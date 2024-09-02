import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AudioService } from '../audio.service';

@Component({
  selector: 'app-audio-recorder',
  templateUrl: './audio-recorder.component.html',
  styleUrls: ['./audio-recorder.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class AudioRecorderComponent {
  recording = false;
  audioURL: string | null = null;

  constructor(private audioService: AudioService) {}

  startRecording() {
    this.recording = true;
    this.audioService.startRecording();
  }

  async stopRecording() {
    this.recording = false;
    const audioBlob = await this.audioService.stopRecording();
    if (audioBlob) {
      this.audioURL = URL.createObjectURL(audioBlob);
    }
  }
}
