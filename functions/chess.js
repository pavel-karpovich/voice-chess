
const loadEngine = require('stockfish');
const path = require('path');

/**
 * Class for making move in chess
 */
module.exports = class Chess {
  /**
   * Chess game with initial board state
   * @param {String} fenstring
   * @param {Number} difficulty
   * Callback is needed only when creating new game without fenstring
   */
  constructor(fenstring, difficulty) {
    const stockfishWasm = 'node_modules/stockfish/src/stockfish.wasm';
    this._stockfish = loadEngine(path.join(__dirname, stockfishWasm));
    this._fen = fenstring;
    this._onMove = null;
    this._onLegalMoves = null;
    this._stockfish.postMessage('ucinewgame');
    this._stockfish.postMessage('isready');
    this._configureDifficulty(difficulty);
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
   * Set given level of difficulty in the Stockfish Engine
   * @param {Number} level
   */
  _configureDifficulty(level) {
    if (level < 0) {
      level = 0;
    }
    if (level > 20) {
      level = 20;
    }
    this._depth = level === 0 ? 1 : level / 2;
    const setopt = 'setoption name Skill Level ';
    this._stockfish.postMessage(setopt + 'value ' + level);
    const errProb = Math.round((level * 6.35) + 1);
    const maxErr = Math.round((level * -0.25) + 5);
    this._stockfish.postMessage(setopt + 'Maximum Error value ' + maxErr);
    this._stockfish.postMessage(setopt + 'Probability value ' + errProb);
  }

  /**
   * The const fen string value of te start chess position
   */
  static get initialFen() {
    return 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
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
      this._stockfish.postMessage(`go depth ${this._depth} movetime 2000`);
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

  /**
   * Parse fen string into 2-dim array
   * @param {String} fen fen string
   * @return {Array} 2-dim array with board data
   */
  static parseBoard(fen) {
    const board = new Array(8);
    const columns = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const fenRows = fen.split(/[// ]/);
    for (let i = 0; i < board.length; ++i) {
      board[i] = new Array(8);
      let j = 0;
      for (const code of fenRows[i]) {
        const int = parseInt(code);
        if (isNaN(int)) {
          board[i][j] = {pos: columns[j] + (i + 1), val: code};
          ++j;
        } else {
          for (let k = 0; k < int; ++k, ++j) {
            board[i][j] = {pos: columns[j] + (i + 1), val: null};
          }
        }
      }
    }
    return board;
  }
};
