import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-text-to-speech',
  templateUrl: './text-to-speech.component.html',
  styleUrls: ['./text-to-speech.component.css'],
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule]
})
export class TextToSpeechComponent {
  textInput: string = '';
  selectedLanguage: string = 'en'; // Default to English
  audioURL: string | null = null;
  languages = [
    { name: 'English', code: 'en' },
    { name: 'Spanish', code: 'es' }
  ];

  constructor(private http: HttpClient) {}

  sendTextToServer() {
    if (this.textInput.trim() !== '') {
      this.http.post('http://localhost:3000/text-to-speech', { text: this.textInput, language: this.selectedLanguage }, { responseType: 'blob' })
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
