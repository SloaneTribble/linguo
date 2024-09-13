import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LanguageService } from './language.service';

@Injectable({
  providedIn: 'root'
})
export class PhraseService {
  private phrases: { [key: string]: string[] } = {
    'en': [
      'Hello, how are you?',
      'What is your name?',
      'Where are you from?'
    ],
    'es': [
      'Hola, ¿cómo estás?',
      '¿Cómo te llamas?',
      '¿De dónde eres?'
    ]
  };

  private currentPhraseSubject = new BehaviorSubject<string>(this.getRandomPhrase('en'));
  currentPhrase = this.currentPhraseSubject.asObservable();

  private currentLanguage: string = 'en';

  constructor(private languageService: LanguageService) {
    // Subscribe to language changes
    this.languageService.getLanguage().subscribe(lang => {
      this.currentLanguage = lang;
      this.setRandomPhrase();
    });
  }

  getRandomPhrase(language: string): string {
    const phrases = this.phrases[language] || [];
    return phrases[Math.floor(Math.random() * phrases.length)];
  }

  setRandomPhrase() {
    this.currentPhraseSubject.next(this.getRandomPhrase(this.currentLanguage));
  }
}
