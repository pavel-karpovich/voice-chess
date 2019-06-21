import { HandlerBase } from '../struct/handlerBase';
import { Answer as Ans } from '../../locales/answer';
import { Suggestions as Sug } from '../../locales/suggestions';
import { Ask } from '../../locales/ask';
import { InfoHandlers } from './info';
import { SettingsHandlers } from './settings';
import { GameHandlers } from './game';
import { AroundMoveHandlers } from './aroundMove';
import { FallbackHandlers } from './fallback';
import { MoveHandlers } from './move';

export class NavigationHandlers extends HandlerBase {
  static async next(): Promise<void> {
    if (this.contexts.get('moves-next')) {
      const fromPoint = Number(this.contexts.get('moves-next').parameters.start);
      await InfoHandlers.listOfMoves(fromPoint);
    } else if (this.contexts.get('board-next')) {
      InfoHandlers.secondPartOfBoard();
    } else if (this.contexts.get('rank-next')) {
      const dir = this.contexts.get('rank-next').parameters.dir;
      if (dir === 'u') {
        InfoHandlers.nextRank();
      } else {
        InfoHandlers.prevRank();
      }
    } else {
      FallbackHandlers.fallback();
      return;
    }
    this.short.fallbackCount = 0;
  }

  static no(): void {
    SettingsHandlers.safeGameContext();
    const gameCtx = this.contexts.get('game');
    if (this.contexts.get('turn-intent')) {
      this.speak(Ask.askWhatever());
      const confirm = this.long.options.confirm;
      const confSug = confirm ? Sug.disableConfirm : Sug.enableConfirm;
      this.suggest(
        Sug.move,
        Sug.changeDifficulty,
        confSug,
        Sug.board,
        Sug.history,
        Sug.availableMoves,
        Sug.autoMove,
        Sug.resign
      );
    } else if (this.contexts.get('moves-next')) {
      this.speak(Ask.waitMove());
      this.suggest(Sug.move, Sug.advice);
    } else if (this.contexts.get('board-next')) {
      this.speak(Ask.waitMove());
      this.suggest(Sug.move, Sug.history, Sug.availableMoves, Sug.advice);
    } else if (this.contexts.get('rank-next')) {
      this.speak(Ask.waitMove());
      this.suggest(Sug.move, Sug.history, Sug.availableMoves, Sug.advice);
    } else if (this.contexts.get('reduce-difficulty-instead-of-resign')) {
      this.speak(Ask.stillWantToResign());
      this.contexts.set('ask-to-resign', 1);
      this.suggest(Sug.yes, Sug.no, Sug.changeDifficulty);
    } else if (this.contexts.get('ask-to-resign')) {
      this.speak(Ask.thenPlay());
      this.suggest(Sug.move, Sug.advice, Sug.autoMove);
    } else if (this.contexts.get('ask-to-new-game')) {
      if (gameCtx) {
        this.speak(Ask.thenPlay());
        this.suggest(Sug.move, Sug.history, Sug.availableMoves, Sug.advice, Sug.changeDifficulty);
      } else {
        this.speak(Ask.whatToDo());
        if (this.long.fen) {
          this.suggest(Sug.continueGame, Sug.newGame, Sug.exit, Sug.changeDifficulty);
        } else {
          this.suggest(Sug.newGame, Sug.exit, Sug.changeDifficulty);
        }
      }
    } else if (this.contexts.get('ask-to-continue')) {
      this.speak(Ask.askToNewGame());
      this.contexts.set('ask-to-new-game', 1);
      this.suggest(Sug.yes, Sug.no, Sug.newGame);
    } else if (this.contexts.get('turn-showboard')) {
      this.speak(Ask.askToMove());
      this.suggest(Sug.move, Sug.availableMoves, Sug.advice);
    } else if (this.contexts.get('confirm-move')) {
      if (this.contexts.get('correct-last-move')) {
        this.speak(Ask.correctFails());
        this.suggest(Sug.move, Sug.availableMoves, Sug.advice);
      } else {
        this.speak(Ask.askToMoveAgain());
        this.suggest(Sug.move, Sug.advice, Sug.disableConfirm);
      }
    } else if (this.contexts.get('advice-made')) {
      this.speak(Ask.askToMove());
      this.suggest(Sug.move, Sug.availableMoves, Sug.posInfo);
    } else if (this.contexts.get('correct-last-move')) {
      this.speak(Ask.correctFails());
      this.suggest(Sug.move, Sug.availableMoves, Sug.advice);
    } else {
      FallbackHandlers.fallback();
      return;
    }
    this.short.fallbackCount = 0;
  }

  static async yes(): Promise<void> {
    SettingsHandlers.safeGameContext();
    if (this.contexts.get('turn-intent')) {
      this.speak(Ask.askToMove());
      const suggestions = [Sug.move];
      const moves = await MoveHandlers.moveSuggestions(6);
      suggestions.push(...moves, Sug.advice);
      this.suggest(...suggestions);
    } else if (this.contexts.get('moves-next')) {
      const n = Number(this.contexts.get('moves-next').parameters.start);
      await InfoHandlers.listOfMoves(n);
    } else if (this.contexts.get('board-next')) {
      InfoHandlers.secondPartOfBoard();
    } else if (this.contexts.get('rank-next')) {
      const dir = this.contexts.get('rank-next').parameters.dir;
      if (dir === 'u') {
        InfoHandlers.nextRank();
      } else {
        InfoHandlers.prevRank();
      }
    } else if (this.contexts.get('reduce-difficulty-instead-of-resign')) {
      const d = this.long.options.difficulty;
      SettingsHandlers.modifyDifficulty(Math.floor(d / 2));
    } else if (this.contexts.get('ask-to-resign')) {
      this.speak(Ans.youLose());
      this.speak(Ask.askToNewGame());
      GameHandlers.dropGame();
    } else if (this.contexts.get('ask-to-new-game')) {
      GameHandlers.newGame();
    } else if (this.contexts.get('ask-to-continue')) {
      GameHandlers.continueGame();
    } else if (this.contexts.get('turn-showboard')) {
      InfoHandlers.firstPartOfBoard();
    } else if (this.contexts.get('confirm-move')) {
      await AroundMoveHandlers.acceptMove();
    } else if (this.contexts.get('advice-made')) {
      await AroundMoveHandlers.acceptAdvice();
    } else {
      FallbackHandlers.fallback();
      return;
    }
    this.short.fallbackCount = 0;
  }
}
