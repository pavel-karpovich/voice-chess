import { upFirst } from '../support/helpers';
import { Langs } from './struct/struct';
import { ChessSide } from '../chess/chessUtils';
import { Vocabulary as Voc } from './vocabulary';

// prettier-ignore
export class Suggestions {
  private static lang: string;

  static setLanguage(language = 'ru'): void {
    this.lang = language;
  }

  static get newGame(): string {
    return ({
      en: 'New game',
      ru: 'Новая игра',
    } as Langs)[this.lang];
  }
  static get help(): string {
    return ({
      en: 'Help',
      ru: 'Помощь',
    } as Langs)[this.lang];
  }
  static get changeDifficulty(): string {
    return ({
      en: 'Change difficulty',
      ru: 'Изменить сложность',
    } as Langs)[this.lang];
  }
  static get continueGame(): string {
    return ({
      en: 'Continue game',
      ru: 'Продолжить игру',
    } as Langs)[this.lang];
  }
  static get white(): string {
    return ({
      en: 'White',
      ru: 'Белые',
    } as Langs)[this.lang];
  }
  static get black(): string {
    return ({
      en: 'Black',
      ru: 'Чёрные',
    } as Langs)[this.lang];
  }
  static get yes(): string {
    return ({
      en: 'Yes',
      ru: 'Да',
    } as Langs)[this.lang];
  }
  static get no(): string {
    return ({
      en: 'No',
      ru: 'Нет',
    } as Langs)[this.lang];
  }
  static get dont(): string {
    return ({
      en: "Don't",
      ru: 'Не надо',
    } as Langs)[this.lang];
  }
  static get move(): string {
    return ({
      en: 'Make a move',
      ru: 'Сделать ход',
    } as Langs)[this.lang];
  }
  static get mySide(): string {
    return ({
      en: 'My side',
      ru: 'Моя сторона',
    } as Langs)[this.lang];
  }
  static get history(): string {
    return ({
      en: 'Moves History',
      ru: 'История ходов',
    } as Langs)[this.lang];
  }
  static get captured(): string {
    return ({
      en: 'Captured Pieces',
      ru: 'Захваченные фигуры',
    } as Langs)[this.lang];
  }
  static get resign(): string {
    return ({
      en: 'Resign',
      ru: 'Сдаться',
    } as Langs)[this.lang];
  }
  static get exit(): string {
    return ({
      en: 'Exit game',
      ru: 'Выйти из игры',
    } as Langs)[this.lang];
  }
  static get advice(): string {
    return ({
      en: 'Advise move',
      ru: 'Посоветуй ход',
    } as Langs)[this.lang];
  }
  static get availableMoves(): string {
    return ({
      en: 'Available moves',
      ru: 'Доступные ходы',
    } as Langs)[this.lang];
  }
  static get autoMove(): string {
    return ({
      en: 'Auto move',
      ru: 'Авто ход',
    } as Langs)[this.lang];
  }
  static get next(): string {
    return ({
      en: 'Next',
      ru: 'Дальше',
    } as Langs)[this.lang];
  }
  static get nextRank(): string {
    return ({
      en: 'Next rank',
      ru: 'Следующий ряд',
    } as Langs)[this.lang];
  }
  static get prevRank(): string {
    return ({
      en: 'Previous rank',
      ru: 'Предыдущий ряд',
    } as Langs)[this.lang];
  }
  static get posInfo(): string {
    return ({
      en: 'Position info',
      ru: 'Инфо о позиции',
    } as Langs)[this.lang];
  }
  static get pieceInfo(): string {
    return ({
      en: 'Piece info',
      ru: 'Инфо о фигуре',
    } as Langs)[this.lang];
  }
  static get board(): string {
    return ({
      en: 'Board info',
      ru: 'Обзор доски',
    } as Langs)[this.lang];
  }
  static all(side: ChessSide): string {
    return ({
      en: ({
        [ChessSide.WHITE]: 'All white',
        [ChessSide.BLACK]: 'All black',
      })[side],
      ru: ({
        [ChessSide.WHITE]: 'Все белые',
        [ChessSide.BLACK]: 'Все чёрные',
      })[side],
    } as Langs)[this.lang];
  }
  static get queen(): string {
    return upFirst(Voc.piece('q'));
  }
  static get knight(): string {
    return upFirst(Voc.piece('n'));
  }
  static get rook(): string {
    return upFirst(Voc.piece('r'));
  }
  static get bishop(): string {
    return upFirst(Voc.piece('b'));
  }
  static get disableConfirm(): string {
    return ({
      en: 'Disable move confirmation',
      ru: 'Откл подтверждение хода',
    } as Langs)[this.lang];
  }
  static get enableConfirm(): string {
    return ({
      en: 'Enable move confirmation',
      ru: 'Вкл подтверждение хода',
    } as Langs)[this.lang];
  }
  static get confirm(): string {
    return ({
      en: 'Confirm',
      ru: 'Да',
    } as Langs)[this.lang];
  }
  static get queenside(): string {
    return ({
      en: 'Queenside',
      ru: 'Ферзевой фланг',
    } as Langs)[this.lang];
  }
  static get kingside(): string {
    return ({
      en: 'Kingside',
      ru: 'Королевский фланг',
    } as Langs)[this.lang];
  }
  static get agree(): string {
    return ({
      en: 'Agree',
      ru: 'Принять',
    } as Langs)[this.lang];
  }
  static get correct(): string {
    return ({
      en: 'Change the last move',
      ru: 'Изменить последний ход',
    } as Langs)[this.lang];
  }
}
