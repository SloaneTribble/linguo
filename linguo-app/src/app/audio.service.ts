import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private mediaRecorder: any;
  private audioChunks: any[] = [];
  private audioBlob: Blob | null = null;

  startRecording() {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        this.mediaRecorder = new MediaRecorder(stream);
        this.mediaRecorder.start();
        this.mediaRecorder.ondataavailable = (event: any) => {
          this.audioChunks.push(event.data);
        };
        this.mediaRecorder.onstop = () => {
          this.audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
          this.audioChunks = [];
        };
      });
  }

  stopRecording() {
    if (this.mediaRecorder) {
      this.mediaRecorder.stop();
    }
  }

  getAudioBlob() {
    return this.audioBlob;
  }
}
