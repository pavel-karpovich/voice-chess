import { rand, LocalizationObject, char, upFirst } from '../support/helpers';
import { Vocabulary as Voc } from './vocabulary';

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
        '<p><s>You are now in the game..</s>' +
        "<s>And I'm wait when you make your next move.</s>" +
        '<s>If you want, you can ask me about the current state of the chessboard.</s>' +
        '<s>I can tell you about a specific rank of the board, or about all the white or black pieces.</s>' +
        '<s>You can also start a new game, or change the difficulty level.</s></p>' +
        '<p><s>And what do you want to do?</s></p>',
      ru:
        '<p><s>Вы сейчас в процессе игры.</s>' +
        '<s>И я ожидаю, когда вы сделаете свой следующий ход.</s>' +
        '<s>Если хотите, вы можете спросить меня о состоянии шахматной доски на текущий момент.</s>' +
        '<s>Я могу рассказать о конкретном ряде доски или обо всех белых или чёрных фигурах.</s>' +
        '<s>Вы также можете начать новую игру, или изменить уровень сложности.</s></p>' +
        '<p><s>И что из этого вы хотите сделать?</s></p>',
    } as LocalizationObject<string>)[this.lang];
  }
  static nogameTips(): string {
    return ({
      en:
        '<p><s>You do not have a running game now.</s>' +
        '<s>You can start a new game.</s>' +
        '<s>Or continue the old one if you have an unfinished game.</s>' +
        '<s>Also, if you want, you can configure the level of difficulty.</s></p>' +
        '<p><s>And what do you want to do?</s></p>',
      ru:
        '<p><s>У вас сейчас нет запущенной игровой партии.</s>' +
        '<s>Вы можете начать новую игру.</s>' +
        '<s>Или продолжить старую, если у вас есть незаконченная партия.</s>' +
        '<s>Также, если хотите, можно отрегулировать уровень сложности.</s></p>' +
        '<p><s>И что из этого вы выбираете?</s></p>',
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
          'Я могу напомнить вам позиции на доске, если нужно.',
        ],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static askToGoNext(): string {
    return rand(
      ({
        en: ['Next?', 'Do you want more?', 'Continue?', 'Go ahead?'],
        ru: ['Дальше?', 'Ещё?', 'Продолжать?', 'Следующая часть?'],
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
        ru: ['И что вы хотите сделать?', 'И что будем делать дальше?'],
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
          'И как вы будете ходить?',
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
          'You can think your move and answer me later.',
          'Do you have another move on your mind?',
          'Choose the correct move.',
          'Then try something else.',
        ],
        ru: [
          'Вы можете подумать над своим ходом, и ответить мне попозже.',
          'У вас есть другой вариант?',
          'Тогда как вы походите?',
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
  static askRankNumber(): string {
    return rand(
      ({
        en: [
          'Can you repeat the rank number?',
          'Please, repeat the rank number.',
          'Which rank do I need to show?',
          'Which rank do you want to know the alignment of forces?',
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
          "Repeat please... I didn't understand the number.",
        ],
        ru: [
          'Повторите пожалуйста, я не расслышал номер...',
          'Простите, не могли бы вы повторить, какой уровень сложности поставить?',
          'Ещё раз, какой уровень сложности поставить?',
        ],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static moveWithoutPiecesMatch(
    actualPiece: string,
    playerPiece: string,
    from: string,
    to: string
  ) {
    return rand(
      ({
        en: [
          `Are you confused? Will you move ${Voc.piece(actualPiece)}?`,
          `But move is legal. Save it?`,
          `But move is legal. Confirm it with ${Voc.piece(actualPiece)}?`,
          `Did you want to say ${Voc.piece(actualPiece)}?`,
          `Then, your move is ${Voc.piece(actualPiece)} from ${char(
            from
          )} to ${char(to)}?`,
        ],
        ru: [
          `Вы просто перепутали? Будете ходить ${Voc.piece(
            actualPiece,
            'tvr'
          )}?`,
          `Но сам ход корректный. Оставляем его?`,
          `Вы хотели сказать ${Voc.piece(actualPiece)} с ${char(
            from
          )} на ${char(to)}?`,
          `Будете ходить ${Voc.piece(actualPiece, 'rod')} с ${char(
            from
          )} на ${char(to)}?`,
          `Значит, ${Voc.piece(actualPiece)} ${char(from)} ${char(to)}?`,
        ],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static howToPromote(): string {
    return rand(
      ({
        en: [
          'In which piece?',
          'In which piece do you want to promote the pawn?',
          'How to promote? In a queen, rock, knight or bishop?',
          'Choose: queen, rock, knight or bishop.',
        ],
        ru: [
          'В какую фигуру?',
          'В какую фигуру вы превратите свою пешку?',
          'В кого превращать? Ферзь, слон, конь, ладья?',
          'Ферзь, слон, конь, ладья. Выбирайте!',
        ],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static askToConfirm(from: string, to: string, pieceCode: string): string {
    return rand(
      ({
        en: [
          `${upFirst(Voc.piece(pieceCode))} from ${char(from)} to ${char(
            to
          )}, yes?`,
          `${upFirst(Voc.piece(pieceCode))} ${char(from)} ${char(
            to
          )}. That's right?`,
          `${upFirst(Voc.piece(pieceCode))} ${char(from)} ${char(
            to
          )}. I understood correctly?`,
        ],
        ru: [
          `${upFirst(Voc.piece(pieceCode))} с ${char(from)} на ${char(
            to
          )}, да?`,
          `${upFirst(Voc.piece(pieceCode))} ${char(from)} ${char(
            to
          )}. Всё верно?`,
          `Вы хотите походить ${Voc.piece(pieceCode, 'rod')} ${char(
            from
          )} ${char(to)}. Верно?`,
        ],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static askToConfirmCastling(
    kFrom: string,
    kTo: string,
    rFrom: string,
    rTo: string
  ): string {
    return rand(
      ({
        en: [
          `You are going to castling. The king will go from ${char(
            kFrom
          )} to ${char(kTo)}, you confirm?`,
          `When castling, the king will make a double move from ${char(
            kFrom
          )} to ${char(kTo)}, and rock from ${char(rFrom)} will move to ${char(
            rTo
          )}. Does it suit you?`,
          `When castling, the king will move to the square ${char(
            kTo
          )}, and rock will move to ${char(rTo)}. Do you confirm this move?`,
          `Castling a king with a rock will cause the king to move to square ${char(
            kTo
          )}, and the rock from ${char(rFrom)} to ${char(rTo)}. Okay?`,
        ],
        ru: [
          `Вы собираетесь выполнить рокировку королём с ${char(
            kFrom
          )} на ${char(kTo)}, всё верно?`,
          `При рокировке король переместится на две клетки, с ${char(
            kFrom
          )} на ${char(kTo)}, а ладья с ${char(
            rFrom
          )} встанет за королём на ${char(rTo)}. Вы подтвержаете ход?`,
          `При рокировке король перейдёт на клетку ${char(
            kTo
          )}, а ладья с ${char(rFrom)} встанет на ${char(
            rTo
          )}. Вы подтверждаете рокировку?`,
          `Рокировка короля с ладьёй приведёт к перемещению короля на клетку ${char(
            kTo
          )}, а ладью на клетку ${char(rTo)}. Вы согласны?`,
        ],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static isAnybodyHere(): string {
    return rand(
      ({
        en: [
          'Helloo!.. Is anybody still here?',
          "You didn't forget about me?",
          'Hi! You are here?',
          "I can't hear you, repeat what you said, please!",
        ],
        ru: [
          'Эй, вы всё ещё тут?',
          'Вы про меня не забыли?',
          'Аууу! Есть кто на связи?',
          'Я вас не слышу, повторите, пожалуйста.',
        ],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static waitForReactOnAdvise(): string {
    return rand(
      ({
        en: [
          'What do you say?',
          'Will you use my advice?',
          'Will you make such a move, or say another?',
          'Do you agree with this choice?',
        ],
        ru: [
          'Что скажете?',
          'Походите так, или у вас есть предложение получше?',
          'Будете ходить так?',
          'Послушаете меня, или походите по-своему?',
        ],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static moveToCorrect(from: string, to: string, pieceCode: string): string {
    return rand(
      ({
        en: [
          `How do you want to change the move ${char(from)} ${char(to)}?`,
          `You want to change your last move ${char(from)} ${char(
            to
          )}? Ok. To what move?`,
          `What move do you want re-play instead of ${Voc.piece(
            pieceCode
          )} ${char(from)} ${char(to)}?`,
          `And how do you want to move instead of ${char(from)} ${char(to)}?`,
          `${Voc.piece(pieceCode)} ${char(from)} ${char(
            to
          )} is your last move. And what move will you play instead?`,
        ],
        ru: [
          `Вы хотите изменить ход ${char(from)} ${char(to)}? На какой?`,
          `Какой ход вы хотите сделать вместо ${char(from)} ${char(to)}?`,
          `Значит вы хотите поменять свой ход ${Voc.piece(
            pieceCode,
            'tvr'
          )} ${char(from)} ${char(to)}? На что?`,
          `И как вы хотите походить вместо ${char(from)} ${char(to)}?`,
          `И какой ход вы хотите на замену старому ${char(from)} ${char(to)}?`,
        ],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static correctFails() {
    return rand(
      ({
        en: [
          'You are back to the original move. What will you do?',
          'Everything remains the same, and you should make a move',
          'The change did not happen and you returned to the original move. Move.',
          "Then we will continue our game as usual. Now it's your turn to move.",
        ],
        ru: [
          'Вы вернулись к оргинальному ходу. Что будете делать?',
          'Всё осталось по прежнему, и вам нужно ходить.',
          'Корректировки хода не произошло и вы вернулись к оригинальному варианту. Ходите.',
          'Значит продолжаем партию как обычно. Ваш ход.',
        ],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static chooseCastling(): string {
    return rand(
      ({
        en: [
          'What do you choose?',
          'Which one do you want to choose?',
          'In which direction do you want castling?',
          'How do you castling?',
        ],
        ru: [
          'Какую вы выбираете?',
          'Какую из них вы хотите сделать?',
          'В каком направлении вы хотите сделать рокировку?',
          'Какую из этих двух рокировок вы хотите совершить?',
          'Какую рокировку вы сделаете?',
        ],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static orMove(): string {
    return rand(
      ({
        en: [
          "Or maybe it's a time to make your move?",
          'Or did you decide what move to make?',
          'Or maybe you will make a move?',
          'Or will you make a move?',
        ],
        ru: [
          'Или сделаете свой ход?',
          'Или вы решили какой сделаете ход?',
          'Или вы сделаете свой ход?',
          'Или вы походите?',
        ],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static nextSquare(): string {
    return rand(
      ({
        en: [
          'Want some more position?',
          'Next square?',
          'What next? Another square?',
          'Remind any more position?',
        ],
        ru: [
          'Хотите узнать ещё о чем-нибудь?',
          'Следующая клетка?',
          'Другую клетку?',
          'Напомнить ещё какую-нибудь позицию?',
        ],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static nextPiece(): string {
    return rand(
      ({
        en: [
          'What next? Maybe another piece?',
          'Remind you of anything else on the board?',
          'Do you want me to remind other pieces?',
          'Remind you more pieces?',
        ],
        ru: [
          'Хотите узнать что-нибудь ещё?',
          'Напомнить ещё о чём-нибудь?',
          'Хотите узнать о других фигурах?',
          'Напомнить ещё о какой-нибудь фигуре?',
        ],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static confirmNewGame(): string {
    return rand(
      ({
        en: [
          'You have an unfinished game. Are you sure you want to create a new one?',
          'If you start a new game, the old one will be deleted. Are you sure?',
          'Creating a new game will remove your unfinished game. Are you sure you want this?',
          'You have an unfinished game, do you really want to create a new one?',
          'When you create a new game, your old progress will be deleted. Are you ready for this?',
          'Starting a new game, you will overwrite your unfinished game. Are you sure?',
          'Do you want to drop the current game and start a new one? But this time, you almost played well. Are you sure?',
        ],
        ru: [
          'У вас есть незаконченная игра, вы действительно хотите создать новую?',
          'Если вы начнёте новую игру, старая партия удалится. Вы уверены, что хотите это сделать?',
          'Созданием новой игры вы сотрёте свою текущую незаконченную партию. Вы уверены?',
          'У вас есть незавершённая игра! Вы уверены, что хотите начать новую партию?',
          'Пусть я и виртуальный, но у меня есть место только для одной шахматной доски. Вы точно хотите начать новую игру и перезаписать текущую?',
          'При создании новой игры ваш старый прогресс удалится. Вы готовы к этому?',
          'Начав новую игру, вы перезапишете свою незавершенную партию. Вы уверены?',
          'Вы хотите бросить текущую партию и начать новую? А ведь, на этот раз, вы почти что неплохо играли. Вы уверены?',
        ],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static confirmResign(): string {
    return rand(
      ({
        en: [
          'Sure?',
          'Are you sure about this decision?',
          "I see you respect my skills, but it's your final decision?",
          'Do you admit defeat?',
          'Are you surrender?',
        ],
        ru: [
          'Вы уверены?',
          'Я, конечно, польщён, что вы меня так высоко оцениваете, но вы в этом точно уверены?',
          'Давно пора. Значит, сдаётесь?',
          'Это окончательное решение?',
          'Вы признаёте поражение в этой партии?',
        ],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
  static thenPlay(): string {
    return rand(
      ({
        en: [
          'Then play!',
          'Then keep playing!',
          "Then keep playing! I'm awaiting your move!",
          "The keep playing! I'm waiting for your move!",
          "That's not all! Make your move!",
        ],
        ru: [
          'Тогда продолжайте играть!',
          'Тогда продолжайте играть! Я жду, когда вы сделаете свой ход.',
          'Тогда делайте свой ход! Ещё не всё потеряно.',
          'Это ещё не конец, продолжайте играть!',
        ],
      } as LocalizationObject<string[]>)[this.lang]
    );
  }
}
