'use strict';

const functions = require('firebase-functions');
const {dialogflow} = require('actions-on-google');
const Ans = require('./answers');
const Chess = require('./chess');
const Helpers = require('./helpers');

process.env.DEBUG = 'dialogflow:debug';

const app = dialogflow();

app.middleware((conv) => {
  if (conv.user.locale) {
    Ans.setLanguage(conv.user.locale.slice(0, 2));
  } else {
    Ans.setLanguage();
  }
});

app.middleware((conv) => {
  if (conv.intent !== 'Default Fallback Intent' &&
      conv.intent !== 'Yes' && conv.intent !== 'No') {
    conv.data.fallbackCount = 0;
  }
});

app.intent('Default Welcome Intent', (conv) => {
  console.log('welcome');
  if (conv.user.storage.difficulty === undefined) {
    conv.ask(...Ans.firstPlay());
    conv.user.storage.difficulty = 2;
  } else if (conv.user.storage.fen === undefined) {
    conv.ask(...Ans.welcomeNoGame());
    conv.contexts.set('Welcome-new', 1);
  } else {
    conv.ask(...Ans.welcomeWithGame());
    conv.contexts.set('Welcome-continue', 1);
  }
  conv.ask(...Ans.welcome());
});

// eslint-disable-next-line require-jsdoc
function fallbackHandler(conv) {
  console.log('fallback');
  // TODO: for all contexts -> + 1
  const fallbacks = parseInt(conv.data.fallbackCount);
  if (isNaN(fallbacks) || fallbacks < 2) {
    conv.ask(...Ans.firstFallback());
    if (fallbacks === 1) {
      conv.data.fallbackCount = 2;
    } else {
      conv.data.fallbackCount = 1;
    }
  } else if (fallbacks < 4) {
    conv.data.fallbackCount = fallbacks + 1;
    conv.ask(Ans.secondFallback()[0]);
    if (conv.contexts.get('game')) {
      conv.ask(Ans.ingameTips()[0]);
    } else {
      conv.ask(Ans.nogameTips()[0]);
    }
  } else {
    conv.close(...Ans.confusedExit());
  }
}

app.intent('Default Fallback Intent', fallbackHandler);

// eslint-disable-next-line require-jsdoc
function whatDoYouWant(conv) {
  console.log('nothing');
  if (conv.contexts.get('game')) {
    conv.ask(Ans.ingameTips()[0]);
  } else {
    conv.ask(Ans.nogameTips()[0]);
  }
}
// eslint-disable-next-line require-jsdoc
function startNewGame(conv) {
  console.log('new game');
  conv.user.storage.fen = Chess.initialFen;
  conv.ask(...Ans.newgame());
}

app.intent('New Game', startNewGame);

// eslint-disable-next-line require-jsdoc
function askToCreateNewGame(conv) {
  console.log('ask to create new game');
  conv.ask(...Ans.askToNewGame());
  conv.contexts.set('Welcome-new', 1);
}

// eslint-disable-next-line require-jsdoc
function continueGame(conv) {
  console.log('continue game');
  const fenstring = conv.user.storage.fen;
  if (!fenstring) {
    conv.ask(...Ans.noGameToContinue());
    conv.contexts.set('Welcome-new', 1);
    return;
  }
  conv.ask(...Ans.continueGame());
  conv.contexts.set('game', 5);
  conv.contexts.set('Turn-followup', 1);
}

app.intent('Continue', continueGame);

// eslint-disable-next-line require-jsdoc
function showRow(board, rowNum) {
  let resultString = '';
  if (board[rowNum - 1].every((el) => el.val === null)) {
    const emptyRowString = Helpers.upFirst(Ans.emptyRow(rowNum));
    resultString += emptyRowString + '.\n';
  } else {
    resultString += Ans.nRow(rowNum) + ': ';
    for (let i = 0; i < board[rowNum - 1].length; ++i) {
      const cell = board[rowNum - 1][i];
      if (cell.val !== null) {
        resultString += Ans.coloredPieceOnPosition(cell.val, cell.pos) + ', ';
      }
    }
    resultString = resultString.slice(0, -2) + '.\n';
  }
  return resultString;
}

// eslint-disable-next-line require-jsdoc
function beginShowingTheBoard(conv) {
  console.log('viewing the board');
  const fenstring = conv.user.storage.fen;
  if (!fenstring) {
    conv.ask(...Ans.noboard());
    return;
  }
  conv.ask(...Ans.board1());
  const board = Chess.parseBoard(fenstring);
  let longString = '<speak>\n';
  for (let i = 0; i < board.length / 2; ++i) {
    longString += showRow(board, i + 1);
  }
  longString += '</speak>';
  conv.ask(longString);
}

app.intent('Board', beginShowingTheBoard);

app.intent('Board - next', (conv) => {
  console.log('viewing the board');
  const fenstring = conv.user.storage.fen;
  conv.ask(...Ans.board2());
  const board = Chess.parseBoard(fenstring);
  let longString = '<speak>\n';
  for (let i = board.length / 2; i < board.length; ++i) {
    longString += showRow(board, i + 1);
  }
  longString += '</speak>';
  conv.ask(longString);
});

// eslint-disable-next-line require-jsdoc
function rowHandler(conv, {ordinal, number}) {
  console.log('showing a single row');
  console.log(`Ordinal: ${ordinal}, number: ${number}`);
  const fenstring = conv.user.storage.fen;
  if (!fenstring) {
    conv.ask(...Ans.noboard());
    return;
  }
  const board = Chess.parseBoard(fenstring);
  const rowNum = parseInt(number ? number : ordinal);
  if (!isNaN(rowNum)) {
    conv.ask('<speak>' + showRow(board, rowNum) + '</speak>');
    conv.data.row = rowNum;
  } else {
    const ans = Ans.rowWithoutNumber();
    console.log(ans);
    conv.ask(...ans);
  }
}

app.intent('Row', rowHandler);
app.intent('Row - number', rowHandler);

app.intent('Row - next', (conv) => {
  console.log('next row');
  const lastRow = parseInt(conv.data.row);
  if (lastRow === 8) {
    conv.ask(...Ans.noNextRow());
    return;
  }
  const fenstring = conv.user.storage.fen;
  const board = Chess.parseBoard(fenstring);
  const nextRow = lastRow + 1;
  conv.ask('<speak>' + showRow(board, nextRow) + '</speak>');
  conv.data.row = nextRow;
});

app.intent('Turn', async (conv, {from, to, piece}) => {
  console.log('chess turn');
  from = from.toLowerCase();
  to = to.toLowerCase();
  const move = from + to;
  console.log(`From: ${from}, to: ${to}`);
  const fenstring = conv.user.storage.fen;
  const difficulty = parseInt(conv.user.storage.difficulty);
  const chess = new Chess(fenstring, difficulty);
  const isLegal = await chess.isMoveLegal(move);
  if (isLegal) {
    await chess.move(move);
    conv.ask(...Ans.playerMove(from, to, {piece}));
    await chess.moveAuto();
    const enemyFrom = chess.enemyMove.slice(0, 2);
    const enemyTo = chess.enemyMove.slice(2);
    conv.ask(...Ans.enemyMove(enemyFrom, enemyTo, {}));
    conv.user.storage.fen = chess.fenstring;
  } else {
    const fiftyFifty = Math.random();
    if (fiftyFifty < 0.5) {
      conv.ask(...Ans.illegalMove(from, to, {piece}));
    } else {
      conv.contexts.set('Turn-followup', 1);
      conv.ask(...Ans.illegalMoveToBoardInfo(from, to, {piece}));
    }
  }
});

app.intent('Choose Side', async (conv, {side}) => {
  console.log('choosing side: ' + side);
  side = side.toLowerCase();
  if (side === 'white') {
    conv.ask(...Ans.whiteSide());
  } else {
    conv.ask(...Ans.blackSide());
    const fenstring = conv.user.storage.fen;
    const difficulty = parseInt(conv.user.storage.difficulty);
    const chess = new Chess(fenstring, difficulty);
    await chess.moveAuto();
    const enemyFrom = chess.enemyMove.slice(0, 2);
    const enemyTo = chess.enemyMove.slice(2);
    conv.ask(...Ans.enemyMove(enemyFrom, enemyTo, {}));
    conv.user.storage.fen = chess.fenstring;
  }
});

app.intent('Difficulty', (conv) => {
  console.log('difficulty');
  const currentDifficulty = parseInt(conv.user.storage.difficulty);
  conv.ask(...Ans.difficulty(currentDifficulty));
});

app.intent('Difficulty - number', (conv, {number, ordinal}) => {
  console.log('difficulte - number');
  if (ordinal || number) {
    const currentDifficulty = parseInt(conv.user.storage.difficulty);
    const newDifficulty = parseInt(number ? number : ordinal);
    if (currentDifficulty === newDifficulty) {
      conv.ask(...Ans.difficultyTheSame(newDifficulty));
    } else {
      conv.ask(...Ans.difficultyChanged(newDifficulty, currentDifficulty));
    }
  } else {
    conv.contexts.set('Difficulty-followup', 2);
    conv.ask(...Ans.difficultyWithoutValue());
  }
});

app.intent('No', (conv) => {
  console.log('no');
  // const gameContext = conv.contexts.get('game');
  // if (gameContext) {
  //   conv.contexts.set('game', gameContext.lifespan + 1);
  // }
  if (conv.contexts.get('Welcome-new')) {
    conv.data.fallbackCount = 0;
    whatDoYouWant(conv);
  } else if (conv.contexts.get('Welcome-continue')) {
    conv.data.fallbackCount = 0;
    askToCreateNewGame(conv);
  } else if (conv.contexts.get('Turn-followup')) {
    conv.data.fallbackCount = 0;
    conv.ask(...Ans.askToMove());
  } else {
    fallbackHandler(conv);
  }
});

app.intent('Yes', (conv) => {
  console.log('yes');
  // const gameContext = conv.contexts.get('game');
  // if (gameContext) {
  //   conv.contexts.set('game', gameContext.lifespan + 1);
  // }
  if (conv.contexts.get('Welcome-new')) {
    conv.data.fallbackCount = 0;
    startNewGame(conv);
  } else if (conv.contexts.get('Welcome-continue')) {
    conv.data.fallbackCount = 0;
    continueGame(conv);
  } else if (conv.contexts.get('Turn-followup')) {
    conv.data.fallbackCount = 0;
    beginShowingTheBoard(conv);
  } else {
    fallbackHandler(conv);
  }
});

module.exports.fulfillment = functions.https.onRequest(app);
