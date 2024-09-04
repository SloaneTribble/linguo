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
        const options = { mimeType: 'audio/webm' }; // Use WebM format
        this.mediaRecorder = new MediaRecorder(stream, options);
        this.mediaRecorder.start();
        this.mediaRecorder.ondataavailable = (event: any) => {
          this.audioChunks.push(event.data);
        };
        this.mediaRecorder.onstop = () => {
          this.audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
          this.audioChunks = [];
          this.onStopResolve(this.audioBlob);  // Resolve the promise when recording stops
        };
      })
      .catch(err => {
        console.error('Error accessing media devices.', err);
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

  async analyzeRecording() {
    if (this.audioBlob) {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const arrayBuffer = await this.audioBlob.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

      // Example: Log some properties of the audio buffer
      console.log('Sample Rate:', audioBuffer.sampleRate);
      console.log('Number of Channels:', audioBuffer.numberOfChannels);
      console.log('Length in Samples:', audioBuffer.length);
      console.log('Duration (seconds):', audioBuffer.duration);

      // Additional analysis can be performed here
    } else {
      console.error('No audio blob available to analyze.');
    }
  }

  saveRecording(filename: string = 'recording.webm') {
    if (this.audioBlob) {
      const url = URL.createObjectURL(this.audioBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);  // Clean up
    } else {
      console.error('No audio blob available to save.');
    }
  }
}
