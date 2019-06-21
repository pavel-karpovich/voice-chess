import { HandlerBase } from '../struct/handlerBase';
import { Answer as Ans } from '../../locales/answer';
import { Suggestions as Sug } from '../../locales/suggestions';
import { Ask } from '../../locales/ask';
import { MoveHandlers } from './move';
import { ChessSide } from '../../chess/chessUtils';
import { Chess } from '../../chess/chess';
import { ChessBoard } from '../../chess/chessboard';
import { FallbackHandlers } from './fallback';
import { gaussianRandom } from '../../support/helpers';
import { OtherHandlers } from './other';
import { rookMoveForCastlingMove, CastlingType } from '../../chess/castling';

export class AroundMoveHandlers extends HandlerBase {
  static async acceptMove(): Promise<void> {
    const move = this.contexts.get('confirm-move').parameters.move as string;
    await MoveHandlers.prepareToMove(move);
  }

  static async promotion(toPiece: string): Promise<void> {
    const promContext = this.contexts.get('ask-to-promotion');
    let move = promContext.parameters.move as string;
    move += toPiece;
    await MoveHandlers.moveByPlayer(move);
    await MoveHandlers.moveByAI();
  }

  static async chooseSide(side: ChessSide): Promise<void> {
    this.long.side = side;
    if (side === ChessSide.WHITE) {
      this.speak(Ans.whiteSide());
      this.speak(Ask.askToMove());
      const suggestions = [Sug.move];
      const moves = await MoveHandlers.moveSuggestions(8 - suggestions.length);
      suggestions.push(...moves);
      this.suggest(...suggestions);
    } else {
      this.speak(Ans.blackSide());
      await MoveHandlers.simpleMoveByAI();
    }
  }

  static async moveAuto(): Promise<void> {
    const fenstring = this.long.fen;
    const difficulty = this.long.options.difficulty;
    const chess = new Chess(fenstring, difficulty);
    await MoveHandlers.playerMoveByAI(chess);
    await MoveHandlers.moveByAI(chess);
  }

  static async castling(): Promise<void> {
    const fenstring = this.long.fen;
    const board = new ChessBoard(fenstring);
    const playerSide = this.long.side;
    const castlings = board.getAvailableCastlingMoves(playerSide);
    if (castlings.length === 0) {
      this.speak(Ans.cantCastling());
      OtherHandlers.askOrRemind();
      return;
    }
    const kingPos = castlings[0].slice(0, 2);
    const to1 = castlings[0].slice(2, 4);
    if (castlings.length === 2) {
      const to2 = castlings[1].slice(2, 4);
      this.speak(Ans.twoTypesOfCastling(kingPos, to1, to2));
      this.speak(Ask.chooseCastling());
      this.contexts.set('choose-castling', 1);
      this.suggest(Sug.queenside, Sug.kingside);
      return;
    }
    const needConfirm = this.long.options.confirm;
    if (needConfirm) {
      const rockMove = rookMoveForCastlingMove(castlings[0]);
      const rFrom = rockMove.slice(0, 2);
      const rTo = rockMove.slice(2, 4);
      this.speak(Ask.askToConfirmCastling(kingPos, to1, rFrom, rTo));
      this.contexts.set('confirm-move', 1, { move: castlings[0] });
      this.suggest(Sug.confirm, Sug.no);
      return;
    }
    await MoveHandlers.moveByPlayer(castlings[0]);
    await MoveHandlers.moveByAI();
  }

  static async correct(): Promise<void> {
    const hist = this.long.history;
    if (hist.length < 2) {
      this.speak(Ans.noMoveToCorrect());
      this.speak(Ask.waitMove());
      this.suggest(Sug.move, Sug.availableMoves, Sug.advice, Sug.autoMove);
      return;
    }
    const lastMove = hist[hist.length - 2];
    const from = lastMove.m.slice(1, 3);
    const to = lastMove.m.slice(3, 5);
    const piece = lastMove.m[0];
    this.speak(Ask.moveToCorrect(from, to, piece));
    this.contexts.set('correct-last-move', 1);
    const chess = new Chess(this.long.fen, 0);
    MoveHandlers.rollbackLastMoves(chess);
    const suggestions = await MoveHandlers.moveSuggestions(7, chess);
    suggestions.push(Sug.no);
    this.suggest(...suggestions);
  }

  static async chooseCastling(cast?: CastlingType, piece?: string, cell?: string): Promise<void> {
    const fenstring = this.long.fen;
    const board = new ChessBoard(fenstring);
    const playerSide = this.long.side;
    const castlings = board.getAvailableCastlingMoves(playerSide);
    const to1 = castlings[0].slice(2, 4);
    const to2 = castlings[1].slice(2, 4);
    const rockMove1 = rookMoveForCastlingMove(castlings[0]);
    const rockFrom1 = rockMove1.slice(0, 2);
    const rockTo1 = rockMove1.slice(2, 4);
    const rockMove2 = rookMoveForCastlingMove(castlings[1]);
    const rockFrom2 = rockMove2.slice(0, 2);
    const rockTo2 = rockMove2.slice(2, 4);
    let playerMove;
    if (
      cast === CastlingType.KINGSIDE ||
      piece === 'k' ||
      (cell === to1 || cell === rockFrom1 || cell === rockTo1)
    ) {
      playerMove = castlings[0];
    } else if (
      cast === CastlingType.QUEENSIDE ||
      piece === 'q' ||
      (cell === to2 || cell === rockFrom2 || cell === rockTo2)
    ) {
      playerMove = castlings[1];
    } else {
      FallbackHandlers.fallback();
      return;
    }
    const needConfirm = this.long.options.confirm;
    if (needConfirm) {
      const kingPos = playerMove.slice(0, 2);
      if (playerMove === castlings[0]) {
        this.speak(Ask.askToConfirmCastling(kingPos, to1, rockFrom1, rockTo1));
      } else {
        this.speak(Ask.askToConfirmCastling(kingPos, to2, rockFrom2, rockTo2));
      }
      this.contexts.set('confirm-move', 1, { move: playerMove });
      this.suggest(Sug.confirm, Sug.no);
      return;
    }
    await MoveHandlers.moveByPlayer(playerMove);
    await MoveHandlers.moveByAI();
  }

  static async acceptAdvice(): Promise<void> {
    const needConfirm = this.long.options.confirm;
    const advCtx = this.contexts.get('advice-made');
    const move = advCtx.parameters.move as string;
    if (needConfirm) {
      const from = move.slice(0, 2);
      const to = move.slice(2, 4);
      const fenstring = this.long.fen;
      const board = new ChessBoard(fenstring);
      const piece = board.pos(from);
      this.speak(Ask.askToConfirm(from, to, piece));
      this.contexts.set('confirm-move', 1, { move });
      this.suggest(Sug.confirm, Sug.no);
      return;
    }
    await MoveHandlers.prepareToMove(move);
  }

  static async advice(randomChance = 0.2): Promise<void> {
    const fenstring = this.long.fen;
    const difficulty = this.long.options.difficulty;
    const delta = 6;
    const min = difficulty - delta;
    const max = difficulty + delta;
    const rndDif = (Math.floor((max - min) * gaussianRandom()) + min) | 0;
    const chess = new Chess(fenstring, rndDif);
    const rnd = Math.random();
    let advisedMove = null;
    if (rnd < randomChance) {
      await chess.updateGameState();
      const rndMoveIndex = Math.floor(Math.random() * chess.legalMoves.length);
      advisedMove = chess.legalMoves[rndMoveIndex];
    } else {
      advisedMove = await chess.bestMove();
    }
    const from = advisedMove.slice(0, 2);
    const to = advisedMove.slice(2, 4);
    const board = new ChessBoard(fenstring);
    const piece = board.pos(from);
    this.speak(Ans.adviseMove(from, to, piece));
    this.speak(Ask.waitForReactOnAdvise());
    this.contexts.set('advice-made', 1, { move: advisedMove });
    this.suggest(Sug.agree, Sug.no);
  }
}
