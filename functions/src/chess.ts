const loadEngine = require('stockfish');
import * as path from 'path';
const stockfishPath = '../node_modules/stockfish/src/stockfish.wasm';

export const chessBoardSize = 8;

export enum ChessGameState {
  OK = 1,
  CHECK = 2,
  CHECKMATE = 3,
  STALEMATE = 4,
}

/**
 * Class for making move in chess
 */
export class Chess {
  private stockfish: any;
  private fen: string;
  private moves: string[];
  private checkers: string[];
  private onChangeGameState: () => void;
  private enemy: string;
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
    this.onChangeGameState = null;
    this.enemy = null;
    this.stockfish.postMessage('ucinewgame');
    this.stockfish.postMessage('isready');
    this.configureDifficulty(difficulty);
    if (this.fen) {
      this.stockfish.postMessage(`position fen ${this.fen}`);
    }

    this.stockfish.onmessage = (e: any) => {
      if (typeof e !== 'string') return;
      if (e.startsWith('bestmove')) {
        this.enemy = e.slice(9, 13);
        const command = `position fen ${this.fen} moves ${this.enemyMove}`;
        this.stockfish.postMessage(command);
        this.stockfish.postMessage('d');
      } else if (e.startsWith('Fen')) {
        this.fen = e.slice(5);
      } else if (e.startsWith('Checkers')) {
        this.checkers = e.slice(10).split(' ');
        this.checkers.pop();
      } else if (e.startsWith('Legal uci moves')) {
        this.moves = e.slice(17).split(' ');
        this.moves.pop();
        this.onChangeGameState();
        this.onChangeGameState = null;
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
  async updateGameState(): Promise<void> {
    return new Promise<void>((resolve: () => void) => {
      this.onChangeGameState = resolve;
      this.stockfish.postMessage('d');
    });
  }

  /**
   * Checks if this move is allowed
   * @param {string} move
   */
  async isMoveLegal(move: string): Promise<boolean> {
    await this.updateGameState();
    return this.moves.indexOf(move) !== -1;
  }

  /**
   * Player move
   * @param {string} move
   */
  async move(move: string): Promise<void> {
    console.log('move: ' + move);
    this.stockfish.postMessage(`position fen ${this.fen} moves ${move}`);
    return this.updateGameState();
  }

  /**
   * Move making by computer
   */
  async moveAuto(): Promise<void> {
    return new Promise<void>((resolve: () => void) => {
      this.onChangeGameState = resolve;
      this.stockfish.postMessage(`go depth ${this.depth} movetime 2000`);
    });
  }

  get currentGameState(): ChessGameState {
    if (this.checkers.length === 0) {
      if (this.moves.length === 0) {
        return ChessGameState.STALEMATE;
      } else {
        return ChessGameState.OK;
      }
    } else {
      if (this.moves.length === 0) {
        return ChessGameState.CHECKMATE;
      } else {
        return ChessGameState.CHECK;
      }
    }
  }

  /**
   * Get fen string - chess board state representation in string
   */
  get fenstring(): string {
    return this.fen;
  }

  /**
   * Get last enemy's move
   */
  get enemyMove(): string {
    return this.enemy;
  }
}
