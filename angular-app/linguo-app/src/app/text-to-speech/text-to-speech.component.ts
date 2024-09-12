import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-text-to-speech',
  templateUrl: './text-to-speech.component.html',
  styleUrls: ['./text-to-speech.component.css'],
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule]  // FormsModule for two-way binding
})
export class TextToSpeechComponent {
  textInput: string = '';
  audioURL: string | null = null;

  constructor(private http: HttpClient) {}

  sendTextToServer() {
    if (this.textInput.trim() !== '') {
      this.http.post('http://localhost:3000/text-to-speech', { text: this.textInput }, { responseType: 'blob' })
        .subscribe({
          next: (response: Blob) => {
            // Create an audio URL from the server's response
            this.audioURL = URL.createObjectURL(response);
            // Optional: Play the audio automatically
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
