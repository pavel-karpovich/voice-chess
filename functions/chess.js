
const loadEngine = require('stockfish');
const path = require('path');

/**
 * Class for making move in chess
 */
module.exports = class Chess {
  /**
   * Chess game with initial board state
   * @param {String} fenstring
   * Callback is needed only when creating new game without fenstring
   */
  constructor(fenstring) {
    const stockfishWasm = 'node_modules/stockfish/src/stockfish.wasm';
    this._stockfish = loadEngine(path.join(__dirname, stockfishWasm));
    this._fen = fenstring;
    this._onMove = null;
    this._onLegalMoves = null;
    this._stockfish.postMessage('ucinewgame');
    this._stockfish.postMessage('isready');
    if (this._fen) {
      this._stockfish.postMessage(`position fen ${this._fen}`);
    }

    this._stockfish.onmessage = (e) => {
      if (typeof e !== 'string') return;
      if (e.startsWith('bestmove')) {
        this._enemyMove = e.slice(9, 13);
        const command = `position fen ${this._fen} moves ${this._enemyMove}`;
        this._stockfish.postMessage(command);
        this._stockfish.postMessage('d');
      } else if (e.startsWith('Fen') && this._onMove) {
        this._fen = e.slice(5);
        this._onMove();
        this._onMove = null;
      } else if (e.startsWith('Legal uci moves') && this._onLegalMoves) {
        const moves = e.slice(17).split(' ');
        this._onLegalMoves(moves);
        this._onLegalMoves = null;
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
   * Get legal moves for current board position
   */
  async getLegalMoves() {
    return new Promise((resolve) => {
      this._onLegalMoves = resolve;
      this._stockfish.postMessage('d');
    });
  }

  /**
   * Checks if this move is allowed
   * @param {String} move
   */
  async isMoveLegal(move) {
    const legalMoves = await this.getLegalMoves();
    return legalMoves.indexOf(move) !== -1;
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
};
