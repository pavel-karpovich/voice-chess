/* eslint-disable max-len */
/* eslint-disable require-jsdoc */

const rand = function(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
};

module.exports = class Answers {
  static setLanguage(language='ru') {
    this.lang = language;
  }

  static firstPlay() {
    return rand({
      'en': [
        [
          'Welcome to Voice Chess! Voice Chess is a game of chess, designed entirely for voice control.',
          'To learn about the features and available commands, say "Help", "Info" or "Help".',
        ],
      ],
      'ru': [
        [
          'Добро пожаловать в Голосовые Шахматы! Голосовые Шахматы - это игра в шахматы, рассчитанная полностью на голосовое управление.',
          'Чтобы узнать о возможностях и доступных командах произнесите "Помощь", "Инфо" или "Справка".',
        ],
      ],
    }[this.lang]);
  }

  static welcomeNoGame() {
    return rand({
      'en': [
        ['Welcome to the Voice Chess!', 'Do you want to create a new game?'],
        ['Hi! Wanna play chess?'],
        ['Want to play chess?', 'This we can.'],
      ],
      'ru': [
        ['Добро пожаловать в Голосовые Шахматы!', 'Сыграем?'],
        ['Сыграем в шахматы?'],
        ['Партейку в шахматы?'],
      ],
    }[this.lang]);
  }

  static welcomeWithGame() {
    return rand({
      'en': [
        ['Hi, I have not seen you for a while!', 'You have a game with me. Want to continue?'],
        ['Hi! Wanna continue our game?'],
        ['Hey! We have an unfinished game.', 'Let\;s continue?'],
      ],
      'ru': [
        ['С возвращением в Голосовые Шахматы!', 'У нас есть незаконченная игра. Желаете продолжить?'],
        ['Привет! Продолжим нашу партию?'],
        ['Привет! Хотите продолжить игру?'],
      ],
    }[this.lang]);
  }

  static continueGame() {
    return rand({
      'en': [
        ['I was waiting for you!', 'Now it\'s your turn. Do you want me to remind the positions of the pieces?'],
        ['Let\'s go!', 'Your turn. May remind that we have on a chessboard?'],
        ['It\'s time!', 'Your turn. Remind you where some chess pieces stand?'],
      ],
      'ru': [
        ['Я ждал вас!', 'Сейчас ваш ход. Хотите, чтобы я напомнил расположение фигур?'],
        ['Поехали!', 'Вам ходить. Может напомнить, что у нас есть на шахматной доске?'],
        ['Давно пора!', 'Ваш ход. Напомнить предварительно, где какие фигуры стоят?'],
      ],
    }[this.lang]);
  }

  static noGameToContinue() {
    return rand({
      'en': [
        ['Sorry, but you don\'t have a running game to continue.', 'Do you want to start a new one?'],
        ['You don\'t have a running game.', 'Create a new game?'],
        ['Sorry, but we don\'t have a running game.', 'But we can always start a new one. Do you want?'],
      ],
      'ru': [
        ['У вас нет запущенной игры, чтобы продолжить.', 'Хотите начать новую?'],
        ['Чтобы что-то продолжить, нужно чтобы было что-то, что можно продолжить.', 'Создать новую игру?'],
        ['Простите, но у нас нет запущенной партии', 'Но мы всегда можем начать новую.'],
      ],
    }[this.lang]);
  }

  static askToNewGame() {
    return rand({
      'en': [
        ['Do you want to start new game?'],
        ['Create a new game?'],
        ['Maybe you wanna start new game?'],
      ],
      'ru': [
        ['Хотите начать новую игру?'],
        ['Создать новую игру?'],
        ['Остаётся только начать новую игру. Да?'],
      ],
    }[this.lang]);
  }

  static firstFallback() {
    return rand({
      'en': [
        ['I didn\'t understand.'],
        ['I\'m sorry, can you try again?'],
        // ['Stop speaking Chinese!', 'I didn\'t understand you!'],
        ['Sorry, can you say it again?'],
      ],
      'ru': [
        ['Я вас не совсем понял...'],
        ['Повторите, пожалуйста.'],
        ['Можно ещё раз?'],
        ['Не могли бы вы повторить?'],
      ],
    }[this.lang]);
  }

  static secondFallback() {
    return rand({
      'en': [
        ['Sorry, I didn\'t understand what you want.'],
        ['I\'m sorry, I didn\'t understand.'],
      ],
      'ru': [
        ['Простите, я не могу понять, чего вы хотите.'],
        ['Извините, я не могу понять, о чём вы говорите.'],
        ['Я не могу вас понять...'],
      ],
    }[this.lang]);
  }

  static confusedExit() {
    return rand({
      'en': [
        ['Sorry, but I can\'t understand what you want', 'Maybe try again later...'],
        ['It is a Chess Game. Is that exactly what you need?', 'I\'m not sure'],
        ['Sorry, try again later.'],
      ],
      'ru': [
        ['Извините, но я совсем не могу вас понять.', 'Попробуйте позже.'],
        ['Может быть в другой раз...'],
        ['Это игра в шахматы. Вы точно попали куда нужно?', 'Я не уверен.'],
      ],
    }[this.lang]);
  }

  static ingameTips() {
    return rand({
      'en': [
        ['<speak><p><s>You are now in the game..</s>' +
         '<s>And I\'m wait when you make your next move.</s>' +
         '<s>If you want, you can ask me about the current state of the chessboard.</s>' +
         '<s>I can tell you about a specific row of the board, or about all the white or black pieces.</s>' +
         '<s>You can also start a new game, or change the difficulty level.</s></p>' +
         '<p><s>And what do you want to do?</s></p></speak>'],
      ],
      'ru': [
        ['<speak><p><s>Вы сейчас в процессе игры.</s>' +
         '<s>И я ожидаю, когда вы сделаете свой следующий ход.</s>' +
         '<s>Если хотите, вы можете спросить меня о состоянии шахматной доски на текущий момент.</s>' +
         '<s>Я могу рассказать о конкретном ряде доски или обо всех белых или чёрных фигурах.</s>' +
         '<s>Вы также можете начать новую игру, или изменить уровень сложности.</s></p>' +
         '<p>Что вы хотите сделать?</p></speak>'],
      ],
    }[this.lang]);
  }

  static nogameTips() {
    return rand({
      'en': [
        ['<speak><p><s>You do not have a running game now.</s>' +
         '<s>You can start a new game.</s>' +
         '<s>Or continue the old one if you have an unfinished game.</s>' +
         '<s>Also, if you want, you can configure the level of difficulty.</s></p>' +
         '<p><s>What do you want to do?</s></p></speak>'],
      ],
      'ru': [
        ['<speak><p><s>У вас сейчас нет запущенной игровой партии.</s>' +
         '<s>Вы можете начать новую игру.</s>' +
         '<s>Или продолжить старую, если у вас есть незаконченная партия.</s>' +
         '<s>Также, если хотите, можно отрегулировать уровень сложности.</s></p>' +
         '<p><s>Что вы хотите из этого сделать?</s></p></speak>'],
      ],
    }[this.lang]);
  }

  static newgame() {
    return rand({
      'en': [
        ['New game is started.', 'You are for White or Black?'],
        ['Let\'s go, I cleared the board.', 'Do you want to play White? Or maybe Black?'],
        ['Ok.', 'Which side are you on, White or Black?'],
      ],
      'ru': [
        ['Новая игра запущена.', 'Вы за Белых или за Чёрных?'],
        ['Ну давайте заново.', 'Вы хотите играть за Белых или Чёрных?'],
        ['Всегда рад новой партейке!', 'На какой вы стороне? Белые или Чёрные?'],
      ],
    }[this.lang]);
  }

  static board1() {
    return rand({
      'en': [
        ['You want see the board? Here is the first part: '],
        ['Look at first part: '],
        ['The first part of the board: '],
      ],
      'ru': [
        ['Первая половина доски: '],
        ['Слушайте, что на первой половине доски: '],
        ['Вот первая половина доски: '],
      ],
    }[this.lang]);
  }

  static board2() {
    return rand({
      'en': [
        ['The second part of the board: '],
      ],
      'ru': [
        ['Вторая половина доски: '],
      ],
    }[this.lang]);
  }

  static noboard() {
    return rand({
      'en': [
        ['There is no chess board yet.'],
        ['We don\'t play to see the board.'],
        ['Start new game first!'],
      ],
      'ru': [
        ['А нечего показывать.'],
        ['Сейчас нет запущенной партии.', 'Скажите "Начать новую игру", чтобы сыграть со мной.'],
        ['Доску можно увидеть только при запущенной игре.'],
      ],
    }[this.lang]);
  }

  static askToMove() {
    return rand({
      'en': [
        ['Well, then you need to make a move.'],
        [`Ok, then what's your move?`],
      ],
      'ru': [
        ['Хорошо, тогда вы ходите.'],
        [`Ладно, и как вы походите?`],
        ['И какой ваш ход?'],
      ],
    }[this.lang]);
  }

  static illegalMove(from, to, details) {
    return rand({
      'en': [
        ['You can\'t do this move!', 'Try something else...'],
        [`You can\'t move <say-as interpret-as="characters">${from}</say-as> <say-as interpret-as="characters">${to}</say-as>!`],
        ['This makes no sense!', 'You need to come up with another move.'],
      ],
      'ru': [
        ['Вы не можете сделать такой ход!'],
        [`Вы не можете ходить с <say-as interpret-as="characters">${from}</say-as> на <say-as interpret-as="characters">${to}</say-as>.`],
        ['Нельзя так ходить!'],
      ],
    }[this.lang]);
  }

  static illegalMoveToBoardInfo(from, to, details) {
    return rand({
      'en': [
        ['But you can\'t!', 'Remind the location of chess pieces?'],
        [`You can\'t move <say-as interpret-as="characters">${from}</say-as> <say-as interpret-as="characters">${to}</say-as>! Have you forgotten something?`, 'I can recall all positions.'],
        ['Sorry, but you can\'t move like that...', 'Remind you the board positions?'],
      ],
      'ru': [
        ['Вы не можете так походить!', 'Напомнить, где какие фигуры на доске?'],
        [`Вы не можете ходить с <say-as interpret-as="characters">${from}</say-as> на <say-as interpret-as="characters">${to}</say-as>.`, 'Напомнить расположение фигур?'],
        [`<say-as interpret-as="characters">${from}</say-as> <say-as interpret-as="characters">${to}</say-as>... Это некорректно.`, 'Я могу напомнить вам позиции на доске, если нужно'],
      ],
    }[this.lang]);
  }

  static playerMove(from, to, details) {
    if (details.piece) {
      return rand({
        'en': [
          [`<speak><p><s>The move is made!</s><s>You move ${details.piece} from <say-as interpret-as="characters">${from}</say-as> to <say-as interpret-as="characters">${to}</say-as>.</s></p></speak>`],
        ],
        'ru': [
          [`<speak><p><s>Ход сделан!</s><s>Вы передвинули ${details.piece} с позиции <say-as interpret-as="characters">${from}</say-as> на <say-as interpret-as="characters">${to}</say-as>.</s></p></speak>`],
        ],
      }[this.lang]);
    } else {
      return rand({
        'en': [
          [`<speak><p><s>The move is made!</s><s>Your move: <say-as interpret-as="characters">${from}</say-as> <say-as interpret-as="characters">${to}</say-as>.</s></p></speak>`],
        ],
        'ru': [
          [`<speak><p><s>Принято!</s><s>Ваш ход: <say-as interpret-as="characters">${from}</say> <say-as interpret-as="characters">${to}</say-as>.</s></p></speak>`],
        ],
      }[this.lang]);
    }
  }

  static enemyMove(from, to, details) {
    return rand({
      'en': [
        [`<speak><break time="2s"/>I would move from <say-as interpret-as="characters">${from}</say-as> to <say-as interpret-as="characters">${to}</say-as>!</speak>`],
        [`<speak><break time="2s"/><say-as interpret-as="characters">${from}</say-as> <say-as interpret-as="characters">${to}</say-as>! And what do you say to that?</speak>`],
        [`<speak><break time="2s"/>I move <say-as interpret-as="characters">${from}</say-as> to <say-as interpret-as="characters">${to}</say-as>.</speak>`],
      ],
      'ru': [
        [`<speak><break time="2s"/>Мой ход таков: с <say-as interpret-as="characters">${from}</say-as> на <say-as interpret-as="characters">${to}</say-as>.</speak>`],
        [`<speak><break time="2s"/>Хм... Пожалуй, <say-as interpret-as="characters">${from}</say-as> <say-as interpret-as="characters">${to}</say-as>.</speak>`],
        [`<speak><break time="2s"/>Я сделаю ход с <say-as interpret-as="characters">${from}</say-as> на <say-as interpret-as="characters">${to}</say-as>!</speak>`],
      ],
    }[this.lang]);
  }

  static color(code, opt='mus') {
    if (code === code.toUpperCase()) {
      return {
        'en': 'black',
        'ru': {
          'mus': 'чёрный',
          'fem': 'чёрная',
        }[opt],
      }[this.lang];
    } else {
      return {
        'en': 'white',
        'ru': {
          'mus': 'белый',
          'fem': 'белая',
        }[opt],
      }[this.lang];
    }
  }

  static piece(code) {
    code = code.toLowerCase();
    switch (code) {
      case 'p':
        return {
          'en': 'Pawn',
          'ru': 'Пешка',
        }[this.lang];
      case 'r':
        return {
          'en': 'Rook',
          'ru': 'Слон',
        }[this.lang];
      case 'n':
        return {
          'en': 'Knight',
          'ru': 'Конь',
        }[this.lang];
      case 'b':
        return {
          'en': 'Bishop',
          'ru': 'Ладья',
        }[this.lang];
      case 'q':
        return {
          'en': 'Queen',
          'ru': 'Ферзь',
        }[this.lang];
      case 'k':
        return {
          'en': 'King',
          'ru': 'Король',
        }[this.lang];
    }
    return 'Error';
  }

  static coloredPiece(code) {
    const piece = this.piece(code);
    let color = null;
    if (piece === 'Пешка' || piece === 'Ладья') {
      color = this.color(code, 'fem');
    } else {
      color = this.color(code, 'mus');
    }
    return color + ' ' + piece;
  }

  static nRow(n, opt='mus') {
    switch (n) {
      case 1:
        return {
          'en': 'First row',
          'ru': {
            'mus': 'Первый ряд',
            'na': 'Первом ряду',
          }[opt],
        }[this.lang];
      case 2:
        return {
          'en': 'Second row',
          'ru': {
            'mus': 'Второй ряд',
            'na': 'Втором ряду',
          }[opt],
        }[this.lang];
      case 3:
        return {
          'en': 'Third row',
          'ru': {
            'mus': 'Третий ряд',
            'na': 'Третьем ряду',
          }[opt],
        }[this.lang];
      case 4:
        return {
          'en': 'Fourth row',
          'ru': {
            'mus': 'Четвёртый ряд',
            'na': 'Четвёртом ряду',
          }[opt],
        }[this.lang];
      case 5:
        return {
          'en': 'Fifth row',
          'ru': {
            'mus': 'Пятый ряд',
            'na': 'Пятом ряду',
          }[opt],
        }[this.lang];
      case 6:
        return {
          'en': 'Sixth row',
          'ru': {
            'mus': 'Шестой ряд',
            'na': 'Шестом ряду',
          }[opt],
        }[this.lang];
      case 7:
        return {
          'en': 'Seventh row',
          'ru': {
            'mus': 'Седьмой ряд',
            'na': 'Седьмом ряду',
          }[opt],
        }[this.lang];
      case 8:
        return {
          'en': 'Eighth row',
          'ru': {
            'mus': 'Восьмой ряд',
            'na': 'Восьмом ряду',
          }[opt],
        }[this.lang];
    }
    return 'Error';
  }

  static emptyRow(n) {
    return {
      'en': `${this.nRow(n)} is empty`,
      'ru': `На ${this.nRow(n, 'na')} нет фигур`,
    }[this.lang];
  }

  static coloredPieceOnPosition(code, pos) {
    return {
      'en': `on <say-as interpret-as="characters">${pos}</say-as> ${this.coloredPiece(code)}`,
      'ru': `на <say-as interpret-as="characters">${pos}</say-as> ${this.coloredPiece(code)}`,
    }[this.lang];
  }

  static emptyPosition(pos) {
    return {
      'en': `<say-as interpret-as="characters">${pos}</say-as> is free`,
      'ru': `Клетка <say-as interpret-as="characters">${pos}</say-as> свободна`,
    }[this.lang];
  }

  static silence() {
    return {
      'en': [
        ['Are you still here?'],
        ['Hello?'],
      ],
      'ru': [
        ['Ау, Вы ещё тут?'],
        ['Ну давайте помолчим вместе.'],
      ],
    }[this.lang];
  }

  static whiteSide() {
    return rand({
      'en': [
        ['Your side is White.', 'Your turn is first!'],
      ],
      'ru': [
        ['Ваша сторона - Белая.', 'Первый ход за вами.'],
        ['Вы за белых, ходите первыми.'],
      ],
    }[this.lang]);
  }

  static blackSide() {
    return rand({
      'en': [
        ['Your side is Black. My turn is first...'],
        ['Ok, you are for Black. Then I go first.'],
      ],
      'ru': [
        ['Ваша сторона - Чёрная. Я хожу первым...'],
        ['Ладно, вы за Чёрных. Тогда мой ход первый.'],
      ],
    }[this.lang]);
  }

  static rowWithoutNumber() {
    return rand({
      'en': [
        ['Can you repeat the row number?'],
        ['Do you want to know chess pieces on a certain row?', 'Which row?'],
        ['Alignment of forces on a row?', 'On which row?'],
      ],
      'ru': [
        ['Какой ряд?'],
        ['Хотите узнать фигуры на заданном ряду?', 'Скажите, на каком.'],
        ['Назовите номер ряда, чтобы узнать расстановку фигур на нём.'],
      ],
    }[this.lang]);
  }

  static noNextRow() {
    return rand({
      'en': [
        ['There is no next row.'],
        ['It was the 8th row.', 'There is no next row!'],
        ['It was the last row.', 'Do you want to see another row? Say the row number.'],
      ],
      'ru': [
        ['Следующего ряда нет.'],
        ['Это был восьмой ряд.', 'Дальше некуда!'],
        ['Это был последний ряд.', 'Можете назвать другой номер, чтобы посмотреть.'],
      ],
    }[this.lang]);
  }

  static difficulty(current) {
    return rand({
      'en': [
        [`The current difficulty level is ${current}.`, 'What value do you want to set instead?'],
        [`At the moment, the difficulty is set to ${current}.`, 'What is the value to change it, from 0 to 20?'],
        [`For now, the difficulty level is ${current}. Valid values are from 0 to 20.`, 'Do you want to change it?'],
      ],
      'ru': [
        [`Текущий уровень сложности: ${current}.`, 'Вы можете установить уровень сложности в диапазоне от 0 до 20:'],
        [`Текущая сложность: ${current}. Допустимые значения: от 0 до 20.`, 'Какую сложность поставить?'],
        [`Сейчас уровень сложности равен ${current}`, 'На какую сложность её изменить? От 0 до 20.'],
      ],
    }[this.lang]);
  }

  static difficultyChanged(newLevel, oldLevel) {
    return rand({
      'en': [
        [`The difficulty level has been changed from ${oldLevel} to ${newLevel}!`],
        [`The difficulty level now is set to ${newLevel}!`],
        [`Ok! Difficulty is now set to ${newLevel}.`],
      ],
      'ru': [
        [`Уровень сложности был изменён с ${oldLevel} на ${newLevel}!`],
        [`Окей, теперь уровень сложности равен ${newLevel}.`],
        [`Дело сделано - сложность теперь будет равна ${newLevel}`],
      ],
    }[this.lang]);
  }

  static difficultyTheSame(level) {
    return rand({
      'en': [
        [`The difficulty level is already ${level}}!`],
      ],
      'ru': [
        [`Уровень сложности уже равне ${level}!`],
        ['Сложность и так такая!'],
      ],
    }[this.lang]);
  }

  static difficultyWithoutValue() {
    return rand({
      'en': [
        ['Sorry, can you repeat the level value?'],
        ['Repeat please... I didn\'t understand the number.'],
      ],
      'ru': [
        ['Повторите пожалуйста, я не расслышал номер...'],
        ['Простите, не могли бы вы повторить, какой уровень сложности поставить?'],
        ['Ещё раз, какой уровень сложности поставить?'],
      ],
    }[this.lang]);
  }
};
