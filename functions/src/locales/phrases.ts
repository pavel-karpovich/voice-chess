import { rand, char, mix, upFirst } from '../support/helpers';
import { WhoseSide, getSide, oppositeWho, ChessSide } from '../chess/chessUtils';
import { rLangs, Langs } from './struct/struct';
import { Vocabulary as V } from './vocabulary';

// prettier-ignore
export class Phrases {
  private static lang: string;

  static setLanguage(language = 'ru'): void {
    this.lang = language;
  }

  static canAttack(): string {
    return rand(
      ({
        en: ['can attack'],
        ru: ['может атаковать'],
      } as rLangs)[this.lang]
    );
  }
  static canMove(): string {
    return rand(
      ({
        en: ['can move'],
        ru: ['может ходить'],
      } as rLangs)[this.lang]
    );
  }
  static canPromote(): string {
    return rand(
      ({
        en: [
          'then promote',
          'transform to queen',
          'transform to another piece',
          'then promote to queen',
        ],
        ru: [
          'затем превратиться',
          'превратиться в другую фигуру',
          'превратиться в ферзя',
          'затем превратиться в ферзя',
        ],
      } as rLangs)[this.lang]
    );
  }
  static canMakeEnPassant(to: string, pawnPos: string): string {
    return rand(
      ({
        en: [
          `The enemy pawn has just made a double move to ${V.square(pawnPos)}, and can be captured in pass,`,
          `You can capture the opponent's pawn 'En Passant' ${V.on(pawnPos)} through ${V.square(to)},`,
          `An enemy pawn from ${V.square(pawnPos)} can be captured via 'En Passant',`,
        ],
        ru: [
          `Вражеская пешка только что сделала двойной ход ${V.on(pawnPos, 'vin')}, и её можно перехватить на проходе,`,
          `Можно взять вражескую пешку на проходе к ${V.square(pawnPos, 'dat')} через ${V.square(to, 'vin')},`,
          `Пешку ${V.on(pawnPos)} можно взять 'Энпассан',`,
        ],
      } as rLangs)[this.lang]
    );
  }
  static enPassantByMove(from: string, to: string): string {
    return rand(
      ({
        en: [
          `from ${V.square(from)} to ${V.square(char(to))}`,
          `by pawn from ${V.square(from)}`,
          `from ${V.square(from)}`,
        ],
        ru: [
          `пешкой ${V.fromTo(from, to)}`,
          `пешкой ${char(from)} ${char(to)}`,
          `${V.fromTo(from, to)}`,
          `пешкой с ${V.square(from)}`,
        ],
      } as rLangs)[this.lang]
    );
  }
  static castlingTo(castTo: string): string {
    if (castTo[0] === 'c') {
      return rand(
        ({
          en: [
            `to ${V.square(castTo)}`,
            `to ${char(castTo)}`,
            `on the queenside to ${V.square(castTo)}`,
            `to the long side ${char(castTo)}`,
          ],
          ru: [
            `на ${V.square(castTo, 'vin')}`,
            `на ${char(castTo)}`,
            `в направлении ферзевого фланга на ${V.square(castTo, 'vin')}`,
            `в длинную сторону на ${V.square(castTo, 'vin')}`,
          ],
        } as rLangs)[this.lang]
      );
    } else {
      return rand(
        ({
          en: [
            `to ${V.square(castTo)}`,
            `to ${char(castTo)}`,
            `on the kingside to ${V.square(castTo)}`,
            `to the short side ${char(castTo)}`,
          ],
          ru: [
            `на позицию ${V.square(castTo, 'vin')}`,
            `на ${char(castTo)}`,
            `в направлении королевского фланга на ${V.square(castTo, 'vin')}`,
            `в короткую сторону на ${V.square(castTo, 'vin')}`,
          ],
        } as rLangs)[this.lang]
      );
    }
  }
  static canMakeCastling(kingPos: string): string {
    return rand(
      ({
        en: [
          'You can do castling by the king',
          'You have the castling move',
          `King from ${V.square(kingPos)} can castling`,
          'You can castling',
        ],
        ru: [
          'Вы можете сделать рокировку своим королём',
          'Вам доступна рокировка',
          `Король на ${V.square(kingPos, 'prd')} может сделать рокировку`,
        ],
      } as rLangs)[this.lang]
    );
  }
  static someoneMoved(who: WhoseSide, pieceCode: string, from: string, to: string): string {
    return rand(
      ({
        en: [
          `${V.youOrI(who)} moved ${V.yourOrMy(pieceCode, who)} ${V.piece(pieceCode)} ${V.fromTo(from, to)}`,
          `${V.youOrI(who)} played ${V.piece(pieceCode)} ${char(from)} ${char(to)}`,
          `${V.youOrI(who)} made a ${V.piece(pieceCode)} move ${V.fromTo(from, to)}`,
        ],
        ru: [
          `${V.youOrI(who)} ${V.moved(who)} ${V.piece(pieceCode, 'tvr')} ${V.fromTo(from, to)}`,
          `${V.youOrI(who)} ${V.played(who)} ${V.piece(pieceCode, 'tvr')} ${char(from)} ${char(to)}`,
          `${V.youOrI(who)} ${V.moved2(who)} ${V.piece(pieceCode, 'tvr')} ${V.fromTo(from, to)}`,
          `${V.youOrI(who)} ${V.moved(who)} ${V.selfPiece(pieceCode, 'tvr')} ${V.fromTo(from, to)}`,
        ],
      } as rLangs)[this.lang]
    );
  }
  static someoneAtePiece(who: WhoseSide, pieceCode: string): string {
    return rand(
      ({
        en: [
          `ate ${V.someonesPiece(oppositeWho(who), pieceCode)}`,
          `took ${V.someonesPiece(oppositeWho(who), pieceCode)}`,
          `left me without ${V.someonesPiece(oppositeWho(who), pieceCode)}`,
          `captured ${V.someonesPiece(oppositeWho(who), pieceCode)}`,
        ],
        ru: [
          `${V.capture(who)} ${V.someonesPiece(oppositeWho(who), pieceCode, 'vin')}`,
          `${V.capture(who)} ${V.someonesPiece(oppositeWho(who), pieceCode, 'vin')}`,
          `${V.capture(who)} ${V.someonesPiece(oppositeWho(who), pieceCode, 'vin')}`,
          `${V.deprived(who)} ${V.someonesPiece(oppositeWho(who), pieceCode, 'rod')}`,
        ],
      } as rLangs)[this.lang]
    );
  }
  static someonePromoted(who: WhoseSide, pieceCode: string): string {
    return rand(
      ({
        en: [
          `${V.youOrI(who)} had promoted ${V.yourOrMy('p', who)} pawn to the ${V.piece(pieceCode)}`,
          `${V.youOrI(who)} turned ${V.yourOrMy('p', who)} pawn into the ${V.yourPiece(pieceCode)}`,
        ],
        ru: [
          `${V.transform(who)} свою пешку в ${V.piece(pieceCode, 'vin')}`,
          `${V.transform(who)} свою пешку в ${V.piece(pieceCode, 'vin')}`,
        ],
      } as rLangs)[this.lang]
    );
  }
  static someoneDoEnPassant(who: WhoseSide, from: string, to: string, pawn: string): string {
    return rand(
      ({
        en: [
          `${V.youOrI(who)} moved pawn ${V.fromTo(from, to)} and made 'En Passant', capturing ${V.yourOrMy('p', oppositeWho(who))} pawn on ${V.square(pawn)}`,
          `${V.youOrI(who)} made in passing capturing of ${V.yourOrMy('p', oppositeWho(who))} pawn on ${V.square(pawn)} by move ${V.fromTo(from, to)}`,
          `${V.youOrI(who)} captured ${V.yourOrMy('p', oppositeWho(who))} pawn 'En Passant' by moving ${V.fromTo(from, to)}`,
        ],
        ru: [
          `${V.youOrI(who)} ${V.moved(who)} пешкой ${V.fromTo(from, to)} и ${V.made(who)} Энпассант, забрав ${V.yourOrMy('p', oppositeWho(who), 'vin')} пешку на ${V.square(pawn, 'prd')}`,
          `${V.youOrI(who)} ${V.made(who)} взятие ${V.yourOrMy('p', oppositeWho(who), 'rod')} пешки на проходе к ${V.square(pawn, 'dat')} своим ходом ${V.fromTo(from, to)}`,
          `своим ходом ${V.fromTo(from, to)}, ${V.youOrI(who)} ${V.made(who)} взятие ${V.yourOrMy('p', oppositeWho(who), 'rod')} пешки на проходе к ${V.square(pawn, 'dat')}`,
          `${V.youOrI(who)} ${V.capture(who)} ${V.yourOrMy('p', oppositeWho(who), 'vin')} пешку 'Эн пассант', сделав ход ${V.fromTo(from, to)}`,
        ],
      } as rLangs)[this.lang]
    );
  }
  static someoneDoCastling(who: WhoseSide, kFrom: string, kTo: string, rFrom: string, rTo: string): string {
    return rand(
      ({
        en: [
          `${V.youOrI(who)} made castling by ${V.yourOrMy('k', who)} king from ${V.square(kFrom)} to ${V.square(kTo)} and also moved ${V.yourOrMy('r', who)} rock from ${V.square(rFrom)} to ${V.square(rTo)}`,
          `${V.youOrI(who)} made castling and moved the king from ${V.square(kFrom)} to ${V.square(kTo)}, and the rock from ${V.square(rFrom)} to ${V.square(rTo)}`,
          `${V.youOrI(who)} castling and moved ${V.yourOrMy('k', who)} king through two squares from ${V.square(kFrom)} to ${V.square(kTo)}, and ${V.yourOrMy('r', who)} rock from ${V.square(rFrom)} to ${V.square(rTo)}`,
        ],
        ru: [
          `${V.youOrI(who)} ${V.made(who)} рокировку королём с ${V.square(kFrom, 'rod')} на ${V.square(kTo, 'vin')} и ладьёй с ${V.square(rFrom, 'rod')} на ${V.square(rTo, 'vin')}`,
          `${V.youOrI(who)} ${V.made(who)} рокировку, походив королём с ${V.square(kFrom, 'rod')} на ${V.square(kTo, 'vin')} и ладьёй с ${V.square(rFrom, 'rod')} на ${V.square(rTo, 'vin')}`,
          `${V.youOrI(who)} ${V.made(who)} рокировку и ${V.shift(who)} своего короля на 2 клетки с ${V.square(kFrom, 'rod')} на ${V.square(kTo, 'vin')}, а также ${V.shift(who)} ладью с ${V.square(rFrom, 'rod')} на ${V.square(rTo, 'vin')}`,
        ],
      } as rLangs)[this.lang]
    );
  }
  static someonesOnlyOnePieceIsHere(pieceCode: string, pos: string, whose: WhoseSide, mixPerc: number): string {
    const gen = V.pieceGender(pieceCode);
    let piece;
    if (mix(!!whose, mixPerc)) {
      piece = upFirst(V.yourOrMy(pieceCode, whose, 'sin')) + ' ' + V.piece(pieceCode);
    } else {
      piece = ({
        en: 'The ' + V.coloredPiece(pieceCode),
        ru: upFirst(V.coloredPiece(pieceCode)),
      } as Langs)[this.lang];
    }
    return rand(
      ({
        en: [
          `${piece} is ${V.on(pos)}.`,
          `${piece} is ${V.on(pos)}.`,
          `${piece} located ${V.on(pos)}.`,
          `${piece} stands ${V.on(pos)}.`,
        ],
        ru: [
          `${piece} находится ${V.on(pos)}.`,
          `${piece} стоит ${V.on(pos)}.`,
          `${piece} ${V.located(gen)} ${V.on(pos)}.`,
          `${piece} сейчас стоит ${V.on(pos)}.`,
        ],
      } as rLangs)[this.lang]
    );
  }
  static someonesOneLeftPieceIsHere(pieceCode: string, pos: string, whose: WhoseSide, playerSide: ChessSide, mixPerc: number): string {
    const gen = V.pieceGender(pieceCode);
    if (mix(!!whose, mixPerc)) {
      whose = whose || (playerSide === getSide(pieceCode) ? WhoseSide.PLAYER : WhoseSide.ENEMY);
      return rand(
        ({
          en: [
            `${upFirst(V.youOrMe(whose))} only have one ${V.piece(pieceCode)} in ${V.square(pos)}.`,
            `${upFirst(V.youOrMe(whose))} have only one ${V.piece(pieceCode)} left and ${V.heShe(gen)} is ${V.on(pos)}.`,
            `${upFirst(V.yourOrMy(pieceCode, whose, 'sin'))} last ${V.piece(pieceCode)} is located ${V.on(pos)}.`,
            `${upFirst(V.yourOrMy(pieceCode, whose, 'sin'))} last ${V.piece(pieceCode)} is ${V.on(pos)}.`,
          ],
          ru: [
            `У ${V.youOrMe(whose)} ${V.left(gen)} только ${V.nPieces(1, pieceCode)} ${V.piecesN(pieceCode, 1)} ${V.on(pos)}.`,
            `${upFirst(V.yourOrMy(pieceCode, whose, 'sin'))} ${V.nPieces(1, pieceCode)} ${V.piecesN(pieceCode, 1)} находится ${V.on(pos)}.`,
            `У ${V.youOrMe(whose)} ${V.left(gen)} всего ${V.nPieces(1, pieceCode)} ${V.piecesN(pieceCode, 1)}, и она стоит ${V.on(pos)}.`,
            `${upFirst(V.yourOrMy(pieceCode, whose, 'sin'))} ${V.only(gen)} ${V.piece(pieceCode)} ${V.located(gen)} ${V.on(pos)}.`,
          ],
        } as rLangs)[this.lang]
      );
    } else {
      return rand(
        ({
          en: [
            `Here is only one ${V.coloredPiece(pieceCode)}, and ${V.heShe(gen)} is ${V.on(pos)}.`,
            `${upFirst(V.black())} has only one ${V.piece(pieceCode)} left, ${V.on(pos)}.`,
            `${upFirst(V.black())} has only one ${V.piece(pieceCode)} left, and ${V.heShe(gen)} is ${V.on(pos)}.`,
            `The last ${V.coloredPiece(pieceCode)} is ${V.on(pos)}.`,
          ],
          ru: [
            `${upFirst(V.coloredPiece(pieceCode))} ${V.left(gen)} только ${V.count(1, gen)}, и ${V.heShe(gen)} находится ${V.on(pos)}.`,
            `${upFirst(V.last(gen))} ${V.coloredPiece(pieceCode)} стоит ${V.on(pos)}.`,
            `У ${V.black('plr/rod')} ${V.left(gen)} лишь ${V.nPieces(1, pieceCode)} ${V.piecesN(pieceCode, 1)} - ${V.on(pos)}.`,
            `${upFirst(V.last(gen))} ${V.coloredPiece(pieceCode, gen)} находится ${V.on(pos)}.`,
          ],
        } as rLangs)[this.lang]
      );
    }
  }
  static someonesPieces(pieceCode: string, whose: WhoseSide, playerSide: string, num: number, mixPerc: number): string {
    const side = getSide(pieceCode);
    if (mix(!!whose, mixPerc)) {
      whose = whose || (playerSide === side ? WhoseSide.PLAYER : WhoseSide.ENEMY);
      return rand(
        ({
          en: [
            `${upFirst(V.someonesPiece(whose, pieceCode, 'plr'))} are in positions`,
            `${upFirst(V.youOrMe(whose))} have ${V.nPieces(num, pieceCode)} ${V.piecesN(pieceCode, num)}, on positions`,
            `${upFirst(V.youOrMe(whose))} have ${V.piece(pieceCode)} on`,
            `${upFirst(V.someonesPiece(whose, pieceCode, 'plr'))} are located in the squares`,
          ],
          ru: [
            `${upFirst(V.someonesPiece(whose, pieceCode, 'plr'))} расположены`,
            `У ${V.youOrMe(whose)} есть ${V.nPieces(num, pieceCode)} ${V.piecesN(pieceCode, num)}:`,
            `У ${V.youOrMe(whose)} есть ${V.piece(pieceCode, 'plr')}`,
            `${upFirst(V.someonesPiece(whose, pieceCode, 'plr'))} находятся`,
          ],
        } as rLangs)[this.lang]
      );
    } else {
      return rand(
        ({
          en: [
            `${upFirst(V.coloredPiece(pieceCode, 'plr'))} are on`,
            `${upFirst(V.coloredPiece(pieceCode, 'plr'))} are placed on`,
            `${upFirst(V.color(side))} has ${V.piece(pieceCode, 'plr')} on`,
            `${upFirst(V.color(side))} side has ${V.nPieces(num, pieceCode)} ${V.piecesN(pieceCode, num)}, and they are located on`,
          ],
          ru: [
            `${upFirst(V.coloredPiece(pieceCode, 'plr'))} занимают позиции`,
            `${upFirst(V.piece(pieceCode, 'plr'))} ${V.color(side, 'fem/rod')} стороны расположены`,
            `У ${V.color(side, 'plr/rod')} есть ${V.nPieces(num, pieceCode)} ${V.piecesN(pieceCode, num)}:`,
            `У ${V.color(side, 'plr/rod')} ${V.nPieces(num, pieceCode)} ${V.piecesN(pieceCode, num)}. Они находятся`,
          ],
        } as rLangs)[this.lang]
      );
    }
  }
  static fullSidePieces(side: ChessSide): string {
    return rand(
      ({
        en: [
          `Here is the full list of ${V.color(side)} pieces:`,
          `And what we have on the ${V.color(side)} side.. Let's see:`,
          `Here are all the ${V.color(side)} pieces that are currently in the game:`,
          `${upFirst(V.color(side))}... Here it is:`,
        ],
        ru: [
          `Вот список всех фигур ${V.color(side, 'fem/rod')} стороны:`,
          `Итак, что у ${V.color(side, 'plr/rod')} есть на доске:`,
          `Вот все ${V.color(side, 'plr')} фигуры, присутствующие в данный момент в игре:`,
          `Так, что мы имеем по ${V.color(side, 'mus/plr/tvr')}:`,
        ],
      } as rLangs)[this.lang]
    );
  }
  static someoneDontCapture(who: WhoseSide, whose: WhoseSide, capturedSide: ChessSide): string {
    return rand(
      ({
        en: [
          `all ${V.yourOrMy('p', whose, 'plr')} ${V.color(capturedSide, 'plr')} pieces are on the board.`,
          `${V.youOrI(who)} have not captured any of ${V.yourOrMy('p', whose, 'plr')} pieces yet.`,
          `${V.youOrI(who)} have not yet captured any of ${V.yourOrMy('p', whose, 'plr')} ${V.color(capturedSide)} pieces.`,
          `${V.youOrI(who)} have not captured anything in this game.`,
        ],
        ru: [
          `все ${V.yourOrMy('p', whose, 'plr')} ${V.color(capturedSide, 'plr')} фигуры ещё на доске.`,
          `у ${V.youOrMe(who)} нет захваченных ${V.yourOrMy('p', whose, 'plr/rod')} фигур.`,
          `${V.youOrI(who)} не ${V.capture(who)} ещё ни одной ${V.yourOrMy('p', whose, 'rod')} ${V.color(capturedSide, 'fem/sin/rod')} фигуры.`,
          `${V.youOrI(who)} пока не ${V.capture(who)} ни одной из ${V.yourOrMy('p', whose, 'plr/rod')} фигур.`,
        ],
      } as rLangs)[this.lang]
    );
  }
  static someoneCapture1(who: WhoseSide): string {
    return rand(
      ({
        en: [
          `${upFirst(V.youOrI(who))} captured`,
          `In this game ${V.youOrI(who)} captured`,
          `${upFirst(V.youOrI(who))} currently captured`,
          `So far ${V.youOrI(who)} captured`,
        ],
        ru: [
          `На текущий момент ${V.youOrI(who)} ${V.capture(who)}`,
          `${upFirst(V.youOrI(who))} ${V.capture(who)}`,
          `В этой игре ${V.youOrI(who)} ${V.capture(who)}`,
          `За время игры ${V.youOrI(who)} ${V.managed(who)} захватить`,
        ],
      } as rLangs)[this.lang]
    );
  }
  static someoneCapture2(who: WhoseSide): string {
    return rand(
      ({
        en: [
          `And ${V.youOrI(who)} captured`,
          `And ${V.youOrI(who)} captured in this game`,
          `And ${upFirst(V.youOrI(who))} currently captured`,
          `And ${V.youOrI(who)} so far captured`,
        ],
        ru: [
          `А ${V.youOrI(who)} на текущий момент ${V.capture(who)}`,
          `${upFirst(V.youOrI(who))} же ${V.capture(who)}`,
          `А ${V.youOrI(who)} в этой игре ${V.capture(who)}`,
          `А ${V.youOrI(who)} за время этой игры ${V.managed(who)} захватить`,
        ],
      } as rLangs)[this.lang]
    );
  }
  static nSomeonesColoredPieces(n: number, whose: WhoseSide, side: ChessSide, pieceCode: string): string {
    const rnd = Math.random();
    const gen = V.pieceGender(pieceCode);
    if (n > 1 || rnd > 0.6) {
      if (n === 1) {
        return `${V.count(n, `${gen}/rod`)} ${V.yourOrMy(pieceCode, whose, 'sin/rod')} ${V.color(side, `${gen}/vin`)} ${V.piece(pieceCode, 'vin')}`;
      } else if (n > 1 && n < 5) {
        return `${V.count(n, `${gen}/vin`)} ${V.yourOrMy(pieceCode, whose, 'plr/vin')} ${V.color(side, `${gen}/plr/vin`)} ${V.piece(pieceCode, 'plr/vin')}`;
      } else {
        return `${V.count(n)} ${V.yourOrMy(pieceCode, whose, 'plr/rod')} ${V.color(side,'plr/rod')} ${V.piece(pieceCode, 'plr/rod')}`;
      }
    } else {
      return `${V.yourOrMy(pieceCode, whose, 'sin/rod')} ${V.color(side, `${gen}/vin`)} ${V.piece(pieceCode, 'vin')}`;
    }
  }
  static nSomeonesPieces(n: number, whose: WhoseSide, pieceCode: string): string {
    const rnd = Math.random();
    const gen = V.pieceGender(pieceCode);
    if (n > 1 || rnd > 0.6) {
      if (n === 1) {
        return `${V.count(n, `${gen}/rod`)} ${V.yourOrMy(pieceCode, whose, 'sin/rod')} ${V.piece(pieceCode, 'vin')}`;
      } else if (n > 1 && n < 5) {
        return `${V.count(n, `${gen}/vin`)} ${V.yourOrMy(pieceCode, whose, 'plr/vin')} ${V.piece(pieceCode, 'plr/vin')}`;
      } else {
        return `${V.count(n)} ${V.yourOrMy(pieceCode, whose, 'plr/rod')} ${V.piece(pieceCode, 'plr/rod')}`;
      }
    } else {
      return `${V.yourOrMy(pieceCode, whose, 'sin/rod')} ${V.piece(pieceCode, 'vin')}`;
    }
  }
  static someonePlayForSide(who: WhoseSide, side: ChessSide): string {
    return rand(
      ({
        en: [
          `${V.youOrI(who)} play ${V.color(side)}.`,
          `${V.youOrI(who)} play for ${V.color(side)}.`,
          `now ${V.youOrI(who)} play for ${V.color(side, 'plr/rod')}.`,
          `this time ${V.youOrI(who)} play ${V.color(side, 'plr/rod')}.`,
        ],
        ru: [
          `${V.youOrI(who)} ${V.play(who)} за ${V.color(side, 'plr/rod')}.`,
          `${V.youOrI(who)} за ${V.color(side, 'plr/rod')}.`,
          `сейчас ${V.youOrI(who)} ${V.play(who)} за ${V.color(side, 'plr/rod')}.`,
          `сейчас ${V.youOrI(who)} за ${V.color(side, 'plr/rod')}.`,
        ],
      } as rLangs)[this.lang]
    );
  }
}
