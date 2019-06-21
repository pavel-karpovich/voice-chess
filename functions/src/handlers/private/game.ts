import { HandlerBase } from '../struct/handlerBase';
import { Answer as Ans } from '../../locales/answer';
import { Ask } from '../../locales/ask';
import { Suggestions as Sug } from '../../locales/suggestions';
import { ChessBoard } from '../../chess/chessboard';
import { Chess } from '../../chess/chess';

export class GameHandlers extends HandlerBase {
  private static firstGameRun(): void {
    const initialDifficulty = 2;
    const initialConfirmOpt = true;
    this.long.options = {
      difficulty: initialDifficulty,
      confirm: initialConfirmOpt,
    };
    this.speak(Ans.firstPlay());
    this.speak(Ask.askToNewGame());
    this.contexts.set('ask-to-new-game', 1);
    this.suggest(Sug.newGame, Sug.help);
  }

  static welcome(): void {
    this.short.fallbackCount = 0;
    if (!this.long.options) {
      this.firstGameRun();
    } else if (!this.long.fen) {
      this.speak(Ans.welcome());
      this.speak(Ask.askToNewGame());
      this.contexts.set('ask-to-new-game', 1);
      this.suggest(Sug.newGame, Sug.help, Sug.changeDifficulty);
    } else {
      this.speak(Ans.welcome());
      this.speak(Ask.askToContinue());
      this.contexts.set('ask-to-continue', 1);
      this.suggest(Sug.continueGame, Sug.newGame, Sug.changeDifficulty);
    }
  }

  static createNewGame(): void {
    this.long.fen = Chess.initialFen;
    this.long.history = [];
    this.speak(Ans.newgame());
    this.speak(Ask.chooseSide());
    this.contexts.set('ask-side', 1);
    this.suggest(Sug.white, Sug.black);
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
      this.suggest(Sug.yes, Sug.dont);
    }
  }

  static continueGame(): void {
    const fenstring = this.long.fen;
    if (!fenstring) {
      this.speak(Ans.noGameToContinue());
      this.speak(Ask.askToNewGame());
      this.contexts.set('ask-to-new-game', 1);
      this.suggest(Sug.newGame, Sug.help, Sug.changeDifficulty, Sug.exit);
      return;
    }
    this.contexts.set('game', 5);
    this.contexts.set('turn-showboard', 1);
    const playerSide = this.long.side;
    this.speak(Ans.continueGame(playerSide));
    this.speak(Ask.askToRemindBoard());
    this.suggest(
      Sug.yes,
      Sug.move,
      Sug.history,
      Sug.captured,
      Sug.availableMoves,
      Sug.pieceInfo,
      Sug.posInfo
    );
  }

  static resign(chance = 0.4): void {
    const rnd = Math.random();
    if (rnd < chance) {
      const difficulty = this.long.options.difficulty;
      if (difficulty !== 0) {
        this.speak(Ask.wantReduceDifficulty(difficulty));
        this.contexts.set('reduce-difficulty-instead-of-resign', 1);
        this.suggest(Sug.yes, Sug.resign);
        return;
      }
    }
    const fenstring = this.long.fen;
    const board = new ChessBoard(fenstring);
    if (board.movesNumber < 5) {
      this.speak(Ans.wtfYouAreJustStartedANewGame());
      this.speak(Ask.waitMove());
      this.suggest(Sug.move, Sug.changeDifficulty, Sug.newGame);
    } else {
      this.speak(Ask.confirmResign());
      this.contexts.set('ask-to-resign', 1);
      this.suggest(Sug.yes, Sug.no, Sug.changeDifficulty);
    }
  }

  static dropGame(): void {
    this.contexts.set('ask-to-new-game', 1);
    this.long.fen = null;
    this.contexts.drop('game');
    this.suggest(Sug.newGame, Sug.exit, Sug.changeDifficulty);
  }
}
