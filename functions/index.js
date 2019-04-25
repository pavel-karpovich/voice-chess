/* eslint-disable max-len */
// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';

const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');
const loadEngine = require('stockfish');
const path = require('path');

process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements


exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({request, response});
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));

  /**
   *
   * @param {WebhookClient} agent
   */
  function welcome(agent) {
    console.log('welcome');
    const ssml = '<speak><p><s>Welcome to the Voice Chess!</s></p></speak>';
    agent.add(ssml);
  }

  /**
   *
   * @param {WebhookClient} agent
   */
  function fallback(agent) {
    console.log('fallback');
    let ssml = '<speak><p><s>I didn\'t understand</s>';
    ssml += '<s>I\'m sorry, can you try again?</s></p></speak>';
    agent.add(ssml);
  }

  /**
   *
   * @param {WebhookAgent} agent
   */
  async function newChessGame(agent) {
    console.log('new game');
    const conv = agent.conv();
    const chess = new Chess();
    await chess.initStartPos();
    conv.user.storage.fen = chess.fenstring;
    const ssml = '<speak><p><s>New game is started.</s><s>Your turn is first!</s></p></speak>';
    conv.ask(ssml);
    agent.add(conv);
  }

  /**
   *
   * @param {WebhookAgent} agent
   */
  async function chessTurn(agent) {
    console.log('chess turn');
    const conv = agent.conv();
    const from = agent.parameters.from;
    const to = agent.parameters.to;
    const piece = agent.parameters.piece;
    const fenstring = conv.user.storage.fen;
    const chess = new Chess(fenstring);

    await chess.move(from + to);
    let ssml1 ='<speak><p><s>The move is made!</s>';
    if (piece) {
      ssml1 += `<s>You move ${piece} from ${from} to ${to}</s></p>`;
    } else {
      ssml1 += `<s>Your move: ${from} ${to}</s></p>`;
    }
    ssml1 += '<p><s>Now is my turn...</s></p><break time="2"/></speak>';
    conv.ask(ssml1);
    await chess.moveAuto();
    const enemyFrom = chess.enemyMove.slice(0, 2);
    const enemyTo = chess.enemyMove.slice(2);
    let ssml2 = `<speak><p><s>I would move from ${enemyFrom} to ${enemyTo}!</s>`;
    ssml2 += '<s>And what do you say to that?</s></p></speak>';
    conv.ask(ssml2);
    conv.user.storage.fen = chess.fenstring;
    agent.add(conv);
  }

  /**
   *
   * @param {WebhookAgent} agent
   */
  function showBoard(agent) {
    console.log('viewing the board');
    const conv = agent.conv();
    const fenstring = conv.user.storage.fen;
    if (fenstring) {
      let ssml1 = '<speak><p><s>You want see the board?</s>';
      ssml1 += '<s>Here it is:</s></p></speak>';
      conv.ask(ssml1);
      const ssml2 = fenstring;
      conv.ask(ssml2);
    } else {
      const ssml = 'There is no chess board yet';
      conv.ask(ssml);
    }
    agent.add(conv);
  }

  // Run the proper function handler based on the matched Dialogflow intent name
  const intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('New game', newChessGame);
  intentMap.set('Turn', chessTurn);
  intentMap.set('Board', showBoard);
  agent.handleRequest(intentMap);
});

/**
 * Class for making move in chess
 */
class Chess {
  /**
   * Chess game with initial board state
   * @param {String} fenstring
   * Callback is needed only when creating new game without fenstring
   */
  constructor(fenstring) {
    this._stockfish = loadEngine(path.join(__dirname, 'node_modules/stockfish/src/stockfish.wasm'));
    this._fen = fenstring;
    this._onMove = null;
    this._stockfish.postMessage('ucinewgame');
    this._stockfish.postMessage('isready');
    if (this._fen) {
      this._stockfish.postMessage(`position fen ${this._fen}`);
    }

    this._stockfish.onmessage = (e) => {
      if (typeof e !== 'string') return;
      if (e.startsWith('bestmove')) {
        this._enemyMove = e.slice(9, 13);
        this._stockfish.postMessage(`position fen ${this._fen} moves ${this._enemyMove}`);
        this._stockfish.postMessage('d');
      } else if (e.startsWith('Fen')) {
        this._fen = e.slice(5);
        if (this._onMove) {
          this._onMove();
        }
      }
    };
  }

  /**
   * Initialize new chess game
   */
  async initStartPos() {
    return new Promise((resolve) => {
      this._onMove = resolve;
      this._stockfish.postMessage('position startpos');
      this._stockfish.postMessage('d');
    });
  }
  /**
   * Player move
   * @param {String} move
   */
  async move(move) {
    return new Promise((resolve) => {
      this._onMove = resolve;
      console.log('move: ' + move);
      this._stockfish.postMessage(`position fen ${this._fen} moves ${move}`);
      this._stockfish.postMessage('d');
    });
  }

  /**
   * Move making by computer
   */
  async moveAuto() {
    return new Promise((resolve) => {
      this._onMove = resolve;
      this._stockfish.postMessage('go depth 8 movetime 10000');
    });
  }

  /**
   * Get fen string - chess board state representation in string
   */
  get fenstring() {
    return this._fen;
  }

  /**
   * Get last enemy's move
   */
  get enemyMove() {
    return this._enemyMove;
  }
}
