import { ChessSide, getSide } from './chess/chessUtils';
import { Vocabulary as Voc } from './locales/vocabulary';
import { upFirst, pause } from './helpers';

export interface HistoryFrame {
  c: string; // piece code
  m: string; // move
  b?: string; // beated piece code
}

export function historyOfMoves(
  moves: HistoryFrame[],
  pSide: ChessSide
): string {
  let result = '';
  let isPlayerMove = false;
  if (getSide(moves[0].c) === pSide) {
    isPlayerMove = true;
  }
  let intro = false;
  let rnd = Math.random();
  if (rnd < 0.3 && moves.length > 1) {
    result += Voc.firstMoveInHistoryIntro() + ' ';
    intro = true;
  }
  for (const move of moves) {
    const from = move.m.slice(0, 2);
    const to = move.m.slice(2, 4);
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
    if (isPlayerMove) {
      let firstPhrase = Voc.youMoved(move.c, from, to);
      if (!intro) {
        firstPhrase = upFirst(firstPhrase);
      }
      result += firstPhrase;
      if (move.b) {
        addSeparator();
        result += Voc.youTookMyPiece(move.b);
      }
      if (move.m.length === 5) {
        addSeparator();
        const promoteTo = move.m[4];
        result += Voc.youPromoted(promoteTo);
      }
    } else {
      let firstPhrase = Voc.iMoved(move.c, from, to);
      if (!intro) {
        firstPhrase = upFirst(firstPhrase);
      }
      result += firstPhrase;
      if (move.b) {
        addSeparator();
        result += Voc.iTookYourPiece(move.b);
      }
      if (move.m.length === 5) {
        addSeparator();
        const promoteTo = move.m[4];
        result += Voc.iPromoted(promoteTo);
      }
    }
    result += '.' + pause(1) + '\n';
    isPlayerMove = !isPlayerMove;
    intro = false;
  }
  return result;
}
