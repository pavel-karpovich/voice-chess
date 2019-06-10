import { ChessBoard } from '../chess/chessboard';
import { Vocabulary as Voc } from '../locales/vocabulary';
import { char, upFirst, pause } from './helpers';

interface Move {
  to: string;
  beat?: string;
  promo?: boolean;
}
interface PieceMoves {
  type: string;
  pos: string;
  moves: Move[];
}
interface MovesBulk {
  end: boolean;
  next: number;
  pieces: PieceMoves[];
}

export function getBulkOfMoves(
  fen: string,
  allMoves: string[],
  n: number,
  beatsSorted = true
): MovesBulk {
  const ret = { end: true, next: n, pieces: [] as PieceMoves[] };
  if (n >= allMoves.length) {
    return ret;
  }
  const board = new ChessBoard(fen);
  if (beatsSorted) {
    allMoves.sort((move1, move2) => {
      const beat1 = board.pos(move1.slice(2, 4));
      const beat2 = board.pos(move2.slice(2, 4));
      if (move1.length === 4 && move2.length === 5) return 1;
      else if (move1.length === 5 && move2.length === 4) return -1;
      else if (beat1 === null && beat2 !== null) return 1;
      else if (beat1 !== null && beat2 === null) return -1;
      else return move1.localeCompare(move2);
    });
  } else {
    allMoves.sort((move1, move2) => {
      const from1 = move1.slice(0, 2);
      const from2 = move2.slice(0, 2);
      const beat1 = board.pos(move1.slice(2, 4));
      const beat2 = board.pos(move2.slice(2, 4));
      if (from1.localeCompare(from2) === 1) return 1;
      else if (from1.localeCompare(from2) === -1) return -1;
      else if (beat1 === null && beat2 !== null) return 1;
      else if (beat1 !== null && beat2 === null) return -1;
      else if (move1.length === 4 && move2.length === 5) return 1;
      else if (move1.length === 5 && move2.length === 4) return -1;
      else return 0;
    });
  }
  const standardSize = 10;
  const permissibleVariation = 5;
  const unnecessary =
    allMoves.slice(n).reduce((sum, el) => (sum += Number(el.length === 5)), 0) *
    0.75;
  const maxN = n + standardSize + permissibleVariation + unnecessary;
  if (maxN > allMoves.length) {
    ret.next = allMoves.length;
    let lastPos = allMoves[n].slice(0, 2);
    let piece = {
      pos: lastPos,
      type: board.pos(lastPos),
      moves: [] as Move[],
    };
    for (let i = n; i < allMoves.length; ++i) {
      const currentPos = allMoves[i].slice(0, 2);
      const posTo = allMoves[i].slice(2, 4);
      const promo = allMoves[i].length === 5;
      let mv = null;
      if (promo) {
        const beat = board.pos(posTo);
        if (beat) {
          mv = { to: posTo, beat, promo };
        } else {
          mv = { to: posTo, promo };
        }
        i += 3;
      } else {
        const beat = board.pos(posTo);
        if (beat) {
          mv = { to: posTo, beat };
        } else {
          mv = { to: posTo };
        }
      }
      if (currentPos === lastPos) {
        piece.moves.push(mv);
      } else {
        ret.pieces.push(piece);
        lastPos = currentPos;
        piece = { pos: lastPos, type: board.pos(lastPos), moves: [mv] };
      }
    }
    ret.pieces.push(piece);
  } else {
    const totalLength = (bulk: MovesBulk): number => {
      return bulk.pieces.reduce((sum, el) => (sum += el.moves.length), 0);
    };
    ret.end = false;
    let lastPos = allMoves[n].slice(0, 2);
    let piece = {
      pos: lastPos,
      type: board.pos(lastPos),
      moves: [] as Move[],
    };
    let i;
    for (i = n; i < maxN + 1; ++i) {
      const currentPos = allMoves[i].slice(0, 2);
      const posTo = allMoves[i].slice(2, 4);
      const promo = allMoves[i].length === 5;
      let mv = null;
      if (promo) {
        const beat = board.pos(posTo);
        if (beat) {
          mv = { to: posTo, beat, promo };
        } else {
          mv = { to: posTo, promo };
        }
        i += 3;
      } else {
        const beat = board.pos(posTo);
        if (beat) {
          mv = { to: posTo, beat };
        } else {
          mv = { to: posTo };
        }
      }
      if (currentPos === lastPos) {
        if (i === maxN) {
          if (totalLength(ret) <= standardSize - permissibleVariation) {
            ret.pieces.push(piece);
          } else {
            i -= piece.moves.length;
          }
          break;
        }
        piece.moves.push(mv);
      } else {
        ret.pieces.push(piece);
        if (totalLength(ret) >= standardSize) {
          break;
        }
        lastPos = currentPos;
        piece = { pos: lastPos, type: board.pos(lastPos), moves: [mv] };
      }
    }
    ret.next = i;
  }
  return ret;
}

function canDoSmth(targets: Move[]): string {
  let result = ' ';
  if (targets[0].beat) {
    const gen = Voc.pieceGender(targets[0].beat);
    result += Voc.canAttack() + ' ' + Voc.enemy(gen);
  } else {
    result += Voc.canMove();
  }
  for (let i = 0; i < targets.length; ++i) {
    if (i !== 0 && i === targets.length - 1) {
      result += ' ' + Voc.or();
    }
    if (targets[i].beat) {
      result += ' ' + Voc.piece(targets[i].beat, 'vin');
    }
    result += ' ' + Voc.on() + ' ' + char(targets[i].to);
    if (targets[i].promo) {
      result += ' ' + Voc.and() + ' ' + Voc.canPromote();
    }
    if (i < targets.length - 1) {
      result += ',';
    }
  }
  return result;
}

function onePosFromBulk(pos: PieceMoves): string {
  let result = upFirst(Voc.pieceOnPosition(pos.type, pos.pos));
  let startIndex = 0;
  let endIndex = 0;
  let end = false;
  let first = true;
  let last = false;
  let isBeats = Boolean(pos.moves[0].beat);
  for (let i = 0; i < pos.moves.length; ++i) {
    if (Boolean(pos.moves[i].beat) !== isBeats) {
      end = true;
    }
    if (i === pos.moves.length - 1) {
      last = true;
    }
    endIndex = i;
    if (end || last) {
      if (!first) {
        result += ', ' + Voc.asWell();
      } else {
        first = false;
      }
      if (end && last) {
        result += canDoSmth(pos.moves.slice(startIndex, endIndex));
        result += ', ' + Voc.asWell();
        result += canDoSmth(pos.moves.slice(endIndex));
      } else if (last) {
        result += canDoSmth(pos.moves.slice(startIndex));
      } else {
        result += canDoSmth(pos.moves.slice(startIndex, endIndex));
      }
      startIndex = endIndex;
      isBeats = !isBeats;
      end = false;
    }
  }
  result += '.';
  return result;
}
export function listMoves(bulk: PieceMoves[]): string {
  let result = '';
  for (const move of bulk) {
    result += onePosFromBulk(move) + pause(1) + ' ';
  }
  return result;
}
