import { ChessSide, getSide } from './chess/chessUtils';
import { Vocabulary as Voc } from './locales/vocabulary';
import { upFirst, pause } from './helpers';

export interface HistoryFrame {
  code: string;
  move: string;
  beat?: string;
  promo?: string;
}

export function historyOfMoves(moves: HistoryFrame[], pSide: ChessSide): string {
  let result = '';
  let isPlayerMove = false;
  if (getSide(moves[0].code) === pSide) {
    isPlayerMove = true;
  }
  let intro = false;
  let rnd = Math.random();
  if (rnd < 0.3 && moves.length > 1) {
    result += Voc.firstMoveInHistoryIntro() + ' ';
    intro = true;
  }
  for (const move of moves) {
    const from = move.move.slice(0, 2);
    const to = move.move.slice(2, 4);
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
      let firstPhrase = Voc.youMoved(move.code, from, to);
      if (!intro) {
        firstPhrase = upFirst(firstPhrase);
      }
      result += firstPhrase;
      if (move.beat) {
        addSeparator();
        result += Voc.youTookMyPiece(move.beat);
      }
      if (move.promo) {
        addSeparator();
        result += Voc.youPromoted(move.promo);
      }
    } else {
      let firstPhrase = Voc.iMoved(move.code, from, to);
      if (!intro) {
        firstPhrase = upFirst(firstPhrase);
      }
      result += firstPhrase;
      if (move.beat) {
        addSeparator();
        result += Voc.iTookYourPiece(move.beat);
      }
      if (move.promo) {
        addSeparator();
        result += Voc.iPromoted(move.promo);
      }
    }
    result += '.' + pause(1) + '\n';
    isPlayerMove = !isPlayerMove;
    intro = false;
  }
  return result;
}