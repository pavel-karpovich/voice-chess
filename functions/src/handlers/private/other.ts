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
      this.suggest(Sug.move, Sug.board, Sug.posInfo, Sug.pieceInfo, Sug.captured, Sug.exit);
    } else {
      this.speak(Ask.isAnybodyHere());
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

  static askOrRemind(chance = 0.75): void {
    const correctCtx = this.contexts.get('correct-last-move');
    if (correctCtx) {
      this.speak(Ask.correctFails());
      this.suggest(Sug.move, Sug.availableMoves, Sug.advice);
      return;
    }
    const fiftyFifty = Math.random();
    if (fiftyFifty < chance) {
      this.speak(Ask.askToMoveAgain());
      this.suggest(Sug.move, Sug.availableMoves, Sug.advice, Sug.history);
    } else {
      this.speak(Ask.askToRemindBoard());
      this.contexts.set('turn-showboard', 1);
      this.suggest(Sug.yes, Sug.no, Sug.move, Sug.pieceInfo);
    }
  }
}
