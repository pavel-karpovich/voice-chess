/* eslint-disable max-len */
/* eslint-disable require-jsdoc */

const rand = function(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
};

module.exports = class Answers {
  static setLanguage(language='ru') {
    this.lang = language;
  }

  static welcome() {
    return rand({
      'en': [
        ['Welcome to the Voice Chess!'],
        ['Wanna play chess?'],
        ['Want to play chess?', 'This we can.'],
      ],
      'ru': [
        ['Добро пожаловать в Голосовые Шахматы!'],
        ['Сыграем в шахматы?'],
        ['Партеёку в шахматы?'],
      ],
    }[this.lang]);
  }

  static fallback() {
    return rand({
      'en': [
        ['I didn\'t understand.'],
        ['I\'m sorry, can you try again?'],
        ['Stop speaking Chinese!', 'I didn\'t understand you!'],
      ],
      'ru': [
        ['Не понял...'],
        ['Повторите, пожалуйста.', 'Я не расслышал последнего слова'],
        ['Можно ещё раз?'],
      ],
    }[this.lang]);
  }

  static newgame() {
    return rand({
      'en': [
        ['New game is started.', 'Your turn is first!'],
        ['Let\'s go, I cleared the board.'],
        ['Ok.', 'You first.'],
      ],
      'ru': [
        ['Новая игра запущена.'],
        ['Ну давай заново.', 'Ты за белых, ходишь первым.'],
        ['Всегда рад новой партейке!', 'Твой ход.'],
      ],
    }[this.lang]);
  }

  static board(fenstring) {
    if (fenstring) {
      return rand({
        'en': [
          ['You want see the board? Here it is:', `<say-as interpret-as="characters">${fenstring}</say-as>`],
          ['Look:', `<say-as interpret-as="characters">${fenstring}</say-as>`],
          [`<say-as interpret-as="characters">${fenstring}</say-as>`],
        ],
        'ru': [
          ['Представление доски: ', `<say-as interpret-as="characters">${fenstring}</say-as>`],
          ['В том виде, в котором она у меня хранится, тебе её лучше не видеть...'],
          ['Вот:', `<say-as interpret-as="characters">${fenstring}</say-as>`],
        ],
      }[this.lang]);
    } else {
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
  }

  static illegalMove(from, to, details) {
    return rand({
      'en': [
        ['You can\'t do this move!', 'Try something else...'],
        [`You can\'t move ${from} ${to}!`],
        ['This makes no sense!', 'You need to come up with another move.'],
      ],
      'ru': [
        ['Вы не можете сделать такой ход!'],
        [`Вы не можете ходить с ${from} на ${to}.`, 'Напомнить расположение фигур?'],
        ['Нельзя так ходить!'],
      ],
    }[this.lang]);
  }

  static playerMove(from, to, details) {
    if (details.piece) {
      return rand({
        'en': [
          [`<speak><p><s>The move is made!</s><s>You move ${details.piece} from ${from} to ${to}.</s></p></speak>`],
        ],
        'ru': [
          [`<speak><p><s>Ход сделан!</s><s>Вы передвинули ${details.piece} с позиции ${from} на ${to}.</s></p></speak>`],
        ],
      }[this.lang]);
    } else {
      return rand({
        'en': [
          [`<speak><p><s>The move is made!</s><s>Your move: ${from} ${to}.</s></p></speak>`],
        ],
        'ru': [
          [`<speak><p><s>Принято!</s><s>Ваш ход: ${from} ${to}.</s></p></speak>`],
        ],
      }[this.lang]);
    }
  }

  static enemyMove(from, to, details) {
    return rand({
      'en': [
        [`<speak><break time="2s"/>I would move from ${from} to ${to}!</speak>`],
        [`<speak><break time="2s"/>${from} ${to}! And what do you say to that?</speak>`],
        [`<speak><break time="2s"/>I move ${from} to ${to}.</speak>`],
      ],
      'ru': [
        [`<speak><break time="2s"/>Мой ход таков: с ${from} на ${to}.</speak>`],
        [`<speak><break time="2s"/>Хм... Пожалуй, ${from} ${to}.</speak>`],
        [`<speak><break time="2s"/>Я сделаю ход с ${from} на ${to}!</speak>`],
      ],
    }[this.lang]);
  }
};
