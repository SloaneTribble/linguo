import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AudioRecorderComponent } from './audio-recorder/audio-recorder.component';
import { TextToSpeechComponent } from "./text-to-speech/text-to-speech.component";
import { LanguageService } from './services/language.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AudioRecorderComponent, TextToSpeechComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'linguo-app';

  constructor(private languageService: LanguageService) {}

  onLanguageChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const language = selectElement.value;
    console.log('Selected Language:', language);
    this.languageService.setLanguage(language);
  }
}
