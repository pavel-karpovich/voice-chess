import { ChessSide, getSide, WhoseSide, oppositeWho } from '../chess/chessUtils';
import { Vocabulary as Voc } from '../locales/vocabulary';
import { Phrases as Phr } from '../locales/phrases';
import { upFirst, pause } from './helpers';
import { rookMoveForCastlingMove, isMoveSuitableForCastling } from '../chess/castling';

export interface HistoryFrame {
  m: string; // pieceCode + move: "pg2g4", "Pe7e8Q"
  b?: string; // captured piece code
  e?: string; // captured 'en passant' pawn position
}

export function createHistoryItem(
  piece: string,
  move: string,
  beatedPiece?: string,
  enPassantPawn?: string
): HistoryFrame {
  const historyItem = { m: piece + move } as HistoryFrame;
  if (beatedPiece) {
    historyItem.b = beatedPiece;
  } else if (enPassantPawn) {
    historyItem.e = enPassantPawn;
  }
  return historyItem;
}

export function historyOfMoves(moves: HistoryFrame[], pSide: ChessSide): string {
  let result = '';
  let whoseMove = WhoseSide.ENEMY;
  if (getSide(moves[0].m[0]) === pSide) {
    whoseMove = WhoseSide.PLAYER;
  }
  let intro = false;
  let rnd = Math.random();
  if (rnd < 0.3 && moves.length > 1) {
    result += Voc.firstMoveInHistoryIntro() + ' ';
    intro = true;
  }
  for (const move of moves) {
    const piece = move.m[0];
    const mv = move.m.slice(1);
    const from = mv.slice(0, 2);
    const to = mv.slice(2, 4);
    const optTotal = Number('b' in move) + Number(move.m.length === 6);
    let optCount = 0;
    const addSeparator = () => {
      optCount++;
      if (optCount === optTotal) {
        result += ' ' + Voc.and() + ' ';
      } else {
        result += ', ';
      }
    };
    rnd = Math.random();
    if (rnd < 0.35 && !intro && move !== moves[0]) {
      result += Voc.nextMoveInHistoryIntro() + ' ';
      intro = true;
    }
    const enPassant = move.e;
    const castling = isMoveSuitableForCastling(piece, mv);
    if (castling) {
      const rookMove = rookMoveForCastlingMove(mv);
      const rookFrom = rookMove.slice(0, 2);
      const rookTo = rookMove.slice(2, 4);
      let castlingPhrase = Phr.someoneDoCastling(whoseMove, from, to, rookFrom, rookTo);
      if (!intro) {
        castlingPhrase = upFirst(castlingPhrase);
      }
      result += castlingPhrase;
    } else if (enPassant) {
      let enPassPhrase = Phr.someoneDoEnPassant(whoseMove, from, to, enPassant);
      if (!intro) {
        enPassPhrase = upFirst(enPassPhrase);
      }
      result += enPassPhrase;
    } else {
      let firstPhrase = Phr.someoneMoved(whoseMove, piece, from, to);
      if (!intro) {
        firstPhrase = upFirst(firstPhrase);
      }
      result += firstPhrase;
      if (move.b) {
        addSeparator();
        result += Phr.someoneAtePiece(whoseMove, move.b);
      }
      if (move.m.length === 6) {
        addSeparator();
        const promoteTo = move.m[5];
        result += Phr.someonePromoted(whoseMove, promoteTo);
      }
    }
    result += '.' + pause(1) + '\n';
    whoseMove = oppositeWho(whoseMove);
    intro = false;
  }
  return result;
}
