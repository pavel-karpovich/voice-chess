import { ChessSide, WhoseSide, getSide, oppositeWho } from '../chess/chessUtils';
import { WordForms, LocalizationObject } from '../support/helpers';
import { rand, char, upFirst, mix } from '../support/helpers';

// prettier-ignore
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
        'mus/tvr': 'мною',
        'fem/tvr': 'мною',
        'mus/sin/rod': 'моего',
        'fem/sin/rod': 'мою',
        'mus/plr/rod': 'моих',
        'fem/plr/rod': 'моих',
        'mus/plr/vin': 'моих',
        'fem/plr/vin': 'мои',
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
        'mus/tvr': 'вами',
        'fem/tvr': 'вами',
        'mus/sin/rod': 'вашего',
        'fem/sin/rod': 'вашу',
        'mus/plr/rod': 'ваших',
        'fem/plr/rod': 'ваших',
        'mus/plr/vin': 'ваших',
        'fem/plr/vin': 'ваши',
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
  static someonesColoredPiece(pieceCode: string, side: ChessSide, opt = 'sin'): string {
    if (getSide(pieceCode) === side) {
      return this.yourColoredPiece(pieceCode, opt);
    } else {
      return this.myColoredPiece(pieceCode, opt);
    }
  }
  static someonesPiece(who: WhoseSide, pieceCode: string, opt = 'sin'): string {
    if (who === WhoseSide.PLAYER) {
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
        'mus/plr/tvr': 'чёрным',
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
        'mus/plr/tvr': 'белым',
        'fem/plr/vin': 'белые',
        'mus/plr/vin': 'белых',
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
            'plr/vin': 'pawns',
          } as WordForms)[opt],
          ru: ({
            sin: 'пешка',
            plr: 'пешки',
            rod: 'пешки',
            vin: 'пешку',
            tvr: 'пешкой',
            'sin/rod': 'пешки',
            'plr/rod': 'пешек',
            'plr/vin': 'пешки',
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
            'plr/vin': 'rooks',
          } as WordForms)[opt],
          ru: ({
            sin: 'ладья',
            plr: 'ладьи',
            rod: 'ладьи',
            vin: 'ладью',
            tvr: 'ладьёй',
            'sin/rod': 'ладьи',
            'plr/rod': 'ладей',
            'plr/vin': 'ладьи',
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
            'plr/vin': 'knights',
          } as WordForms)[opt],
          ru: ({
            sin: 'конь',
            plr: 'кони',
            rod: 'коня',
            vin: 'коня',
            tvr: 'конём',
            'sin/rod': 'коня',
            'plr/rod': 'коней',
            'plr/vin': 'коней',
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
            'plr/vin': 'bishops',
          } as WordForms)[opt],
          ru: ({
            sin: 'слон',
            plr: 'слоны',
            rod: 'слона',
            vin: 'слона',
            tvr: 'слоном',
            'sin/rod': 'слона',
            'plr/rod': 'слонов',
            'plr/vin': 'слонов',
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
            'plr/vin': 'королев',
          } as WordForms)[opt],
          ru: ({
            sin: 'ферзь',
            plr: 'ферзи',
            rod: 'ферзя',
            vin: 'ферзя',
            tvr: 'ферзём',
            'sin/rod': 'ферзя',
            'plr/rod': 'ферзей',
            'plr/vin': 'ферзей',
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
            'plr/vin': 'kings',
          } as WordForms)[opt],
          ru: ({
            sin: 'король',
            plr: 'короли',
            rod: 'короля',
            vin: 'короля',
            tvr: 'королём',
            'sin/rod': 'короля',
            'plr/rod': 'королей',
            'plr/vin': 'королей',
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
  static count(num: number, opt = 'mus'): string {
    switch (num) {
      case 1:
        return ({
          en: 'one',
          ru: ({
            mus: 'один',
            fem: 'одна',
            'mus/rod': 'одного',
            'fem/rod': 'одну',
          } as WordForms)[opt],
        } as LocalizationObject<string>)[this.lang];
      case 2:
        return ({
          en: 'two',
          ru: ({
            mus: 'два',
            fem: 'две',
            'mus/vin': 'двух',
            'fem/vin': 'две',
          } as WordForms)[opt],
        } as LocalizationObject<string>)[this.lang];
      case 3:
        return ({
          en: 'three',
          ru: ({
            mus: 'три',
            fem: 'три',
            'mus/vin': 'трёх',
            'fem/vin': 'три',
          } as WordForms)[opt],
        } as LocalizationObject<string>)[this.lang];
      case 4:
        return ({
          en: 'four',
          ru: ({
            mus: 'четыре',
            fem: 'четыре',
            'mus/vin': 'четырёх',
            'fem/vin': 'четыре',
          } as WordForms)[opt],
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
  static n(num: number, opt = 'mus'): string {
    switch (num) {
      case 1:
        return ({
          en: 'first',
          ru: ({
            mus: 'первый',
            fem: 'первая',
            'mus/prd': 'первом',
            'fem/prd': 'первой',
          } as WordForms)[opt],
        } as LocalizationObject<string>)[this.lang];
      case 2:
        return ({
          en: 'second',
          ru: ({
            mus: 'второй',
            fem: 'вторая',
            'mus/prd': 'втором',
            'fem/prd': 'второй',
          } as WordForms)[opt],
        } as LocalizationObject<string>)[this.lang];
      case 3:
        return ({
          en: 'third',
          ru: ({
            mus: 'третий',
            fem: 'третья',
            'mus/prd': 'третьем',
            'fem/prd': 'третьей',
          } as WordForms)[opt],
        } as LocalizationObject<string>)[this.lang];
      case 4:
        return ({
          en: 'fourth',
          ru: ({
            mus: 'четвёртый',
            fem: 'четвёртая',
            'mus/prd': 'четвёртом',
            'fem/prd': 'четвёртой',
          } as WordForms)[opt],
        } as LocalizationObject<string>)[this.lang];
      case 5:
        return ({
          en: 'fifth',
          ru: ({
            mus: 'пятый',
            fem: 'пятая',
            'mus/prd': 'пятом',
            'fem/prd': 'пятой',
          } as WordForms)[opt],
        } as LocalizationObject<string>)[this.lang];
      case 6:
        return ({
          en: 'sixth',
          ru: ({
            mus: 'шестой',
            fem: 'шестая',
            'mus/prd': 'шестом',
            'fem/prd': 'шестой',
          } as WordForms)[opt],
        } as LocalizationObject<string>)[this.lang];
      case 7:
        return ({
          en: 'seventh',
          ru: ({
            mus: 'седьмой',
            fem: 'седьмая',
            'mus/prd': 'седьмом',
            'fem/prd': 'седьмой',
          } as WordForms)[opt],
        } as LocalizationObject<string>)[this.lang];
      case 8:
        return ({
          en: 'eighth',
          ru: ({
            mus: 'восьмой',
            fem: 'восьмая',
            'mus/prd': 'восьмом',
            'fem/prd': 'восьмой',
          } as WordForms)[opt],
        } as LocalizationObject<string>)[this.lang];
      default:
        return null;
    }
  }
  static emptyRank(n: number): string {
    return rand(
      ({
        en: [`${upFirst(this.n(n))} rank is empty.`],
        ru: [`На ${this.n(n, 'mus/prd')} ряду нет фигур.`],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static nRank(n: number): string {
    return rand(
      ({
        en: [
          `${this.n(n)} rank`,
          `rank number ${this.count(n)}`,
        ],
        ru: [
          `${this.n(n)} ряд`,
          `ряд ${this.n(n)}`,
          `ряд номер ${this.count(n)}`,
        ],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static square(pos: string, opt = 'imn'): string {
    return rand(
      ({
        en: [
          char(pos),
          char(pos),
          `square ${char(pos)}`,
          `cell ${char(pos)}`,
        ],
        ru: [
          char(pos),
          char(pos),
          char(pos),
          ({
            imn: `квадрат ${char(pos)}`,
            rod: `квадрата ${char(pos)}`,
            dat: `квадрату ${char(pos)}`,
            vin: `квадрат ${char(pos)}`,
            prd: `квадрате ${char(pos)}`,
          } as WordForms)[opt],
          ({
            imn: `позиция ${char(pos)}`,
            rod: `позиции ${char(pos)}`,
            dat: `позиции ${char(pos)}`,
            vin: `позицию ${char(pos)}`,
            prd: `позиции ${char(pos)}`,
          } as WordForms)[opt],
          ({
            imn: `клетка ${char(pos)}`,
            rod: `клетки ${char(pos)}`,
            dat: `клетке ${char(pos)}`,
            vin: `клетку ${char(pos)}`,
            prd: `клетке ${char(pos)}`,
          } as WordForms)[opt],
        ],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static on(pos: string, opt = 'prd'): string {
    return ({
        en: `on ${this.square(pos)}`,
        ru: `на ${this.square(pos, opt)}`,
    } as LocalizationObject<string>)[this.lang];
  }
  static pieceFromPosition(code: string, pos: string): string {
    return rand([
      `${this.piece(code)} ${this.from()} ${this.square(pos, 'rod')}`,
      `${this.piece(code)} ${this.from()} ${this.square(pos, 'rod')}`,
      `${this.piece(code)} ${this.from()} ${this.square(pos, 'rod')}`,
      `${this.piece(code)} ${char(pos)}`,
    ]);
  }
  static from(): string {
    return ({
        en: 'from',
        ru: 'с',
    } as LocalizationObject<string>)[this.lang];
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
  static andA(): string {
    return rand(
      ({
        en: ['and'],
        ru: ['а'],
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
          `The enemy pawn has just made a double move to ${char(pawn)}, and can be captured in pass,`,
          `You can capture the opponent's pawn 'En Passant' on ${char(pawn)} through square ${char(to)},`,
          `An enemy pawn from ${char(pawn)} can be captured via 'En Passant',`,
        ],
        ru: [
          `Вражеская пешка только что сделала двойной ход на ${char(pawn)}, и её можно перехватить на проходе,`,
          `Можно взять вражескую пешку на проходе к ${char(pawn)} через клетку ${char(to)},`,
          `Пешку на ${char(pawn)} можно взять 'Энпассан',`,
        ],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static enPassantByMove(from: string, to: string): string {
    return rand(
      ({
        en: [
          `from ${this.square(from)} to ${this.square(char(to))}`,
          `by pawn from ${this.square(from)}`,
          `from ${this.square(from)}`,
        ],
        ru: [
          `пешкой с ${this.square(from, 'rod')} на ${this.square(to, 'vin')}`,
          `пешкой ${char(from)} ${char(to)}`,
          `с ${this.square(from)} на ${this.square(to)}`,
          `пешкой с ${this.square(from)}`,
        ],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static castlingTo(castTo: string): string {
    if (castTo[0] === 'c') {
      return rand(
        ({
          en: [
            `to ${this.square(castTo)}`,
            `to ${char(castTo)}`,
            `on the queenside to ${this.square(castTo)}`,
            `to the long side ${char(castTo)}`,
          ],
          ru: [
            `на ${this.square(castTo, 'vin')}`,
            `на ${char(castTo)}`,
            `в направлении ферзевого фланга на ${this.square(castTo, 'vin')}`,
            `в длинную сторону на ${this.square(castTo, 'vin')}`,
          ],
        } as LocalizationObject<string[]>)[this.lang]
      );
    } else {
      return rand(
        ({
          en: [
            `to ${this.square(castTo)}`,
            `to ${char(castTo)}`,
            `on the kingside to ${this.square(castTo)}`,
            `to the short side ${char(castTo)}`,
          ],
          ru: [
            `на позицию ${this.square(castTo, 'vin')}`,
            `на ${char(castTo)}`,
            `в направлении королевского фланга на ${this.square(castTo, 'vin')}`,
            `в короткую сторону на ${this.square(castTo, 'vin')}`,
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
          `King from ${this.square(kingPos)} can castling`,
          'You can castling',
        ],
        ru: [
          'Вы можете сделать рокировку своим королём',
          'Вам доступна рокировка',
          `Король на ${this.square(kingPos, 'prd')} может сделать рокировку`,
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
  static byHis(gen: string): string {
    return ({
        en: '',
        ru: ({
          mus: 'своим',
          fem: 'своей',
        } as WordForms)[gen],
      } as LocalizationObject<string>)[this.lang];

  }
  static someoneMoved(who: WhoseSide, pieceCode: string, from: string, to: string): string {
    return rand(
      ({
        en: [
          `${this.youOrI(who)} moved ${this.yourOrMy(pieceCode, who)} ${this.piece(pieceCode)} from ${this.square(from)} to ${this.square(to)}`,
          `${this.youOrI(who)} played ${this.piece(pieceCode)} ${char(from)} ${char(to)}`,
          `${this.youOrI(who)} made a ${this.piece(pieceCode)} move from ${this.square(from)} to ${this.square(to)}`,
        ],
        ru: [
          `${this.youOrI(who)} ${this.moved(who)} ${this.piece(pieceCode, 'tvr')} с ${this.square(from, 'rod')} на ${this.square(to, 'vin')}`,
          `${this.youOrI(who)} ${this.played(who)} ${this.piece(pieceCode, 'tvr')} ${char(from)} ${char(to)}`,
          `${this.youOrI(who)} ${this.moved2(who)} ${this.piece(pieceCode, 'tvr')} с ${this.square(from, 'rod')} на ${this.square(to, 'vin')}`,
          `${this.youOrI(who)} ${this.moved(who)} ${this.byHis(this.pieceGender(pieceCode))} ${this.piece(pieceCode, 'tvr')} с ${this.square(from, 'rod')} на ${this.square(to, 'vin')}`,
        ],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static deprived(who: WhoseSide): string {
    return ({
      en: 'deprived',
      ru: ({
        [WhoseSide.ENEMY]: 'лишил',
        [WhoseSide.PLAYER]: 'лишили',
      })[who],
    } as LocalizationObject<string>)[this.lang];
  }
  static someoneAtePiece(who: WhoseSide, pieceCode: string): string {
    return rand(
      ({
        en: [
          `ate ${this.someonesPiece(oppositeWho(who), pieceCode)}`,
          `took ${this.someonesPiece(oppositeWho(who), pieceCode)}`,
          `left me without ${this.someonesPiece(oppositeWho(who), pieceCode)}`,
          `captured ${this.someonesPiece(oppositeWho(who), pieceCode)}`,
        ],
        ru: [
          `${this.capture(who)} ${this.someonesPiece(oppositeWho(who), pieceCode, 'vin')}`,
          `${this.capture(who)} ${this.someonesPiece(oppositeWho(who), pieceCode, 'vin')}`,
          `${this.capture(who)} ${this.someonesPiece(oppositeWho(who), pieceCode, 'vin')}`,
          `${this.deprived(who)} ${this.someonesPiece(oppositeWho(who), pieceCode, 'rod')}`,
        ],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static transform(who: WhoseSide): string {
    return rand(
      ({
        en: ['transformed'],
        ru: ({
          [WhoseSide.ENEMY]: ['превратил', 'трансформировал', 'обратил'],
          [WhoseSide.PLAYER]: ['превратили', 'трансформировали', 'обратили'],
        })[who],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static someonePromoted(who: WhoseSide, pieceCode: string): string {
    return rand(
      ({
        en: [
          `${this.youOrI(who)} had promoted ${this.yourOrMy('p', who)} pawn to the ${this.piece(pieceCode)}`,
          `${this.youOrI(who)} turned ${this.yourOrMy('p', who)} pawn into the ${this.yourPiece(pieceCode)}`,
        ],
        ru: [
          `${this.transform(who)} свою пешку в ${this.piece(pieceCode, 'vin')}`,
          `${this.transform(who)} свою пешку в ${this.piece(pieceCode, 'vin')}`,
        ],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static someoneDoEnPassant(who: WhoseSide, from: string, to: string, pawn: string): string {
    return rand(
      ({
        en: [
          `${this.youOrI(who)} moved pawn from ${this.square(from)} to ${this.square(to)} and made 'En Passant', capturing ${this.yourOrMy('p', oppositeWho(who))} pawn on ${this.square(pawn)}`,
          `${this.youOrI(who)} made in passing capturing of ${this.yourOrMy('p', oppositeWho(who))} pawn on ${this.square(pawn)} by move from ${this.square(from)} to ${this.square(to)}`,
          `${this.youOrI(who)} captured ${this.yourOrMy('p', oppositeWho(who))} pawn 'En Passant' by moving from ${this.square(from)} to ${this.square(to)}`,
        ],
        ru: [
          `${this.youOrI(who)} ${this.moved(who)} пешкой с ${this.square(from, 'rod')} на ${this.square(to, 'vin')} и ${this.made(who)} Энпассант, забрав ${this.yourOrMy('p', oppositeWho(who), 'vin')} пешку на ${this.square(pawn, 'prd')}`,
          `${this.youOrI(who)} ${this.made(who)} взятие ${this.yourOrMy('p', oppositeWho(who), 'rod')} пешки на проходе к ${this.square(pawn, 'dat')} своим ходом с ${this.square(from, 'rod')} на ${this.square(to, 'vin')}`,
          `своим ходом с ${this.square(from, 'rod')} на ${this.square(to, 'vin')}, ${this.youOrI(who)} ${this.made(who)} взятие ${this.yourOrMy('p', oppositeWho(who), 'rod')} пешки на проходе к ${this.square(pawn, 'dat')}`,
          `${this.youOrI(who)} ${this.capture(who)} ${this.yourOrMy('p', oppositeWho(who), 'vin')} пешку 'Эн пассант', сделав ход с ${this.square(from, 'rod')} на ${this.square(to, 'vin')}`,
        ],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static moved(who: WhoseSide): string {
    return rand(
      ({
        en: ['move'],
        ru: ({
          [WhoseSide.ENEMY]: ['походил', 'сделал ход'],
          [WhoseSide.PLAYER]: ['походили', 'сделали ход'],
        })[who],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static played(who: WhoseSide): string {
    return rand(
      ({
        en: ['played'],
        ru: ({
          [WhoseSide.ENEMY]: ['сыграл'],
          [WhoseSide.PLAYER]: ['сыграли'],
        })[who],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static moved2(who: WhoseSide): string {
    return rand(
      ({
        en: ['move'],
        ru: ({
          [WhoseSide.ENEMY]: ['перешёл'],
          [WhoseSide.PLAYER]: ['перешли'],
        })[who],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static made(who: WhoseSide): string {
    return rand(
      ({
        en: ['made'],
        ru: ({
          [WhoseSide.ENEMY]: ['сделал', 'совершил', 'выполнил'],
          [WhoseSide.PLAYER]: ['сделали', 'совершили', 'выполнили'],
        })[who],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static shift(who: WhoseSide): string {
    return rand(
      ({
        en: ['move'],
        ru: ({
          [WhoseSide.ENEMY]: ['переместил', 'передвинул'],
          [WhoseSide.PLAYER]: ['переместили', 'передвинули'],
        })[who],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static someoneDoCastling(who: WhoseSide, kFrom: string, kTo: string, rFrom: string, rTo: string): string {
    return rand(
      ({
        en: [
          `${this.youOrI(who)} made castling by ${this.yourOrMy('k', who)} king from ${this.square(kFrom)} to ${this.square(kTo)} and also moved ${this.yourOrMy('r', who)} rock from ${this.square(rFrom)} to ${this.square(rTo)}`,
          `${this.youOrI(who)} made castling and moved the king from ${this.square(kFrom)} to ${this.square(kTo)}, and the rock from ${this.square(rFrom)} to ${this.square(rTo)}`,
          `${this.youOrI(who)} castling and moved ${this.yourOrMy('k', who)} king through two squares from ${this.square(kFrom)} to ${this.square(kTo)}, and ${this.yourOrMy('r', who)} rock from ${this.square(rFrom)} to ${this.square(rTo)}`,
        ],
        ru: [
          `${this.youOrI(who)} ${this.made(who)} рокировку королём с ${this.square(kFrom, 'rod')} на ${this.square(kTo, 'vin')} и ладьёй с ${this.square(rFrom, 'rod')} на ${this.square(rTo, 'vin')}`,
          `${this.youOrI(who)} ${this.made(who)} рокировку, походив королём с ${this.square(kFrom, 'rod')} на ${this.square(kTo, 'vin')} и ладьёй с ${this.square(rFrom, 'rod')} на ${this.square(rTo, 'vin')}`,
          `${this.youOrI(who)} ${this.made(who)} рокировку и ${this.shift(who)} своего короля на 2 клетки с ${this.square(kFrom, 'rod')} на ${this.square(kTo, 'vin')}, а также ${this.shift(who)} ладью с ${this.square(rFrom, 'rod')} на ${this.square(rTo, 'vin')}`,
        ],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static pieceMaxNumber(pieceCode: string): string {
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
  static yourOrMy(pieceCode: string, whose: WhoseSide, pNum = 'sin'): string {
    const gen = this.pieceGender(pieceCode);
    if (whose === WhoseSide.ENEMY) {
      return this.my(`${gen}/${pNum}`);
    } else {
      return this.your(`${gen}/${pNum}`);
    }
  }
  static allYourOrMy(pieceCode: string, whose: WhoseSide, pNum: string): string {
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
  static someonesOnlyOnePieceIsHere(pieceCode: string, pos: string, whose: WhoseSide, mixPerc: number): string {
    const gen = this.pieceGender(pieceCode);
    let piece;
    if (mix(!!whose, mixPerc)) {
      piece = upFirst(this.yourOrMy(pieceCode, whose, 'sin')) + ' ' + this.piece(pieceCode);
    } else {
      piece = 'The ' + this.coloredPiece(pieceCode);
    }
    return rand(
      ({
        en: [
          `${piece} is ${this.on(pos)}.`,
          `${piece} is ${this.on(pos)}.`,
          `${piece} located ${this.on(pos)}.`,
          `${piece} stands ${this.on(pos)}.`,
        ],
        ru: [
          `${piece} находится ${this.on(pos)}.`,
          `${piece} стоит ${this.on(pos)}.`,
          `${piece} ${this.located(gen)} ${this.on(pos)}.`,
          `${piece} сейчас стоит ${this.on(pos)}.`,
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
  static nPieces(n: number, pieceCode: string): string {
    const gen = this.pieceGender(pieceCode);
    if (n === 1) {
      return this.count(n, gen);
    } else if (n > 1 && n < 5) {
      return this.count(n, gen);
    } else {
      return this.count(n, gen);
    }
  }
  static piecesN(pieceCode: string, n: number, opt?: string): string {
    if (n === 1) {
      return opt ? this.piece(pieceCode, opt) : this.piece(pieceCode);
    } else if (n > 1 && n < 5) {
      return this.piece(pieceCode, 'rod');
    } else {
      return this.piece(pieceCode, 'plr/rod');
    }
  }
  static someonesOneLeftPieceIsHere(pieceCode: string, pos: string, whose: WhoseSide, playerSide: ChessSide, mixPerc: number): string {
    const gen = this.pieceGender(pieceCode);
    if (mix(!!whose, mixPerc)) {
      whose = whose || (playerSide === getSide(pieceCode) ? WhoseSide.PLAYER : WhoseSide.ENEMY);
      return rand(
        ({
          en: [
            `${upFirst(this.youOrMe(whose))} only have one ${this.piece(pieceCode)} in ${this.square(pos)}.`,
            `${upFirst(this.youOrMe(whose))} have only one ${this.piece(pieceCode)} left and ${this.heShe(gen)} is ${this.on(pos)}.`,
            `${upFirst(this.yourOrMy(pieceCode, whose, 'sin'))} last ${this.piece(pieceCode)} is located ${this.on(pos)}.`,
            `${upFirst(this.yourOrMy(pieceCode, whose, 'sin'))} last ${this.piece(pieceCode)} is ${this.on(pos)}.`,
          ],
          ru: [
            `У ${this.youOrMe(whose)} ${this.left(gen)} только ${this.nPieces(1, pieceCode)} ${this.piecesN(pieceCode, 1)} ${this.on(pos)}.`,
            `${upFirst(this.yourOrMy(pieceCode, whose, 'sin'))} ${this.nPieces(1, pieceCode)} ${this.piecesN(pieceCode, 1)} находится ${this.on(pos)}.`,
            `У ${this.youOrMe(whose)} ${this.left(gen)} всего ${this.nPieces(1, pieceCode)} ${this.piecesN(pieceCode, 1)}, и она стоит ${this.on(pos)}.`,
            `${upFirst(this.yourOrMy(pieceCode, whose, 'sin'))} ${this.only(gen)} ${this.piece(pieceCode)} ${this.located(gen)} ${this.on(pos)}.`,
          ],
        } as LocalizationObject<string[]>)[this.lang]
      );
    } else {
      return rand(
        ({
          en: [
            `Here is only one ${this.coloredPiece(pieceCode)}, and ${this.heShe(gen)} is ${this.on(pos)}.`,
            `${upFirst(this.black())} has only one ${this.piece(pieceCode)} left, ${this.on(pos)}.`,
            `${upFirst(this.black())} has only one ${this.piece(pieceCode)} left, and ${this.heShe(gen)} is ${this.on(pos)}.`,
            `The last ${this.coloredPiece(pieceCode)} is ${this.on(pos)}.`,
          ],
          ru: [
            `${upFirst(this.coloredPiece(pieceCode))} ${this.left(gen)} только ${this.count(1, gen)}, и ${this.heShe(gen)} находится ${this.on(pos)}.`,
            `${upFirst(this.last(gen))} ${this.coloredPiece(pieceCode)} стоит ${this.on(pos)}.`,
            `У ${this.black('plr/rod')} ${this.left(gen)} лишь ${this.nPieces(1, pieceCode)} ${this.piecesN(pieceCode, 1)} - ${this.on(pos)}.`,
            `${upFirst(this.last(gen))} ${this.coloredPiece(pieceCode, gen)} находится ${this.on(pos)}.`,
          ],
        } as LocalizationObject<string[]>)[this.lang]
      );
    }
  }
  static simpleOn(pos: string): string {
    return ({
      en: char(pos),
      ru: `на ${char(pos)}`,
    } as LocalizationObject<string>)[this.lang];
  }
  static someonesPieces(pieceCode: string, whose: WhoseSide, playerSide: string, num: number, mixPerc: number): string {
    const side = getSide(pieceCode);
    if (mix(!!whose, mixPerc)) {
      whose = whose || (playerSide === side ? WhoseSide.PLAYER : WhoseSide.ENEMY);
      return rand(
        ({
          en: [
            `${upFirst(this.someonesPiece(whose, pieceCode, 'plr'))} are in positions`,
            `${upFirst(this.youOrMe(whose))} have ${this.nPieces(num, pieceCode)} ${this.piecesN(pieceCode, num)}, on positions`,
            `${upFirst(this.youOrMe(whose))} have ${this.piece(pieceCode)} on`,
            `${upFirst(this.someonesPiece(whose, pieceCode, 'plr'))} are located in the squares`,
          ],
          ru: [
            `${upFirst(this.someonesPiece(whose, pieceCode, 'plr'))} расположены`,
            `У ${this.youOrMe(whose)} есть ${this.nPieces(num, pieceCode)} ${this.piecesN(pieceCode, num)}:`,
            `У ${this.youOrMe(whose)} есть ${this.piece(pieceCode, 'plr')}`,
            `${upFirst(this.someonesPiece(whose, pieceCode, 'plr'))} находятся`,
          ],
        } as LocalizationObject<string[]>)[this.lang]
      );
    } else {
      return rand(
        ({
          en: [
            `${upFirst(this.coloredPiece(pieceCode, 'plr'))} are on`,
            `${upFirst(this.coloredPiece(pieceCode, 'plr'))} are placed on`,
            `${upFirst(this.color(side))} has ${this.piece(pieceCode, 'plr')} on`,
            `${upFirst(this.color(side))} side has ${this.nPieces(num, pieceCode)} ${this.piecesN(pieceCode, num)}, and they are located on`,
          ],
          ru: [
            `${upFirst(this.coloredPiece(pieceCode, 'plr'))} занимают позиции`,
            `${upFirst(this.piece(pieceCode, 'plr'))} ${this.color(side, 'fem/rod')} стороны расположены`,
            `У ${this.color(side, 'plr/rod')} есть ${this.nPieces(num, pieceCode)} ${this.piecesN(pieceCode, num)}:`,
            `У ${this.color(side, 'plr/rod')} ${this.nPieces(num, pieceCode)} ${this.piecesN(pieceCode, num)}. Они находятся`,
          ],
        } as LocalizationObject<string[]>)[this.lang]
      );
    }
  }
  static fullSidePieces(side: ChessSide): string {
    return rand(
      ({
        en: [
          `Here is the full list of ${this.color(side)} pieces:`,
          `And what we have on the ${this.color(side)} side.. Let's see:`,
          `Here are all the ${this.color(side)} pieces that are currently in the game:`,
          `${upFirst(this.color(side))}... Here it is:`,
        ],
        ru: [
          `Вот список всех фигур ${this.color(side, 'fem/rod')} стороны:`,
          `Итак, что у ${this.color(side, 'plr/rod')} есть на доске:`,
          `Вот все ${this.color(side, 'plr')} фигуры, присутствующие в данный момент в игре:`,
          `Так, что мы имеем по ${this.color(side, 'mus/plr/tvr')}:`,
        ],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static capture(whose: WhoseSide): string {
    return rand(
      ({
        en: ['capture'],
        ru: ({
          [WhoseSide.ENEMY]: ['захватил', 'взял', 'съел', 'забрал'],
          [WhoseSide.PLAYER]: ['захватили', 'взяли', 'съели', 'забрали'],
        })[whose],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static youOrI(whose: WhoseSide): string {
    return ({
      en: ({
        [WhoseSide.ENEMY]: 'I',
        [WhoseSide.PLAYER]: 'you',
      })[whose],
      ru: ({
        [WhoseSide.ENEMY]: 'я',
        [WhoseSide.PLAYER]: 'вы',
      })[whose],
    } as LocalizationObject<string>)[this.lang];
  }
  static someoneDontCapture(who: WhoseSide, whose: WhoseSide, capturedSide: ChessSide): string {
    return rand(
      ({
        en: [
          `all ${this.yourOrMy('p', whose, 'plr')} ${this.color(capturedSide, 'plr')} pieces are on the board.`,
          `${this.youOrI(who)} have not captured any of ${this.yourOrMy('p', whose, 'plr')} pieces yet.`,
          `${this.youOrI(who)} have not yet captured any of ${this.yourOrMy('p', whose, 'plr')} ${this.color(capturedSide)} pieces.`,
          `${this.youOrI(who)} have not captured anything in this game.`,
        ],
        ru: [
          `все ${this.yourOrMy('p', whose, 'plr')} ${this.color(capturedSide, 'plr')} фигуры ещё на доске.`,
          `у ${this.youOrMe(who)} нет захваченных ${this.yourOrMy('p', whose, 'plr/rod')} фигур.`,
          `${this.youOrI(who)} не ${this.capture(who)} ещё ни одной ${this.yourOrMy('p', whose, 'rod')} ${this.color(capturedSide, 'fem/sin/rod')} фигуры.`,
          `${this.youOrI(who)} пока не ${this.capture(who)} ни одной из ${this.yourOrMy('p', whose, 'plr/rod')} фигур.`,
        ],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static managed(who: WhoseSide): string {
    return ({
      en: 'managed',
      ru: ({
        [WhoseSide.ENEMY]: 'успел',
        [WhoseSide.PLAYER]: 'успели',
      })[who],
    } as LocalizationObject<string>)[this.lang];
  }
  static someoneCapture1(who: WhoseSide): string {
    return rand(
      ({
        en: [
          `${upFirst(this.youOrI(who))} captured`,
          `In this game ${this.youOrI(who)} captured`,
          `${upFirst(this.youOrI(who))} currently captured`,
          `So far ${this.youOrI(who)} captured`,
        ],
        ru: [
          `На текущий момент ${this.youOrI(who)} ${this.capture(who)}`,
          `${upFirst(this.youOrI(who))} ${this.capture(who)}`,
          `В этой игре ${this.youOrI(who)} ${this.capture(who)}`,
          `За время игры ${this.youOrI(who)} ${this.managed(who)} захватить`,
        ],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static someoneCapture2(who: WhoseSide): string {
    return rand(
      ({
        en: [
          `And ${this.youOrI(who)} captured`,
          `And ${this.youOrI(who)} captured in this game`,
          `And ${upFirst(this.youOrI(who))} currently captured`,
          `And ${this.youOrI(who)} so far captured`,
        ],
        ru: [
          `А ${this.youOrI(who)} на текущий момент ${this.capture(who)}`,
          `${upFirst(this.youOrI(who))} же ${this.capture(who)}`,
          `А ${this.youOrI(who)} в этой игре ${this.capture(who)}`,
          `А ${this.youOrI(who)} за время этой игры ${this.managed(who)} захватить`,
        ],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static nSomeonesColoredPieces(n: number, whose: WhoseSide, side: ChessSide, pieceCode: string): string {
    const rnd = Math.random();
    const gen = this.pieceGender(pieceCode);
    if (n > 1 || rnd > 0.6) {
      if (n === 1) {
        return `${this.count(n, `${gen}/rod`)} ${this.yourOrMy(pieceCode, whose, 'sin/rod')} ${this.color(side, `${gen}/vin`)} ${this.piece(pieceCode, 'vin')}`;
      } else if (n > 1 && n < 5) {
        return `${this.count(n, `${gen}/vin`)} ${this.yourOrMy(pieceCode, whose, 'plr/vin')} ${this.color(side, `${gen}/plr/vin`)} ${this.piece(pieceCode, 'plr/vin')}`;
      } else {
        return `${this.count(n)} ${this.yourOrMy(pieceCode, whose, 'plr/rod')} ${this.color(side,'plr/rod')} ${this.piece(pieceCode, 'plr/rod')}`;
      }
    } else {
      return `${this.yourOrMy(pieceCode, whose, 'sin/rod')} ${this.color(side, `${gen}/vin`)} ${this.piece(pieceCode, 'vin')}`;
    }
  }
  static nSomeonesPieces(n: number, whose: WhoseSide, pieceCode: string): string {
    const rnd = Math.random();
    const gen = this.pieceGender(pieceCode);
    if (n > 1 || rnd > 0.6) {
      if (n === 1) {
        return `${this.count(n, `${gen}/rod`)} ${this.yourOrMy(pieceCode, whose, 'sin/rod')} ${this.piece(pieceCode, 'vin')}`;
      } else if (n > 1 && n < 5) {
        return `${this.count(n, `${gen}/vin`)} ${this.yourOrMy(pieceCode, whose, 'plr/vin')} ${this.piece(pieceCode, 'plr/vin')}`;
      } else {
        return `${this.count(n)} ${this.yourOrMy(pieceCode, whose, 'plr/rod')} ${this.piece(pieceCode, 'plr/rod')}`;
      }
    } else {
      return `${this.yourOrMy(pieceCode, whose, 'sin/rod')} ${this.piece(pieceCode, 'vin')}`;
    }
  }
  static yes(): string {
    return rand(
      ({
        en: ['yes', 'yeah', 'truly', 'right'],
        ru: ['да', 'верно', 'так точно'],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static no(): string {
    return rand(
      ({
        en: ['no', 'nope'],
        ru: ['нет'],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static play(who: WhoseSide): string {
    return ({
      en: 'play',
      ru: ({
        [WhoseSide.ENEMY]: 'играю',
        [WhoseSide.PLAYER]: 'играете',
      })[who],
    } as LocalizationObject<string>)[this.lang];
  }
  static someonePlayForSide(who: WhoseSide, side: ChessSide): string {
    return rand(
      ({
        en: [
          `${this.youOrI(who)} play ${this.color(side)}.`,
          `${this.youOrI(who)} play for ${this.color(side)}.`,
          `now ${this.youOrI(who)} play for ${this.color(side, 'plr/rod')}.`,
          `this time ${this.youOrI(who)} play ${this.color(side, 'plr/rod')}.`,
        ],
        ru: [
          `${this.youOrI(who)} ${this.play(who)} за ${this.color(side, 'plr/rod')}.`,
          `${this.youOrI(who)} за ${this.color(side, 'plr/rod')}.`,
          `сейчас ${this.youOrI(who)} ${this.play(who)} за ${this.color(side, 'plr/rod')}.`,
          `сейчас ${this.youOrI(who)} за ${this.color(side, 'plr/rod')}.`,
        ],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static nPassed(n: number): string {
    return ({
      en: 'passed',
      ru: n % 100 === 1 ? 'прошёл' : 'прошло',
    } as LocalizationObject<string>)[this.lang];
  }
  static nFullMoves(n: number): string {
    if (this.lang === 'en') {
      return n === 1 ? 'full move' : 'full moves';
    } else if (this.lang === 'ru') {
      const nMod10 = n % 10;
      const nMod100 = n % 100;
      if (nMod100 === 1) {
        return 'полный ход';
      } else if (nMod10 > 1 && nMod10 < 5 && (nMod100 < 10 && nMod100 > 15)) {
        return 'полных хода';
      } else {
        return 'полных ходов';
      }
    } else return null;
  }
}
