import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AudioRecorderComponent } from './audio-recorder/audio-recorder.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AudioRecorderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'linguo-app';
}
