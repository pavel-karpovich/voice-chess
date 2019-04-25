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
    agent.add(`Default welcome handler`);
  }

  /**
   *
   * @param {WebhookClient} agent
   */
  function fallback(agent) {
    console.log('fallback');
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }


  /**
   *
   * @param {WebhookAgent} agent
   */
  async function newChessGame(agent) {
    console.log('new game');
    try {
      const conv = agent.conv();
      const chess = new Chess();
      console.log(conv);
      console.log(conv.user);
      console.log(conv.user.storage);
      conv.user.storage.fen = chess.fenstring;
      agent.add('A new game is started.');
      agent.add('Your turn is first!');
      agent.add(conv);
    } catch (e) {
      console.log(e);
    }
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

    chess.move(from + to, () => {
      agent.add('The move is made!');
      if (piece) {
        agent.add(`You move ${piece} from ${from} to ${to}`);
      } else {
        agent.add(`Your move: ${from} ${to}`);
      }
      agent.add('Now is my turn...');
      chess.moveAuto(() => {
        const enemyFrom = chess.enemyMove.slice(0, 2);
        const enemyTo = chess.enemyMove.slice(2);
        agent.add(`I would move from ${enemyFrom} to ${enemyTo}!`);
        agent.add('And what do you say to that?');
        conv.user.storage.fen = chess.fenstring;
        agent.add(conv);
      });
    });
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
      agent.add('You want see the board?');
      agent.add('Here it is:');
      agent.add(fenstring);
    } else {
      agent.add('There is no chess board yet');
    }
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
   * @param {Function} cb
   * Callback is needed only when creating new game without fenstring
   */
  constructor(fenstring, cb) {
    this._stockfish = loadEngine(path.join(__dirname, 'node_modules/stockfish/src/stockfish.wasm'));
    this._fen = fenstring;
    this._onMove = cb;
    this._stockfish.postMessage('ucinewgame');
    this._stockfish.postMessage('isready');
    if (this._fen) {
      this._stockfish.postMessage(`position fen ${this._fen}`);
    }
    this._onMove = null;

    this._stockfish.onmessage = function(e) {
      if (e.startsWith('bestmove')) {
        this._enemyMove = e.slice(8, 13);
        this._stockfish.postMessage(`position fen ${this._fen} moves ${bestMove}`);
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
   * @param {Function} cb
   */
  initStartPos(cb) {
    this._stockfish.postMessage('position startpos');
    this._stockfish.postMessage('d');
  }
  /**
   * Player move
   * @param {String} move
   * @param {Function} cb
   */
  move(move, cb) {
    this._onMove = cb;
    this._stockfish.postMessage(`position fen ${this._fen} moves ${move}`);
    this._stockfish.postMessage('d');
  }

  /**
   * Move making by computer
   * @param {Function} cb
   */
  moveAuto(cb) {
    this._onMove = cb;
    this._stockfish.postMessage('go depth 8 movetime 10000');
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
