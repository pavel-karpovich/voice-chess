import { ChessSide, getSide, WhoseSide, oppositeWho } from '../chess/chessUtils';
import { Vocabulary as Voc } from '../locales/vocabulary';
import { upFirst, pause } from './helpers';

export interface HistoryFrame {
  m: string; // pieceCode + move: "pg2g4", "Pe7e8Q"
  b?: string; // captured piece code
  e?: string; // captured 'en passant' pawn position
  c?: string; // rock move when castling
}

export function createHistoryItem(
  piece: string,
  move: string,
  beatedPiece?: string,
  rookMove?: string,
  enPassantPawn?: string
): HistoryFrame {
  const historyItem = { m: piece + move } as HistoryFrame;
  if (beatedPiece) {
    historyItem.b = beatedPiece;
  } else if (rookMove) {
    historyItem.c = rookMove;
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
    const from = move.m.slice(1, 3);
    const to = move.m.slice(3, 5);
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
    const castling = move.c;
    if (castling) {
      const rockFrom = castling.slice(0, 2);
      const rockTo = castling.slice(2, 4);
      let castlingPhrase = Voc.someoneDoCastling(whoseMove, from, to, rockFrom, rockTo);
      if (!intro) {
        castlingPhrase = upFirst(castlingPhrase);
      }
      result += castlingPhrase;
    } else if (enPassant) {
      let enPassPhrase = Voc.someoneDoEnPassant(whoseMove, from, to, enPassant);
      if (!intro) {
        enPassPhrase = upFirst(enPassPhrase);
      }
      result += enPassPhrase;
    } else {
      let firstPhrase = Voc.someoneMoved(whoseMove, piece, from, to);
      if (!intro) {
        firstPhrase = upFirst(firstPhrase);
      }
      result += firstPhrase;
      if (move.b) {
        addSeparator();
        result += Voc.someoneAtePiece(whoseMove, move.b);
      }
      if (move.m.length === 6) {
        addSeparator();
        const promoteTo = move.m[5];
        result += Voc.someonePromoted(whoseMove, promoteTo);
      }
    }
    result += '.' + pause(1) + '\n';
    whoseMove = oppositeWho(whoseMove);
    intro = false;
  }
  return result;
}
