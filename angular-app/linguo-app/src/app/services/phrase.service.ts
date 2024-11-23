import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LanguageService } from './language.service';

@Injectable({
  providedIn: 'root'
})
export class PhraseService {
  private phrases: { [key: string]: string[] } = {
    'en': [
      // Greetings
      'Hello, how are you?',
      'What is your name?',
      'Where are you from?',
      'Good morning!',
      'Good afternoon!',
      'Good evening!',
      'How is your day going?',

      // Common Questions
      'What do you do for work?',
      'Do you have any hobbies?',
      'What is your favorite food?',
      'Can you help me, please?',
      'What time is it?',
      'Where is the nearest bus stop?',
      'How much does this cost?',

      // Shopping and Dining
      'I would like to order a coffee.',
      'Do you have vegetarian options?',
      'Can I see the menu, please?',
      'How much is the total?',
      'Where can I find the milk aisle?',
      'Can you recommend a good restaurant nearby?',

      // Travel
      'I need a taxi to the airport.',
      'Where is the train station?',
      'How far is the hotel from here?',
      'Can you show me on the map?',
      'Do you speak English?',
      'I am looking for the museum.',
      
      // Polite Expressions
      'Thank you very much!',
      'You’re welcome!',
      'Excuse me, can you help me?',
      'I am sorry for being late.',
      'No problem!',
    ],
    'es': [
      // Greetings
      'Hola, ¿cómo estás?',
      '¿Cómo te llamas?',
      '¿De dónde eres?',
      '¡Buenos días!',
      '¡Buenas tardes!',
      '¡Buenas noches!',
      '¿Cómo va tu día?',

      // Common Questions
      '¿A qué te dedicas?',
      '¿Tienes algún pasatiempo?',
      '¿Cuál es tu comida favorita?',
      '¿Puedes ayudarme, por favor?',
      '¿Qué hora es?',
      '¿Dónde está la parada de autobús más cercana?',
      '¿Cuánto cuesta esto?',

      // Shopping and Dining
      'Quisiera pedir un café.',
      '¿Tienen opciones vegetarianas?',
      '¿Puedo ver el menú, por favor?',
      '¿Cuánto es el total?',
      '¿Dónde puedo encontrar la sección de leche?',
      '¿Puede recomendarme un buen restaurante cerca?',

      // Travel
      'Necesito un taxi al aeropuerto.',
      '¿Dónde está la estación de tren?',
      '¿Qué tan lejos está el hotel desde aquí?',
      '¿Puedes mostrarme en el mapa?',
      '¿Hablas inglés?',
      'Estoy buscando el museo.',

      // Polite Expressions
      '¡Muchas gracias!',
      '¡De nada!',
      'Disculpa, ¿puedes ayudarme?',
      'Lo siento por llegar tarde.',
      '¡No hay problema!',
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
