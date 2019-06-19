import { HandlerBase } from '../struct/handlerBase';
import { Answer as Ans } from '../../locales/answer';
import { Ask } from '../../locales/ask';
import { InfoHandlers } from './info';
import { SettingsHandlers } from './settings';
import { GameHandlers } from './game';
import { AroundMoveHandlers } from './aroundMove';
import { FallbackHandlers } from './fallback';

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
    } else if (this.contexts.get('moves-next')) {
      this.speak(Ask.waitMove());
    } else if (this.contexts.get('board-next')) {
      this.speak(Ask.waitMove());
    } else if (this.contexts.get('rank-next')) {
      this.speak(Ask.waitMove());
    } else if (this.contexts.get('reduce-difficulty-instead-of-resign')) {
      this.speak(Ask.stillWantToResign());
      this.contexts.set('ask-to-resign', 1);
    } else if (this.contexts.get('ask-to-resign')) {
      this.speak(Ask.thenPlay());
    } else if (this.contexts.get('ask-to-new-game')) {
      this.speak(gameCtx ? Ask.thenPlay() : Ask.whatToDo());
    } else if (this.contexts.get('ask-to-continue')) {
      this.speak(Ask.askToNewGame());
      this.contexts.set('ask-to-new-game', 1);
    } else if (this.contexts.get('turn-showboard')) {
      this.speak(Ask.askToMove());
    } else if (this.contexts.get('confirm-move')) {
      if (this.contexts.get('correct-last-move')) {
        this.speak(Ask.correctFails());
      } else {
        this.speak(Ask.askToMoveAgain());
      }
    } else if (this.contexts.get('advice-made')) {
      this.speak(Ask.askToMove());
    } else if (this.contexts.get('correct-last-move')) {
      this.speak(Ask.correctFails());
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
      this.contexts.set('ask-to-new-game', 1);
      this.long.fen = null;
      this.contexts.drop('game');
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
