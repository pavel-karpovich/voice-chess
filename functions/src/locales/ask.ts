import { rand, char, upFirst } from '../support/helpers';
import { Vocabulary as Voc } from './vocabulary';
import { rLangs, Langs } from './struct/struct';

// prettier-ignore
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
      } as rLangs)[this.lang]
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
      } as rLangs)[this.lang]
    );
  }
  static ingameTips(): string {
    return ({
      en:
        '<p><s>You are now in the game.</s>' +
        "<s>And I'm wait when you make your next move.</s>" +
        '<s>If you want, you can ask me about the current state of the chessboard.</s>' +
        '<s>I can tell you about a certain board rank, about a particular square or piece, or about color.</s>' +
        '<s>Also I can show you the full or partial history of moves, the number of the current mover, or what color who plays.</s>' +
        '<s>I can list all the moves available to you or give advice on how best to play.</s>' +
        '<s>For any reason, you can always change your last move.</s>' +
        '<s>If needed, I can even make a move automatically for you!</s>' +
        '<s>Of course, at any time you can start a new game or resign if you think you will lose.</s>' +
        '<s>If you want, you can change the difficulty level, and disable/enable confirmation of every move.</s></p>' +
        '<p><s>So, what do you want to do?</s></p>',
      ru:
        '<p><s>Вы сейчас в процессе игры.</s>' +
        '<s>И я ожидаю, когда вы сделаете свой следующий ход.</s>' +
        '<s>Если вы плохо помните расположение фигур, я могу вам всё напомнить.</s>' +
        '<s>Я могу рассказать о конкретном ряде доски, о заданной клетке, о конкретной фигуре или о цвете.</s>' +
        '<s>Также вы можете узнать у меня полную историю ходов, какой ход сейчас по номеру, и за какой цвет вы играете.</s>' +
        '<s>Я могу рассказать вам обо всех доступных ходах, которые вы можете совершить, или дать совет, как лучше походить.</s>' +
        '<s>Если что, вы всегда можете откорректировать один свой последний ход.</s>' +
        '<s>На крайний случай, я могу даже сделать ход автоматически за вас!</s>' +
        '<s>Вы всегда можете начать новую игру, или сдаться, если чувствуете, что проиграли.</s>' +
        '<s>Если вам нужно, вы можете изменить уровень сложности, или включить/отключить необходимость подтверждения каждого хода.</s></p>' +
        '<p><s>Теперь, что вы хотите сделать из этого списка?</s></p>',
    } as Langs)[this.lang];
  }
  static nogameTips(): string {
    return ({
      en:
        '<p><s>You are not in the game now.</s>' +
        '<s>If you have an unfinished game you can continue it.</s>' +
        '<s>Or you can start a new one.</s>' +
        '<s>Or continue the old one if you have an unfinished game.</s>' +
        '<s>In terms of settings, you can change the level of difficulty, ' +
        'and enable/disable confirmation of every move.</s></p>' +
        '<p><s>So, what do you want to do?</s></p>',
      ru:
        '<p><s>Вы сейчас не в игре.</s>' +
        '<s>Если у вас есть незаконченная партия, вы можете продолжить её.</s>' +
        '<s>Или начать новую игру, ведь за этим вы сюда и пришли, разве не так?</s>' +
        '<s>В качестве настроек вы можете отрегулировать уровень сложности игры, ' +
        'а также включить/отключить опцию подтверждения каждого хода.</s></p>' +
        '<p><s>Ну и что вы будете делать?</s></p>',
    } as Langs)[this.lang];
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
      } as rLangs)[this.lang]
    );
  }
  static askToGoNext(): string {
    return rand(
      ({
        en: ['Next?', 'Do you want more?', 'Continue?', 'Go ahead?'],
        ru: ['Дальше?', 'Ещё?', 'Продолжать?', 'Следующая часть?'],
      } as rLangs)[this.lang]
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
      } as rLangs)[this.lang]
    );
  }
  static whatToDo(): string {
    return rand(
      ({
        en: ['And what do you want to do next?'],
        ru: ['И что вы хотите сделать?', 'И что будем делать дальше?'],
      } as rLangs)[this.lang]
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
      } as rLangs)[this.lang]
    );
  }
  static askToMove(): string {
    return rand(
      ({
        en: ['Well, then you need to make a move.', "Ok, then what's your move?"],
        ru: [
          'И как вы будете ходить?',
          'Ладно, и как вы походите?',
          'И какой ваш ход?',
          'Какой вы сделаете ход?',
          'И каков будет ваш ход?',
        ],
      } as rLangs)[this.lang]
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
      } as rLangs)[this.lang]
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
      } as rLangs)[this.lang]
    );
  }
  static waitMove(): string {
    return rand(
      ({
        en: [
          'Now will you make a move?',
          "Ok, what's next? Maybe make your move?",
          "Now it's your turn, and I'm waiting for you to make a move. Have you decided where to go?",
          'Now are you ready to make your move?',
          'I am waiting for your move. What will you do?',
          "I'm waiting for you to make a move. Have you decided where to go?",
        ],
        ru: [
          'Теперь вы будете ходить?',
          'Что дальше? Может быть сделаете свой ход?',
          'Я ожидаю вашего хода. Вы решили куда будете ходить?',
          'Теперь вы готовы походить?',
          'Я жду вашего хода. Что будете делать?',
        ],
      } as rLangs)[this.lang]
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
      } as rLangs)[this.lang]
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
      } as rLangs)[this.lang]
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
      } as rLangs)[this.lang]
    );
  }
  static wantReduceDifficulty(current: number): string {
    return rand(
      ({
        en: [
          'Maybe I just reduce the level of difficulty?',
          `I can just reduce the difficulty because it is set to ${current}. Do this?`,
          `The difficulty is now equal to ${current}. Maybe just reduce it?`,
          'Can we just reduce the level of difficulty? Do you agree?',
          'But what about reducing difficulty? Maybe this is the case?',
        ],
        ru: [
          'Может быть вы хотите просто уменьшить уровень сложности?',
          `Я могу уменьшить сложность, сейчас она равна ${current} из 20. Сделать ниже?`,
          `Уровень сложности сейчас равен ${current}? Может быть вы хотите, чтобы я его уменьшил?`,
          'Может просто обойдёмся уменьшением уровня сложности? Хотите?',
          'А что на счёт уменьшения уровня сложности?',
        ],
      } as rLangs)[this.lang]
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
          `Then, your move is ${Voc.piece(actualPiece)} from ${char(from)} to ${char(to)}?`,
        ],
        ru: [
          `Вы просто перепутали? Будете ходить ${Voc.piece(actualPiece, 'tvr')}?`,
          `Но сам ход корректный. Оставляем его?`,
          `Вы хотели сказать ${Voc.piece(actualPiece)} с ${char(from)} на ${char(to)}?`,
          `Будете ходить ${Voc.piece(actualPiece, 'rod')} с ${char(from)} на ${char(to)}?`,
          `Значит, ${Voc.piece(actualPiece)} ${char(from)} ${char(to)}?`,
        ],
      } as rLangs)[this.lang]
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
      } as rLangs)[this.lang]
    );
  }
  static askToConfirm(from: string, to: string, pieceCode: string): string {
    return rand(
      ({
        en: [
          `${upFirst(Voc.piece(pieceCode))} from ${char(from)} to ${char(to)}, yes?`,
          `${upFirst(Voc.piece(pieceCode))} ${char(from)} ${char(to)}. That's right?`,
          `${upFirst(Voc.piece(pieceCode))} ${char(from)} ${char(to)}. I understood correctly?`,
        ],
        ru: [
          `${upFirst(Voc.piece(pieceCode))} с ${char(from)} на ${char(to)}, да?`,
          `${upFirst(Voc.piece(pieceCode))} ${char(from)} ${char(to)}. Всё верно?`,
          `Вы хотите походить ${Voc.piece(pieceCode, 'tvr')} ${char(from)} ${char(to)}. Верно?`,
        ],
      } as rLangs)[this.lang]
    );
  }
  static askToConfirmCastling(kFrom: string, kTo: string, rFrom: string, rTo: string): string {
    return rand(
      ({
        en: [
          `You are going to castling. The king will go from ${char(kFrom)} to ${char(kTo)}, you confirm?`,
          `When castling, the king will make a double move from ${char(kFrom)} to ${char(kTo)}, and rock from ${char(rFrom)} will move to ${char(rTo)}. Does it suit you?`,
          `When castling, the king will move to the square ${char(kTo)}, and rock will move to ${char(rTo)}. Do you confirm this move?`,
          `Castling a king with a rock will cause the king to move to square ${char(kTo)}, and the rock from ${char(rFrom)} to ${char(rTo)}. Okay?`,
        ],
        ru: [
          `Вы собираетесь выполнить рокировку королём с ${char(kFrom)} на ${char(kTo)}, всё верно?`,
          `При рокировке король переместится на две клетки, с ${char(kFrom)} на ${char(kTo)}, а ладья с ${char(rFrom)} встанет за королём на ${char(rTo)}. Вы подтвержаете ход?`,
          `При рокировке король перейдёт на клетку ${char(kTo)}, а ладья с ${char(rFrom)} встанет на ${char(rTo)}. Вы подтверждаете рокировку?`,
          `Рокировка короля с ладьёй приведёт к перемещению короля на клетку ${char(kTo)}, а ладью на клетку ${char(rTo)}. Вы согласны?`,
        ],
      } as rLangs)[this.lang]
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
      } as rLangs)[this.lang]
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
      } as rLangs)[this.lang]
    );
  }
  static moveToCorrect(from: string, to: string, pieceCode: string): string {
    return rand(
      ({
        en: [
          `How do you want to change the move ${char(from)} ${char(to)}?`,
          `You want to change your last move ${char(from)} ${char(to)}? Ok. To what move?`,
          `What move do you want re-play instead of ${Voc.piece(pieceCode)} ${char(from)} ${char(to)}?`,
          `And how do you want to move instead of ${char(from)} ${char(to)}?`,
          `${Voc.piece(pieceCode)} ${char(from)} ${char(to)} is your last move. And what move will you play instead?`,
        ],
        ru: [
          `Вы хотите изменить ход ${char(from)} ${char(to)}? На какой?`,
          `Какой ход вы хотите сделать вместо ${char(from)} ${char(to)}?`,
          `Значит вы хотите поменять свой ход ${Voc.piece(pieceCode, 'tvr')} ${char(from)} ${char(to)}? На что?`,
          `И как вы хотите походить вместо ${char(from)} ${char(to)}?`,
          `И какой ход вы хотите на замену старому ${char(from)} ${char(to)}?`,
        ],
      } as rLangs)[this.lang]
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
      } as rLangs)[this.lang]
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
      } as rLangs)[this.lang]
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
      } as rLangs)[this.lang]
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
          'Ещё какую-нибудь клетку?',
          'Другая клетка?',
          'Напомнить ещё какую-нибудь позицию?',
        ],
      } as rLangs)[this.lang]
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
      } as rLangs)[this.lang]
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
      } as rLangs)[this.lang]
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
      } as rLangs)[this.lang]
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
      } as rLangs)[this.lang]
    );
  }
  static stillWantToResign(): string {
    return rand(
      ({
        en: [
          'Do you still want to resign?',
          'Do you still want surrender?',
          'Do you still want to give up?',
          'Then you surrender?',
          'Then your choice is still to admit defeat?',
        ],
        ru: [
          'Вы всё так же собираетесь сдаться?',
          'Вы так же твёрдо намерены принять поражение?',
          'Значит вы всё-таки сдаётесь?',
          'Значит вы приняли выбор сдаться?',
          'То есть вы сдаётесь?',
        ],
      } as rLangs)[this.lang]
    );
  }
  static tryAgainOrLater(): string {
    return rand(
      ({
        en: [
          'Please try again.',
          'Please try again later.',
          'You can try again, or contact support.',
          'If this problem persists, please contact support.',
          'You can try again, or make another request.',
        ],
        ru: [
          'Попробуйте ещё раз.',
          'Вы можете попробовать ещё раз, или сделать это позже.',
          'Вы можете попробовать ещё раз, или обратиться в поддержку.',
          'Если данная проблема повторится, пожалуйста, обратитесь в поддержку.',
          'Вы можете попробовать ещё раз, или сделать другой запрос.',
        ],
      } as rLangs)[this.lang]
    );
  }
}
