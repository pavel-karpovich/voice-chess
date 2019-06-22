import { rand, char, upFirst } from '../support/helpers';
import { ChessSide, WhoseSide, oppositeSide, getSide } from '../chess/chessUtils';
import { Langs, rLangs } from './struct/struct';
import { Vocabulary as Voc } from './vocabulary';
import { Phrases as Phr } from './phrases';

// prettier-ignore
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
        'доступных командах произнесите "Помощь" или "Справка".',
    } as Langs)[this.lang];
  }
  static welcome(): string {
    return rand(
      ({
        en: [
          'Welcome to the Voice Chess!',
          'Hi!',
          'Voice Chess welcomes you!',
          'Chessy chessy chess! Welcome back!',
          'Welcome back, grandmaster!',
          'Want to play chess? This we can.',
          'Hi, I have not seen you for a while!',
        ],
        ru: [
          'Добро пожаловать в Голосовые Шахматы!',
          'С возвращением!',
          'С возвращением, гроссмейстер!',
          'Соскучились по шахматам? Я ждал вас.',
          'С возвращением в Голосовые Шахматы!',
          'Привет!',
          'Рад вас видеть, гроссмейстер!',
        ],
      } as rLangs)[this.lang]
    );
  }
  static continueGame(side: ChessSide, lastMove: string): string {
    const from = lastMove.slice(0, 2);
    const to = lastMove.slice(2, 4);
    return rand(
      ({
        en: [
          `I was waiting for you! You play ${Voc.side(side)}. Now it's your turn.`,
          `Let's go! Your turn. I remind, that you play ${Voc.side(side)}.`,
          `It's time! You are ${Voc.side(side, 'plr')}. And now it's your turn.`,
          `Well, we continue our game. I remind you that last time I made the  move ${char(from)} ${char(to)}, and now your turn.`,
          `Good, let's continue! We stopped at my turn ${char(from)} ${char(to)}. What are you going to do?`,
        ],
        ru: [
          `Я ждал вас! Вы играете за ${Voc.side(side, 'plr/rod')}, и сейчас ваш ход.`,
          `Поехали! Напоминаю, что вы за ${Voc.side(side, 'plr/rod')} и сейчас ваш ход.`,
          `Давно пора! Ваш ход. Вы играете ${Voc.side(side, 'plr/tvr')}.`,
          `Значит продолжаем. Напомню, что последний раз я сделал ход ${char(from)} ${char(to)}, и сейчас ваша очередь.`,
          `Отлично, давайте продолжим! Мы остановились на моём ходе ${char(from)} ${char(to)}. Что вы будете делать?`,
        ],
      } as rLangs)[this.lang]
    );
  }
  static continueNewGame(side: ChessSide): string {
    return rand(
      ({
        en: [
          "Well, let's continue. By the way, we have not made any move yet.",
          'So, we continue, you are for white. All pieces in the original positions. We have not made any move yet.',
          'Continue the game? Ok, but we have just begun, and no one has yet made a single move.',
        ],
        ru: [
          'Значит продолжаем. Между прочим, мы ещё не сделали ни одного хода.',
          'Продолжаем, вы за белых. Все фигуры на начальных позициях. Мы ещё не сделали ни одного хода.',
          'А продолжать то практически и нечего - мы начали новую игру, и вы ещё не сделали в ней ни одного хода',
        ],
      } as rLangs)[this.lang]
    );
  }
  static newgame(): string {
    return rand(
      ({
        en: [
          'New game is started.',
          "Let's go, I cleared the board.",
          'Ok.',
          'Ok, we start a new game.',
          'We are starting a new game from scratch.',
          'So, new game!',
          "Let's go! It's a new game.",
        ],
        ru: [
          'Новая игра запущена.',
          'Поехали!. Новая игра.',
          'Всегда рад новой партейке!',
          'Ладно, мы начинаем новую партию!',
          'Что ж, да начнётся новая игра!',
          'Тогда мы начинаем!',
          'Новую игру в студию!',
        ],
      } as rLangs)[this.lang]
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
      } as rLangs)[this.lang]
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
          "I don't get it.",
          'What do you mean?',
          "What it's mean?",
          "I don't know what to answer",
          "I don't know what to say about this",
          "Are you sure this is what you want from me?",
        ],
        ru: [
          'Я вас не совсем понял...',
          'Повторите, пожалуйста.',
          'Можно ещё раз?',
          'Не могли бы вы повторить?',
          'Я вас не понял.',
          'Что вы хотели этим сказать?',
          'Что это значит?',
          'Я даже не знаю, что сказать.',
          'Я даже не знаю, как на это ответить',
          'Я не знаю, как мне на это отреагировать...',
        ],
      } as rLangs)[this.lang]
    );
  }
  static secondFallbackInGame(): string {
    return rand(
      ({
        en: [
          'May I ask you, maybe you want to make a move?',
          'Just make a move, amigo.',
          `Just say "Make a move", or something like ${char('g2')} ${char('g4')}.`,
          'You kidding me?',
          'Are you joking?',
          "Are you specifically asking me about something extra? I'm just a robot chess player.",
          "I'm a robot chess player, and I can't do anything except chess.",
          "Don't ask me about anything, I'm not Google Assistant, I'm just a poor robot chess player.",
          `If you want to make a move, just say it. Fore example, pawn ${char('a7')} ${char('a5')}.`,
        ],
        ru: [
          'Может быть вы хотите сделать ход?',
          'Может вы хотите походить?',
          `Просто скажите "Сделать ход", или назовите ход, например ${char('g2')} ${char('g4')}.`,
          'Вы шутите?',
          'Вы специально спрашиваете меня о чём-то лишнем? Я просто робот шахматист.',
          'Я робот шахматист, и не умею ничего кроме шахмат.',
          'Не спрашивайте меня ни о чём постороннем, я не Google Ассистент, я просто бедный робот шахматист.',
          `Если вы хотите походить, то просто назовите свой ход. Например так: пешка ${char('a7')} ${char('a5')}.`,
        ],
      } as rLangs)[this.lang]
    );
  }
  static secondFallbackOutOfGame(): string {
    return rand(
      ({
        en: [
          'You kidding me?',
          'Are you joking?',
          "Are you specifically asking me about something extra? I'm just a robot chess player.",
          "I'm a robot chess player, and I can't do anything except chess.",
          "Don't ask me about anything, I'm not Google Assistant, I'm just a poor robot chess player.",
          'Just say that you want to start a new game, and we will play chess.',
          'This can no longer continue! Or start a new game, or exit!',
          `Please say "Let's start a new game", otherwise we will have to go to extremes!`,
        ],
        ru: [
          'Вы шутите?',
          'Вы специально спрашиваете меня о чём-то лишнем? Я просто робот шахматист.',
          'Я робот шахматист, и не умею ничего кроме шахмат.',
          'Не спрашивайте меня ни о чём постороннем, я не Google Ассистент, я просто бедный робот шахматист.',
          'Просто скажите, что вы хотите начать новую игру, и мы начнём.',
          'Так не может продолжаться долго! Или начинайте новую игру, или заканчивайте.',
          'Скажите "Давай начнём новую игру", или нам придётся дойти до крайностей!',
        ],
      } as rLangs)[this.lang]
    );
  }
  static thirdFallback(): string {
    return rand(
      ({
        en: [
          "Sorry, I didn't understand what you want.",
          "I'm sorry, I didn't understand.",
          "I can't understand.",
          "I still don't understand.",
          "Sorry, I'm still didn't understand what you want.",
          'I just show you the help options...',
          "I don't know what to do, and just show you the help options...",
        ],
        ru: [
          'Простите, я не могу понять, чего вы хотите.',
          'Извините, я не могу понять, о чём вы говорите.',
          'Я никак не могу вас понять.',
          'Видимо это бесполезно.',
          'Нет, никак... Тогда я просто зачитаю вам справку:',
          'Не знаю ,что и делать, вот вам справка:',
          'Я не знаю, что с вами делать. Просто покажу вам справку:',
        ],
      } as rLangs)[this.lang]
    );
  }
  static confusedExit(): string {
    return rand(
      ({
        en: [
          "Sorry, but I can't understand what you want.\nMaybe try again later...",
          "It is a chess game. Is that exactly what you need?\nI'm not sure...",
          'Sorry, try again later.',
          'Come back when you are ready to play chess!',
          'Come back when you decide to play chess and not something else!',
          'Sorry, It was not normal, I hope this will not happen again.',
          'Sorry, It was strange. I hope this will not happen here again.',
        ],
        ru: [
          'Извините, но я совсем не могу вас понять.\nПопробуйте позже.',
          'Может быть в другой раз...',
          'Это игра в шахматы. Вы точно попали куда нужно?\nЯ не уверен.',
          'Возвращайтесь, когда будет настроены играть в шахматы!',
          'Приходите, когда решите сыграть в шахматы, а не во что-то другое!',
          'Это было не нормально, надеюсь, такого больше не повторится',
          'Это было странно. Я надеюсь, у нас такого больше не произойдет.',
        ],
      } as rLangs)[this.lang]
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
      } as rLangs)[this.lang]
    );
  }
  static board2(): string {
    return rand(
      ({
        en: ['The second part of the board: '],
        ru: ['Вторая половина доски: '],
      } as rLangs)[this.lang]
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
      } as rLangs)[this.lang]
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
      } as rLangs)[this.lang]
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
          `Вы не можете ходить с ${Voc.square(from, 'rod')} на ${Voc.square(to, 'vin')}.`,
          'Нельзя так ходить!',
          `${char(from)} ${char(to)}... Это некорректный ход.`,
        ],
      } as rLangs)[this.lang]
    );
  }
  static playerMove(from: string, to: string, pieceCode: string): string {
    return rand(
      ({
        en: [
          `The move is made! You move ${Voc.piece(pieceCode)} from ${Voc.square(from)} to ${Voc.square(to)}.`,
          `Okay, you move ${Voc.piece(pieceCode)} from ${Voc.square(from)} to ${Voc.square(to)}.`,
        ],
        ru: [
          `Ход сделан! Вы передвинули ${Voc.piece(pieceCode, 'vin')} с ${Voc.square(from, 'rod')} на ${Voc.square(to, 'vin')}.`,
          `Ладно, значит вы ходите ${Voc.piece(pieceCode, 'tvr')} с ${Voc.square(from, 'rod')} на ${Voc.square(to, 'vin')}.`,
        ],
      } as rLangs)[this.lang]
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
      } as rLangs)[this.lang]
    );
  }
  static enemyMove(from: string, to: string, pieceCode: string): string {
    return rand(
      ({
        en: [
          `I would move a ${Voc.piece(pieceCode)} from ${Voc.square(from)} to ${Voc.square(to)}!`,
          `My move is a ${Voc.piece(pieceCode)} from ${Voc.square(from)} to ${Voc.square(to)}! And what do you say to that?`,
          `I move my ${Voc.piece(pieceCode)} from ${Voc.square(from)} to ${Voc.square(to)}.`,
        ],
        ru: [
          `Мой ход таков: ${Voc.piece(pieceCode)} с ${Voc.square(from, 'rod')} на ${Voc.square(to, 'vin')}.`,
          `Так. Пожалуй, я отвечу ${Voc.piece(pieceCode)} ${char(from)} ${char(to)}.`,
          `Я сделаю ход ${Voc.piece(pieceCode, 'tvr')} с ${Voc.square(from, 'rod')} на ${Voc.square(to, 'vin')}!`,
          `А я похожу ${Voc.piece(pieceCode, 'tvr')} с ${Voc.square(from, 'rod')} на ${Voc.square(to, 'vin')}.`,
        ],
      } as rLangs)[this.lang]
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
          `${upFirst(Voc.yourPiece(eatedPieceCode, 'sin'))} теперь ${Voc.my(Voc.pieceGender(eatedPieceCode))}!`,
          `И я лишу вас ${Voc.piece(eatedPieceCode, 'rod')}.`,
          `И я забираю ${Voc.yourPiece(eatedPieceCode, 'vin')}.`,
          `${upFirst(Voc.yourPiece(eatedPieceCode, 'vin'))} уходит в минус.`,
          `С вашего позволения, я забираю ${Voc.yourPiece(eatedPieceCode, 'vin')}.`,
          `Я съедаю ${Voc.yourPiece(eatedPieceCode, 'vin')}!`,
        ],
      } as rLangs)[this.lang]
    );
  }
  static enPassantPlayer(from: string, to: string, pawn: string): string {
    return rand(
      ({
        en: [
          `En passant! You move your pawn from ${Voc.square(from)} to ${Voc.square(to)} and capture my pawn in passing to ${Voc.square(pawn)}!`,
          `En passant! You capture my pawn in passing to ${Voc.square(pawn)}! You made a move by pawn from ${Voc.square(from)} to ${Voc.square(to)}.`,
        ],
        ru: [
          `Энпассант! Вы ходите пешкой с ${Voc.square(from, 'rod')} на ${Voc.square(to, 'vin')} и забираете мою пешку на проходе к ${Voc.square(pawn, 'dat')}!`,
          `Энпассант! Вы забираете мою пешку на проходе к ${Voc.square(pawn, 'dat')} ходом ${char(from)} ${char(to)}!`,
        ],
      } as rLangs)[this.lang]
    );
  }
  static enPassantEnemy(from: string, to: string, pawn: string): string {
    return rand(
      ({
        en: [
          `En passant! I move my pawn from ${Voc.square(from)} to ${Voc.square(to)} and capture your pawn in passing to ${Voc.square(pawn)}!`,
          `En passant! I will capture your pawn in passing to ${Voc.square(pawn)}! My move is pawn ${Voc.square(from)} ${Voc.square(to)}.`,
        ],
        ru: [
          `Энпассант! Я хожу пешкой с ${Voc.square(from, 'rod')} на ${Voc.square(to, 'vin')} и забираю вашу пешку ${char(pawn)} на проходе!`,
          `Энпассант! Я заберу вашу пешку на проходе к ${Voc.square(pawn, 'dat')}! Мой ход - пешка ${char(from)} ${char(to)}.`,
        ],
      } as rLangs)[this.lang]
    );
  }
  static castlingByPlayer(kFrom: string, kTo: string, rFrom: string, rTo: string): string {
    return rand(
      ({
        en: [
          `You made castling! The king moves from ${Voc.square(kFrom)} to ${Voc.square(kTo)} and the rock moves from ${Voc.square(rFrom)} to ${Voc.square(rTo)}!`,
          `This is castling! You move the king through two squares from ${Voc.square(kFrom)} to ${Voc.square(kTo)}, and place your rock from ${Voc.square(rFrom)} to ${Voc.square(rTo)} behind the king.`,
          `This move you castling, moving your king from ${Voc.square(kFrom)} to ${Voc.square(kTo)} and the rock from ${Voc.square(rFrom)} to ${Voc.square(rTo)}.`,
        ],
        ru: [
          `Вы делаете рокировку! Король перемещается с ${Voc.square(kFrom, 'rod')} на ${Voc.square(kTo, 'vin')}, а ладья с ${Voc.square(rFrom, 'rod')} двигается за короля на ${Voc.square(rTo, 'vin')}.`,
          `И это рокировка! Вы перемещаете короля на две клетки c ${char(kFrom)} на ${Voc.square(kTo, 'vin')} и ставите ладью с ${Voc.square(rFrom, 'rod')} за своего короля, на ${Voc.square(rTo, 'vin')}.`,
          `Этим ходом вы совершаете рокировку, перемещая своего короля с ${Voc.square(kFrom, 'rod')} на ${Voc.square(kTo, 'vin')} и ладью с ${Voc.square(rFrom, 'rod')} на ${Voc.square(rTo, 'vin')}!`,
        ],
      } as rLangs)[this.lang]
    );
  }
  static castlingByOpponent(kFrom: string, kTo: string, rFrom: string, rTo: string): string {
    return rand(
      ({
        en: [
          `I will do castling! My king from ${Voc.square(kFrom)} moves to ${Voc.square(kTo)} and my rock from ${Voc.square(rFrom)} moves to ${Voc.square(rTo)}!`,
          `And I make castling! I move the king from ${Voc.square(kFrom)} to ${Voc.square(kTo)}, and place the rock from ${Voc.square(rFrom)} on ${Voc.square(rTo)} behind the king.`,
          `I will do castling in my turn. I move my king from ${Voc.square(kFrom)} to ${Voc.square(kTo)} and rock from ${Voc.square(rFrom)} to ${Voc.square(rTo)}.`,
        ],
        ru: [
          `Я сделаю рокировку! Мой король перемещается с ${Voc.square(kFrom, 'rod')} на ${Voc.square(kTo, 'vin')}, а ладья с ${Voc.square(rFrom, 'rod')} встаёт за короля на ${Voc.square(rTo, 'vin')}.`,
          `И это рокировка! Я перемещаю короля на две клетки c ${char(kFrom)} на ${Voc.square(kTo, 'vin')} и ставлю ладью с ${Voc.square(rFrom, 'rod')} за своего короля, на ${Voc.square(rTo, 'vin')}.`,
          `Я совершу своим ходом рокировку, и перемещу короля с ${Voc.square(kFrom, 'rod')} на ${Voc.square(kTo, 'vin')}, а ладью с ${Voc.square(rFrom, 'rod')} на ${Voc.square(rTo, 'vin')}!`,
        ],
      } as rLangs)[this.lang]
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
      } as rLangs)[this.lang]
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
      } as rLangs)[this.lang]
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
      } as rLangs)[this.lang]
    );
  }
  static whiteSide(): string {
    return rand(
      ({
        en: [
          'Your side is White.\nAnd your turn is first!',
        ],
        ru: [
          'Ваша сторона - Белая.\nПервый ход за вами.', 
          'Вы за белых, ходите первыми.',
        ],
      } as rLangs)[this.lang]
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
      } as rLangs)[this.lang]
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
          `Сейчас уровень сложности равен ${current}.`,
        ],
      } as rLangs)[this.lang]
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
      } as rLangs)[this.lang]
    );
  }
  static difficultyTheSame(level: number): string {
    return rand(
      ({
        en: [
          `The difficulty level is already ${level}!`,
        ],
        ru: [
          `Уровень сложности уже равен ${level}!`,
          'Сложность и так такая!',
        ],
      } as rLangs)[this.lang]
    );
  }
  static checkmateToPlayer(): string {
    return rand(
      ({
        en: ['You checkmate!', 'Checkmate!'],
        ru: ['Шах и мат!', 'Вам шах и мат!'],
      } as rLangs)[this.lang]
    );
  }
  static youLose(): string {
    return rand(
      ({
        en: [
          "I won! Don't worry, next time you get it!",
          'This is my victory!',
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
      } as rLangs)[this.lang]
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
      } as rLangs)[this.lang]
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
      } as rLangs)[this.lang]
    );
  }
  static checkToEnemy(): string {
    return rand(
      ({
        en: ['And you set me a check!'],
        ru: ['И тем самым вы ставите мне шах!'],
      } as rLangs)[this.lang]
    );
  }
  static checkToPlayer(): string {
    return rand(
      ({
        en: ['Check to your king!'],
        ru: ['Вам шах.'],
      } as rLangs)[this.lang]
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
      } as rLangs)[this.lang]
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
      } as rLangs)[this.lang]
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
      } as rLangs)[this.lang]
    );
  }
  static squareIsEmpty(square: string, pieceCode?: string): string {
    if (pieceCode) {
      return rand(
        ({
          en: [
            `There is no ${Voc.piece(pieceCode)} on ${Voc.square(square)}! It's empty.`,
            `${upFirst(Voc.piece(pieceCode))} from ${Voc.square(square)}? Are you sure? ${upFirst(Voc.square(square))} is empty!`,
            `You confused something. There is no chess pieces on ${Voc.square(square)}.`,
          ],
          ru: [
            `Но клетка ${char(square)} пустая. На ней нет ${Voc.piece(pieceCode, 'rod')}!`,
            `${upFirst(Voc.piece(pieceCode))} ${Voc.on(square)}? Но ${Voc.on(square)} ничего нет.`,
            `${upFirst(Voc.on(square))} нет ${Voc.piece(pieceCode, 'rod')}. На ней вообще нет фигур - это свободная клетка.`,
          ],
        } as rLangs)[this.lang]
      );
    } else {
      return rand(
        ({
          en: [
            `But ${Voc.square(square)} is empty. There are no pieces!`,
            `Sorry, but there are no pieces on ${Voc.square(square)}.`,
            `The position is incorrect. ${upFirst(Voc.square(square))} is empty!`,
          ],
          ru: [
            `Но клетка ${char(square)} пустая. На ней нет фигур.`,
            `${upFirst(Voc.on(square))} нет фигур.`,
            `Это некорректная позиция. ${upFirst(Voc.on(square))} ничего нет.`,
          ],
        } as rLangs)[this.lang]
      );
    }
  }
  static piecesDontMatch(playerPiece: string, actualPiece: string, square: string): string {
    return rand(
      ({
        en: [
          `But ${Voc.on(square)} is not a ${Voc.piece(playerPiece)}, but a ${Voc.piece(actualPiece)}.`,
          `${upFirst(Voc.on(square))} is a ${Voc.piece(actualPiece)}, not a ${Voc.piece(playerPiece)}.`,
          `${upFirst(Voc.on(square))} is not a ${Voc.piece(playerPiece)}, but a ${Voc.piece(actualPiece)}.`,
        ],
        ru: [
          `Но ${Voc.on(square)} стоит не ${Voc.piece(playerPiece)}, a ${Voc.piece(actualPiece)}.`,
          `Только ${Voc.on(square)} находится ${Voc.piece(actualPiece)}, а не ${Voc.piece(playerPiece)}.`,
          `${upFirst(Voc.on(square))} не ${Voc.piece(playerPiece)}, а ${Voc.piece(actualPiece)}.`,
        ],
      } as rLangs)[this.lang]
    );
  }
  static promotion(from: string, to: string): string {
    return rand(
      ({
        en: [
          `Your pawn reaches the last rank! Now you need to use promotion!`,
          `When your pawn moves from ${Voc.square(from)} to ${Voc.square(to)}, there will be a promotion!`,
          `It is time to Pawn promotion!`,
          `Pawn promotion!`,
        ],
        ru: [
          `Ваша Пешка дошла до последнего ряда. Теперь её можно превратить в другую фигуру!`,
          `При переходе Пешки с ${Voc.square(from, 'rod')} на ${Voc.square(to, 'vin')} происходит превращение!`,
          `Время превращения пешки!`,
          `Повышение пешки!`,
        ],
      } as rLangs)[this.lang]
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
      } as rLangs)[this.lang]
    );
  }
  static itsAll(): string {
    return rand(
      ({
        en: [
          "It's all.",
          'And it is the end.',
          'And that was the last item.',
        ],
        ru: [
          'И это всё.',
          'Все, это конец.',
          'Это всё, что есть.',
        ],
      } as rLangs)[this.lang]
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
      } as rLangs)[this.lang]
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
      } as rLangs)[this.lang]
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
          `Но мы не сделали столько ходов. Лишь ${num}:`,
          `У нас всего ${num} ходов в истории:`,
          `${invNum} ходов я физически не могу назвать, но вот ${num} - пожалуйста.`,
          'Это больше чем было за всю игру. Я перечислю вам всё, что есть.',
          `За всю игру было только ${num} ходов. Так что больше чем ${num} я вам не назову.`,
        ],
      } as rLangs)[this.lang]
    );
  }
  static wrongSide(playerSide: ChessSide, from: string, pieceCode: string): string {
    const enemySide = oppositeSide(playerSide);
    return rand(
      ({
        en: [
          `You play ${Voc.color(playerSide, 'plr')}, but ${Voc.on(from)} is ${Voc.myColoredPiece(pieceCode)}!`,
          `You cannot play ${Voc.coloredPiece(pieceCode)}, because it's mine!`,
          `You are for ${Voc.color(playerSide, 'plr')}, I am for ${Voc.color(enemySide, 'plr')}. The ${Voc.piece(pieceCode)} ${Voc.on(from)} is ${Voc.color(enemySide)}, thus mine.`,
        ],
        ru: [
          `Вы играете за ${Voc.color(playerSide, 'plr/rod')}, а ${Voc.on(from)} стоит ${Voc.myPiece(pieceCode)}!`,
          `Вы не можете играть за ${Voc.piece(pieceCode, 'rod')} ${Voc.on(from)}, она моя.`,
          `Вообще то за ${Voc.color(enemySide, 'plr/rod')} играю я. Вы не можете ходить моими фигурами.`,
          `Вы за ${Voc.color(playerSide, 'plr/rod')}, я за ${Voc.color(enemySide, 'plr/rod')}. Следите за фигурами. ${upFirst(Voc.on(from))} ${Voc.myColoredPiece(pieceCode)}.`,
        ],
      } as rLangs)[this.lang]
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
      } as rLangs)[this.lang]
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
      } as rLangs)[this.lang]
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
      } as rLangs)[this.lang]
    );
  }
  static adviseMove(from: string, to: string, pieceCode: string): string {
    return rand(
      ({
        en: [
          `I can advise you to make a ${Voc.piece(pieceCode)} move from ${Voc.square(from)} to ${Voc.square(to)}.`,
          `If I were you, I would move a ${Voc.piece(pieceCode)} from ${Voc.square(from)} to ${Voc.square(to)}.`,
          `The ${Voc.piece(pieceCode)} move from ${Voc.square(from)} to ${Voc.square(to)} seems pretty good!`,
          `What about ${Voc.piece(pieceCode)} from ${Voc.square(from)} to ${Voc.square(to)}?`,
        ],
        ru: [
          `Могу посоветовать вам походить ${Voc.piece(pieceCode, 'tvr')} с ${Voc.square(from, 'rod')} на ${Voc.square(to, 'vin')}.`,
          `Я бы на вашем месте походил ${Voc.piece(pieceCode, 'tvr')} с ${Voc.square(from, 'rod')} на ${Voc.square(to, 'vin')}.`,
          `Вы можете сыграть ${Voc.piece(pieceCode, 'tvr')} ${char(from)} ${char(to)}.`,
          `Что насчёт хода ${Voc.piece(pieceCode, 'tvr')} с ${Voc.square(from, 'rod')} на ${Voc.square(to, 'vin')}?`,
        ],
      } as rLangs)[this.lang]
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
      } as rLangs)[this.lang]
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
      } as rLangs)[this.lang]
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
      } as rLangs)[this.lang]
    );
  }
  static twoTypesOfCastling(king: string, to1: string, to2: string): string {
    let result = `${Phr.canMakeCastling(king)} ${Phr.castlingTo(to1)}`;
    result += ` ${Voc.and()} ${Phr.castlingTo(to2)}.`;
    return result;
  }
  static emptyPosition(pos: string): string {
    return rand(
      ({
        en: [
          `${upFirst(Voc.square(pos))} is free.`,
          `${upFirst(Voc.square(pos))} is empty!`,
          `There is no piece ${Voc.on(pos)}.`,
          `${upFirst(Voc.square(pos))} is not occupied by anyone.`,
        ],
        ru: [
          `${upFirst(Voc.square(pos))} свободна.`,
          `${upFirst(Voc.square(pos))} никем не занята.`,
          `${upFirst(Voc.on(pos))} ничего нет.`,
          `${upFirst(Voc.square(pos))} пустая.`,
        ],
      } as rLangs)[this.lang]
    );
  }
  static hereIsPieceOnPosition(pos: string, pieceCode: string, side: ChessSide): string {
    const whose = getSide(pieceCode) === side ? WhoseSide.PLAYER : WhoseSide.ENEMY;
    return rand(
      ({
        en: [
          `${upFirst(Voc.on(pos))} is ${Voc.someonesColoredPiece(pieceCode, side)}.`,
          `${upFirst(Voc.on(pos))} is the ${Voc.someonesPiece(whose, pieceCode)}.`,
          `${upFirst(Voc.square(pos))} is occupied by ${Voc.someonesColoredPiece(pieceCode, side)}.`,
          `Here is ${Voc.someonesColoredPiece(pieceCode, side)}.`,
          `${upFirst(Voc.square(pos))} stands ${Voc.someonesColoredPiece(pieceCode, side)}.`,
        ],
        ru: [
          `${upFirst(Voc.on(pos))} ${Voc.someonesColoredPiece(pieceCode, side)}.`,
          `${upFirst(Voc.on(pos))} стоит ${Voc.someonesColoredPiece(pieceCode, side)}.`,
          `${upFirst(Voc.square(pos))} занята ${Voc.someonesPiece(whose, pieceCode, 'tvr')}.`,
          `Здесь находится ${Voc.someonesPiece(whose, pieceCode)}.`,
          `${upFirst(Voc.on(pos))} находится ${Voc.someonesPiece(whose, pieceCode)}.`,
        ],
      } as rLangs)[this.lang]
    );
  }
  static noSuchPieces(pieceCode: string, who?: WhoseSide): string {
    const pNum = Voc.pieceMaxNumber(pieceCode);
    if (!!who) {
      return rand(
        ({
          en: [
            `${upFirst(Voc.youOrMe(who))} have no more ${Voc.piece(pieceCode, pNum)} left.`,
            `${upFirst(Voc.yourOrMy(pieceCode, who, pNum))} ${Voc.piece(pieceCode, pNum)} are no longer on the board.`,
            `${upFirst(Voc.youOrMe(who))} no longer have ${Voc.piece(pieceCode, pNum)}.`,
            `${upFirst(Voc.allYourOrMy(pieceCode, who, pNum))} ${Voc.piece(pieceCode, pNum)} are already captured.`,
          ],
          ru: [
            `У ${Voc.youOrMe(who)} не осталось ${Voc.piece(pieceCode, `${pNum}/rod`)}.`,
            `${upFirst(Voc.whosePiece(pieceCode, who, `${pNum}/rod`))} больше нет на поле.`,
            `У ${Voc.youOrMe(who)} больше нет ${Voc.piece(pieceCode, `${pNum}/rod`)}.`,
            `${upFirst(Voc.allYourOrMy(pieceCode, who, pNum))} ${Voc.piece(pieceCode, `${pNum}/rod`)} уже захвачены.`,
          ],
        } as rLangs)[this.lang]
      );
    } else {
      return rand(
        ({
          en: [
            `There is no ${Voc.coloredPiece(pieceCode, pNum)}.`,
            `There is no ${Voc.coloredPiece(pieceCode, pNum)} on the board.`,
            `No one ${Voc.coloredPiece(pieceCode)} left.`,
            `There is no ${Voc.coloredPiece(pieceCode, pNum)} left in the game.`,
          ],
          ru: [
            `На поле не осталось ${Voc.coloredPiece(pieceCode, `${pNum}/rod`)}.`,
            `На доске нет ${Voc.coloredPiece(pieceCode, `${pNum}/rod`)}.`,
            `Здесь больше нет ${Voc.coloredPiece(pieceCode, `${pNum}/rod`)}.`,
            `${upFirst(Voc.coloredPiece(pieceCode, `${pNum}/rod`))} не осталось в игре.`,
          ],
        } as rLangs)[this.lang]
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
      } as rLangs)[this.lang]
    );
  }
  static wtfYouAreJustStartedANewGame(): string {
    return rand(
      ({
        en: [
          "But the game has just begun! It's early to throw up your hands!",
          "Seriously? We just started! It's too Early to give up!",
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
      } as rLangs)[this.lang]
    );
  }
  static fullmoveNumber(num: number): string {
    return rand(
      ({
        en: [
          `${num} full moves passed from the beggining of the game.`,
          `Only ${num} full moves were made.`,
          `We have played ${num} full moves since the beginning of the game.`,
          `${num} full game moves passed during this time.`,
          `During the game, we have done ${num} full moves.`,
        ],
        ru: [
          `С момента начала игры ${Voc.nPassed(num)} ${num} ${Voc.nFullMoves(num)}.`,
          `Эта игра насчитывает ${num} ${Voc.nFullMoves(num)}.`,
          `За эту игру мы сделали ${num} ${Voc.nFullMoves(num)}.`,
          `Пока что мы успели сделать только ${num} ${Voc.nFullMoves(num)}.`,
          `У нас за спиной уже ${num} ${Voc.nFullMoves(num)}.`,
          `Эта игра насчитывает ${num} ${Voc.nFullMoves(num)} с момента старта.`,
          `От начала игры ${Voc.nPassed(num)} ${num} ${Voc.nFullMoves(num)}.`,
        ],
      } as rLangs)[this.lang]
    );
  }
  static noFullmoves(): string {
    return rand(
      ({
        en: [
          'We just started a new game.',
          'We have not had time to make a single full move, and you are already asking!',
          'But we just started a new game.',
          'We have just begun, we have not had a single full move.',
          'Make your move, and we will have the first full move.',
        ],
        ru: [
          'Мы только что начали игру.',
          'Мы ещё не успели сделать ни одного полного хода, а вы уже спрашиваете!',
          'Мы же только что начали новую игру.',
          'Мы только начали, у нас ещё не было ни одного полного хода.',
          'Сделайте свой ход, и у нас появится первых полный ход.',
        ],
      } as rLangs)[this.lang]
    );
  }
  static error(msg: string): string {
    return rand(
      ({
        en: [
          `Error: ${msg}`,
          `Sorry, but something went wrong: ${msg}`,
          `Sorry, there was a problem: ${msg}`,
          `The Problem occurred: ${msg}`,
          `An error has occurred: ${msg}`,
        ],
        ru: [
          `Ошибка: ${msg}`,
          `Простите, что-то пошло не так. ${msg}`,
          `Простите, у меня возникла проблема: ${msg}`,
          `Упс, у нас неприятности: ${msg}`,
          `Извините, произошла ошибка: ${msg}`,
        ],
      } as rLangs)[this.lang]
    );
  }
}
