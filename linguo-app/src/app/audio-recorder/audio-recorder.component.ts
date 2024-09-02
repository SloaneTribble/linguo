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

  stopRecording() {
    this.recording = false;
    this.audioService.stopRecording();
    const audioBlob = this.audioService.getAudioBlob();
    if (audioBlob) {
      this.audioURL = URL.createObjectURL(audioBlob);
    }
  }
}
