import { Ask } from './ask';
import { Answer } from './answer';
import { Phrases } from './phrases';
import { Vocabulary } from './vocabulary';
import { Suggestions } from './suggestions';

export function initLanguage(language = 'en'): void {
  Suggestions.setLanguage(language);
  Vocabulary.setLanguage(language);
  Phrases.setLanguage(language);
  Answer.setLanguage(language);
  Ask.setLanguage(language);
}
