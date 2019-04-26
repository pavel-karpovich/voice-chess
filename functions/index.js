'use strict';

const functions = require('firebase-functions');
const {dialogflow} = require('actions-on-google');
const Ans = require('./answers');
const Chess = require('./chess');

process.env.DEBUG = 'dialogflow:debug';

const app = dialogflow();

app.middleware((conv) => {
  Ans.setLanguage(conv.user.locale.slice(0, 2));
});

// eslint-disable-next-line require-jsdoc
function respond(conv, answers) {
  for (const answer of answers) {
    conv.ask(answer);
  }
}

app.intent('Default Welcome Intent', (conv) => {
  console.log('welcome');
  respond(conv, Ans.welcome());
});

app.intent('Default Fallback Intent', (conv) => {
  console.log('fallback');
  respond(conv, Ans.fallback());
});

app.intent('New Game', async (conv) => {
  console.log('new game');
  const chess = new Chess();
  await chess.initStartPos();
  conv.user.storage.fen = chess.fenstring;
  respond(conv, Ans.newgame());
});

app.intent('Board', (conv) => {
  console.log('viewing the board');
  const fenstring = conv.user.storage.fen;
  respond(conv, Ans.board(fenstring));
});

app.intent('Turn', async (conv, {from, to, piece}) => {
  console.log('chess turn');
  const move = from + to;
  const fenstring = conv.user.storage.fen;
  const chess = new Chess(fenstring);
  const isLegal = await chess.isMoveLegal(move);
  if (isLegal) {
    await chess.move(move);
    respond(conv, Ans.playerMove(from, to, {piece}));
    await chess.moveAuto();
    const enemyFrom = chess.enemyMove.slice(0, 2);
    const enemyTo = chess.enemyMove.slice(2);
    respond(conv, Ans.enemyMove(enemyFrom, enemyTo, {}));
    conv.user.storage.fen = chess.fenstring;
  } else {
    respond(conv, Ans.illegalMove(from, to, {piece}));
  }
});

module.exports.fulfillment = functions.https.onRequest(app);
