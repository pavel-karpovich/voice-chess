import { rand, LocalizationObject } from './helpers';

export class Ask {
  private static lang: string;

  static setLanguage(language = 'ru'): void {
    this.lang = language;
  }

  static askToNewGame(): string {
    return rand(
      ({
        en: [
          'Do you want to start new game?',
          'Create a new game?',
          'Maybe you wanna start a new game?',
        ],
        ru: [
          'Хотите начать новую игру?',
          'Создать новую игру?',
          'Остаётся только начать новую игру. Да?',
        ],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static askToContinue(): string {
    return rand(
      ({
        en: [
          'You have a game with me. Want to continue?',
          'Wanna continue our game?',
          "We have an unfinished game. Let's continue?",
          'We have an unfinished game. Is it time to continue?',
        ],
        ru: [
          'У нас есть незаконченная игра. Желаете продолжить?',
          'Продолжим нашу партию?',
          'Хотите продолжить игру?',
          'Мы с вами недоиграли. Закончим начатое?',
        ],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static ingameTips(): string {
    return ({
      en:
        '<speak><p><s>You are now in the game..</s>' +
        "<s>And I'm wait when you make your next move.</s>" +
        '<s>If you want, you can ask me about the current state of the chessboard.</s>' +
        '<s>I can tell you about a specific row of the board, or about all the white or black pieces.</s>' +
        '<s>You can also start a new game, or change the difficulty level.</s></p>' +
        '<p><s>And what do you want to do?</s></p></speak>',
      ru:
        '<speak><p><s>Вы сейчас в процессе игры.</s>' +
        '<s>И я ожидаю, когда вы сделаете свой следующий ход.</s>' +
        '<s>Если хотите, вы можете спросить меня о состоянии шахматной доски на текущий момент.</s>' +
        '<s>Я могу рассказать о конкретном ряде доски или обо всех белых или чёрных фигурах.</s>' +
        '<s>Вы также можете начать новую игру, или изменить уровень сложности.</s></p>' +
        '<p><s>И что из этого вы хотите сделать?</s></p></speak>',
    } as LocalizationObject<string>)[this.lang];
  }
  static nogameTips(): string {
    return ({
      en:
        '<speak><p><s>You do not have a running game now.</s>' +
        '<s>You can start a new game.</s>' +
        '<s>Or continue the old one if you have an unfinished game.</s>' +
        '<s>Also, if you want, you can configure the level of difficulty.</s></p>' +
        '<p><s>And what do you want to do?</s></p></speak>',
      ru:
        '<speak><p><s>У вас сейчас нет запущенной игровой партии.</s>' +
        '<s>Вы можете начать новую игру.</s>' +
        '<s>Или продолжить старую, если у вас есть незаконченная партия.</s>' +
        '<s>Также, если хотите, можно отрегулировать уровень сложности.</s></p>' +
        '<p><s>И что из этого вы выбираете?</s></p></speak>',
    } as LocalizationObject<string>)[this.lang];
  }
  static askToRemindBoard(): string {
    return rand(
      ({
        en: [
          'Do you want me to remind the positions of the pieces?',
          'May remind that we have on a chessboard?',
          'Remind you where some chess pieces stand?',
          'Remind the location of chess pieces?',
          'Have you forgotten something?\nI can recall all positions.',
          'Remind you the board positions?',
        ],
        ru: [
          'Хотите, чтобы я напомнил расположение фигур?',
          'Может напомнить, что у нас есть на шахматной доске?',
          'Напомнить, где какие фигуры?',
          'Напомнить, где какие фигуры стоят на доске?',
          'Напомнить расположение фигур?',
          'Я могу напомнить вам позиции на доске, если нужно',
        ],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static askToGoNext(): string {
    return rand(
      ({
        en: ['Next?', 'Continue?', 'Go ahead?'],
        ru: ['Дальше?', 'Продолжать?', 'Следующая часть?'],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static chooseSide(): string {
    return rand(
      ({
        en: [
          'You are for White or Black?',
          'Do you want to play White? Or maybe Black?',
          'Which side are you on, White or Black?',
        ],
        ru: [
          'Вы за Белых или за Чёрных?',
          'Вы хотите играть за Белых или Чёрных?',
          'На какой вы стороне? Белые или Чёрные?',
        ],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static whatToDo(): string {
    return rand(
      ({
        en: ['And what do you want to do next?'],
        ru: ['Что вы хотите сделать?', 'И что будем делать дальше?'],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static askWhatever(): string {
    return rand(
      ({
        en: [
          'Then, what do you want?',
          'Well, what do you want to do?',
          'What then?',
          'Then ask me what you want in the game.',
        ],
        ru: [
          'И чего вы хотите?',
          'И что же вы хотите сделать?',
          'Каковы ваши действия?',
          'Тогда что?',
          'Тогда что вы хотите сделать?',
        ],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static askToMove(): string {
    return rand(
      ({
        en: [
          'Well, then you need to make a move.',
          "Ok, then what's your move?",
        ],
        ru: [
          'Хорошо, тогда ходите.',
          'Ладно, и как вы походите?',
          'И какой ваш ход?',
          'Какой вы сделаете ход?',
          'И каков будет ваш ход?',
        ],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static askToMoveAgain(): string {
    return rand(
      ({
        en: [
          'You can think and answer me later.',
          'Do you have another option?',
          'Choose the correct move.',
          'Try something else...',
        ],
        ru: [
          'Вы можете подумать, и ответить мне попозже.',
          'У вас есть другой вариант?',
          'Есть что ещё в запасе?',
          'Назовите корректный ход.',
        ],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static nowYouNeedToMove(): string {
    return rand(
      ({
        en: [
          'Now you. Go.',
          'Now your turn.',
          'What will you do?',
          'How will you answer me?',
          'Now show me what you are capable of!',
        ],
        ru: [
          'Теперь вы. Ходите!',
          'Теперь ваш ход. Вперёд.',
          'Что вы будете делать?',
          'И чем вы мне ответите?',
          'Покажите, на что вы способны! Ходите.',
          'И что же вы будете делать в ответ?',
          'Есть чем мне ответить?',
        ],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static waitMove(): string {
    return rand(
      ({
        en: [
          'Now will you make a move?',
          "Ok, what's next? Maybe make your move?",
          'I am awaiting your turn. Have you decided where to go?',
          'Now are you ready to make your move?',
          'I am waiting for your turn. What will you do?',
        ],
        ru: [
          'Теперь вы будете ходить?',
          'Что дальше? Может быть сделаете свой ход?',
          'Я ожидаю вашего хода. Вы решили куда будете ходить?',
          'Теперь вы готовы походить?',
          'Я жду вашего хода. Что будете делать?',
        ],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static silence(): string {
    return rand(
      ({
        en: ['Are you still here?', 'Hello?'],
        ru: [
          'Ау, Вы ещё тут?',
          'Ну давайте вместе помолчим.',
          'Знаете, я тоже люблю молчать.',
        ],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static askRowNumber(): string {
    return rand(
      ({
        en: [
          'Can you repeat the row number?',
          'Please, repeat the row number.',
          'Which row do I need to show?',
          'Which row do you want to know the alignment of forces?',
        ],
        ru: [
          'Какой ряд?',
          'Какой ряд вам показать?',
          'На каком ряду вы хотите узнать фигуры?',
          'Назовите номер ряда, чтобы узнать расстановку фигур на нём.',
        ],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static askToChangeDifficulty(): string {
    return rand(
      ({
        en: [
          'What value do you want to set instead?',
          'What is the value to change it, from 0 to 20?',
          'Do you want to change it?',
        ],
        ru: [
          'Вы можете установить уровень сложности в диапазоне от 0 до 20.\nКакой вы выберите?',
          'Какую сложность поставить?',
          'На какую сложность её изменить? От 0 до 20.',
        ],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static difficultyWithoutValue(): string {
    return rand(
      ({
        en: [
          'Sorry, can you repeat the level value?',
          'Repeat please... I didn\'t understand the number.',
        ],
        ru: [
          'Повторите пожалуйста, я не расслышал номер...',
          'Простите, не могли бы вы повторить, какой уровень сложности поставить?',
          'Ещё раз, какой уровень сложности поставить?',
        ],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
}
