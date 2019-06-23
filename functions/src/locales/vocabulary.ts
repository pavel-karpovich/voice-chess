import { ChessSide, WhoseSide, getSide } from '../chess/chessUtils';
import { WordForms, Langs, rLangs } from './struct/struct';
import { rand, char, upFirst } from '../support/helpers';
import { getTypeOfCastling, CastlingType } from '../chess/castling';

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
  static self(opt = 'mus/imn'): string {
    return ({
      en: '',
      ru: ({
        'mus/imn': 'свой',
        'fem/imn': 'своя',
        'mus/vin': 'своего',
        'fem/vin': 'свою',
        'mus/tvr': 'своим',
        'fem/tvr': 'своей',
      } as WordForms)[opt],
    } as Langs)[this.lang];
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
    } as Langs)[this.lang];
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
    } as Langs)[this.lang];
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
    } as Langs)[this.lang];
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
    } as Langs)[this.lang];
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
        } as Langs)[this.lang];
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
        } as Langs)[this.lang];
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
        } as Langs)[this.lang];
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
        } as Langs)[this.lang];
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
        } as Langs)[this.lang];
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
        } as Langs)[this.lang];
      default:
        return null;
    }
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
        } as Langs)[this.lang];
      case 2:
        return ({
          en: 'two',
          ru: ({
            mus: 'два',
            fem: 'две',
            'mus/vin': 'двух',
            'fem/vin': 'две',
          } as WordForms)[opt],
        } as Langs)[this.lang];
      case 3:
        return ({
          en: 'three',
          ru: ({
            mus: 'три',
            fem: 'три',
            'mus/vin': 'трёх',
            'fem/vin': 'три',
          } as WordForms)[opt],
        } as Langs)[this.lang];
      case 4:
        return ({
          en: 'four',
          ru: ({
            mus: 'четыре',
            fem: 'четыре',
            'mus/vin': 'четырёх',
            'fem/vin': 'четыре',
          } as WordForms)[opt],
        } as Langs)[this.lang];
      case 5:
        return ({
          en: 'five',
          ru: 'пять',
        } as Langs)[this.lang];
      case 6:
        return ({
          en: 'six',
          ru: 'шесть',
        } as Langs)[this.lang];
      case 7:
        return ({
          en: 'seven',
          ru: 'семь',
        } as Langs)[this.lang];
      case 8:
        return ({
          en: 'eight',
          ru: 'восемь',
        } as Langs)[this.lang];
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
        } as Langs)[this.lang];
      case 2:
        return ({
          en: 'second',
          ru: ({
            mus: 'второй',
            fem: 'вторая',
            'mus/prd': 'втором',
            'fem/prd': 'второй',
          } as WordForms)[opt],
        } as Langs)[this.lang];
      case 3:
        return ({
          en: 'third',
          ru: ({
            mus: 'третий',
            fem: 'третья',
            'mus/prd': 'третьем',
            'fem/prd': 'третьей',
          } as WordForms)[opt],
        } as Langs)[this.lang];
      case 4:
        return ({
          en: 'fourth',
          ru: ({
            mus: 'четвёртый',
            fem: 'четвёртая',
            'mus/prd': 'четвёртом',
            'fem/prd': 'четвёртой',
          } as WordForms)[opt],
        } as Langs)[this.lang];
      case 5:
        return ({
          en: 'fifth',
          ru: ({
            mus: 'пятый',
            fem: 'пятая',
            'mus/prd': 'пятом',
            'fem/prd': 'пятой',
          } as WordForms)[opt],
        } as Langs)[this.lang];
      case 6:
        return ({
          en: 'sixth',
          ru: ({
            mus: 'шестой',
            fem: 'шестая',
            'mus/prd': 'шестом',
            'fem/prd': 'шестой',
          } as WordForms)[opt],
        } as Langs)[this.lang];
      case 7:
        return ({
          en: 'seventh',
          ru: ({
            mus: 'седьмой',
            fem: 'седьмая',
            'mus/prd': 'седьмом',
            'fem/prd': 'седьмой',
          } as WordForms)[opt],
        } as Langs)[this.lang];
      case 8:
        return ({
          en: 'eighth',
          ru: ({
            mus: 'восьмой',
            fem: 'восьмая',
            'mus/prd': 'восьмом',
            'fem/prd': 'восьмой',
          } as WordForms)[opt],
        } as Langs)[this.lang];
      default:
        return null;
    }
  }
  static myPiece(pieceCode: string, opt = 'sin'): string {
    const gen = this.pieceGender(pieceCode);
    return this.my(`${gen}/${opt}`) + ' ' + this.piece(pieceCode, opt);
  }
  static yourPiece(pieceCode: string, opt = 'sin'): string {
    const gen = this.pieceGender(pieceCode);
    return this.your(`${gen}/${opt}`) + ' ' + this.piece(pieceCode, opt);
  }
  static selfPiece(pieceCode: string, opt = 'imn'): string {
    const gen = this.pieceGender(pieceCode);
    return this.self(`${gen}/${opt}`) + ' ' + this.piece(pieceCode, opt);
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
  static coloredPiece(pieceCode: string, opt = 'sin'): string {
    const piece = this.piece(pieceCode, opt);
    const gen = this.pieceGender(pieceCode);
    const color = this.color(getSide(pieceCode), `${gen}/${opt}`);
    return color + ' ' + piece;
  }
  static emptyRank(n: number): string {
    return rand(
      ({
        en: [`${upFirst(this.n(n))} rank is empty.`],
        ru: [`На ${this.n(n, 'mus/prd')} ряду нет фигур.`],
      } as rLangs)[this.lang]
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
      } as rLangs)[this.lang]
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
      } as rLangs)[this.lang]
    );
  }
  static on(pos: string, opt = 'prd'): string {
    return ({
        en: `on ${this.square(pos)}`,
        ru: `на ${this.square(pos, opt)}`,
    } as Langs)[this.lang];
  }
  static pieceFrom(code: string, pos: string): string {
    return rand([
      `${this.piece(code)} ${this.from()} ${this.square(pos, 'rod')}`,
      `${this.piece(code)} ${this.from()} ${this.square(pos, 'rod')}`,
      `${this.piece(code)} ${this.from()} ${this.square(pos, 'rod')}`,
      `${this.piece(code)} ${char(pos)}`,
    ]);
  }
  static fromTo(from: string, to: string): string {
    return `${this.from()} ${this.square(from, 'rod')} ${this.to()} ${this.square(to, 'vin')}`;
  }
  static from(): string {
    return ({
        en: 'from',
        ru: 'с',
    } as Langs)[this.lang];
  }
  static to(): string {
    return ({
        en: 'to',
        ru: 'на',
    } as Langs)[this.lang];
  }
  static or(): string {
    return rand(
      ({
        en: ['or'],
        ru: ['или'],
      } as rLangs)[this.lang]
    );
  }
  static and(): string {
    return rand(
      ({
        en: ['and'],
        ru: ['и'],
      } as rLangs)[this.lang]
    );
  }
  static andA(): string {
    return rand(
      ({
        en: ['and'],
        ru: ['а'],
      } as rLangs)[this.lang]
    );
  }
  static asWell(): string {
    return rand(
      ({
        en: ['and'],
        ru: ['а также'],
      } as rLangs)[this.lang]
    );
  }
  static enemy(opt = 'mus'): string {
    return ({
      en: 'enemy',
      ru: ({
        mus: 'вражеского',
        fem: 'вражескую',
      } as WordForms)[opt],
    } as Langs)[this.lang];
  }
  static byPlay(): string {
    return rand(
      ({
        en: ['if you make a move'],
        ru: ['сыграв', 'походив', 'сделав ход'],
      } as rLangs)[this.lang]
    );
  }
  static firstMoveInHistoryIntro(): string {
    return rand(
      ({
        en: ['At first', 'First'],
        ru: ['Сначала', 'Сперва'],
      } as rLangs)[this.lang]
    );
  }
  static nextMoveInHistoryIntro(): string {
    return rand(
      ({
        en: ['Next', 'Then', 'In response,'],
        ru: ['Далее', 'Затем', 'В ответ', 'После этого'],
      } as rLangs)[this.lang]
    );
  }
  static deprived(who: WhoseSide): string {
    return ({
      en: 'deprived',
      ru: ({
        [WhoseSide.ENEMY]: 'лишил',
        [WhoseSide.PLAYER]: 'лишили',
      })[who],
    } as Langs)[this.lang];
  }
  static transform(who: WhoseSide): string {
    return rand(
      ({
        en: ['transformed'],
        ru: ({
          [WhoseSide.ENEMY]: ['превратил', 'трансформировал', 'обратил'],
          [WhoseSide.PLAYER]: ['превратили', 'трансформировали', 'обратили'],
        })[who],
      } as rLangs)[this.lang]
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
      } as rLangs)[this.lang]
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
      } as rLangs)[this.lang]
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
      } as rLangs)[this.lang]
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
      } as rLangs)[this.lang]
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
      } as rLangs)[this.lang]
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
    } as Langs)[this.lang];
  }
  static all(): string {
    return ({
      en: `all`,
      ru: 'все',
    } as Langs)[this.lang];
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
    } as Langs)[this.lang];
  }
  static left(gen: string): string {
    return ({
      en: 'left',
      ru: ({
        mus: 'остался',
        fem: 'осталась',
      } as WordForms)[gen],
    } as Langs)[this.lang];
  }
  static last(gen: string): string {
    return ({
      en: 'last',
      ru: ({
        mus: 'последний',
        fem: 'последняя',
      } as WordForms)[gen],
    } as Langs)[this.lang];
  }
  static only(gen: string): string {
    return ({
      en: 'last',
      ru: ({
        mus: 'единственный',
        fem: 'единственная',
      } as WordForms)[gen],
    } as Langs)[this.lang];
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
    } as Langs)[this.lang];
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
  static simpleOn(pos: string): string {
    return ({
      en: char(pos),
      ru: `на ${char(pos)}`,
    } as Langs)[this.lang];
  }
  static capture(whose: WhoseSide): string {
    return rand(
      ({
        en: ['capture'],
        ru: ({
          [WhoseSide.ENEMY]: ['захватил', 'взял', 'съел', 'забрал'],
          [WhoseSide.PLAYER]: ['захватили', 'взяли', 'съели', 'забрали'],
        })[whose],
      } as rLangs)[this.lang]
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
    } as Langs)[this.lang];
  }
  static managed(who: WhoseSide): string {
    return ({
      en: 'managed',
      ru: ({
        [WhoseSide.ENEMY]: 'успел',
        [WhoseSide.PLAYER]: 'успели',
      })[who],
    } as Langs)[this.lang];
  }
  static yes(): string {
    return rand(
      ({
        en: ['yes', 'yeah', 'truly', 'right'],
        ru: ['да', 'верно', 'так точно'],
      } as rLangs)[this.lang]
    );
  }
  static no(): string {
    return rand(
      ({
        en: ['no', 'nope'],
        ru: ['нет'],
      } as rLangs)[this.lang]
    );
  }
  static play(who: WhoseSide): string {
    return ({
      en: 'play',
      ru: ({
        [WhoseSide.ENEMY]: 'играю',
        [WhoseSide.PLAYER]: 'играете',
      })[who],
    } as Langs)[this.lang];
  }
  static nPassed(n: number): string {
    return ({
      en: 'passed',
      ru: n % 100 === 1 ? 'прошёл' : 'прошло',
    } as Langs)[this.lang];
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
  static kingside(): string {
    return ({
      en: 'kingside',
      ru: 'королевском фланге',
    } as Langs)[this.lang];
  }
  static queenside(): string {
    return ({
      en: 'queenside',
      ru: 'ферзевом фланге',
    } as Langs)[this.lang];
  }
  static castlSide(move: string): string {
    const type = getTypeOfCastling(move);
    return ({
      [CastlingType.KINGSIDE]: this.kingside(),
      [CastlingType.QUEENSIDE]: this.queenside(),
    })[type];
  }
}
