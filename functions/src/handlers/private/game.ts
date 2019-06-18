import { HandlerBase } from '../struct/handlerBase';
import { Answer as Ans } from '../../locales/answer';
import { Ask } from '../../locales/ask';
import { ChessBoard } from '../../chess/chessboard';
import { Chess } from '../../chess/chess';

export class GameHandlers extends HandlerBase {
  static createNewGame(): void {
    this.long.fen = Chess.initialFen;
    this.long.history = [];
    this.speak(Ans.newgame());
    this.speak(Ask.chooseSide());
    this.contexts.set('ask-side', 1);
  }

  static newGame(): void {
    const fenstring = this.long.fen;
    const confirmNewGameCtx = this.contexts.get('confirm-new-game');
    if (!fenstring || confirmNewGameCtx) {
      this.createNewGame();
    } else {
      this.speak(Ask.confirmNewGame());
      this.contexts.set('ask-to-new-game', 1);
      this.contexts.set('confirm-new-game', 1);
    }
  }

  static continueGame(): void {
    const fenstring = this.long.fen;
    if (!fenstring) {
      this.speak(Ans.noGameToContinue());
      this.speak(Ask.askToNewGame());
      this.contexts.set('ask-to-new-game', 1);
      return;
    }
    this.contexts.set('game', 5);
    this.contexts.set('turn-showboard', 1);
    const playerSide = this.long.side;
    this.speak(Ans.continueGame(playerSide));
    this.speak(Ask.askToRemindBoard());
  }

  static resign(chance = 0.4): void {
    const rnd = Math.random();
    if (rnd < chance) {
      const difficulty = this.long.options.difficulty;
      if (difficulty !== 0) {
        this.speak(Ask.wantReduceDifficulty(difficulty));
        this.contexts.set('reduce-difficulty-instead-of-resign', 1);
        return;
      }
    }
    const fenstring = this.long.fen;
    const board = new ChessBoard(fenstring);
    if (board.movesNumber < 5) {
      this.speak(Ans.wtfYouAreJustStartedANewGame());
      this.speak(Ask.waitMove());
    } else {
      this.speak(Ask.confirmResign());
      this.contexts.set('ask-to-resign', 1);
    }
  }
}
