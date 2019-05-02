const loadEngine = require('stockfish');
import * as path from 'path';
const stockfishPath = '../node_modules/stockfish/src/stockfish.wasm';

export interface ChessboardCell {
  pos: string;
  val: string;
}

/**
 * Class for making move in chess
 */
export class Chess {
  private stockfish: any;
  private fen: string;
  private onMove: () => void;
  private onLegalMoves: (moves: string[]) => void;
  private enemyMoveValue: string;
  private depth: number;
  /**
   * Chess game with initial board state
   * @param {string} fenstring
   * @param {number} difficulty
   * Callback is needed only when creating new game without fenstring
   */
  constructor(fenstring: string, difficulty: number) {
    const stockfishWasm = stockfishPath;
    this.stockfish = loadEngine(path.join(__dirname, stockfishWasm));
    this.fen = fenstring;
    this.onMove = null;
    this.onLegalMoves = null;
    this.enemyMoveValue = null;
    this.stockfish.postMessage('ucinewgame');
    this.stockfish.postMessage('isready');
    this.configureDifficulty(difficulty);
    if (this.fen) {
      this.stockfish.postMessage(`position fen ${this.fen}`);
    }

    this.stockfish.onmessage = (e: any) => {
      if (typeof e !== 'string') return;
      if (e.startsWith('bestmove')) {
        this.enemyMoveValue = e.slice(9, 13);
        const command = `position fen ${this.fen} moves ${this.enemyMove}`;
        this.stockfish.postMessage(command);
        this.stockfish.postMessage('d');
      } else if (e.startsWith('Fen') && this.onMove) {
        this.fen = e.slice(5);
        this.onMove();
        this.onMove = null;
      } else if (e.startsWith('Legal uci moves') && this.onLegalMoves) {
        const moves = e.slice(17).split(' ');
        this.onLegalMoves(moves);
        this.onLegalMoves = null;
      }
    };
  }

  /**
   * Set given level of difficulty in the Stockfish Engine
   * @param {number} level
   */
  private configureDifficulty(level: number): void {
    if (level < 0) {
      level = 0;
    }
    if (level > 20) {
      level = 20;
    }
    this.depth = level === 0 ? 1 : level / 2;
    const setopt = 'setoption name Skill Level ';
    this.stockfish.postMessage(setopt + 'value ' + level);
    const errProb = Math.round(level * 6.35 + 1);
    const maxErr = Math.round(level * -0.25 + 5);
    this.stockfish.postMessage(setopt + 'Maximum Error value ' + maxErr);
    this.stockfish.postMessage(setopt + 'Probability value ' + errProb);
  }

  /**
   * The const fen string value of te start chess position
   */
  static get initialFen(): string {
    return 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
  }

  /**
   * Get legal moves for current board position
   */
  async getLegalMoves(): Promise<string[]> {
    return new Promise((resolve: (moves: string[]) => void) => {
      this.onLegalMoves = resolve;
      this.stockfish.postMessage('d');
    });
  }

  /**
   * Checks if this move is allowed
   * @param {string} move
   */
  async isMoveLegal(move: string): Promise<boolean> {
    const legalMoves = await this.getLegalMoves();
    return legalMoves.indexOf(move) !== -1;
  }

  /**
   * Player move
   * @param {string} move
   */
  async move(move: string): Promise<{}> {
    return new Promise((resolve: () => void) => {
      this.onMove = resolve;
      console.log('move: ' + move);
      this.stockfish.postMessage(`position fen ${this.fen} moves ${move}`);
      this.stockfish.postMessage('d');
    });
  }

  /**
   * Move making by computer
   */
  async moveAuto(): Promise<{}> {
    return new Promise((resolve: () => void) => {
      this.onMove = resolve;
      this.stockfish.postMessage(`go depth ${this.depth} movetime 2000`);
    });
  }

  /**
   * Get fen string - chess board state representation in string
   */
  get fenstring() {
    return this.fen;
  }

  /**
   * Get last enemy's move
   */
  get enemyMove() {
    return this.enemyMoveValue;
  }

  /**
   * Parse fen string into 2-dim array
   * @param {string} fen fen string
   * @return {ChessboardCell[][]} 2-dim array with board data
   */
  static parseBoard(fen: string): ChessboardCell[][] {
    const board = new Array(8);
    const columns = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const fenRows = fen.split(/[// ]/);
    for (let i = 0; i < board.length; ++i) {
      board[i] = new Array(8);
      let j = 0;
      for (const code of fenRows[i]) {
        const int = Number(code);
        if (isNaN(int)) {
          board[i][j] = { pos: columns[j] + (i + 1), val: code };
          ++j;
        } else {
          for (let k = 0; k < int; ++k, ++j) {
            board[i][j] = { pos: columns[j] + (i + 1), val: null };
          }
        }
      }
    }
    return board;
  }
}
