import { ChessSide, getSide } from '../chess/chessUtils';
import { Vocabulary as Voc } from '../locales/vocabulary';
import { upFirst, pause } from './helpers';

export interface HistoryFrame {
  m: string; // pieceCode + move: "pg2g4", "Pe7e8Q"
  b?: string; // beated piece code
  e?: string; // beated 'en passant' piece code
  c?: string; // rock move when castling
}

export function historyOfMoves(
  moves: HistoryFrame[],
  pSide: ChessSide
): string {
  let result = '';
  let isPlayerMove = false;
  if (getSide(moves[0].m[0]) === pSide) {
    isPlayerMove = true;
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
    const optTotal = Number('beat' in move) + Number('promo' in move);
    let optCount = 0;
    const addSeparator = () => {
      optCount++;
      if (optCount === optTotal) {
        result += Voc.and() + ' ';
      } else {
        result += ', ';
      }
    };
    rnd = Math.random();
    if (rnd < 0.3 && !intro && move !== moves[0]) {
      result += Voc.nextMoveInHistoryIntro() + ' ';
      intro = true;
    }
    const enPassant = move.e;
    const castling = move.c;
    if (isPlayerMove) {
      if (castling) {
        const rockFrom = castling.slice(0, 2);
        const rockTo = castling.slice(2, 4);
        let castlingPhrase = Voc.youDoCastling(from, to, rockFrom, rockTo);
        if (!intro) {
          castlingPhrase = upFirst(castlingPhrase);
        }
        result += castlingPhrase;
      } else if (enPassant) {
        let enPassPhrase = Voc.youDoEnPassant(from, to, enPassant);
        if (!intro) {
          enPassPhrase = upFirst(enPassPhrase);
        }
        result += enPassPhrase;
      } else {
        let firstPhrase = Voc.youMoved(piece, from, to);
        if (!intro) {
          firstPhrase = upFirst(firstPhrase);
        }
        result += firstPhrase;
        if (move.b) {
          addSeparator();
          result += Voc.youTookMyPiece(move.b);
        }
        if (move.m.length === 6) {
          addSeparator();
          const promoteTo = move.m[5];
          result += Voc.youPromoted(promoteTo);
        }
      }
    } else {
      if (castling) {
        const rockFrom = castling.slice(0, 2);
        const rockTo = castling.slice(2, 4);
        let castlingPhrase = Voc.iDoCastling(from, to, rockFrom, rockTo);
        if (!intro) {
          castlingPhrase = upFirst(castlingPhrase);
        }
        result += castlingPhrase;
      } else if (enPassant) {
        let enPassPhrase = Voc.iDoEnPassant(from, to, enPassant);
        if (!intro) {
          enPassPhrase = upFirst(enPassPhrase);
        }
        result += enPassPhrase;
      } else {
        let firstPhrase = Voc.iMoved(piece, from, to);
        if (!intro) {
          firstPhrase = upFirst(firstPhrase);
        }
        result += firstPhrase;
        if (move.b) {
          addSeparator();
          result += Voc.iTookYourPiece(move.b);
        }
        if (move.m.length === 6) {
          addSeparator();
          const promoteTo = move.m[5];
          result += Voc.iPromoted(promoteTo);
        }
      }
    }
    result += '.' + pause(1) + '\n';
    isPlayerMove = !isPlayerMove;
    intro = false;
  }
  return result;
}