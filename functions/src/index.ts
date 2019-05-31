import * as functions from 'firebase-functions';
import { dialogflow, DialogflowConversation } from 'actions-on-google';

import { Answer as Ans } from './answer';
import { Ask } from './ask';
import { Chess, chessBoardSize, ChessGameState } from './chess';
import { ChessBoard, ChessCellInfo } from './chessboard';
import { upFirst } from './helpers';

process.env.DEBUG = 'dialogflow:debug';

interface ConversationData {
  fallbackCount?: number;
  row?: number;
}

interface LongStorageData {
  difficulty?: number;
  fen?: string;
}

type VoiceChessConv = DialogflowConversation<ConversationData, LongStorageData>;

const app = dialogflow<ConversationData, LongStorageData>();

app.middleware(
  (conv: VoiceChessConv): void => {
    if (conv.user.locale) {
      const lang = conv.user.locale.slice(0, 2);
      Ans.setLanguage(lang);
      Ask.setLanguage(lang);
    } else {
      Ans.setLanguage();
      Ask.setLanguage();
    }
  }
);

app.middleware(
  (conv: VoiceChessConv): void => {
    if (
      conv.intent !== 'Default Fallback Intent' &&
      conv.intent !== 'Yes' &&
      conv.intent !== 'No'
    ) {
      conv.data.fallbackCount = 0;
    }
  }
);

function safeGameContext(conv: VoiceChessConv): void {
  const gameContext = conv.contexts.get('game');
  if (gameContext) {
    conv.contexts.set('game', gameContext.lifespan + 1);
  }
}

function whatDoYouWantWithTips(conv: VoiceChessConv): void {
  console.log('what to do with tips');
  if (conv.contexts.get('game')) {
    conv.ask(Ask.ingameTips());
  } else {
    conv.ask(Ask.nogameTips());
  }
}

app.intent(
  'Default Welcome Intent',
  (conv: VoiceChessConv): void => {
    console.log('welcome');
    if (conv.user.storage.difficulty === undefined) {
      conv.user.storage.difficulty = 2;
      conv.ask(Ans.firstPlay());
      conv.ask(Ask.askToNewGame());
      conv.contexts.set('ask-to-new-game', 1);
    } else if (conv.user.storage.fen === undefined) {
      conv.ask(Ans.welcome());
      conv.ask(Ask.askToNewGame());
      conv.contexts.set('ask-to-new-game', 1);
    } else {
      conv.contexts.set('ask-to-continue', 1);
      conv.ask(Ans.welcome());
      conv.ask(Ask.askToContinue());
    }
  }
);

function fallbackHandler(conv: VoiceChessConv): void {
  console.log('fallback');
  for (const context of conv.contexts) {
    context.lifespan++;
  }
  // const fallbacks = parseInt(conv.data.fallbackCount);
  const fallbacks = conv.data.fallbackCount;
  if (isNaN(fallbacks) || fallbacks < 2) {
    if (fallbacks === 1) {
      conv.data.fallbackCount = 2;
    } else {
      conv.data.fallbackCount = 1;
    }
    conv.ask(Ans.firstFallback());
  } else if (fallbacks < 4) {
    conv.data.fallbackCount = fallbacks + 1;
    conv.ask(Ans.secondFallback());
    whatDoYouWantWithTips(conv);
  } else {
    conv.close(Ans.confusedExit());
  }
}
app.intent('Default Fallback Intent', fallbackHandler);

function startNewGame(conv: VoiceChessConv): void {
  console.log('new game');
  conv.user.storage.fen = Chess.initialFen;
  conv.ask(Ans.newgame());
  conv.ask(Ask.chooseSide());
}
app.intent('New Game', startNewGame);

function continueGame(conv: VoiceChessConv): void {
  console.log('continue game');
  const fenstring = conv.user.storage.fen;
  if (!fenstring) {
    conv.ask(Ans.noGameToContinue());
    conv.ask(Ask.askToNewGame());
    conv.contexts.set('ask-to-new-game', 1);
    return;
  }
  conv.contexts.set('game', 5);
  conv.contexts.set('turn-showboard', 1);
  conv.ask(Ans.continueGame());
  conv.ask(Ask.askToRemindBoard());
}
app.intent('Continue', continueGame);

function showRow(row: ChessCellInfo[], rowNum: number): string {
  let resultString = '';
  if (row.every(el => el.val === null)) {
    const emptyRowString = upFirst(Ans.emptyRow(rowNum));
    resultString += emptyRowString + '\n';
  } else {
    resultString += Ans.nRow(rowNum) + ': ';
    for (const cell of row) {
      if (cell.val !== null) {
        resultString += Ans.coloredPieceOnPosition(cell.val, cell.pos) + ', ';
      }
    }
    resultString = resultString.slice(0, -2) + '.\n';
  }
  return resultString;
}

function beginShowingTheBoard(conv: VoiceChessConv): void {
  console.log('viewing the board');
  const fenstring = conv.user.storage.fen;
  if (!fenstring) {
    conv.ask(Ans.noboard());
    conv.ask(Ask.askToNewGame());
    conv.contexts.set('ask-to-new-game', 1);
    return;
  }
  const board = new ChessBoard(fenstring);
  let longString = `<speak><p><s>${Ans.board1()}</s></p>\n`;
  for (let i = 1; i < chessBoardSize + 1; ++i) {
    longString += showRow(board.row(i), i);
  }
  longString += '</speak>';
  conv.contexts.set('board-followup', 1);
  conv.ask(longString);
  conv.ask(Ask.askToGoNext());
}
app.intent('Board', beginShowingTheBoard);

app.intent(
  'Board - next',
  (conv: VoiceChessConv): void => {
    console.log('board - next');
    const fenstring = conv.user.storage.fen;
    const board = new ChessBoard(fenstring);
    let longString = `<speak><p><s>${Ans.board2()}</s></p>\n`;
    for (let i = chessBoardSize / 2 + 1; i < chessBoardSize + 1; ++i) {
      longString += showRow(board.row(i), i);
    }
    longString += '</speak>';
    conv.contexts.set('turn-intent', 1);
    conv.ask(longString);
    conv.ask(Ask.waitMove());
  }
);

function rowHandler(
  conv: VoiceChessConv,
  { ord, num }: { ord?: number; num?: number }
): void {
  console.log('Single row');
  console.log(`Ordinal: ${ord}, number: ${num}`);
  const fenstring = conv.user.storage.fen;
  if (!fenstring) {
    conv.ask(Ans.noboard());
    conv.ask(Ask.askToNewGame());
    conv.contexts.set('ask-to-new-game', 1);
    return;
  }
  const board = new ChessBoard(fenstring);
  // parseInt
  const rowNum = num ? num : ord;
  if (!isNaN(rowNum)) {
    if (rowNum < 1 || rowNum > 8) {
      conv.data.row = undefined;
      conv.ask(Ans.incorrectRowNumber(rowNum));
      conv.ask(Ask.askRowNumber());
    }
    conv.data.row = rowNum;
    conv.ask(`<speak>${showRow(board.row(rowNum), rowNum)}</speak>`);
    conv.ask(Ask.askToGoNext());
    conv.contexts.set('row-followup', 1);
  } else {
    conv.ask(Ask.askRowNumber());
    conv.data.row = undefined;
  }
}

app.intent('Row', rowHandler);
app.intent('Row - number', rowHandler);

app.intent(
  'Row - next',
  (conv: VoiceChessConv): void => {
    console.log('next row');
    const lastRow = conv.data.row;
    if (lastRow === 8) {
      conv.ask(Ans.noNextRow());
      conv.ask(Ask.waitMove());
      conv.contexts.set('turn-intent', 1);
      return;
    }
    conv.contexts.set('row-followup', 1);
    const fenstring = conv.user.storage.fen;
    const board = new ChessBoard(fenstring);
    const thisRow = lastRow + 1;
    conv.data.row = thisRow;
    conv.ask(`<speak>${showRow(board.row(thisRow), thisRow)}</speak>`);
    if (thisRow === 8) {
      conv.ask(Ask.whatToDo());
    } else {
      conv.ask(Ask.askToGoNext());
    }
  }
);

app.intent(
  'Turn',
  async (
    conv: VoiceChessConv,
    { from, to, piece }: { from: string; to: string; piece?: string }
  ): Promise<void> => {
    console.log('chess turn');
    from = from.toLowerCase();
    to = to.toLowerCase();
    const move = from + to;
    console.log(`From: ${from}, to: ${to}`);
    const fenstring = conv.user.storage.fen;
    const difficulty = conv.user.storage.difficulty;
    const chess = new Chess(fenstring, difficulty);
    await chess.updateGameState();
    if (chess.currentGameState === ChessGameState.CHECKMATE) {
      conv.ask(Ans.youLose());
      conv.ask(Ask.askToNewGame());
      conv.contexts.set('ask-to-new-game', 1);
      return;
    }
    const isLegal = await chess.isMoveLegal(move);
    if (isLegal) {
      await chess.move(move);
      let ask = Ans.playerMove(from, to, { piece });
      if (chess.currentGameState as ChessGameState === ChessGameState.CHECKMATE) {
        conv.ask(`<speak>${ask}\n${Ans.youWin()}</speak>`);
        conv.ask(Ask.askToNewGame());
        conv.contexts.set('ask-to-new-game', 1);
        return;
      } else if (chess.currentGameState === ChessGameState.CHECK) {
        ask += '\n' + Ans.checkToEnemy();
      }
      conv.ask(`<speak>${ask}</speak>`);
      await chess.moveAuto();
      const enemyFrom = chess.enemyMove.slice(0, 2);
      const enemyTo = chess.enemyMove.slice(2);
      let enemyStr = Ans.enemyMove(enemyFrom, enemyTo, {});
      if (chess.currentGameState as ChessGameState === ChessGameState.CHECKMATE) {
        conv.ask(`${enemyStr}\n${Ans.youLose()}\n${Ask.askToNewGame()}`);
        conv.contexts.set('ask-to-new-game', 1);
        return;
      } else if (chess.currentGameState === ChessGameState.CHECK) {
        enemyStr += '\n' + Ans.checkToPlayer();
      }
      const askYouStr = Ask.nowYouNeedToMove();
      conv.ask(`<speak>${enemyStr}\n${askYouStr}</speak>`);
      conv.user.storage.fen = chess.fenstring;
    } else {
      const fiftyFifty = Math.random();
      let illegal = Ans.illegalMove(from, to, { piece });
      if (chess.currentGameState === ChessGameState.CHECK) {
        illegal = Ans.checkToPlayer() + '\n' + illegal;
      }
      conv.ask(`<speak>${illegal}</speak>`);
      if (fiftyFifty < 0.5) {
        conv.ask(Ask.askToMoveAgain());
      } else {
        conv.ask(Ask.askToRemindBoard());
        conv.contexts.set('turn-showboard', 1);
      }
    }
  }
);

app.intent(
  'Choose Side',
  async (conv: VoiceChessConv, { side }: { side: string }): Promise<void> => {
    console.log('choosing side: ' + side);
    side = side.toLowerCase();
    if (side === 'white') {
      conv.ask(Ans.whiteSide());
      conv.ask(Ask.askToMove());
    } else {
      conv.ask(Ans.blackSide());
      const fenstring = conv.user.storage.fen;
      // const difficulty = parseInt(conv.user.storage.difficulty);
      const difficulty = conv.user.storage.difficulty;
      const chess = new Chess(fenstring, difficulty);
      await chess.moveAuto();
      const enemyFrom = chess.enemyMove.slice(0, 2);
      const enemyTo = chess.enemyMove.slice(2);
      conv.user.storage.fen = chess.fenstring;
      const enemyStr = Ans.enemyMove(enemyFrom, enemyTo, {});
      const askYouStr = Ask.nowYouNeedToMove();
      conv.ask(`<speak>${enemyStr}\n${askYouStr}</speak>`);
    }
  }
);

app.intent(
  'Difficulty',
  (conv: VoiceChessConv): void => {
    console.log('difficulty');
    safeGameContext(conv);
    //const currentDifficulty = parseInt(conv.user.storage.difficulty);
    const currentDifficulty = conv.user.storage.difficulty;
    conv.contexts.set('difficulty-followup', 1);
    conv.ask(Ans.showDifficulty(currentDifficulty));
    conv.ask(Ask.askToChangeDifficulty());
  }
);

app.intent(
  'Difficulty - number',
  (
    conv: VoiceChessConv,
    { ord, num }: { ord?: number; num?: number }
  ): void => {
    console.log('difficulte - number');
    safeGameContext(conv);
    if (ord || num) {
      // const currentDifficulty = parseInt(conv.user.storage.difficulty);
      // const newDifficulty = parseInt(number ? number : ordinal);
      const currentDifficulty = conv.user.storage.difficulty;
      const newDifficulty = num ? num : ord;
      if (currentDifficulty === newDifficulty) {
        conv.ask(Ans.difficultyTheSame(newDifficulty));
      } else {
        conv.ask(Ans.difficultyChanged(newDifficulty, currentDifficulty));
      }
      const game = conv.contexts.get('game');
      if (game !== undefined) {
        conv.ask(Ask.waitMove());
        conv.contexts.set('turn-intent', 1);
      } else {
        conv.ask(Ask.askToNewGame());
        conv.contexts.set('ask-to-new-game', 1);
      }
    } else {
      conv.ask(Ask.difficultyWithoutValue());
      conv.contexts.set('difficulty-followup', 1);
    }
  }
);

app.intent(
  'No',
  (conv: VoiceChessConv): void => {
    console.log('no');
    safeGameContext(conv);
    let isFallback = false;
    if (conv.contexts.get('turn-intent')) {
      conv.ask(Ask.askWhatever());
    } else if (conv.contexts.get('ask-to-new-game')) {
      conv.ask(Ask.whatToDo());
    } else if (conv.contexts.get('ask-to-continue')) {
      conv.ask(Ask.askToNewGame());
      conv.contexts.set('ask-to-new-game', 1);
    } else if (conv.contexts.get('turn-showboard')) {
      conv.ask(Ask.askToMove());
    } else {
      isFallback = true;
      fallbackHandler(conv);
    }
    if (!isFallback) {
      conv.data.fallbackCount = 0;
    }
  }
);

app.intent(
  'Yes',
  (conv: VoiceChessConv): void => {
    console.log('yes');
    safeGameContext(conv);
    let isFallback = false;
    if (conv.contexts.get('turn-intent')) {
      conv.ask(Ask.askToMove());
    } else if (conv.contexts.get('ask-to-new-game')) {
      startNewGame(conv);
    } else if (conv.contexts.get('ask-to-continue')) {
      continueGame(conv);
    } else if (conv.contexts.get('turn-showboard')) {
      beginShowingTheBoard(conv);
    } else {
      isFallback = true;
      fallbackHandler(conv);
    }
    if (!isFallback) {
      conv.data.fallbackCount = 0;
    }
  }
);

module.exports.fulfillment = functions.https.onRequest(app);
