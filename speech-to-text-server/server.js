const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const speech = require('@google-cloud/speech');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(fileUpload());

// Create a client
const client = new speech.SpeechClient({
  keyFilename: './speech-to-text-credentials.json' // Add path to your JSON key
});

// Endpoint to receive the audio from Angular app and send it to Speech-to-Text API
app.post('/upload-audio', async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  const audioFile = req.files.audio; // Assuming you send the file with the key 'audio'

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
    sampleRateHertz: 48000, // Match the sample rate of your recording
    languageCode: 'en-US',  // Set your language here
  };
  const request = {
    audio: audio,
    config: config,
  };
  
  // Log the request details
  console.log('Sending request to Speech-to-Text API:', request);
  
  try {
    const [response] = await client.recognize(request);
    // Log the response details
    console.log('Received response from Speech-to-Text API:', response);
    const transcription = response.results
      .map(result => result.alternatives[0].transcript)
      .join('\n');
    res.json({ transcription });
  } catch (err) {
    console.error('Error from Speech-to-Text API:', err);
    res.status(500).send(err.message);
  }
  finally {
    // Optionally delete temp file
    if (fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath);
    }
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
