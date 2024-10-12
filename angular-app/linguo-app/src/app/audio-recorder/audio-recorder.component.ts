import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AudioService } from '../services/audio.service';
import { LanguageService } from '../services/language.service';
import { PhraseService } from '../services/phrase.service';

@Component({
  selector: 'app-audio-recorder',
  templateUrl: './audio-recorder.component.html',
  styleUrls: ['./audio-recorder.component.css'],
  standalone: true,
  imports: [CommonModule, HttpClientModule]
})
export class AudioRecorderComponent {
  recording = true;
  audioURL: string | null = 'abc';
  // Default to English
  language: string = 'en-US'; 
  // phrase for user to speak and record
  phrase: string = '';

  // variables for displaying feedback on user input
  transcript: string = 'hello';
  wordMatches: string[] = ['hello'];
  wordConfidenceDetails: { word: string, confidence: number }[] = [{word: "hello", confidence: .99}];

  // set default to an impossible number to indicate no calculated value
  matchAccuracy: number = 100;

  constructor(private audioService: AudioService, private http: HttpClient, private languageService: LanguageService, private phraseService: PhraseService) {
    this.languageService.getLanguage().subscribe((lang: string) => {
      this.language = lang === 'es' ? 'es-ES' : 'en-US';
      console.log('AudioRecorderComponent language updated:', this.language);
    });
    this.phraseService.currentPhrase.subscribe((phrase) => {
      this.phrase = phrase;
    });
  }

  // note that more characters may need to be considered if languages outside of English and Spanish are available to user
  cleanString(str: string): string {
      return str.toLowerCase().replace(/[.,!?;:¿]/g, '');
  }

  compareWords(prompt: string, transcript: string): number {
    // Convert both strings to lowercase and split into words
    const promptWords = this.cleanString(prompt).split(' ');
    const transcriptWords = transcript.toLowerCase().split(' ');
    console.log("Prompt words from compareWords(): ", promptWords);
    console.log("Transcript words from compareWords(): ", transcriptWords);
  
    // Find matching words
    this.wordMatches = transcriptWords.filter(word => promptWords.includes(word));
  
    // Calculate accuracy as a percentage
    const accuracy = (this.wordMatches.length / promptWords.length) * 100;
  
    return accuracy;
  }
  

  startRecording() {
    this.recording = true;
    this.audioService.startRecording();
  }

  async stopRecording() {
    this.recording = false;
    const audioBlob = await this.audioService.stopRecording();
    if (audioBlob) {
      this.audioURL = URL.createObjectURL(audioBlob);

      const formData = new FormData();
      formData.append('audio', audioBlob, 'audio.webm');
      formData.append('language', this.language);

      this.http.post('http://localhost:3000/upload-audio', formData)
        .subscribe({
          next: (response: any) => {
            console.log('Server response:', response);
            if (response.transcriptionDetails && response.transcriptionDetails.length > 0) {
              const transcriptionDetail = response.transcriptionDetails[0];
              const transcript = transcriptionDetail.transcript;
              this.transcript = transcript;

              
              this.wordConfidenceDetails = transcriptionDetail.words.map((wordInfo: any) => {
                return { word: wordInfo.word, confidence: wordInfo.confidence };
              });
              
              
              this.matchAccuracy = this.compareWords(this.phrase, transcript);
              // alert('Transcription: ' + transcript + '\n\nWord Confidence Details:\n' + wordConfidenceDetails);
              console.log('Transcript:', transcript);
              console.log('Word confidence details:\n', this.wordConfidenceDetails);
              console.log(`Match Accuracy: ${this.matchAccuracy}%`);
            } else {
              alert('No transcription details found.');
            }
          },
          error: (error) => {
            console.error('Error uploading audio:', error);
          },
          complete: () => {
            console.log('Request completed');
          }
        });
    }
  }

  saveRecording() {
    this.audioService.saveRecording('my-recording.webm');
  }

  // format a lengthy decimal to a more user-friendly percentage
  formatDecimal(confidence: number): string{
    return (confidence * 100).toFixed(2) + '%';
  }

  getColorForConfidence(confidence: number): string {
    // Google seems to seldom pick up on words with a confidence of less than 70% or so -- need to accommodate missing words in transcript detected by speech-to-text
    if (confidence >= 0.9) {
      return 'green'; 
    } else if (confidence >= 0.8) {
      return 'orange'; 
    } else {
      return 'red'; 
    }
  }
}

