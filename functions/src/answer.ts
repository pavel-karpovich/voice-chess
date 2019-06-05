import {
  rand,
  LocalizationObject,
  WordForms,
  char,
  upFirst,
  pause,
} from './helpers';
import { PieceMoves, Move, ChessSide } from './chess';

export class Answer {
  private static lang: string;

  static setLanguage(language = 'ru'): void {
    this.lang = language;
  }

  static firstPlay(): string {
    return ({
      en:
        'Welcome to Voice Chess! Voice Chess is a game of chess, designed entirely for voice ' +
        'control. To learn about the features and available commands, say "Help" or "Info".',
      ru:
        'Добро пожаловать в Голосовые Шахматы! Голосовые Шахматы - это игра в шахматы, ' +
        'рассчитанная полностью на голосовое управление. Чтобы узнать о возможностях и ' +
        'доступных командах произнесите "Помощь", "Инфо" или "Справка".',
    } as LocalizationObject<string>)[this.lang];
  }
  static welcome(): string {
    return rand(
      ({
        en: [
          'Welcome to the Voice Chess!',
          'Hi!',
          'Want to play chess? This we can.',
          'Hi, I have not seen you for a while!',
        ],
        ru: [
          'Добро пожаловать в Голосовые Шахматы!',
          'С возвращением!',
          'Соскучились по шахматам? Я ждал вас.',
          'С возвращением в Голосовые Шахматы!',
          'Привет!',
        ],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static giveSide(pieceCode: string): ChessSide {
    if (pieceCode === pieceCode.toUpperCase()) {
      return ChessSide.WHITE;
    } else {
      return ChessSide.BLACK;
    }
  }
  static side(side: ChessSide, opt = 'mus'): string {
    if (side === ChessSide.BLACK) {
      return this.black(opt);
    } else {
      return this.white(opt);
    }
  }
  static continueGame(side: ChessSide): string {
    return rand(
      ({
        en: [
          `I was waiting for you! You play ${this.side(
            side
          )}. Now it's your turn.`,
          `Let's go! Your turn. I remind, that you play ${this.side(side)}.`,
          `It's time! You are ${this.side(side, 'plr')}. And your move.`,
        ],
        ru: [
          `Я ждал вас! Вы играете за ${this.side(
            side,
            'plr/rod'
          )}, и сейчас ваш ход.`,
          `Поехали! Вам ходить. Напоминаю, что вы за ${this.side(
            side,
            'plr/rod'
          )}.`,
          `Давно пора! Ваш ход. Вы играете ${this.side(side, 'plr/tvr')}.`,
        ],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static newgame(): string {
    return rand(
      ({
        en: ['New game is started.', "Let's go, I cleared the board.", 'Ok.'],
        ru: [
          'Новая игра запущена.',
          'Ну давайте заново.',
          'Всегда рад новой партейке!',
        ],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static noGameToContinue(): string {
    return rand(
      ({
        en: [
          "Sorry, but you don't have a running game to continue.",
          "You don't have a running game.",
          "Sorry, but we don't have a running game.",
        ],
        ru: [
          'У вас нет запущенной игры, чтобы продолжить.',
          'Чтобы что-то продолжить, нужно чтобы было что-то, что можно продолжить.',
          'Простите, но у нас нет запущенной партии...',
        ],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static firstFallback(): string {
    return rand(
      ({
        en: [
          "I didn't understand.",
          "I'm sorry, can you try again?",
          "Sorry, I didn't understand you...",
          'Sorry, can you say it again?',
        ],
        ru: [
          'Я вас не совсем понял...',
          'Повторите, пожалуйста.',
          'Можно ещё раз?',
          'Не могли бы вы повторить?',
        ],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static secondFallback(): string {
    return rand(
      ({
        en: [
          "Sorry, I didn't understand what you want.",
          "I'm sorry, I didn't understand.",
        ],
        ru: [
          'Простите, я не могу понять, чего вы хотите.',
          'Извините, я не могу понять, о чём вы говорите.',
          'Я не могу вас понять...',
        ],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static confusedExit(): string {
    return rand(
      ({
        en: [
          "Sorry, but I can't understand what you want.\nMaybe try again later...",
          "It is a Chess Game. Is that exactly what you need?\nI'm not sure...",
          'Sorry, try again later.',
        ],
        ru: [
          'Извините, но я совсем не могу вас понять.\nПопробуйте позже.',
          'Может быть в другой раз...',
          'Это игра в шахматы. Вы точно попали куда нужно?\nЯ не уверен.',
        ],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static board1(): string {
    return rand(
      ({
        en: [
          'You want see the board? Here is the first part: ',
          'Look at first part: ',
          'The first part of the board: ',
        ],
        ru: [
          'Первая половина доски: ',
          'Слушайте, что на первой половине доски: ',
          'Вот первая половина доски: ',
        ],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static board2(): string {
    return rand(
      ({
        en: ['The second part of the board: '],
        ru: ['Вторая половина доски: '],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static board(): string {
    return rand(
      ({
        en: [
          'And this is on our chessboard: ',
          'So, chessboard: ',
          "And what's on the board? Listen: ",
        ],
        ru: [
          'Вот что у нас сейчас на доске: ',
          'Итак, шахматная доска: ',
          'Что же происходит на доске? Слушайте: ',
        ],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static noboard(): string {
    return rand(
      ({
        en: [
          'There is no chess board yet.',
          "We don't play to see the board.",
          'Start a new game first!',
        ],
        ru: [
          'А нечего показывать.',
          'Сейчас нет запущенной партии.',
          'Доску можно увидеть только при запущенной игре.',
        ],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static illegalMove(from: string, to: string, details?: object): string {
    return rand(
      ({
        en: [
          "You can't!",
          "You can't do this move!",
          `You can't move ${char(from)} ${char(to)}!`,
          'This makes no sense!\nYou need to come up with another move.',
          "Sorry, but you can't move like that...",
        ],
        ru: [
          'Вы не можете так походить!',
          'Вы не можете сделать такой ход!',
          `Вы не можете ходить с ${char(from)} на ${char(to)}.`,
          'Нельзя так ходить!',
          `${char(from)} ${char(to)}... Это некорректный ход.`,
        ],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static playerMove(from: string, to: string, pieceCode: string): string {
    return rand(
      ({
        en: [
          `The move is made! You move ${this.piece(pieceCode)} from ${char(
            from
          )} to ${char(to)}.`,
          `Okay, you move ${this.piece(pieceCode)} from ${char(from)} to ${char(
            to
          )}.`,
        ],
        ru: [
          `Ход сделан! Вы передвинули ${this.piece(
            pieceCode,
            'vin'
          )} с позиции ${char(from)} на ${char(to)}.`,
          `Ладно, значит вы ходите ${this.piece(pieceCode, 'tvr')} с ${char(
            from
          )} на ${char(to)}.`,
        ],
      } as LocalizationObject<string[]>)[this.lang]
    );
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
  static pieceGender(pieceCode: string): string {
    pieceCode = pieceCode.toLowerCase();
    if (pieceCode === 'p' || pieceCode === 'r') {
      return 'fem';
    } else {
      return 'mus';
    }
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
    pieceCode = pieceCode.toLowerCase();
    const gen = this.pieceGender(pieceCode);
    return this.my(`${gen}/${opt}`) + ' ' + this.piece(pieceCode, opt);
  }
  static yourPiece(pieceCode: string, opt = 'sin'): string {
    pieceCode = pieceCode.toLowerCase();
    const gen = this.pieceGender(pieceCode);
    return this.your(`${gen}/${opt}`) + ' ' + this.piece(pieceCode, opt);
  }
  static playerBeat(beatedPieceCode: string): string {
    return rand(
      ({
        en: [
          `And grab ${this.myPiece(beatedPieceCode, 'vin')}.`,
          `And you take off ${this.myPiece(beatedPieceCode, 'vin')}.`,
          `And I loose ${this.myPiece(beatedPieceCode, 'vin')}!`,
        ],
        ru: [
          `Ко всему прочему я теряю ${this.myPiece(beatedPieceCode, 'vin')}.`,
          `И вы забираете ${this.myPiece(beatedPieceCode, 'vin')}, чёрт...`,
          `И я лишаюсь ${this.myPiece(beatedPieceCode, 'rod')}!`,
        ],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static enemyMove(from: string, to: string, pieceCode: string): string {
    const piece = this.piece(pieceCode);
    return rand(
      ({
        en: [
          `I would move a ${piece} from ${char(from)} to ${char(to)}!`,
          `My move is a ${piece} from ${char(from)} to ${char(
            to
          )}! And what do you say to that?`,
          `I move my ${piece} from ${char(from)} to ${char(to)}.`,
        ],
        ru: [
          `Мой ход таков: ${piece} с ${char(from)} на ${char(to)}.`,
          `Так. Пожалуй, я отвечу ${piece} ${char(from)} ${char(to)}.`,
          `Я сделаю ход ${this.piece(pieceCode, 'tvr')} с ${char(
            from
          )} на ${char(to)}!`,
          `А я похожу ${this.piece(pieceCode, 'tvr')} с ${char(from)} на ${char(
            to
          )}.`,
        ],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static enemyBeat(beatedPieceCode: string): string {
    return rand(
      ({
        en: [
          `I beat ${this.yourPiece(beatedPieceCode, 'vin')}!`,
          `And I will take ${this.yourPiece(beatedPieceCode, 'vin')}!`,
          `Minus ${this.yourPiece(beatedPieceCode, 'vin')}.`,
        ],
        ru: [
          `${upFirst(this.yourPiece(beatedPieceCode, 'sin'))} теперь ${this.my(
            this.pieceGender(beatedPieceCode)
          )}!`,
          `И я лишу вас ${this.piece(beatedPieceCode, 'rod')}.`,
          `И я забираю ${this.yourPiece(beatedPieceCode, 'vin')}.`,
          `${upFirst(this.yourPiece(beatedPieceCode, 'vin'))} в минусе.`,
          `С вашего позволения, я забираю ${this.yourPiece(
            beatedPieceCode,
            'vin'
          )}.`,
        ],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static black(opt = 'mus'): string {
    return ({
      en: ({
        mus: 'black',
        plr: 'blacks',
      } as WordForms)[opt],
      ru: ({
        mus: 'чёрный',
        fem: 'чёрная',
        'plr/rod': 'чёрных',
        'plr/tvr': 'чёрными',
      } as WordForms)[opt],
    } as LocalizationObject<string>)[this.lang];
  }
  static white(opt = 'mus'): string {
    return ({
      en: ({
        mus: 'white',
        plr: 'whites',
      } as WordForms)[opt],
      ru: ({
        mus: 'белый',
        fem: 'белая',
        'plr/rod': 'белых',
        'plr/tvr': 'белыми',
      } as WordForms)[opt],
    } as LocalizationObject<string>)[this.lang];
  }
  static color(pieceCode: string, opt = 'mus'): string {
    if (this.giveSide(pieceCode) === ChessSide.WHITE) {
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
  static coloredPiece(code: string): string {
    const piece = this.piece(code);
    let color = null;
    if (piece === 'Пешка' || piece === 'Ладья') {
      color = this.color(code, 'fem');
    } else {
      color = this.color(code, 'mus');
    }
    return color + ' ' + piece;
  }
  static nRow(n: number, opt = 'mus'): string {
    switch (n) {
      case 1:
        return ({
          en: 'First row',
          ru: ({
            mus: 'Первый ряд',
            na: 'Первом ряду',
          } as WordForms)[opt],
        } as LocalizationObject<string>)[this.lang];
      case 2:
        return ({
          en: 'Second row',
          ru: ({
            mus: 'Второй ряд',
            na: 'Втором ряду',
          } as WordForms)[opt],
        } as LocalizationObject<string>)[this.lang];
      case 3:
        return ({
          en: 'Third row',
          ru: ({
            mus: 'Третий ряд',
            na: 'Третьем ряду',
          } as WordForms)[opt],
        } as LocalizationObject<string>)[this.lang];
      case 4:
        return ({
          en: 'Fourth row',
          ru: ({
            mus: 'Четвёртый ряд',
            na: 'Четвёртом ряду',
          } as WordForms)[opt],
        } as LocalizationObject<string>)[this.lang];
      case 5:
        return ({
          en: 'Fifth row',
          ru: ({
            mus: 'Пятый ряд',
            na: 'Пятом ряду',
          } as WordForms)[opt],
        } as LocalizationObject<string>)[this.lang];
      case 6:
        return ({
          en: 'Sixth row',
          ru: ({
            mus: 'Шестой ряд',
            na: 'Шестом ряду',
          } as WordForms)[opt],
        } as LocalizationObject<string>)[this.lang];
      case 7:
        return ({
          en: 'Seventh row',
          ru: ({
            mus: 'Седьмой ряд',
            na: 'Седьмом ряду',
          } as WordForms)[opt],
        } as LocalizationObject<string>)[this.lang];
      case 8:
        return ({
          en: 'Eighth row',
          ru: ({
            mus: 'Восьмой ряд',
            na: 'Восьмом ряду',
          } as WordForms)[opt],
        } as LocalizationObject<string>)[this.lang];
      default:
        return null;
    }
  }
  static emptyRow(n: number): string {
    return rand(
      ({
        en: [`${this.nRow(n)} is empty.`],
        ru: [`На ${this.nRow(n, 'na')} нет фигур.`],
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
  static emptyPosition(pos: string): string {
    return rand(
      ({
        en: [`${char(pos)} is free.`],
        ru: [`Клетка ${char(pos)} свободна.`],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static incorrectRowNumber(num: number): string {
    return rand(
      ({
        en: [
          `Row ${num}? What does it mean?`,
          'You called the wrong row number. Rows are numbered from 1 to 8.',
        ],
        ru: [
          `Ряда ${num} не существует в шахматах.`,
          'Вы назвали неверный номер. Ряды в шахматах нумеруются от 1 до 8.',
          'Такого ряда не существует. Нумерация идёт с 1 до 8.',
        ],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static noNextRow(): string {
    return rand(
      ({
        en: [
          'There is no next row.',
          'It was the 8th row.\nThere is no next row!',
          'It was the last row.\n',
        ],
        ru: [
          'Следующего ряда нет.',
          'Это был восьмой ряд.\nДальше некуда!',
          'Это был последний ряд.',
        ],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static whiteSide(): string {
    return rand(
      ({
        en: ['Your side is White.\nAnd your turn is first!'],
        ru: [
          'Ваша сторона - Белая.\nПервый ход за вами.',
          'Вы за белых, ходите первыми.',
        ],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static blackSide(): string {
    return rand(
      ({
        en: [
          'Your side is Black. My turn is first...',
          "Ok, you are for Black. Then I'll go first.",
        ],
        ru: [
          'Ваша сторона - Чёрная. Я хожу первым...',
          'Ладно, вы за Чёрных. Тогда мой ход первый.',
        ],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static showDifficulty(current: number): string {
    return rand(
      ({
        en: [
          `The current difficulty level is ${current}.`,
          `At the moment, the difficulty is set to ${current}.`,
          `For now, the difficulty level is ${current}. Valid values are from 0 to 20.`,
        ],
        ru: [
          `Текущий уровень сложности: ${current}.`,
          `Текущая сложность: ${current}. Допустимые значения: от 0 до 20.`,
          `Сейчас уровень сложности равен ${current}`,
        ],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static difficultyChanged(newLevel: number, oldLevel: number): string {
    return rand(
      ({
        en: [
          `The difficulty level has been changed from ${oldLevel} to ${newLevel}!`,
          `The difficulty level now is set to ${newLevel}!`,
          `Ok! Difficulty is now set to ${newLevel}.`,
        ],
        ru: [
          `Уровень сложности был изменён с ${oldLevel} на ${newLevel}!`,
          `Окей, теперь уровень сложности равен ${newLevel}.`,
          `Дело сделано - сложность теперь будет равна ${newLevel}`,
        ],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static difficultyTheSame(level: number): string {
    return rand(
      ({
        en: [`The difficulty level is already ${level}}!`],
        ru: [`Уровень сложности уже равен ${level}!`, 'Сложность и так такая!'],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static youLose(): string {
    return rand(
      ({
        en: ["You checkmate! Don't worry, next time you get!"],
        ru: ['Вы проиграли, шах и мат! Ничего, в другой раз всё получится.'],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static youWin(): string {
    return rand(
      ({
        en: [
          'Oh... You checkmate me! Very impressive! You won! Congratulations!.',
        ],
        ru: [
          'Погодите секундочку... Вы поставили мне шах и мат? Ничего себе, да вы победили! Поздравляю!',
        ],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static draw(): string {
    return rand(
      ({
        en: [
          'It seems like a draw.',
          "It's a draw. The game is over.",
          "Draw, well played. Now it's over.",
        ],
        ru: [
          'Похоже, у нас ничья!',
          'И это ничья! Партия окончена.',
          'Ничья. Дальше играть некуда.',
        ],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static checkToEnemy(): string {
    return rand(
      ({
        en: ['And you set me a check!'],
        ru: ['И тем самым вы ставите мне шах!'],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static checkToPlayer(): string {
    return rand(
      ({
        en: ['Check to your king!'],
        ru: ['Вам шах.'],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static stalemateToEnemy(): string {
    return rand(
      ({
        en: [
          'Stalemate situation!',
          'Stalemate! I have nothing to move.',
          'You gave me a stalemate!',
        ],
        ru: [
          'Патовая ситуация!',
          'Пат! Мне нечем ходить.',
          'Вы поставили мне пат!',
        ],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static stalemateToPlayer(): string {
    return rand(
      ({
        en: [
          'It is a stalemate situation!',
          "Stalemate! You don't have any piece to legal move.",
          'I put you a stalemate!',
        ],
        ru: [
          'Вам пат!',
          'Пат! У вас нет легальных ходов.',
          'Похоже, я поставил вам пат!',
        ],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static fiftymove(): string {
    return rand(
      ({
        en: [
          'It is fifty-move rule!',
          'For 50 moves in a row there was not a single capture of any piece or pawn movement.',
        ],
        ru: [
          'Правило 50 ходов!',
          'Уже 50 ходов подряд не было ни одного взятия фигуры или передвижения пешки!',
        ],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static cellIsEmpty(cell: string, piece?: string): string {
    if (piece) {
      return rand(
        ({
          en: [
            `There is no ${piece} on the square ${char(cell)}! It's empty.`,
            `${piece} from ${char(cell)}? Are you sure? ${char(
              cell
            )} is empty!`,
            `You confused something. In the square ${char(
              cell
            )} no chess pieces.`,
          ],
          ru: [
            `Но клетка ${char(cell)} пустая. На ней нет ${piece}!`,
            `${piece} на ${char(cell)}? Но на клетке ${char(cell)} ничего нет.`,
            `На клетке ${char(
              cell
            )} нет ${piece}, на ней вообще нет фигур - это свободная клетка.`,
          ],
        } as LocalizationObject<string[]>)[this.lang]
      );
    } else {
      return rand(
        ({
          en: [
            `But the square ${char(cell)} is empty. There are no pieces!`,
            `Sorry, but there are no pieces on the square ${char(cell)}.`,
            `The position is incorrect. The square ${char(cell)} is empty!`,
          ],
          ru: [
            `Но клетка ${char(cell)} пустая. На ней нет фигур.`,
            `На клетке ${char(cell)} нет фигур.`,
            `Это некорректная позиция. На клетке ${char(cell)} ничего нет.`,
          ],
        } as LocalizationObject<string[]>)[this.lang]
      );
    }
  }
  static piecesDontMatch(
    playerPiece: string,
    actualPiece: string,
    cell: string
  ): string {
    return rand(
      ({
        en: [
          `But on the square ${char(
            cell
          )} is not ${playerPiece}, but ${actualPiece}.`,
          `On the square ${char(cell)} is ${actualPiece}, not ${playerPiece}.`,
          `On ${char(cell)} is not ${playerPiece}, but ${actualPiece}.`,
        ],
        ru: [
          `Но на клетке ${char(
            cell
          )} стоит не ${playerPiece}, a ${actualPiece}.`,
          `Только на клетке ${char(
            cell
          )} находится ${actualPiece}, а не ${playerPiece}.`,
          `На ${char(cell)} не ${playerPiece}, а ${actualPiece}.`,
        ],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static promotion(from: string, to: string): string {
    return rand(
      ({
        en: [
          `Your pawn reaches the last row! Now you need to use promotion!`,
          `When your pawn moves from ${char(from)} to ${char(
            to
          )}, there will be a promotion!`,
          `It is time to Pawn promotion!`,
          `Pawn promotion!`,
        ],
        ru: [
          `Ваша Пешка дошла до последнего ряда. Теперь её можно превратить в другую фигуру!`,
          `При переходе Пешки с ${char(from)} на ${char(
            to
          )} происходит превращение!`,
          `Время превращения пешки!`,
          `Повышение пешки!`,
        ],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static moveWithPromotion(pieceCode: string): string {
    const piece = this.piece(pieceCode);
    return rand(
      ({
        en: [
          `And pawn transforms to ${piece}!`,
          `And now it\'s a ${piece}!`,
          `Pawn promotes into a ${piece}!`,
        ],
        ru: [
          `И пешка становится ${this.piece(pieceCode, 'tvr')}!`,
          `Теперь это ${piece}!`,
          `Пешка превратилась в ${this.piece(pieceCode, 'vin')}!`,
        ],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static itsAll(): string {
    return rand(
      ({
        en: ["It's all.", 'And it is the end.', 'And that was the last item.'],
        ru: ['И это всё.', 'Все, это конец.', 'Это всё, что есть.'],
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
  static canDoSmth(targets: Move[]): string {
    let result = ' ';
    if (targets[0].beat) {
      result +=
        this.canAttack() + ' ' + this.enemy(this.pieceGender(targets[0].beat));
    } else {
      result += this.canMove();
    }
    for (let i = 0; i < targets.length; ++i) {
      if (i !== 0 && i === targets.length - 1) {
        result += ' ' + this.or();
      }
      if (targets[i].beat) {
        result += ' ' + this.piece(targets[i].beat, 'vin');
      }
      result += ' ' + this.on() + ' ' + char(targets[i].to);
      if (targets[i].promo) {
        result += ' ' + this.and() + ' ' + this.canPromote();
      }
      if (i < targets.length - 1) {
        result += ',';
      }
    }
    return result;
  }

  static onePosFromBulk(pos: PieceMoves): string {
    let result = upFirst(this.pieceOnPosition(pos.type, pos.pos));
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
          result += ', ' + this.asWell();
        } else {
          first = false;
        }
        if (end && last) {
          result += this.canDoSmth(pos.moves.slice(startIndex, endIndex));
          result += ', ' + this.asWell();
          result += this.canDoSmth(pos.moves.slice(endIndex));
        } else if (last) {
          result += this.canDoSmth(pos.moves.slice(startIndex));
        } else {
          result += this.canDoSmth(pos.moves.slice(startIndex, endIndex));
        }
        startIndex = endIndex;
        isBeats = !isBeats;
        end = false;
      }
    }
    result += '.';
    return result;
  }
  static listMoves(bulk: PieceMoves[]): string {
    let result = '';
    for (const move of bulk) {
      result += this.onePosFromBulk(move) + pause(1) + ' ';
    }
    return result;
  }
  static emptyHistory(): string {
    return rand(
      ({
        en: [
          'There is no story here, we just started a new game!',
          'The history of moves is empty, we are just started.',
          'History is empty, we didn\'t make any move yet.',
        ],
        ru: [
          'Какая история? Мы только начали новую игру!',
          'В истории нет ни одного хода, мы только начали.',
          'Никакой истории нет, ещё не было сделано ни одного хода',
        ],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static invalidMovesNumber(invNum: number): string {
    return rand(
      ({
        en: [
          'This value is invalid!',
          `The number of moves can't be equal to ${invNum}.`,
        ],
        ru: [
          'Вы назвали некорректное число.',
          `Количество ходов не может быть равно ${invNum}!`,
        ],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static moreMovesThanWeHave(invNum: number, num: number): string {
    return rand(
      ({
        en: [
          `We didn't do so many moves! Only ${num}:`,
          `We have only ${num} moves in the history of the game:`,
          `${invNum} it is too many. We played only 3 moves.`,
          'This is more than we played in the whole game! I will show you everything that we have in the history of moves:',
          `We have not played ${invNum} moves throughout the game. I can tell you only ${num} moves:`,
        ],
        ru: [
          `У нас нету стольки ходов. Только ${num}:`,
          `У нас всего ${num} ходов в истории:`,
          `${invNum} ходов я физически не могу назвать, но вот ${num} - пожалуйста.`,
          'Это больше чем было за всю игру. Я перечислю вам всё, что есть.',
          `За всю игру было только ${num} ходов. Так что больше чем ${num} я вам не назову.`,
        ],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static firstMoveInHistoryIntro(): string {
    return rand(
      ({
        en: [
          'At first',
          'First',
        ],
        ru: [
          'Сначала',
          'Сперва',
        ],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static nextMoveInHistoryIntro(): string {
    return rand(
      ({
        en: [
          'Next',
          'Then',
          'In response,',
        ],
        ru: [
          'Далее',
          'Затем',
          'В ответ',
          'После этого',
        ],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static youMoved(pieceCode: string, from: string, to: string): string {
    return rand(
      ({
        en: [
          `you moved ${this.piece(pieceCode)} from ${char(from)} to ${char(to)}`,
          `you played ${this.piece(pieceCode)} ${char(from)} ${char(to)}`,
          `you made a ${this.piece(pieceCode)} move from ${char(from)} to ${char(to)}`,
        ],
        ru: [
          `вы походили ${this.piece(pieceCode, 'tvr')} с ${char(from)} на ${char(to)}`,
          `вы сыграли ${this.piece(pieceCode, 'tvr')} ${char(from)} ${char(to)}`,
          `вы перешли ${this.piece(pieceCode, 'tvr')} с ${char(from)} на ${char(to)}`,
          `вы сделали ход ${this.piece(pieceCode, 'tvr')} с ${char(from)} на ${char(to)}`,
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
          `I made a ${this.piece(pieceCode)} move from ${char(from)} to ${char(to)}`,
        ],
        ru: [
          `я походил ${this.piece(pieceCode, 'tvr')} с ${char(from)} на ${char(to)}`,
          `я сыграл ${this.piece(pieceCode, 'tvr')} ${char(from)} ${char(to)}`,
          `я перешёл ${this.piece(pieceCode, 'tvr')} с ${char(from)} на ${char(to)}`,
          `я сделал ход ${this.piece(pieceCode, 'tvr')} с ${char(from)} на ${char(to)}`,
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

}
