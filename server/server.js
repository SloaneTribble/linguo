const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const speech = require('@google-cloud/speech');
const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs');
const path = require('path');
const util = require('util');

// Initialize Express app
const app = express();
app.use(cors());
app.use(fileUpload());
app.use(express.json()); // To handle JSON payloads for text-to-speech

// Create clients for both Speech-to-Text and Text-to-Speech
const speechClient = new speech.SpeechClient({
  keyFilename: './speech-to-text-credentials.json'
});

const textToSpeechClient = new textToSpeech.TextToSpeechClient({
  keyFilename: './text-to-speech-credentials.json'
});

// Speech-to-Text API endpoint
app.post('/upload-audio', async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  const audioFile = req.files.audio;
  const languageCode = req.body.language || 'en-US'; // Default to English

  // Save the file temporarily
  const tempFilePath = path.join(__dirname, 'temp-audio.webm');
  await audioFile.mv(tempFilePath);

  // Read the audio file and convert to base64
  const file = fs.readFileSync(tempFilePath);
  const audioBytes = file.toString('base64');

  // Configure request for Google Cloud Speech API
  const audio = {
    content: audioBytes,
  };
  const config = {
    enableWordConfidence: true,
    audioChannelCount: 1,
    encoding: 'WEBM_OPUS',
    sampleRateHertz: 48000,
    languageCode: languageCode,
  };
  const request = {
    audio: audio,
    config: config,
  };

  try {
    const [response] = await speechClient.recognize(request);
    
    // Extract transcription and word-level confidence
    const transcriptionDetails = response.results.map(result => {
      const words = result.alternatives[0].words.map(wordInfo => ({
        word: wordInfo.word,
        confidence: wordInfo.confidence || 0.0,
      }));

      const transcript = result.alternatives[0].transcript;

      return { transcript, words };
    });

    // Respond with both the transcription and word confidences
    res.json({ transcriptionDetails });
    
  } catch (err) {
    console.error('Error from Speech-to-Text API:', err);
    res.status(500).send(err.message);
  } finally {
    // Optionally delete temp file
    if (fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath);
    }
  }
});

// Text-to-Speech API endpoint
app.post('/text-to-speech', async (req, res) => {
  const text = req.body.text;
  const language = req.body.language || 'en'; // Default to English

  if (!text) {
    return res.status(400).send('Text input is required.');
  }

  let voiceName = 'en-US-Wavenet-F'; // Default to English Female voice
  let languageCode = 'en-US'; // Default to English

  if (language === 'es') {
    voiceName = 'es-ES-Wavenet-C'; // Spanish Female voice
    languageCode = 'es-ES';
  }

  const request = {
    input: { text },
    voice: { name: voiceName, languageCode: languageCode },
    audioConfig: { audioEncoding: 'MP3' },
  };

  try {
    const [response] = await textToSpeechClient.synthesizeSpeech(request);

    // Save the audio file temporarily
    const tempFilePath = path.join(__dirname, 'temp-audio.mp3');
    await util.promisify(fs.writeFile)(tempFilePath, response.audioContent, 'binary');

    // Send the audio file as a response
    res.setHeader('Content-Type', 'audio/mpeg');
    res.sendFile(tempFilePath, () => {
      fs.unlinkSync(tempFilePath); // Delete the file after sending
    });

  } catch (err) {
    console.error('Error during Text-to-Speech:', err);
    res.status(500).send('Error generating speech');
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
