import { ChessSide, getSide } from '../chess/chessUtils';
import { WordForms, LocalizationObject } from '../support/helpers';
import { rand, char } from '../support/helpers';

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
        'mus/sin': 'мой',
        'fem/sin': 'моя',
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
        'mus/sin': 'ваш',
        'fem/sin': 'ваша',
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
  static black(opt = 'mus'): string {
    return ({
      en: ({
        mus: 'black',
        fem: 'white',
        plr: 'blacks',
        'mus/sin': 'black',
        'fem/sin': 'black',
        'mus/vin': 'black',
        'fem/vin': 'black',
        'mus/rod': 'black',
        'fem/rod': 'black',
        'plr/rod': 'blacks',
        'plr/tvr': 'blacks',
      } as WordForms)[opt],
      ru: ({
        mus: 'чёрный',
        fem: 'чёрная',
        plr: 'чёрные',
        'mus/sin': 'чёрный',
        'fem/sin': 'чёрная',
        'mus/vin': 'чёрного',
        'fem/vin': 'чёрную',
        'mus/rod': 'чёрного',
        'fem/rod': 'чёрной',
        'plr/rod': 'чёрных',
        'plr/tvr': 'чёрными',
      } as WordForms)[opt],
    } as LocalizationObject<string>)[this.lang];
  }
  static white(opt = 'mus'): string {
    return ({
      en: ({
        mus: 'white',
        fem: 'white',
        plr: 'whites',
        'mus/sin': 'white',
        'fem/sin': 'white',
        'mus/vin': 'white',
        'fem/vin': 'white',
        'mus/rod': 'white',
        'fem/rod': 'white',
        'plr/rod': 'whites',
        'plr/tvr': 'whites',
      } as WordForms)[opt],
      ru: ({
        mus: 'белый',
        fem: 'белая',
        plr: 'белые',
        'mus/sin': 'чёрный',
        'fem/sin': 'чёрная',
        'mus/vin': 'чёрного',
        'fem/vin': 'чёрную',
        'mus/rod': 'чёрного',
        'fem/rod': 'чёрной',
        'plr/rod': 'чёрных',
        'plr/tvr': 'чёрными',
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
          en: 'Pawn',
          ru: ({
            sin: 'Пешка',
            rod: 'Пешки',
            vin: 'Пешку',
            tvr: 'Пешкой',
          } as WordForms)[opt],
        } as LocalizationObject<string>)[this.lang];
      case 'r':
        return ({
          en: 'Rook',
          ru: ({
            sin: 'Ладья',
            rod: 'Ладьи',
            vin: 'Ладью',
            tvr: 'Ладьёй',
          } as WordForms)[opt],
        } as LocalizationObject<string>)[this.lang];
      case 'n':
        return ({
          en: 'Knight',
          ru: ({
            sin: 'Конь',
            rod: 'Коня',
            vin: 'Коня',
            tvr: 'Конём',
          } as WordForms)[opt],
        } as LocalizationObject<string>)[this.lang];
      case 'b':
        return ({
          en: 'Bishop',
          ru: ({
            sin: 'Слон',
            rod: 'Слона',
            vin: 'Слона',
            tvr: 'Слоном',
          } as WordForms)[opt],
        } as LocalizationObject<string>)[this.lang];
      case 'q':
        return ({
          en: 'Queen',
          ru: ({
            sin: 'Ферзь',
            rod: 'Ферзя',
            vin: 'Ферзя',
            tvr: 'Ферзём',
          } as WordForms)[opt],
        } as LocalizationObject<string>)[this.lang];
      case 'k':
        return ({
          en: 'King',
          ru: ({
            sin: 'Король',
            rod: 'Короля',
            vin: 'Короля',
            tvr: 'Королём',
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
  static nRank(n: number, opt = 'mus'): string {
    switch (n) {
      case 1:
        return ({
          en: 'First rank',
          ru: ({
            mus: 'Первый ряд',
            na: 'Первом ряду',
          } as WordForms)[opt],
        } as LocalizationObject<string>)[this.lang];
      case 2:
        return ({
          en: 'Second rank',
          ru: ({
            mus: 'Второй ряд',
            na: 'Втором ряду',
          } as WordForms)[opt],
        } as LocalizationObject<string>)[this.lang];
      case 3:
        return ({
          en: 'Third rank',
          ru: ({
            mus: 'Третий ряд',
            na: 'Третьем ряду',
          } as WordForms)[opt],
        } as LocalizationObject<string>)[this.lang];
      case 4:
        return ({
          en: 'Fourth rank',
          ru: ({
            mus: 'Четвёртый ряд',
            na: 'Четвёртом ряду',
          } as WordForms)[opt],
        } as LocalizationObject<string>)[this.lang];
      case 5:
        return ({
          en: 'Fifth rank',
          ru: ({
            mus: 'Пятый ряд',
            na: 'Пятом ряду',
          } as WordForms)[opt],
        } as LocalizationObject<string>)[this.lang];
      case 6:
        return ({
          en: 'Sixth rank',
          ru: ({
            mus: 'Шестой ряд',
            na: 'Шестом ряду',
          } as WordForms)[opt],
        } as LocalizationObject<string>)[this.lang];
      case 7:
        return ({
          en: 'Seventh rank',
          ru: ({
            mus: 'Седьмой ряд',
            na: 'Седьмом ряду',
          } as WordForms)[opt],
        } as LocalizationObject<string>)[this.lang];
      case 8:
        return ({
          en: 'Eighth rank',
          ru: ({
            mus: 'Восьмой ряд',
            na: 'Восьмом ряду',
          } as WordForms)[opt],
        } as LocalizationObject<string>)[this.lang];
      default:
        return null;
    }
  }
  static emptyRank(n: number): string {
    return rand(
      ({
        en: [`${this.nRank(n)} is empty.`],
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
  static youTookMyPiece(pieceCode: string): string {
    return rand(
      ({
        en: [
          `killed ${this.myPiece(pieceCode)}`,
          `took ${this.myPiece(pieceCode)}`,
          `left me without ${this.myPiece(pieceCode)}`,
        ],
        ru: [
          `забрали ${this.myPiece(pieceCode, 'vin')}`,
          `убили ${this.myPiece(pieceCode, 'vin')}`,
          `лишили меня ${this.piece(pieceCode, 'rod')}`,
        ],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static iTookYourPiece(pieceCode: string): string {
    return rand(
      ({
        en: [
          `killed ${this.yourPiece(pieceCode)}`,
          `took ${this.yourPiece(pieceCode)}`,
          `left you without ${this.yourPiece(pieceCode)}`,
        ],
        ru: [
          `забрал ${this.yourPiece(pieceCode, 'vin')}`,
          `убил ${this.yourPiece(pieceCode, 'vin')}`,
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
}
