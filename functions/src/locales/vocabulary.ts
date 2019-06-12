import { ChessSide, getSide } from '../chess/chessUtils';
import { WordForms, LocalizationObject, WhoseSide } from '../support/helpers';
import { rand, char, upFirst, mix } from '../support/helpers';

export class Vocabulary {
  private static lang: string;

  static setLanguage(language = 'ru'): void {
    this.lang = language;
  }
  static side(side: ChessSide, opt = 'mus'): string {
    if (side === ChessSide.BLACK) {
      return this.black(opt);
    } else {
      return this.white(opt);
    }
  }
  static pieceGender(pieceCode: string): string {
    pieceCode = pieceCode.toLowerCase();
    if (pieceCode === 'p' || pieceCode === 'r') {
      return 'fem';
    } else {
      return 'mus';
    }
  }
  static my(opt = 'mus'): string {
    return ({
      en: 'my',
      ru: ({
        mus: 'мой',
        fem: 'моя',
        sin: 'мой',
        plr: 'мои',
        'mus/sin': 'мой',
        'fem/sin': 'моя',
        'mus/plr': 'мои',
        'fem/plr': 'мои',
        'mus/vin': 'моего',
        'fem/vin': 'мою',
        'mus/rod': 'моего',
        'fem/rod': 'моей',
      } as WordForms)[opt],
    } as LocalizationObject<string>)[this.lang];
  }
  static your(opt = 'mus'): string {
    return ({
      en: 'your',
      ru: ({
        mus: 'ваш',
        fem: 'ваша',
        sin: 'ваш',
        plr: 'ваши',
        'mus/sin': 'ваш',
        'fem/sin': 'ваша',
        'mus/plr': 'ваши',
        'fem/plr': 'ваши',
        'mus/vin': 'вашего',
        'fem/vin': 'вашу',
        'mus/rod': 'вашего',
        'fem/rod': 'вашей',
      } as WordForms)[opt],
    } as LocalizationObject<string>)[this.lang];
  }
  static myPiece(pieceCode: string, opt = 'sin'): string {
    const gen = this.pieceGender(pieceCode);
    return this.my(`${gen}/${opt}`) + ' ' + this.piece(pieceCode, opt);
  }
  static yourPiece(pieceCode: string, opt = 'sin'): string {
    const gen = this.pieceGender(pieceCode);
    return this.your(`${gen}/${opt}`) + ' ' + this.piece(pieceCode, opt);
  }
  static myColoredPiece(pieceCode: string, opt = 'sin'): string {
    const gen = this.pieceGender(pieceCode);
    return this.my(`${gen}/${opt}`) + ' ' + this.coloredPiece(pieceCode, opt);
  }
  static yourColoredPiece(pieceCode: string, opt = 'sin'): string {
    const gen = this.pieceGender(pieceCode);
    return this.your(`${gen}/${opt}`) + ' ' + this.coloredPiece(pieceCode, opt);
  }
  static someonesColoredPiece(
    pieceCode: string,
    side: ChessSide,
    opt = 'sin'
  ): string {
    if (getSide(pieceCode) === side) {
      return this.yourColoredPiece(pieceCode, opt);
    } else {
      return this.myColoredPiece(pieceCode, opt);
    }
  }
  static someonesPiece(
    pieceCode: string,
    side: ChessSide,
    opt = 'sin'
  ): string {
    if (getSide(pieceCode) === side) {
      return this.yourPiece(pieceCode, opt);
    } else {
      return this.myPiece(pieceCode, opt);
    }
  }
  static whosePiece(pieceCode: string, whose: WhoseSide, opt = 'sin'): string {
    if (whose === WhoseSide.PLAYER) {
      return this.yourPiece(pieceCode, opt);
    } else {
      return this.myPiece(pieceCode, opt);
    }
  }
  static black(opt = 'mus'): string {
    return ({
      en: 'black',
      ru: ({
        mus: 'чёрный',
        fem: 'чёрная',
        sin: 'чёрный',
        plr: 'чёрные',
        'mus/sin': 'чёрный',
        'fem/sin': 'чёрная',
        'mus/plr': 'чёрные',
        'fem/plr': 'чёрные',
        'mus/vin': 'чёрного',
        'fem/vin': 'чёрную',
        'mus/rod': 'чёрного',
        'fem/rod': 'чёрной',
        'plr/rod': 'чёрных',
        'plr/tvr': 'чёрными',
        'fem/sin/rod': 'чёрной',
        'mus/sin/rod': 'чёрного',
        'fem/plr/rod': 'чёрных',
        'mus/plr/rod': 'чёрных',
        'fem/plr/tvr': 'чёрным',
        'mys/plr/tvr': 'чёрным',
      } as WordForms)[opt],
    } as LocalizationObject<string>)[this.lang];
  }
  static white(opt = 'mus'): string {
    return ({
      en: 'white',
      ru: ({
        mus: 'белый',
        fem: 'белая',
        sin: 'белый',
        plr: 'белые',
        'mus/sin': 'белый',
        'fem/sin': 'белая',
        'mus/plr': 'белые',
        'fem/plr': 'белые',
        'mus/vin': 'белого',
        'fem/vin': 'белую',
        'mus/rod': 'белого',
        'fem/rod': 'белой',
        'plr/rod': 'белых',
        'plr/tvr': 'белыми',
        'fem/sin/rod': 'белой',
        'mus/sin/rod': 'белого',
        'fem/plr/rod': 'белых',
        'mus/plr/rod': 'белых',
        'fem/plr/tvr': 'белым',
        'mys/plr/tvr': 'белым',
      } as WordForms)[opt],
    } as LocalizationObject<string>)[this.lang];
  }
  static color(side: ChessSide, opt = 'mus'): string {
    if (side === ChessSide.WHITE) {
      return this.white(opt);
    } else {
      return this.black(opt);
    }
  }
  static piece(code: string, opt = 'sin'): string {
    if (!code) {
      return null;
    }
    code = code.toLowerCase();
    switch (code) {
      case 'p':
        return ({
          en: ({
            sin: 'pawn',
            plr: 'pawns',
            rod: 'pawn',
            vin: 'pawn',
            tvr: 'pawn',
            'sin/rod': 'pawn',
            'plr/rod': 'pawns',
          } as WordForms)[opt],
          ru: ({
            sin: 'пешка',
            plr: 'пешки',
            rod: 'пешки',
            vin: 'пешку',
            tvr: 'пешкой',
            'sin/rod': 'пешки',
            'plr/rod': 'пешек',
          } as WordForms)[opt],
        } as LocalizationObject<string>)[this.lang];
      case 'r':
        return ({
          en: ({
            sin: 'rook',
            plr: 'rooks',
            rod: 'rook',
            vin: 'rook',
            tvr: 'rook',
            'sin/rod': 'rook',
            'plr/rod': 'rooks',
          } as WordForms)[opt],
          ru: ({
            sin: 'ладья',
            plr: 'ладьи',
            rod: 'ладьи',
            vin: 'ладью',
            tvr: 'ладьёй',
            'sin/rod': 'ладьи',
            'plr/rod': 'ладей',
          } as WordForms)[opt],
        } as LocalizationObject<string>)[this.lang];
      case 'n':
        return ({
          en: ({
            sin: 'knight',
            plr: 'knights',
            rod: 'knight',
            vin: 'knight',
            tvr: 'knight',
            'sin/rod': 'knight',
            'plr/rod': 'knights',
          } as WordForms)[opt],
          ru: ({
            sin: 'конь',
            plr: 'кони',
            rod: 'коня',
            vin: 'коня',
            tvr: 'конём',
            'sin/rod': 'коня',
            'plr/rod': 'коней',
          } as WordForms)[opt],
        } as LocalizationObject<string>)[this.lang];
      case 'b':
        return ({
          en: ({
            sin: 'bishop',
            plr: 'bishops',
            rod: 'bishop',
            vin: 'bishop',
            tvr: 'bishop',
            'sin/rod': 'bishop',
            'plr/rod': 'bishops',
          } as WordForms)[opt],
          ru: ({
            sin: 'слон',
            plr: 'слоны',
            rod: 'слона',
            vin: 'слона',
            tvr: 'слоном',
            'sin/rod': 'слона',
            'plr/rod': 'слонов',
          } as WordForms)[opt],
        } as LocalizationObject<string>)[this.lang];
      case 'q':
        return ({
          en: ({
            sin: 'queen',
            plr: 'queens',
            rod: 'queen',
            vin: 'queen',
            tvr: 'queen',
            'sin/rod': 'queen',
            'plr/rod': 'queens',
          } as WordForms)[opt],
          ru: ({
            sin: 'ферзь',
            plr: 'ферзи',
            rod: 'ферзя',
            vin: 'ферзя',
            tvr: 'ферзём',
            'sin/rod': 'ферзя',
            'plr/rod': 'ферзей',
          } as WordForms)[opt],
        } as LocalizationObject<string>)[this.lang];
      case 'k':
        return ({
          en: ({
            sin: 'king',
            plr: 'kings',
            rod: 'king',
            vin: 'king',
            tvr: 'king',
            'sin/rod': 'king',
            'plr/rod': 'kings',
          } as WordForms)[opt],
          ru: ({
            sin: 'король',
            plr: 'короли',
            rod: 'короля',
            vin: 'короля',
            tvr: 'королём',
            'sin/rod': 'короля',
            'plr/rod': 'королей',
          } as WordForms)[opt],
        } as LocalizationObject<string>)[this.lang];
      default:
        return null;
    }
  }
  static coloredPiece(pieceCode: string, opt = 'sin'): string {
    const piece = this.piece(pieceCode, opt);
    const gen = this.pieceGender(pieceCode);
    const color = this.color(getSide(pieceCode), `${gen}/${opt}`);
    return color + ' ' + piece;
  }
  static n(num: number, opt = 'mus'): string {
    switch (num) {
      case 1:
        return ({
          en: 'one',
          ru: ({
            mus: 'один',
            fem: 'одна',
          } as WordForms)[opt],
        } as LocalizationObject<string>)[this.lang];
      case 2:
        return ({
          en: 'two',
          ru: ({
            mus: 'два',
            fem: 'две',
          } as WordForms)[opt],
        } as LocalizationObject<string>)[this.lang];
      case 3:
        return ({
          en: 'three',
          ru: 'три',
        } as LocalizationObject<string>)[this.lang];
      case 4:
        return ({
          en: 'four',
          ru: 'четыре',
        } as LocalizationObject<string>)[this.lang];
      case 5:
        return ({
          en: 'five',
          ru: 'пять',
        } as LocalizationObject<string>)[this.lang];
      case 6:
        return ({
          en: 'six',
          ru: 'шесть',
        } as LocalizationObject<string>)[this.lang];
      case 7:
        return ({
          en: 'seven',
          ru: 'семь',
        } as LocalizationObject<string>)[this.lang];
      case 8:
        return ({
          en: 'eight',
          ru: 'восемь',
        } as LocalizationObject<string>)[this.lang];
      default:
        return null;
    }
  }
  static nRank(n: number, opt = 'mus'): string {
    switch (n) {
      case 1:
        return ({
          en: 'first rank',
          ru: ({
            mus: 'первый ряд',
            na: 'первом ряду',
          } as WordForms)[opt],
        } as LocalizationObject<string>)[this.lang];
      case 2:
        return ({
          en: 'second rank',
          ru: ({
            mus: 'второй ряд',
            na: 'втором ряду',
          } as WordForms)[opt],
        } as LocalizationObject<string>)[this.lang];
      case 3:
        return ({
          en: 'third rank',
          ru: ({
            mus: 'третий ряд',
            na: 'третьем ряду',
          } as WordForms)[opt],
        } as LocalizationObject<string>)[this.lang];
      case 4:
        return ({
          en: 'fourth rank',
          ru: ({
            mus: 'четвёртый ряд',
            na: 'четвёртом ряду',
          } as WordForms)[opt],
        } as LocalizationObject<string>)[this.lang];
      case 5:
        return ({
          en: 'fifth rank',
          ru: ({
            mus: 'пятый ряд',
            na: 'пятом ряду',
          } as WordForms)[opt],
        } as LocalizationObject<string>)[this.lang];
      case 6:
        return ({
          en: 'sixth rank',
          ru: ({
            mus: 'шестой ряд',
            na: 'шестом ряду',
          } as WordForms)[opt],
        } as LocalizationObject<string>)[this.lang];
      case 7:
        return ({
          en: 'seventh rank',
          ru: ({
            mus: 'седьмой ряд',
            na: 'седьмом ряду',
          } as WordForms)[opt],
        } as LocalizationObject<string>)[this.lang];
      case 8:
        return ({
          en: 'eighth rank',
          ru: ({
            mus: 'восьмой ряд',
            na: 'восьмом ряду',
          } as WordForms)[opt],
        } as LocalizationObject<string>)[this.lang];
      default:
        return null;
    }
  }
  static emptyRank(n: number): string {
    return rand(
      ({
        en: [`${upFirst(this.nRank(n))} is empty.`],
        ru: [`На ${this.nRank(n, 'na')} нет фигур.`],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static coloredPieceOnPosition(code: string, pos: string): string {
    return rand(
      ({
        en: [`on ${char(pos)} ${this.coloredPiece(code)}`],
        ru: [`на ${char(pos)} ${this.coloredPiece(code)}`],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static pieceOnPosition(code: string, pos: string): string {
    return rand(
      ({
        en: [
          `${this.piece(code)} on ${char(pos)}`,
          `${this.piece(code)} from the square ${char(pos)}`,
          `${this.piece(code)} ${char(pos)}`,
        ],
        ru: [
          `${this.piece(code)} на ${char(pos)}`,
          `${this.piece(code)} с ${char(pos)}`,
          `${this.piece(code)} на позиции ${char(pos)}`,
          `${this.piece(code)} ${char(pos)}`,
        ],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static on(): string {
    return rand(
      ({
        en: ['on'],
        ru: ['на'],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static or(): string {
    return rand(
      ({
        en: ['or'],
        ru: ['или'],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static and(): string {
    return rand(
      ({
        en: ['and'],
        ru: ['и'],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static asWell(): string {
    return rand(
      ({
        en: ['and'],
        ru: ['а также'],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static canAttack(): string {
    return rand(
      ({
        en: ['can attack'],
        ru: ['может атаковать'],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static enemy(opt = 'mus'): string {
    return ({
      en: 'enemy',
      ru: ({
        mus: 'вражеского',
        fem: 'вражескую',
      } as WordForms)[opt],
    } as LocalizationObject<string>)[this.lang];
  }
  static canMove(): string {
    return rand(
      ({
        en: ['can move'],
        ru: ['может ходить'],
      } as LocalizationObject<string[]>)[this.lang]
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
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static byPlay(): string {
    return rand(
      ({
        en: ['if you make a move'],
        ru: ['сыграв', 'походив', 'сделав ход'],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static canMakeEnPassant(to: string, pawn: string): string {
    return rand(
      ({
        en: [
          `The enemy pawn has just made a double move to ${char(
            pawn
          )}, and can be captured in pass,`,
          `You can capture the opponent's pawn 'En Passant' on ${char(
            pawn
          )} through square ${char(to)},`,
          `An enemy pawn from ${char(pawn)} can be captured via 'En Passant',`,
        ],
        ru: [
          `Вражеская пешка только что сделала двойной ход на ${char(
            pawn
          )}, и её можно перехватить на проходе,`,
          `Можно взять вражескую пешку на проходе к ${char(
            pawn
          )} через клетку ${char(to)},`,
          `Пешку на ${char(pawn)} можно взять 'Энпассан',`,
        ],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static enPassantByMove(from: string, to: string): string {
    return rand(
      ({
        en: [
          `from ${char(from)} to ${char(to)}`,
          `by pawn from ${char(from)}`,
          `from ${char(from)}`,
        ],
        ru: [
          `пешкой с ${char(from)} на ${char(to)}`,
          `пешкой ${char(from)} ${char(to)}`,
          `с ${char(from)} на ${char(to)}`,
          `пешкой с ${char(from)}`,
        ],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static castlingTo(castTo: string): string {
    if (castTo[0] === 'c') {
      return rand(
        ({
          en: [
            `to square ${char(castTo)}`,
            `to ${char(castTo)}`,
            `on the queenside to ${char(castTo)}`,
            `to the long side ${char(castTo)}`,
          ],
          ru: [
            `на позицию ${char(castTo)}`,
            `на ${char(castTo)}`,
            `в направлении ферзевого фланга на ${char(castTo)}`,
            `в длинную сторону на ${char(castTo)}`,
          ],
        } as LocalizationObject<string[]>)[this.lang]
      );
    } else {
      return rand(
        ({
          en: [
            `to square ${char(castTo)}`,
            `to ${char(castTo)}`,
            `on the kingside to ${char(castTo)}`,
            `to the short side ${char(castTo)}`,
          ],
          ru: [
            `на позицию ${char(castTo)}`,
            `на ${char(castTo)}`,
            `в направлении королевского фланга на ${char(castTo)}`,
            `в короткую сторону на ${char(castTo)}`,
          ],
        } as LocalizationObject<string[]>)[this.lang]
      );
    }
  }
  static canMakeCastling(kingPos: string): string {
    return rand(
      ({
        en: [
          'You can do castling by the king',
          'You have the castling move',
          `King from ${char(kingPos)} can castling`,
          'You can castling',
        ],
        ru: [
          'Вы можете сделать рокировку своим королём',
          'Вам доступна рокировка',
          `Король на ${char(kingPos)} может сделать рокировку`,
        ],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static firstMoveInHistoryIntro(): string {
    return rand(
      ({
        en: ['At first', 'First'],
        ru: ['Сначала', 'Сперва'],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static nextMoveInHistoryIntro(): string {
    return rand(
      ({
        en: ['Next', 'Then', 'In response,'],
        ru: ['Далее', 'Затем', 'В ответ', 'После этого'],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static youMoved(pieceCode: string, from: string, to: string): string {
    return rand(
      ({
        en: [
          `you moved ${this.piece(pieceCode)} from ${char(from)} to ${char(
            to
          )}`,
          `you played ${this.piece(pieceCode)} ${char(from)} ${char(to)}`,
          `you made a ${this.piece(pieceCode)} move from ${char(
            from
          )} to ${char(to)}`,
        ],
        ru: [
          `вы походили ${this.piece(pieceCode, 'tvr')} с ${char(
            from
          )} на ${char(to)}`,
          `вы сыграли ${this.piece(pieceCode, 'tvr')} ${char(from)} ${char(
            to
          )}`,
          `вы перешли ${this.piece(pieceCode, 'tvr')} с ${char(from)} на ${char(
            to
          )}`,
          `вы сделали ход ${this.piece(pieceCode, 'tvr')} с ${char(
            from
          )} на ${char(to)}`,
        ],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static iMoved(pieceCode: string, from: string, to: string): string {
    return rand(
      ({
        en: [
          `I moved ${this.piece(pieceCode)} from ${char(from)} to ${char(to)}`,
          `I played ${this.piece(pieceCode)} ${char(from)} ${char(to)}`,
          `I made a ${this.piece(pieceCode)} move from ${char(from)} to ${char(
            to
          )}`,
        ],
        ru: [
          `я походил ${this.piece(pieceCode, 'tvr')} с ${char(from)} на ${char(
            to
          )}`,
          `я сыграл ${this.piece(pieceCode, 'tvr')} ${char(from)} ${char(to)}`,
          `я перешёл ${this.piece(pieceCode, 'tvr')} с ${char(from)} на ${char(
            to
          )}`,
          `я сделал ход ${this.piece(pieceCode, 'tvr')} с ${char(
            from
          )} на ${char(to)}`,
        ],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static youAteMyPiece(pieceCode: string): string {
    return rand(
      ({
        en: [
          `ate ${this.myPiece(pieceCode)}`,
          `took ${this.myPiece(pieceCode)}`,
          `left me without ${this.myPiece(pieceCode)}`,
          `captured ${this.myPiece(pieceCode)}`,
        ],
        ru: [
          `забрали ${this.myPiece(pieceCode, 'vin')}`,
          `съели ${this.myPiece(pieceCode, 'vin')}`,
          `захватили ${this.myPiece(pieceCode, 'vin')}`,
          `лишили меня ${this.piece(pieceCode, 'rod')}`,
        ],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static iAteYourPiece(pieceCode: string): string {
    return rand(
      ({
        en: [
          `ate ${this.yourPiece(pieceCode)}`,
          `took ${this.yourPiece(pieceCode)}`,
          `left you without ${this.yourPiece(pieceCode)}`,
          `captured ${this.yourPiece(pieceCode)}`,
        ],
        ru: [
          `забрал ${this.yourPiece(pieceCode, 'vin')}`,
          `съел ${this.yourPiece(pieceCode, 'vin')}`,
          `захватил ${this.yourPiece(pieceCode, 'vin')}`,
          `лишил вас ${this.piece(pieceCode, 'rod')}`,
        ],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static youPromoted(pieceCode: string): string {
    return rand(
      ({
        en: [
          `has promoted your pawn to the ${this.piece(pieceCode)}`,
          `turned your pawn into the ${this.yourPiece(pieceCode)}`,
        ],
        ru: [
          `превратили свою пешку в ${this.piece(pieceCode, 'vin')}`,
          `трансформировали свою пешку в ${this.piece(pieceCode, 'vin')}`,
        ],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static iPromoted(pieceCode: string): string {
    return rand(
      ({
        en: [
          `I promoted my pawn to the ${this.piece(pieceCode)}`,
          `I turned my pawn to the ${this.yourPiece(pieceCode)}`,
        ],
        ru: [
          `превратил свою пешку в ${this.piece(pieceCode, 'vin')}`,
          `трансформировал свою пешку в ${this.piece(pieceCode, 'vin')}`,
        ],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static youDoEnPassant(from: string, to: string, pawn: string): string {
    return rand(
      ({
        en: [
          `you moved pawn from ${char(from)} to ${char(
            to
          )} and made 'En Passant', capturing my pawn on ${char(pawn)}`,
          `you made in passing capturing of my pawn on ${char(
            pawn
          )} by move from ${char(from)} to ${char(to)}`,
          `you captured my pawn 'En Passant' by moving from ${char(
            from
          )} to ${char(to)}`,
        ],
        ru: [
          `вы походили пешкой с ${char(from)} на ${char(
            to
          )} и сделали Энпассант, забрав мою пешку на ${char(pawn)}`,
          `вы выполнили взятие на проходе моей пешки к ${char(
            pawn
          )} своим ходом с ${char(from)} на ${char(to)}`,
          `вы взяли мою пешку 'Эн пассант', сделав ход с ${char(
            from
          )} на ${char(to)}`,
        ],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static iDoEnPassant(from: string, to: string, pawn: string): string {
    return rand(
      ({
        en: [
          `you moved pawn from ${char(from)} to ${char(
            to
          )} and made 'En Passant', capturing my pawn on ${char(pawn)}`,
          `you made in passing capturing of my pawn on ${char(
            pawn
          )} by move from ${char(from)} to ${char(to)}`,
          `you captured my pawn 'En Passant' by moving from ${char(
            from
          )} to ${char(to)}`,
        ],
        ru: [
          `я походил пешкой с ${char(from)} на ${char(
            to
          )} и совершил Энпассант, забрав вашу пешку на ${char(pawn)}`,
          `своим ходом с ${char(from)} на ${char(
            to
          )}, я выполнил взятие вашей пешки на проходе к ${char(pawn)}`,
          `я взял вашу пешку 'Эн пассант', сделав ход с ${char(from)} на ${char(
            to
          )}`,
        ],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static youDoCastling(
    kFrom: string,
    kTo: string,
    rFrom: string,
    rTo: string
  ): string {
    return rand(
      ({
        en: [
          `you made castling by your king from ${char(kFrom)} to ${char(
            kTo
          )} and also moved your rock from ${char(rFrom)} to ${char(rTo)}`,
          `you made castling and moved the king from ${char(kFrom)} to ${char(
            kTo
          )}, and the rock from ${char(rFrom)} to ${char(rTo)}`,
          `you castling and moved your king through two squares from ${char(
            kFrom
          )} to ${char(kTo)}, and your rock from ${char(rFrom)} to ${char(
            rTo
          )}`,
        ],
        ru: [
          `вы произвели рокировку королём с ${char(kFrom)} на ${char(
            kTo
          )} и ладьёй с ${char(rFrom)} на ${char(rTo)}`,
          `вы сделали рокировку, походив королём с ${char(kFrom)} на ${char(
            kTo
          )} и ладьёй с ${char(rFrom)} на ${char(rTo)}`,
          `вы совершили рокировку и переместили своего короля на 2 клетки с ${char(
            kFrom
          )} на ${char(kTo)}, и, вместе с тем, передвинули ладью с ${char(
            rFrom
          )} на ${char(rTo)}`,
        ],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static iDoCastling(
    kFrom: string,
    kTo: string,
    rFrom: string,
    rTo: string
  ): string {
    return rand(
      ({
        en: [
          `I made castling by the king from ${char(kFrom)} to ${char(
            kTo
          )} and also moved my rock from ${char(rFrom)} to ${char(rTo)}`,
          `I made castling and moved the king from ${char(kFrom)} to ${char(
            kTo
          )}, and the rock from ${char(rFrom)} to ${char(rTo)}`,
          `I castling and moved my king through two squares from ${char(
            kFrom
          )} to ${char(kTo)}, and my rock from ${char(rFrom)} to ${char(rTo)}`,
        ],
        ru: [
          `я сделал рокировку королём с ${char(kFrom)} на ${char(
            kTo
          )} и ладьёй с ${char(rFrom)} на ${char(rTo)}`,
          `я выполнил рокировку, походив королём с ${char(kFrom)} на ${char(
            kTo
          )} и ладьёй с ${char(rFrom)} на ${char(rTo)}`,
          `я совершил рокировку и переместил своего короля на 2 клетки с ${char(
            kFrom
          )} на ${char(kTo)}, а также передвинул ладью с ${char(
            rFrom
          )} на ${char(rTo)}`,
        ],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static pieceNumber(pieceCode: string): string {
    pieceCode = pieceCode.toLowerCase();
    if (pieceCode === 'k' || pieceCode === 'q') {
      return 'sin';
    } else {
      return 'plr';
    }
  }
  static youOrMe(whose: WhoseSide): string {
    return ({
      en: whose === WhoseSide.ENEMY ? 'I' : 'you',
      ru: whose === WhoseSide.ENEMY ? 'меня' : 'вас',
    } as LocalizationObject<string>)[this.lang];
  }
  static all(): string {
    return ({
      en: `all`,
      ru: 'все',
    } as LocalizationObject<string>)[this.lang];
  }
  static yourOrMy(pieceCode: string, whose: WhoseSide, pNum: string): string {
    const gen = this.pieceGender(pieceCode);
    const result =
      whose === WhoseSide.ENEMY
        ? this.my(`${gen}/${pNum}`)
        : this.your(`${gen}/${pNum}`);
    return result;
  }
  static allYourOrMy(
    pieceCode: string,
    whose: WhoseSide,
    pNum: string
  ): string {
    const yourMy = this.yourOrMy(pieceCode, whose, pNum);
    const result = pNum === 'plr' ? `${this.all()} ${yourMy}` : yourMy;
    return result;
  }
  static located(gen: string): string {
    return ({
      en: rand(['located', 'placed']),
      ru: ({
        mus: 'расположен',
        fem: 'расположена',
      } as WordForms)[gen],
    } as LocalizationObject<string>)[this.lang];
  }
  static someonesOnlyOnePieceIsHere(
    pieceCode: string,
    pos: string,
    whose: WhoseSide,
    mixPerc: number
  ): string {
    const gen = this.pieceGender(pieceCode);
    let piece;
    if (mix(!!whose, mixPerc)) {
      piece =
        upFirst(this.yourOrMy(pieceCode, whose, 'sin')) +
        ' ' +
        this.piece(pieceCode);
    } else {
      piece = 'The ' + this.coloredPiece(pieceCode);
    }
    return rand(
      ({
        en: [
          `${piece} is on ${char(pos)}.`,
          `${piece} is on the square ${char(pos)}.`,
          `${piece} located on the cell ${char(pos)}.`,
          `${piece} stands on  ${char(pos)}.`,
        ],
        ru: [
          `${piece} находится на позиции ${char(pos)}.`,
          `${piece} стоит на квадрате ${char(pos)}.`,
          `${piece} ${this.located(gen)} на ${char(pos)}.`,
          `${piece} сейчас стоит на ${char(pos)}.`,
        ],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static left(gen: string): string {
    return ({
      en: 'left',
      ru: ({
        mus: 'остался',
        fem: 'осталась',
      } as WordForms)[gen],
    } as LocalizationObject<string>)[this.lang];
  }
  static last(gen: string): string {
    return ({
      en: 'last',
      ru: ({
        mus: 'последний',
        fem: 'последняя',
      } as WordForms)[gen],
    } as LocalizationObject<string>)[this.lang];
  }
  static only(gen: string): string {
    return ({
      en: 'last',
      ru: ({
        mus: 'единственный',
        fem: 'единственная',
      } as WordForms)[gen],
    } as LocalizationObject<string>)[this.lang];
  }
  static heShe(gen: string): string {
    return ({
      en: ({
        mus: 'he',
        fem: 'she',
      } as WordForms)[gen],
      ru: ({
        mus: 'он',
        fem: 'она',
      } as WordForms)[gen],
    } as LocalizationObject<string>)[this.lang];
  }
  static someonesOneLeftPieceIsHere(
    pieceCode: string,
    pos: string,
    whose: WhoseSide,
    playerSide: ChessSide,
    mixPerc: number
  ): string {
    const gen = this.pieceGender(pieceCode);
    if (mix(!!whose, mixPerc)) {
      whose =
        whose ||
        (playerSide === getSide(pieceCode)
          ? WhoseSide.PLAYER
          : WhoseSide.ENEMY);
      return rand(
        ({
          en: [
            `${upFirst(this.youOrMe(whose))} only have one ${this.piece(
              pieceCode
            )} is position ${char(pos)}.`,
            `${upFirst(this.youOrMe(whose))} have only one ${this.piece(
              pieceCode
            )} left and ${this.heShe(gen)} is on the square ${char(pos)}.`,
            `${upFirst(
              this.yourOrMy(pieceCode, whose, 'sin')
            )} last ${this.piece(pieceCode)} is located on ${char(pos)}.`,
            `${upFirst(
              this.yourOrMy(pieceCode, whose, 'sin')
            )} last ${this.piece(pieceCode)} is on ${char(pos)}.`,
          ],
          ru: [
            `У ${this.youOrMe(whose)} ${this.left(gen)} только ${this.nPieces(
              1,
              pieceCode
            )} на ${char(pos)}.`,
            `${upFirst(this.yourOrMy(pieceCode, whose, 'sin'))} ${this.nPieces(
              1,
              pieceCode
            )} находится на клетке ${char(pos)}.`,
            `У ${this.youOrMe(whose)} ${this.left(gen)} всего ${this.nPieces(
              1,
              pieceCode
            )}, и она стоит на ${char(pos)}.`,
            `${upFirst(this.yourOrMy(pieceCode, whose, 'sin'))} ${this.only(
              gen
            )} ${this.piece(pieceCode)} ${this.located(gen)} на позиции ${char(
              pos
            )}.`,
          ],
        } as LocalizationObject<string[]>)[this.lang]
      );
    } else {
      return rand(
        ({
          en: [
            `Here is only one ${this.coloredPiece(pieceCode)}, and ${this.heShe(
              gen
            )} is on the square ${char(pos)}.`,
            `${upFirst(this.black())} has only one ${this.piece(
              pieceCode
            )} left, on the position ${char(pos)}.`,
            `${upFirst(this.black())} has only one ${this.piece(
              pieceCode
            )} left, and ${this.heShe(gen)} is on the position ${char(pos)}.`,
            `The last ${this.coloredPiece(pieceCode)} is on the square ${char(
              pos
            )}.`,
          ],
          ru: [
            `${upFirst(this.coloredPiece(pieceCode))} ${this.left(
              gen
            )} только ${this.n(1, gen)}, и ${this.heShe(
              gen
            )} находится на ${char(pos)}.`,
            `${upFirst(this.last(gen))} ${this.coloredPiece(
              pieceCode
            )} стоит на клетке ${char(pos)}.`,
            `У ${this.black('plr/rod')} ${this.left(gen)} лишь ${this.nPieces(
              1,
              pieceCode
            )} - на позиции ${char(pos)}.`,
            `${upFirst(this.last(gen))} ${this.coloredPiece(
              pieceCode,
              gen
            )} находится на ${char(pos)}.`,
          ],
        } as LocalizationObject<string[]>)[this.lang]
      );
    }
  }
  static nPieces(n: number, pieceCode: string): string {
    const gen = this.pieceGender(pieceCode);
    if (n === 1) {
      return this.n(n, gen) + ' ' + this.piece(pieceCode);
    } else if (n > 1 && n < 5) {
      return this.n(n, gen) + ' ' + this.piece(pieceCode, 'rod');
    } else {
      return this.n(n, gen) + ' ' + this.piece(pieceCode, 'plr/rod');
    }
  }
  static someonesPieces(
    pieceCode: string,
    whose: WhoseSide,
    playerSide: string,
    num: number,
    mixPerc: number
  ): string {
    const side = getSide(pieceCode);
    if (mix(!!whose, mixPerc)) {
      whose =
        whose || (playerSide === side ? WhoseSide.PLAYER : WhoseSide.ENEMY);
      return rand(
        ({
          en: [
            `${upFirst(this.myPiece(pieceCode, 'plr'))} are in positions`,
            `${upFirst(this.youOrMe(whose))} have ${this.nPieces(
              num,
              pieceCode
            )}, on positions`,
            `${upFirst(this.youOrMe(whose))} have ${this.piece(pieceCode)} on`,
            `${upFirst(
              this.myPiece(pieceCode, 'plr')
            )} are located in the squares`,
          ],
          ru: [
            `${upFirst(
              this.someonesPiece(pieceCode, side, 'plr')
            )} расположены`,
            `У ${this.youOrMe(whose)} есть ${this.nPieces(num, pieceCode)}:`,
            `У ${this.youOrMe(whose)} есть ${this.piece(pieceCode, 'plr')}`,
            `${upFirst(this.someonesPiece(pieceCode, side, 'plr'))} находятся`,
          ],
        } as LocalizationObject<string[]>)[this.lang]
      );
    } else {
      return rand(
        ({
          en: [
            `${upFirst(this.coloredPiece(pieceCode, 'plr'))} are on`,
            `${upFirst(this.coloredPiece(pieceCode, 'plr'))} are placed on`,
            `${upFirst(this.color(side))} has ${this.piece(
              pieceCode,
              'plr'
            )} on`,
            `${upFirst(this.color(side))} side has ${this.nPieces(
              num,
              pieceCode
            )}, and they are located on`,
          ],
          ru: [
            `${upFirst(this.coloredPiece(pieceCode, 'plr'))} занимают позиции`,
            `${upFirst(this.piece(pieceCode, 'plr'))} ${this.color(
              side,
              'fem/rod'
            )} стороны расположены`,
            `У ${this.color(side, 'plr/rod')} есть ${this.nPieces(
              num,
              pieceCode
            )}:`,
            `У ${this.color(side, 'plr/rod')} ${this.nPieces(
              num,
              pieceCode
            )}. Они находятся`,
          ],
        } as LocalizationObject<string[]>)[this.lang]
      );
    }
  }
  static onPosition(pos: string): string {
    return rand(
      ({
        en: [char(pos)],
        ru: [`на ${char(pos)}`, `на ${char(pos)}`, `на клетке ${char(pos)}`],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static fullSidePieces(side: ChessSide): string {
    return rand(
      ({
        en: [
          `Here is the full list of ${this.color(side)} pieces:`,
          `And what we have on the ${this.color(side)} side.. Let's see:`,
          `Here are all the ${this.color(
            side
          )} pieces that are currently in the game:`,
          `${upFirst(this.color(side))}... Here it is:`,
        ],
        ru: [
          `Вот список всех фигур ${this.color(side, 'fem/rod')} стороны:`,
          `Итак, что у ${this.color(side, 'plr/rod')} есть на доске:`,
          `Вот все ${this.color(
            side,
            'plr'
          )} фигуры, присутствующие в данный момент в игре:`,
          `Так, что мы имеем по ${this.color(side, 'mys/plr/tvr')}:`,
        ],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
}
