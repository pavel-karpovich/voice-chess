import { HandlerBase } from '../struct/handlerBase';
import { Answer as Ans } from '../../locales/answer';
import { Ask } from '../../locales/ask';
import { Suggestions as Sug } from '../../locales/suggestions';

export class OtherHandlers extends HandlerBase {
  static helpSuggestions(help = true): void {
    const suggestions = [];
    if (this.contexts.is('game')) {
      suggestions.push(
        Sug.move,
        Sug.advice,
        Sug.availableMoves,
        Sug.history,
        Sug.board,
        Sug.autoMove,
        Sug.help,
        Sug.exit
      );
    } else {
      if (this.long.fen) {
        suggestions.push(Sug.continueGame);
      }
      suggestions.push(Sug.newGame, Sug.help, Sug.changeDifficulty, Sug.exit);
    }
    if (!help) {
      const delInd = suggestions.indexOf(Sug.help);
      suggestions.splice(delInd, 1);
    }
    this.suggest(...suggestions);
  }

  static help(): void {
    if (this.contexts.is('game')) {
      this.speak(Ask.ingameTips());
    } else {
      this.speak(Ask.nogameTips());
    }
    this.helpSuggestions(false);
  }

  static silence(): void {
    const gameContext = this.contexts.get('game');
    if (gameContext) {
      this.speak(Ans.doNotHurry());
    } else {
      this.speak(Ask.isAnybodyHere());
      if (this.long.fen) {
        this.suggest(Sug.continueGame, Sug.newGame, Sug.exit);
      } else {
        this.suggest(Sug.newGame, Sug.exit);
      }
    }
  }

  static directToNextLogicalAction(): void {
    const gameContext = this.contexts.get('game');
    if (gameContext) {
      this.speak(Ask.waitMove());
      this.contexts.set('turn-intent', 1);
      this.suggest(Sug.move, Sug.history, Sug.advice);
    } else {
      this.speak(Ask.askToNewGame());
      this.contexts.set('ask-to-new-game', 1);
      if (this.long.fen) {
        this.suggest(Sug.continueGame, Sug.newGame, Sug.exit);
      } else {
        this.suggest(Sug.newGame, Sug.exit);
      }
    }
  }

  static repeat(): void {
    this.speak('This feature is under development.');
    this.directToNextLogicalAction();
  }
}
