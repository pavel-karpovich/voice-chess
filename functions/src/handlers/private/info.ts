import { HandlerBase } from '../struct/handlerBase';
import { Answer as Ans } from '../../locales/answer';
import { Ask } from '../../locales/ask';
import {
  oneRank,
  manyRanks,
  listCapturedPieces,
  allPiecesForSide,
  allPiecesForType,
  someonePlayForColor,
} from '../../support/board';
import { chessBoardSize, Chess } from '../../chess/chess';
import { historyOfMoves } from '../../support/history';
import { listMoves, getBulkOfMoves } from '../../support/moves';
import { ChessBoard } from '../../chess/chessboard';
import { oppositeSide, WhoseSide, ChessSide } from '../../chess/chessUtils';
import { pause } from '../../support/helpers';
import { Handlers } from '../public';

export class InfoHandlers extends HandlerBase {
  static firstPartOfBoard(): void {
    const fenstring = this.long.fen;
    let longString = `<p><s>${Ans.board1()}</s></p>\n`;
    longString += manyRanks(fenstring, 1, chessBoardSize / 2);
    this.speak(longString);
    this.speak(Ask.askToGoNext());
    this.contexts.set('board-next', 1);
  }

  static secondPartOfBoard(): void {
    const fenstring = this.long.fen;
    let longString = `<p><s>${Ans.board2()}</s></p>\n`;
    longString += manyRanks(fenstring, chessBoardSize / 2 + 1, chessBoardSize);
    this.contexts.set('turn-intent', 1);
    this.speak(longString);
    this.speak(Ask.waitMove());
  }

  static rank(ord?: string, num?: string): void {
    const fenstring = this.long.fen;
    const rankNum = Number(num ? num : ord);
    if (!isNaN(rankNum)) {
      if (rankNum < 1 || rankNum > chessBoardSize) {
        this.speak(Ans.incorrectRankNumber(rankNum));
        this.speak(Ask.askRankNumber());
        return;
      }
      this.speak(oneRank(fenstring, rankNum));
      this.speak(Ask.askToGoNext());
      this.contexts.set('rank-next', 1, { rank: rankNum, dir: 'u' });
    } else {
      this.speak(Ask.askRankNumber());
    }
  }

  static nextRank(): void {
    const rankContext = this.contexts.get('rank-next');
    const lastRank = Number(rankContext.parameters.rank);
    if (lastRank === 8) {
      this.speak(Ans.noNextRank());
      this.speak(Ask.waitMove());
      this.contexts.set('turn-intent', 1);
      return;
    }
    const fenstring = this.long.fen;
    const thisRank = lastRank + 1;
    this.speak(oneRank(fenstring, thisRank));
    if (thisRank === 8) {
      this.speak(Ask.whatToDo());
    } else {
      this.speak(Ask.askToGoNext());
      this.contexts.set('rank-next', 1, { rank: thisRank, dir: 'u' });
    }
  }

  static prevRank(): void {
    const rankContext = this.contexts.get('rank-next');
    const lastRank = Number(rankContext.parameters.rank);
    if (lastRank === 1) {
      this.speak(Ans.noPrevRank());
      this.speak(Ask.waitMove());
      this.contexts.set('turn-intent', 1);
      return;
    }
    const fenstring = this.long.fen;
    const thisRank = lastRank - 1;
    this.speak(oneRank(fenstring, thisRank));
    if (thisRank === 1) {
      this.speak(Ask.whatToDo());
    } else {
      this.speak(Ask.askToGoNext());
      this.contexts.set('rank-next', 1, { rank: thisRank, dir: 'd' });
    }
  }

  static async listOfMoves(startNumber: number): Promise<void> {
    const fenstring = this.long.fen;
    const difficulty = this.long.options.difficulty;
    const chess = new Chess(fenstring, difficulty);
    await chess.updateGameState();
    const moves = chess.legalMoves;
    if (moves.length === 0) {
      const msg = "Checkmate/stalemate in this place can't be!";
      console.log(`ERROR: ${msg}`);
      this.speak(Ans.error(msg));
      this.speak(Ask.tryAgainOrLater());
      return;
    }
    const bulkOfMoves = getBulkOfMoves(fenstring, moves, startNumber);
    if (bulkOfMoves.end) {
      const ans = listMoves(bulkOfMoves.pieces) + ' \n' + Ans.itsAll();
      this.speak(ans);
      this.speak(Ask.waitMove());
    } else {
      this.speak(listMoves(bulkOfMoves.pieces));
      this.speak(Ask.askToGoNext());
      this.contexts.set('moves-next', 1, { start: bulkOfMoves.next });
    }
  }

  static history(movesNumber?: number): void {
    const history = this.long.history;
    if (history.length === 0) {
      this.speak(Ans.emptyHistory());
      this.speak(Ask.waitMove());
      return;
    }
    movesNumber = movesNumber || history.length;
    if (movesNumber < 1) {
      this.speak(Ans.invalidMovesNumber(movesNumber));
      this.speak(Ask.whatToDo());
      return;
    }
    let answer = '';
    if (movesNumber > history.length) {
      answer += Ans.moreMovesThanWeHave(movesNumber, history.length) + '\n';
      movesNumber = history.length;
    }
    const playerSide = this.long.side;
    const requestedMoves = history.slice(history.length - movesNumber);
    answer += historyOfMoves(requestedMoves, playerSide);
    this.speak(answer);
    this.speak(Ask.waitMove());
  }

  static square(square: string): void {
    const fenstring = this.long.fen;
    const playerSide = this.long.side;
    const board = new ChessBoard(fenstring);
    const reqestedPiece = board.pos(square);
    if (reqestedPiece) {
      this.speak(Ans.hereIsPieceOnPosition(square, reqestedPiece, playerSide));
    } else {
      this.speak(Ans.emptyPosition(square));
    }
    this.speak(pause(1) + Ask.nextSquare() + ' ' + Ask.orMove());
  }

  static piece(piece: string, side?: ChessSide, whose?: WhoseSide): void {
    const fenstring = this.long.fen;
    const playerSide = this.long.side;
    const board = new ChessBoard(fenstring, true);
    if (side === ChessSide.WHITE) {
      piece = piece.toUpperCase();
    }
    if (
      (whose === WhoseSide.PLAYER && playerSide === ChessSide.WHITE) ||
      (whose === WhoseSide.ENEMY && playerSide === ChessSide.BLACK)
    ) {
      piece = piece.toUpperCase();
      side = ChessSide.WHITE;
    } else {
      side = ChessSide.BLACK;
    }
    if (!side && !whose) {
      whose = WhoseSide.PLAYER;
      side = playerSide;
      if (playerSide === ChessSide.WHITE) {
        piece = piece.toUpperCase();
      }
    }
    const positions = board.allPiecesByType(piece);
    if (positions.length === 0) {
      this.speak(Ans.noSuchPieces(piece, whose));
    } else {
      const ans = allPiecesForType(piece, positions, whose, playerSide);
      this.speak(ans);
    }
    this.speak(pause(0.6) + Ask.nextPiece() + ' ' + Ask.orMove());
  }

  static all(side?: ChessSide, whose?: WhoseSide): void {
    if (!side && !whose) {
      Handlers.fallback();
      return;
    }
    const playerSide = this.long.side;
    if (!side) {
      if (whose === WhoseSide.PLAYER) {
        side = playerSide;
      } else {
        side = oppositeSide(playerSide);
      }
    }
    const fenstring = this.long.fen;
    const board = new ChessBoard(fenstring);
    const positions = board.allPiecesBySide(side);
    this.speak(allPiecesForSide(positions, side, playerSide) + ' \n' + Ans.itsAll());
    this.speak(Ask.waitMove());
  }

  static captured(): void {
    const fenstring = this.long.fen;
    const playerSide = this.long.side;
    const board = new ChessBoard(fenstring, true);
    const captured = board.capturedPieces();
    if (captured.white.length === 0 && captured.black.length === 0) {
      this.speak(Ans.noCapturedPieces());
    } else {
      this.speak(listCapturedPieces(captured, playerSide));
    }
    this.speak(Ask.waitMove());
  }

  static side(side?: ChessSide, who?: WhoseSide): void {
    const playerSide = this.long.side;
    this.speak(someonePlayForColor(who, side, playerSide));
    this.speak(Ask.waitMove());
  }

  static fullmove(): void {
    const fenstring = this.long.fen;
    const board = new ChessBoard(fenstring);
    const num = board.movesNumber - 1;
    if (num === 0) {
      this.speak(Ans.noFullmoves());
    } else {
      this.speak(Ans.fullmoveNumber(num));
    }
    this.speak(Ask.waitMove());
  }
}
