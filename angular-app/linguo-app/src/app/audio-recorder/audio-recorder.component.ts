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
  recording = false;
  audioURL: string | null = null;
  // Default to English
  language: string = 'en-US'; 
  // phrase for user to speak and record
  phrase: string = '';

  constructor(private audioService: AudioService, private http: HttpClient, private languageService: LanguageService, private phraseService: PhraseService) {
    this.languageService.getLanguage().subscribe((lang: string) => {
      this.language = lang === 'es' ? 'es-ES' : 'en-US';
      console.log('AudioRecorderComponent language updated:', this.language);
    });
    this.phraseService.currentPhrase.subscribe((phrase) => {
      this.phrase = phrase;
    });
  }

  cleanString(str: string): string {
      return str.toLowerCase().replace(/[.,!?;:]/g, '');
  }

  compareWords(prompt: string, transcript: string): number {
    // Convert both strings to lowercase and split into words
    const promptWords = this.cleanString(prompt).split(' ');
    const transcriptWords = transcript.toLowerCase().split(' ');
    console.log("Prompt words from compareWords(): ", promptWords);
    console.log("Transcript words from compareWords(): ", transcriptWords);
  
    // Find matching words
    const matches = transcriptWords.filter(word => promptWords.includes(word));
  
    // Calculate accuracy as a percentage
    const accuracy = (matches.length / promptWords.length) * 100;
  
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

              console.log('Transcript:', transcript);

              const wordConfidenceDetails = transcriptionDetail.words.map((wordInfo: any) => {
                return `Word: ${wordInfo.word}, Confidence: ${wordInfo.confidence}`;
              }).join('\n');

              console.log('Word confidence details:\n', wordConfidenceDetails);
              alert('Transcription: ' + transcript + '\n\nWord Confidence Details:\n' + wordConfidenceDetails);
              const accuracy = this.compareWords(this.phrase, transcript);
            console.log(`Match Accuracy: ${accuracy}%`);
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
}

