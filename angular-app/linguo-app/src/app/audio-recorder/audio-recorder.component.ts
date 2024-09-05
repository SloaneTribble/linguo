import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AudioService } from '../audio.service';

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

  constructor(private audioService: AudioService, private http: HttpClient) {}

  startRecording() {
    this.recording = true;
    this.audioService.startRecording();
  }

  async stopRecording() {
    this.recording = false;
    const audioBlob = await this.audioService.stopRecording();
    if (audioBlob) {
      this.audioURL = URL.createObjectURL(audioBlob);
      // enable to automatically download recordings
      // this.saveRecording();

      await this.audioService.analyzeRecording();

      // Send the audioBlob to the server
      const formData = new FormData();
      formData.append('audio', audioBlob, 'audio.webm');

      this.http.post('http://localhost:3000/upload-audio', formData)
        .subscribe({
          next: (response: any) => {
            console.log('Server response:', response);
            // Parse the transcriptionDetails array
          if (response.transcriptionDetails && response.transcriptionDetails.length > 0) {
            const transcriptionDetail = response.transcriptionDetails[0];
            const transcript = transcriptionDetail.transcript;

            console.log('Transcript:', transcript);  // The entire transcript

            const wordConfidenceDetails = transcriptionDetail.words.map((wordInfo: any) => {
              return `Word: ${wordInfo.word}, Confidence: ${wordInfo.confidence}`;
            }).join('\n');

            console.log('Word confidence details:\n', wordConfidenceDetails);
            alert('Transcription: ' + transcript + '\n\nWord Confidence Details:\n' + wordConfidenceDetails);
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
