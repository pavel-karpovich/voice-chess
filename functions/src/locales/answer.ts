import {
  rand,
  LocalizationObject,
  char,
  upFirst,
  WhoseSide,
} from '../support/helpers';
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
  static playerEat(eatedPieceCode: string): string {
    return rand(
      ({
        en: [
          `And grab ${Voc.myPiece(eatedPieceCode, 'vin')}.`,
          `And you take off ${Voc.myPiece(eatedPieceCode, 'vin')}.`,
          `And I loose ${Voc.myPiece(eatedPieceCode, 'vin')}!`,
          `And you eat ${Voc.myPiece(eatedPieceCode)}.`,
        ],
        ru: [
          `Ко всему прочему я теряю ${Voc.myPiece(eatedPieceCode, 'vin')}.`,
          `И вы забираете ${Voc.myPiece(eatedPieceCode, 'vin')}, чёрт...`,
          `И я лишаюсь ${Voc.myPiece(eatedPieceCode, 'rod')}!`,
          `Вы съедаете ${Voc.myPiece(eatedPieceCode, 'vin')}!`,
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
  static enemyEat(eatedPieceCode: string): string {
    return rand(
      ({
        en: [
          `I eat ${Voc.yourPiece(eatedPieceCode)}!`,
          `And I will take ${Voc.yourPiece(eatedPieceCode)}!`,
          `Minus ${Voc.yourPiece(eatedPieceCode)}.`,
          `And I captured ${Voc.yourPiece(eatedPieceCode)}!`,
          `I captured ${Voc.yourPiece(eatedPieceCode)}.`,
        ],
        ru: [
          `${upFirst(Voc.yourPiece(eatedPieceCode, 'sin'))} теперь ${Voc.my(
            Voc.pieceGender(eatedPieceCode)
          )}!`,
          `И я лишу вас ${Voc.piece(eatedPieceCode, 'rod')}.`,
          `И я забираю ${Voc.yourPiece(eatedPieceCode, 'vin')}.`,
          `${upFirst(Voc.yourPiece(eatedPieceCode, 'vin'))} уходит в минус.`,
          `С вашего позволения, я забираю ${Voc.yourPiece(
            eatedPieceCode,
            'vin'
          )}.`,
          `Я съедаю ${Voc.yourPiece(eatedPieceCode, 'vin')}!`,
        ],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static enPassantPlayer(from: string, to: string, pawn: string): string {
    return rand(
      ({
        en: [
          `En passant! You move your pawn from ${char(from)} to ${char(
            to
          )} and capture my pawn in passing to ${char(pawn)}!`,
          `En passant! You capture my pawn in passing to ${char(
            pawn
          )}! You made a move by pawn from ${char(from)} to ${char(to)}.`,
        ],
        ru: [
          `Энпассант! Вы ходите пешкой с ${char(from)} на ${char(
            to
          )} и забираете мою пешку на проходе к ${char(pawn)}!`,
          `Энпассант! Вы забираете мою пешку на проходе к ${char(
            pawn
          )} ходом ${char(from)} ${char(to)}!`,
        ],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static enPassantEnemy(from: string, to: string, pawn: string): string {
    return rand(
      ({
        en: [
          `En passant! I move my pawn from ${char(from)} to ${char(
            to
          )} and capture your pawn in passing to ${char(pawn)}!`,
          `En passant! I will capture your pawn in passing to ${char(
            pawn
          )}! My move is pawn ${char(from)} ${char(to)}.`,
        ],
        ru: [
          `Энпассант! Я хожу пешкой с ${char(from)} на ${char(
            to
          )} и забираю вашу пешку ${char(pawn)} на проходе!`,
          `Энпассант! Я заберу вашу пешку на проходе к ${char(
            pawn
          )}! Мой ход - пешка ${char(from)} ${char(to)}.`,
        ],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static castlingByPlayer(
    kFrom: string,
    kTo: string,
    rFrom: string,
    rTo: string
  ): string {
    return rand(
      ({
        en: [
          `You made castling! The king moves from square ${char(
            kFrom
          )} to ${char(kTo)} and the rock moves from ${char(rFrom)} to ${char(
            rTo
          )}!`,
          `This is castling! You move the king through two squares from ${char(
            kFrom
          )} to ${char(kTo)}, and place your rock from ${char(
            rFrom
          )} to the square ${char(rTo)} behind the king.`,
          `This move you castling, moving your king from ${char(
            kFrom
          )} to ${char(kTo)} and the rock from ${char(rFrom)} to ${char(rTo)}.`,
        ],
        ru: [
          `Вы делаете рокировку! Король перемещается с позиции ${char(
            kFrom
          )} на ${char(kTo)}, а ладья с ${rFrom} двигается за короля на ${char(
            rTo
          )}.`,
          `И это рокировка! Вы перемещаете короля на две клетки c ${char(
            kFrom
          )} на ${char(kTo)} и ставите ладью с ${char(
            rFrom
          )} за короля на ${char(rTo)}.`,
          `Этим ходом вы совершаете рокировку, перемещая своего короля с ${char(
            kFrom
          )} на ${char(kTo)} и ладью с ${char(rFrom)} на ${char(rTo)}!`,
        ],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static castlingByOpponent(
    kFrom: string,
    kTo: string,
    rFrom: string,
    rTo: string
  ): string {
    return rand(
      ({
        en: [
          `I will do castling! My king from square ${char(
            kFrom
          )} moves to ${char(kTo)} and my rock from ${char(
            rFrom
          )} moves to ${char(rTo)}!`,
          `And I make castling! I move the king from ${char(kFrom)} to ${char(
            kTo
          )}, and place the rock from ${char(rFrom)} on the square ${char(
            rTo
          )} behind the king.`,
          `I will do castling in my turn. I move my king from ${char(
            kFrom
          )} to ${char(kTo)} and rock from ${char(rFrom)} to ${char(rTo)}.`,
        ],
        ru: [
          `Я сделаю рокировку! Мой король перемещается с позиции ${char(
            kFrom
          )} на ${char(kTo)}, а ладья с ${rFrom} встаёт за короля на ${char(
            rTo
          )}.`,
          `И это рокировка! Я перемещаю короля на две клетки c ${char(
            kFrom
          )} на ${char(kTo)} и ставлю ладью с ${char(
            rFrom
          )} за короля на ${char(rTo)}.`,
          `Я совершу своим ходом рокировку, и перемещу короля с позиции ${char(
            kFrom
          )} на ${char(kTo)}, а ладью с ${char(rFrom)} на ${char(rTo)}!`,
        ],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static incorrectRankNumber(num: number): string {
    return rand(
      ({
        en: [
          `Rank ${num}? What does it mean?`,
          'You called the wrong rank number. Ranks in standard chess are numbered from 1 to 8.',
        ],
        ru: [
          `Ряда ${num} не существует в шахматах.`,
          'Вы назвали неверный номер. Ряды в шахматах нумеруются от 1 до 8.',
          'Такого ряда не существует. Нумерация идёт с 1 до 8.',
        ],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static noNextRank(): string {
    return rand(
      ({
        en: [
          'There is no next rank.',
          'It was the 8th rank.\nThere is no next rank!',
          'It was the last rank.',
        ],
        ru: [
          'Следующего ряда нет.',
          'Это был восьмой ряд.\nДальше некуда!',
          'Это был последний ряд.',
        ],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static noPrevRank(): string {
    return rand(
      ({
        en: [
          'There is no previous rank.',
          'It was the 1th rank.\nThere is no previous rank!',
          'It was the first rank on the chess board. What is the "previous"?',
        ],
        ru: [
          'Это был первый ряд, куда дальше то!',
          'Только что был первый ряд, перед ним на доске ничего нет.',
          'Это вам не программирование, в шахматах нумерация не с нуля, а с единицы идёт!',
          'Больше предыдущих нет!',
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
  static checkmateToPlayer(): string {
    return rand(
      ({
        en: [
          'You checkmate!',
          'Checkmate!',
        ],
        ru: [
          'Шах и мат!',
          'Вам шах и мат!',
        ],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static youLose(): string {
    return rand(
      ({
        en: [
          "I won! Don't worry, next time you get it!",
          "This is my victory!",
          'You lose this game, but who knows, maybe you are lucky in our next game!',
          'I defeated you!',
          'I won!',
          'This time I am a winner!',
          'You played well! But this time I became a winner!',
          "Easy-breezy. I'm joke. Nice game!",
        ],
        ru: [
          'Вы проиграли! Ничего, в другой раз всё получится.',
          'Что ж, победа за мной!',
          'И я выхожу из этой схватки победителем!',
          'Я выиграл, и это было легко!',
          'Легкая победа!',
          'Вы неплохо справлялись, но победа за мной!',
          'Вы хорошо играли! Но в этот раз победа досталсь мне.',
          'На этот раз я победил! Посмотрим, что будет дальше.',
        ],
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
  static squareIsEmpty(square: string, pieceCode?: string): string {
    if (pieceCode) {
      return rand(
        ({
          en: [
            `There is no ${Voc.piece(pieceCode)} on the square ${char(
              square
            )}! It's empty.`,
            `${upFirst(Voc.piece(pieceCode))} from ${char(
              square
            )}? Are you sure? ${char(square)} is empty!`,
            `You confused something. In the square ${char(
              square
            )} no chess pieces.`,
          ],
          ru: [
            `Но клетка ${char(square)} пустая. На ней нет ${Voc.piece(
              pieceCode,
              'rod'
            )}!`,
            `${upFirst(Voc.piece(pieceCode))} на ${char(
              square
            )}? Но на клетке ${char(square)} ничего нет.`,
            `На клетке ${char(square)} нет ${Voc.piece(
              pieceCode,
              'rod'
            )}. На ней вообще нет фигур - это свободная клетка.`,
          ],
        } as LocalizationObject<string[]>)[this.lang]
      );
    } else {
      return rand(
        ({
          en: [
            `But the square ${char(square)} is empty. There are no pieces!`,
            `Sorry, but there are no pieces on the square ${char(square)}.`,
            `The position is incorrect. The square ${char(square)} is empty!`,
          ],
          ru: [
            `Но клетка ${char(square)} пустая. На ней нет фигур.`,
            `На клетке ${char(square)} нет фигур.`,
            `Это некорректная позиция. На клетке ${char(square)} ничего нет.`,
          ],
        } as LocalizationObject<string[]>)[this.lang]
      );
    }
  }
  static piecesDontMatch(
    playerPiece: string,
    actualPiece: string,
    square: string
  ): string {
    return rand(
      ({
        en: [
          `But on the square ${char(square)} is not a ${Voc.piece(
            playerPiece
          )}, but a ${Voc.piece(actualPiece)}.`,
          `On the square ${char(square)} is a ${Voc.piece(
            actualPiece
          )}, not a ${Voc.piece(playerPiece)}.`,
          `On ${char(square)} is not a ${Voc.piece(
            playerPiece
          )}, but a ${Voc.piece(actualPiece)}.`,
        ],
        ru: [
          `Но на клетке ${char(square)} стоит не ${Voc.piece(
            playerPiece
          )}, a ${Voc.piece(actualPiece)}.`,
          `Только на клетке ${char(square)} находится ${Voc.piece(
            actualPiece
          )}, а не ${Voc.piece(playerPiece)}.`,
          `На ${char(square)} не ${Voc.piece(playerPiece)}, а ${Voc.piece(
            actualPiece
          )}.`,
        ],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static promotion(from: string, to: string): string {
    return rand(
      ({
        en: [
          `Your pawn reaches the last rank! Now you need to use promotion!`,
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
    return rand(
      ({
        en: [
          `And pawn transforms to ${Voc.piece(pieceCode)}!`,
          `And now it\'s a ${Voc.piece(pieceCode)}!`,
          `Pawn promotes into a ${Voc.piece(pieceCode)}!`,
        ],
        ru: [
          `И пешка становится ${Voc.piece(pieceCode, 'tvr')}!`,
          `Теперь это ${Voc.piece(pieceCode)}!`,
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
          `I can advise you to make a ${Voc.piece(pieceCode)} move from ${char(
            from
          )} to ${char(to)}.`,
          `If I were you, I would move a ${Voc.piece(pieceCode)} from ${char(
            from
          )} to ${char(to)}.`,
          `The ${Voc.piece(pieceCode)} move from ${char(from)} to ${char(
            to
          )} seems pretty good!`,
          `What about ${Voc.piece(pieceCode)} from ${char(from)} to ${char(
            to
          )}?`,
        ],
        ru: [
          `Могу посоветовать вам походить ${Voc.piece(
            pieceCode,
            'tvr'
          )} с ${char(from)} на ${char(to)}.`,
          `Я бы на вашем месте походил ${Voc.piece(pieceCode, 'tvr')} с ${char(
            from
          )} на ${char(to)}.`,
          `Вы можете сыграть ${Voc.piece(pieceCode, 'tvr')} ${char(
            from
          )} ${char(to)}.`,
          `Что насчёт хода ${Voc.piece(pieceCode, 'tvr')} с ${char(
            from
          )} на ${char(to)}?`,
        ],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static playerAutoMove(): string {
    return rand(
      ({
        en: [
          'As you wish. I make a move instead of you.',
          'Ok, I make your move instead of you.',
          "Okay, I'll make a move for you.",
          'Move instead of you? Easy!',
          'If you sure, I can do it.',
        ],
        ru: [
          'Ну, раз вы так хотите, я могу сделать ход за вас.',
          'Хорошо, сейчас я похожу за вас.',
          'Хорошо, я похожу за вас.',
          'Ладно, я сделаю ваш ход вместо вас.',
          'Походить за вас? Запросто!',
        ],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static noMoveToCorrect(): string {
    return rand(
      ({
        en: [
          'To change the last move, you need to have the last move.',
          'You just started a new game. What are you talking about?',
          'You have not made any move yet!',
          "But you just started a new game. You don't made a first move yet!",
          'First make at least one move, to have something to change.',
        ],
        ru: [
          'Чтобы изменить предыдущий ход, нужно чтобы предыдущий ход был!',
          'Мы только начали новую игру. О чём речь?',
          'Вы ещё не сделали ни одного хода.',
          'В этой игре вы ещё не сделали ни одного хода.',
          'Сначала сделайте хоть один ход, чтобы было что исправлять.',
        ],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static cantCastling(): string {
    return rand(
      ({
        en: [
          "You can't castling now!",
          'For castling you need untouched king and rock and no pieces between them.',
          "You can't castling from the current position!",
          "Castling? But you can't castling now!",
        ],
        ru: [
          'Вы не можете сыграть рокировку сейчас!',
          'Для рокировки у вас должны быть нетронутые король и ладья, между которыми не должно быть ни одной фигуры.',
          'Вы не можете сделать рокировку из такой позиции!',
          'Рокировка? Но вы не можете сейчас сделать рокировку.',
        ],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static twoTypesOfCastling(king: string, to1: string, to2: string): string {
    let result = `${Voc.canMakeCastling(king)} ${Voc.castlingTo(to1)}`;
    result += ` ${Voc.and()} ${Voc.castlingTo(to2)}.`;
    return result;
  }
  static emptyPosition(pos: string): string {
    return rand(
      ({
        en: [
          `${char(pos)} is free.`,
          `Square ${char(pos)} is empty!`,
          `There is no piece on the square ${char(pos)}.`,
          `Square ${char(pos)} is not occupied by anyone.`,
        ],
        ru: [
          `Клетка ${char(pos)} свободна.`,
          `Клетка ${char(pos)} никем не занята.`,
          `На клетке ${char(pos)} ничего нет.`,
          `Клетка ${char(pos)} пустая.`,
        ],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static hereIsPieceOnPosition(
    pos: string,
    pieceCode: string,
    side: ChessSide
  ): string {
    return rand(
      ({
        en: [
          `On ${char(pos)} is ${Voc.someonesColoredPiece(pieceCode, side)}.`,
          `On the square ${char(pos)} is the ${Voc.someonesPiece(
            pieceCode,
            side
          )}.`,
          `Position ${char(pos)} is occupied by ${Voc.someonesColoredPiece(
            pieceCode,
            side
          )}.`,
          `Here is ${Voc.someonesColoredPiece(pieceCode, side)}.`,
          `On the square ${char(pos)} stands ${Voc.someonesColoredPiece(
            pieceCode,
            side
          )}.`,
        ],
        ru: [
          `На ${char(pos)} ${Voc.someonesColoredPiece(pieceCode, side)}.`,
          `На клетке ${char(pos)} стоит ${Voc.someonesColoredPiece(
            pieceCode,
            side
          )}.`,
          `Позиция ${char(pos)} занята ${Voc.someonesPiece(
            pieceCode,
            side,
            'rod'
          )}.`,
          `Здесь находится ${Voc.someonesPiece(pieceCode, side)}.`,
          `На квадрате ${char(pos)} находится ${Voc.someonesPiece(
            pieceCode,
            side
          )}.`,
        ],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static noSuchPieces(pieceCode: string, whose?: WhoseSide): string {
    const pNum = Voc.pieceNumber(pieceCode);
    if (!!whose) {
      return rand(
        ({
          en: [
            `${upFirst(Voc.youOrMe(whose))} have no more ${Voc.piece(
              pieceCode,
              pNum
            )} left.`,
            `${upFirst(Voc.yourOrMy(pieceCode, whose, pNum))} ${Voc.piece(
              pieceCode,
              pNum
            )} are no longer on the board.`,
            `${upFirst(Voc.youOrMe(whose))} no longer have ${Voc.piece(
              pieceCode,
              pNum
            )}.`,
            `${upFirst(Voc.allYourOrMy(pieceCode, whose, pNum))} ${Voc.piece(
              pieceCode,
              pNum
            )} are already captured.`,
          ],
          ru: [
            `У ${Voc.youOrMe(whose)} не осталось ${Voc.piece(
              pieceCode,
              `${pNum}/rod`
            )}.`,
            `${upFirst(
              Voc.whosePiece(pieceCode, whose, `${pNum}/rod`)
            )} больше нет на поле.`,
            `У ${Voc.youOrMe(whose)} больше нет ${Voc.piece(
              pieceCode,
              `${pNum}/rod`
            )}.`,
            `${upFirst(Voc.allYourOrMy(pieceCode, whose, pNum))} ${Voc.piece(
              pieceCode,
              `${pNum}/rod`
            )} уже захвачены.`,
          ],
        } as LocalizationObject<string[]>)[this.lang]
      );
    } else {
      return rand(
        ({
          en: [
            `There is no ${Voc.coloredPiece(pieceCode, pNum)}.`,
            `There is no ${Voc.coloredPiece(pieceCode, pNum)} on the board.`,
            `No one ${Voc.coloredPiece(pieceCode)} left.`,
            `There is no ${Voc.coloredPiece(
              pieceCode,
              pNum
            )} left in the game.`,
          ],
          ru: [
            `На поле не осталось ${Voc.coloredPiece(
              pieceCode,
              `${pNum}/rod`
            )}.`,
            `На доске нет ${Voc.coloredPiece(pieceCode, `${pNum}/rod`)}.`,
            `Здесь больше нет ${Voc.coloredPiece(pieceCode, `${pNum}/rod`)}.`,
            `${upFirst(
              Voc.coloredPiece(pieceCode, `${pNum}/rod`)
            )} не осталось в игре.`,
          ],
        } as LocalizationObject<string[]>)[this.lang]
      );
    }
  }
  static noCapturedPieces(): string {
    return rand(
      ({
        en: [
          'We have no captured pieces at all!',
          'This game has not been a single capture yet!',
          'We just started, and have not eaten yet a single piece.',
          'Neither you nor I, no captured pieces.',
        ],
        ru: [
          'Ещё не было захвачено ни одной фигуры!',
          'В текущей игре ещё не было ни одного захвата!',
          'Мы только начали, ещё не было съедено ни одной фигуры!',
          'Ни у вас, ни у меня, ещё нет съеденных фигур.',
        ],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static wtfYouAreJustStartedANewGame(): string {
    return rand(
      ({
        en: [
          "But the game has just begun! It's early to throw up your hands!",
          'Seriously? We just started! Early to give up!',
          "But it's a beginning of the game! You can't surrender now!",
          "What? Resign now? This is too early! We haven't even played out yet!",
        ],
        ru: [
          'Вы смеётесь? Игра только началась! Рано опускать руки.',
          'Серьёзно? Мы только начали! Ещё рано сдаваться!',
          'Что это за выкрутасы? Мы не успели начать, а вы уже наровите от меня смыться. Нет уж, продолжайте играть!',
          'Да мы же только в самом начале! У вас ещё есть все шансы победить - продолжайте игру.',
          'Ты сможешь сдаться только когда я разрешу. Понял?',
        ],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
}
