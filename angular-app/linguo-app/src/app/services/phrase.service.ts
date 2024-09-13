import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PhraseService {
  private phrases: string[] = [
    'Hello, how are you?',
    'I would like a cup of coffee.',
    'Can you help me?',
  ];
  private currentPhraseSubject = new BehaviorSubject<string>(this.phrases[0]);

  get currentPhrase() {
    return this.currentPhraseSubject.asObservable();
  }

  // Call this method to set a new phrase (e.g., a new phrase for the user to say)
  setRandomPhrase() {
    const randomIndex = Math.floor(Math.random() * this.phrases.length);
    this.currentPhraseSubject.next(this.phrases[randomIndex]);
  }
}
