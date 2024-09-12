import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../services/language.service';

@Component({
  selector: 'app-text-to-speech',
  templateUrl: './text-to-speech.component.html',
  styleUrls: ['./text-to-speech.component.css'],
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule]
})
export class TextToSpeechComponent {
  textInput: string = '';
  audioURL: string | null = null;
  language: string = 'en-US'; // Default to English

  constructor(private http: HttpClient, private languageService: LanguageService) {
    this.languageService.getLanguage().subscribe((lang: string) => {
      this.language = lang === 'es' ? 'es-ES' : 'en-US';
      console.log('TextToSpeechComponent language updated:', this.language);
    });
  }

  sendTextToServer() {
    if (this.textInput.trim() !== '') {
      console.log("Sending text:", this.language);
      this.http.post('http://localhost:3000/text-to-speech', { text: this.textInput, language: this.language }, { responseType: 'blob' })
        .subscribe({
          next: (response: Blob) => {
            this.audioURL = URL.createObjectURL(response);
            const audio = new Audio(this.audioURL);
            audio.play();
          },
          error: (error) => {
            console.error('Error sending text to server:', error);
          }
        });
    } else {
      alert('Please enter text to convert to speech');
    }
  }
}
