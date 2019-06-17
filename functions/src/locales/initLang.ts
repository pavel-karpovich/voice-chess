import { Answer } from './answer';
import { Ask } from './ask';
import { Vocabulary } from './vocabulary';

export function initLanguage(language = 'en'): void {
  Vocabulary.setLanguage(language);
  Answer.setLanguage(language);
  Ask.setLanguage(language);
}
