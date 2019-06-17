import { ChessBoard } from '../chess/chessboard';
import { enPawnPos } from '../chess/chessUtils';
import { Vocabulary as Voc } from '../locales/vocabulary';
import { upFirst, pause } from './helpers';

interface Move {
  to: string;
  beat?: string;
  promo?: boolean;
  from?: string;
}
interface PieceMoves {
  type: string;
  pos: string;
  moves: Move[];
  enPassant?: boolean;
  castling?: boolean;
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
  if (n >= allMoves.length || n < 0) {
    return null;
  }
  const ret = { end: true, next: n, pieces: [] as PieceMoves[] };
  const board = new ChessBoard(fen);
  if (beatsSorted) {
    allMoves.sort((move1, move2) => {
      const beat1 = board.pos(move1.slice(2, 4));
      const beat2 = board.pos(move2.slice(2, 4));
      const cast1 = board.isMoveCastling(move1);
      const cast2 = board.isMoveCastling(move2);
      if (move1.slice(2, 4) !== board.enPassant && move2.slice(2, 4) === board.enPassant) {
        return 1;
      } else if (move1.slice(2, 4) === board.enPassant && move2.slice(2, 4) !== board.enPassant) {
        return -1;
      } else if (move1.length === 4 && move2.length === 5) return 1;
      else if (move1.length === 5 && move2.length === 4) return -1;
      else if (beat1 === null && beat2 !== null) return 1;
      else if (beat1 !== null && beat2 === null) return -1;
      else if (!cast1 && cast2) return 1;
      else if (cast1 && !cast2) return -1;
      else return move1.localeCompare(move2);
    });
  } else {
    allMoves.sort((move1, move2) => {
      const from1 = move1.slice(0, 2);
      const from2 = move2.slice(0, 2);
      const beat1 = board.pos(move1.slice(2, 4));
      const beat2 = board.pos(move2.slice(2, 4));
      const cast1 = board.isMoveCastling(move1);
      const cast2 = board.isMoveCastling(move2);
      if (move1.slice(2, 4) !== board.enPassant && move2.slice(2, 4) === board.enPassant) {
        return 1;
      } else if (move1.slice(2, 4) === board.enPassant && move2.slice(2, 4) !== board.enPassant) {
        return -1;
      } else if (!cast1 && cast2) return 1;
      else if (cast1 && !cast2) return -1;
      else if (from1.localeCompare(from2) === 1) return 1;
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
    allMoves.slice(n).reduce((sum, el) => (sum += Number(el.length === 5)), 0) * 0.75;
  const maxN = n + standardSize + permissibleVariation + unnecessary;
  if (maxN >= allMoves.length) {
    ret.next = allMoves.length;
    let lastPos = allMoves[n].slice(0, 2);
    let posTo = allMoves[n].slice(2, 4);
    let pieceType = board.pos(lastPos);
    let isCastlPrev = board.isMoveCastling(allMoves[n]);
    let isEnPsntPrev = posTo === board.enPassant;
    let piece;
    if (isCastlPrev) {
      piece = {
        pos: lastPos,
        type: pieceType,
        moves: [] as Move[],
        castling: true,
      };
    } else if (isEnPsntPrev) {
      piece = {
        pos: enPawnPos(board.enPassant),
        type: pieceType,
        moves: [] as Move[],
        enPassant: true,
      };
    } else {
      piece = {
        pos: lastPos,
        type: pieceType,
        moves: [] as Move[],
      };
    }
    for (let i = n; i < allMoves.length; ++i) {
      const currentPos = allMoves[i].slice(0, 2);
      posTo = allMoves[i].slice(2, 4);
      pieceType = board.pos(currentPos);
      const promo = allMoves[i].length === 5;
      let mv = null;
      const isCastl = board.isMoveCastling(allMoves[i]);
      const isEnPsnt = posTo === board.enPassant;
      if (isEnPsnt) {
        mv = { to: posTo, from: currentPos };
      } else if (isCastl) {
        mv = { to: posTo };
      } else {
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
      }
      if (
        (currentPos === lastPos && !isEnPsnt && !isEnPsntPrev && !isCastl && !isCastlPrev) ||
        (isEnPsnt && isEnPsntPrev) ||
        (isCastl && isCastlPrev)
      ) {
        piece.moves.push(mv);
      } else {
        ret.pieces.push(piece);
        lastPos = currentPos;
        if (isEnPsnt) {
          piece = {
            pos: enPawnPos(board.enPassant),
            type: pieceType,
            moves: [] as Move[],
            enPassant: true,
          };
        } else if (isCastl) {
          piece = {
            pos: lastPos,
            type: pieceType,
            moves: [mv],
            castling: true,
          };
        } else {
          piece = {
            pos: lastPos,
            type: pieceType,
            moves: [mv],
          };
        }
      }
      isEnPsntPrev = isEnPsnt;
      isCastlPrev = isCastl;
    }
    ret.pieces.push(piece);
  } else {
    const totalLength = (bulk: MovesBulk): number => {
      return bulk.pieces.reduce((sum, el) => (sum += el.moves.length), 0);
    };
    ret.end = false;
    let lastPos = allMoves[n].slice(0, 2);
    let posTo = allMoves[n].slice(2, 4);
    let pieceType = board.pos(lastPos);
    let isCastlPrev = board.isMoveCastling(allMoves[n]);
    let isEnPsntPrev = posTo === board.enPassant;
    let piece;
    if (isEnPsntPrev) {
      piece = {
        pos: enPawnPos(board.enPassant),
        type: board.pos(lastPos),
        moves: [] as Move[],
        enPassant: true,
      };
    } else if (isCastlPrev) {
      piece = {
        pos: lastPos,
        type: pieceType,
        moves: [] as Move[],
        castling: true,
      };
    } else {
      piece = {
        pos: lastPos,
        type: pieceType,
        moves: [] as Move[],
      };
    }
    let i;
    for (i = n; i < maxN + 1; ++i) {
      const currentPos = allMoves[i].slice(0, 2);
      pieceType = board.pos(currentPos);
      posTo = allMoves[i].slice(2, 4);
      const promo = allMoves[i].length === 5;
      let mv = null;
      const isCastl = board.isMoveCastling(allMoves[i]);
      const isEnPsnt = posTo === board.enPassant;
      if (isEnPsnt) {
        mv = { to: posTo, from: currentPos };
      } else if (isCastl) {
        mv = { to: posTo };
      } else {
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
      }
      if (
        (currentPos === lastPos && !isEnPsnt && !isEnPsntPrev && !isCastl && !isCastlPrev) ||
        (isEnPsnt && isEnPsntPrev) ||
        (isCastl && isCastlPrev)
      ) {
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
        if (isEnPsnt) {
          piece = {
            pos: enPawnPos(board.enPassant),
            type: pieceType,
            moves: [] as Move[],
            enPassant: true,
          };
        } else if (isCastl) {
          piece = {
            pos: lastPos,
            type: pieceType,
            moves: [mv],
            castling: true,
          };
        } else {
          piece = {
            pos: lastPos,
            type: pieceType,
            moves: [mv],
          };
        }
      }
      isEnPsntPrev = isEnPsnt;
      isCastlPrev = isCastl;
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
      result += ' ' + Voc.on(targets[i].to);
    } else {
      result += ' ' + Voc.on(targets[i].to, 'vin');
    }
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
  let result = upFirst(Voc.pieceFromPosition(pos.type, pos.pos));
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

function enPassantFromBulk(pos: PieceMoves): string {
  let result = Voc.canMakeEnPassant(pos.moves[0].to, pos.pos);
  result += ' ' + Voc.byPlay() + ' ';
  result += Voc.enPassantByMove(pos.moves[0].from, pos.moves[0].to);
  if (pos.moves.length === 2) {
    result += ', ' + Voc.or() + ' ';
    result += Voc.enPassantByMove(pos.moves[1].from, pos.moves[1].to);
  }
  result += '.';
  return result;
}

function castlingFromBulk(pos: PieceMoves): string {
  let result = Voc.canMakeCastling(pos.pos);
  result += ' ' + Voc.castlingTo(pos.moves[0].to);
  if (pos.moves.length === 2) {
    result += ' ' + Voc.and() + ' ';
    result += Voc.castlingTo(pos.moves[1].to);
  }
  result += '.';
  return result;
}

export function listMoves(bulk: PieceMoves[]): string {
  let result = '';
  for (const piece of bulk) {
    if (piece.enPassant) {
      result += enPassantFromBulk(piece);
    } else if (piece.castling) {
      result += castlingFromBulk(piece);
    } else {
      result += onePosFromBulk(piece);
    }
    result += pause(1) + ' ';
  }
  return result;
}
