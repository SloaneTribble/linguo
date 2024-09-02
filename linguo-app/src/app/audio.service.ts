import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private mediaRecorder: any;
  private audioChunks: any[] = [];
  private audioBlob: Blob | null = null;
  private onStopResolve: (blob: Blob | null) => void = () => {};

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
          this.onStopResolve(this.audioBlob);  // Resolve the promise when recording stops
        };
      });
  }

  stopRecording(): Promise<Blob | null> {
    return new Promise((resolve) => {
      this.onStopResolve = resolve;
      if (this.mediaRecorder) {
        this.mediaRecorder.stop();
      } else {
        resolve(null);
      }
    });
  }

  getAudioBlob() {
    return this.audioBlob;
  }
}
