import { rand, LocalizationObject, char, upFirst } from '../helpers';
import { ChessSide, oppositeSide } from '../chess/chessUtils';
import { Vocabulary as Voc } from './vocabulary';

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
  static continueGame(side: ChessSide): string {
    return rand(
      ({
        en: [
          `I was waiting for you! You play ${Voc.side(
            side
          )}. Now it's your turn.`,
          `Let's go! Your turn. I remind, that you play ${Voc.side(side)}.`,
          `It's time! You are ${Voc.side(side, 'plr')}. And your move.`,
        ],
        ru: [
          `Я ждал вас! Вы играете за ${Voc.side(
            side,
            'plr/rod'
          )}, и сейчас ваш ход.`,
          `Поехали! Вам ходить. Напоминаю, что вы за ${Voc.side(
            side,
            'plr/rod'
          )}.`,
          `Давно пора! Ваш ход. Вы играете ${Voc.side(side, 'plr/tvr')}.`,
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
  static illegalMove(from: string, to: string, piece?: string): string {
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
          `The move is made! You move ${Voc.piece(pieceCode)} from ${char(
            from
          )} to ${char(to)}.`,
          `Okay, you move ${Voc.piece(pieceCode)} from ${char(from)} to ${char(
            to
          )}.`,
        ],
        ru: [
          `Ход сделан! Вы передвинули ${Voc.piece(
            pieceCode,
            'vin'
          )} с позиции ${char(from)} на ${char(to)}.`,
          `Ладно, значит вы ходите ${Voc.piece(pieceCode, 'tvr')} с ${char(
            from
          )} на ${char(to)}.`,
        ],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static playerBeat(beatedPieceCode: string): string {
    return rand(
      ({
        en: [
          `And grab ${Voc.myPiece(beatedPieceCode, 'vin')}.`,
          `And you take off ${Voc.myPiece(beatedPieceCode, 'vin')}.`,
          `And I loose ${Voc.myPiece(beatedPieceCode, 'vin')}!`,
        ],
        ru: [
          `Ко всему прочему я теряю ${Voc.myPiece(beatedPieceCode, 'vin')}.`,
          `И вы забираете ${Voc.myPiece(beatedPieceCode, 'vin')}, чёрт...`,
          `И я лишаюсь ${Voc.myPiece(beatedPieceCode, 'rod')}!`,
        ],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static enemyMove(from: string, to: string, pieceCode: string): string {
    const piece = Voc.piece(pieceCode);
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
          `Я сделаю ход ${Voc.piece(pieceCode, 'tvr')} с ${char(
            from
          )} на ${char(to)}!`,
          `А я похожу ${Voc.piece(pieceCode, 'tvr')} с ${char(from)} на ${char(
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
          `I beat ${Voc.yourPiece(beatedPieceCode, 'vin')}!`,
          `And I will take ${Voc.yourPiece(beatedPieceCode, 'vin')}!`,
          `Minus ${Voc.yourPiece(beatedPieceCode, 'vin')}.`,
        ],
        ru: [
          `${upFirst(Voc.yourPiece(beatedPieceCode, 'sin'))} теперь ${Voc.my(
            Voc.pieceGender(beatedPieceCode)
          )}!`,
          `И я лишу вас ${Voc.piece(beatedPieceCode, 'rod')}.`,
          `И я забираю ${Voc.yourPiece(beatedPieceCode, 'vin')}.`,
          `${upFirst(Voc.yourPiece(beatedPieceCode, 'vin'))} в минусе.`,
          `С вашего позволения, я забираю ${Voc.yourPiece(
            beatedPieceCode,
            'vin'
          )}.`,
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
  static cellIsEmpty(cell: string, pieceCode?: string): string {
    if (pieceCode) {
      return rand(
        ({
          en: [
            `There is no ${Voc.piece(pieceCode)} on the square ${char(cell)}! It's empty.`,
            `${Voc.piece(pieceCode)} from ${char(cell)}? Are you sure? ${char(
              cell
            )} is empty!`,
            `You confused something. In the square ${char(
              cell
            )} no chess pieces.`,
          ],
          ru: [
            `Но клетка ${char(cell)} пустая. На ней нет ${Voc.piece(pieceCode, 'rod')}!`,
            `${Voc.piece(pieceCode)} на ${char(cell)}? Но на клетке ${char(cell)} ничего нет.`,
            `На клетке ${char(
              cell
            )} нет ${Voc.piece(pieceCode, 'rod')}. На ней вообще нет фигур - это свободная клетка.`,
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
          )} is not a ${Voc.piece(playerPiece)}, but ${Voc.piece(actualPiece)}.`,
          `On the square ${char(cell)} is a ${Voc.piece(actualPiece)}, not a ${Voc.piece(playerPiece)}.`,
          `On ${char(cell)} is not a ${Voc.piece(playerPiece)}, but ${Voc.piece(actualPiece)}.`,
        ],
        ru: [
          `Но на клетке ${char(
            cell
          )} стоит не ${Voc.piece(playerPiece)}, a ${Voc.piece(actualPiece)}.`,
          `Только на клетке ${char(
            cell
          )} находится ${Voc.piece(actualPiece)}, а не ${Voc.piece(playerPiece)}.`,
          `На ${char(cell)} не ${Voc.piece(playerPiece)}, а ${Voc.piece(actualPiece)}.`,
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
    const piece = Voc.piece(pieceCode);
    return rand(
      ({
        en: [
          `And pawn transforms to ${piece}!`,
          `And now it\'s a ${piece}!`,
          `Pawn promotes into a ${piece}!`,
        ],
        ru: [
          `И пешка становится ${Voc.piece(pieceCode, 'tvr')}!`,
          `Теперь это ${piece}!`,
          `Пешка превратилась в ${Voc.piece(pieceCode, 'vin')}!`,
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
  static emptyHistory(): string {
    return rand(
      ({
        en: [
          'There is no story here, we just started a new game!',
          'The history of moves is empty, we are just started.',
          "History is empty, we didn't make any move yet.",
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
  static wrongSide(
    playerSide: ChessSide,
    from: string,
    pieceCode: string
  ): string {
    const enemySide = oppositeSide(playerSide);
    return rand(
      ({
        en: [
          `You play ${Voc.color(playerSide, 'plr')}, but on the square ${char(
            from
          )} is ${Voc.coloredPiece(pieceCode)}!`,
          `You cannot play ${Voc.coloredPiece(pieceCode)}, because it's mine!`,
          `You are for ${Voc.color(playerSide, 'plr')}, I am for ${Voc.color(
            enemySide,
            'plr'
          )}. The ${Voc.piece(pieceCode)} on ${char(from)} is ${Voc.color(
            enemySide
          )}, thus mine.`,
        ],
        ru: [
          `Вы играете за ${Voc.color(
            playerSide,
            'plr/rod'
          )}, а на клетке ${char(from)} стоит ${Voc.myPiece(pieceCode)}!`,
          `Вы не можете играть за ${Voc.piece(pieceCode, 'rod')} на ${char(
            from
          )}, она моя.`,
          `Вообще то за ${Voc.color(
            enemySide,
            'plr/rod'
          )} играю я. Вы не можете ходить моими фигурами.`,
          `Вы за ${Voc.color(playerSide, 'plr/rod')}, я за ${Voc.color(
            enemySide,
            'plr/rod'
          )}. Следите за фигурами. На ${char(from)} ${Voc.myColoredPiece(
            pieceCode
          )}.`,
        ],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static confirmEnabled(): string {
    return rand(
      ({
        en: [
          'Okay, move confirmation is now activated!',
          'Ok, now I will ask for confirmation of each your move!',
        ],
        ru: [
          'Хорошо, подтверждение ходов теперь включено.',
          'Принято! Теперь я буду спрашивать у вас подтверждение ходов.',
        ],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static confirmDisabled(): string {
    return rand(
      ({
        en: [
          'Okay, confirmation of moves in now disabled.',
          'Ok, I will no longer ask you for confirmation.',
        ],
        ru: [
          'Окей, подтверждение ходов выключено.',
          'Хорошо, я больше не буду спрашивать подтверждения для ваших ходов.',
        ],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static doNotHurry(): string {
    return rand(
      ({
        en: [
          'You can think about your move, no need to rush.',
          'Ok, I will no longer ask you for confirmation.',
          'You can think well and answer me later.',
          'You can think well and answer me later. Just don\'t forget to say "Okay, Google!".',
        ],
        ru: [
          'Вы можете подумать над своим ходом, я никуда не тороплюсь.',
          'Вы можете подумать и ответить позже, я пока ещё не планирую разряжаться.',
          'Можете подумать и ответить позже, только не забудьте сказать "Ok, Google!".',
        ],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static adviseMove(from: string, to: string, pieceCode: string): string {
    return rand(
      ({
        en: [
          `I can advise you to make a ${Voc.piece(pieceCode)} move from ${char(from)} to ${char(to)}.`,
          `If I were you, I would move a ${Voc.piece(pieceCode)} from ${char(from)} to ${char(to)}.`,
          `The ${Voc.piece(pieceCode)} move from ${char(from)} to ${char(to)} seems pretty good!`,
          `What about ${Voc.piece(pieceCode)} from ${char(from)} to ${char(to)}?`,
        ],
        ru: [
          `Могу посоветовать вам походить ${Voc.piece(pieceCode, 'tvr')} с ${char(from)} на ${char(to)}.`,
          `Я бы на вашем месте походил ${Voc.piece(pieceCode, 'tvr')} с ${char(from)} на ${char(to)}.`,
          `Вы можете сыграть ${Voc.piece(pieceCode, 'tvr')} ${char(from)} ${char(to)}.`,
          `Что насчёт хода ${Voc.piece(pieceCode, 'tvr')} с ${char(from)} на ${char(to)}?`,
        ],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
}
