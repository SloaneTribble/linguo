import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private languageSubject = new BehaviorSubject<string>('en');

  getLanguage(): Observable<string> {
    return this.languageSubject.asObservable();
  }

  setLanguage(language: string): void {
    if (language === 'en' || language === 'es') {
      this.languageSubject.next(language);
    } else {
      console.error('Unsupported language:', language);
    }
  }
}
