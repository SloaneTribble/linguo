import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AudioRecorderComponent } from './audio-recorder/audio-recorder.component';
import { TextToSpeechComponent } from "./text-to-speech/text-to-speech.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AudioRecorderComponent, TextToSpeechComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'linguo-app';
}
