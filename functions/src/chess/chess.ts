const loadEngine = require('stockfish');
import * as path from 'path';
import { ChessSide } from './chessUtils';
const stockfishPath = '../../node_modules/stockfish/src/stockfish.wasm';

export const chessBoardSize = 8;

export const enum ChessGameState {
  OK = 1,
  CHECK = 2,
  CHECKMATE = 3,
  STALEMATE = 4,
  FIFTYMOVEDRAW = 5,
}

/**
 * Class for making move in chess
 */
export class Chess {
  private stockfish: any;
  private fen: string;
  private moves: string[];
  private checkers: string[];
  private stateChangeHandler: () => void;
  private bestMoveHandler: (bestMove: string) => void;
  private enemy: string;
  private depth: number;
  private memorizedState: ChessGameState;
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
    this.stateChangeHandler = null;
    this.bestMoveHandler = null;
    this.enemy = null;
    this.memorizedState = null;
    this.stockfish.postMessage('isready');
    this.stockfish.postMessage('ucinewgame');
    this.configureDifficulty(difficulty);
    this.stockfish.postMessage('setoption name Ponder value false');
    this.stockfish.postMessage('setoption name Slow Mover value 10');
    if (!this.fen) {
      this.fen = Chess.initialFen;
    }
    this.stockfish.postMessage(`position fen ${this.fen}`);

    this.stockfish.onmessage = (e: any) => {
      if (typeof e !== 'string') return;
      console.log(e);
      if (e.startsWith('bestmove')) {
        const bestMove = e.split(' ')[1];
        this.bestMoveHandler(bestMove);
      } else if (e.startsWith('Fen')) {
        this.fen = e.slice(5);
      } else if (e.startsWith('Checkers')) {
        this.checkers = e.slice(10).split(' ');
        this.checkers.pop();
      } else if (e.startsWith('Legal uci moves')) {
        this.moves = e.slice(17).split(' ');
        this.moves.pop();
        this.memorizedState = null;
        this.stateChangeHandler();
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
    const maxErr = Math.round(level * -20 + 450);
    const errProb = Math.round(level * 12.7 + 1);
    this.stockfish.postMessage(setopt + 'Maximum Error value ' + maxErr);
    this.stockfish.postMessage(setopt + 'Probability value ' + errProb);
  }

  /**
   * The const fen string value of te start chess position
   */
  static get initialFen(): string {
    // return '4k3/7P/8/4p1p1/p2P4/1P3N2/3K4/1Q6 w - - 0 1';
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

  isPromotion(move: string): boolean {
    return this.isMoveLegal(move + 'q');
  }
  /**
   * Checks if this move is allowed
   * @param {string} move
   */
  isMoveLegal(move: string): boolean {
    if (!this.moves) {
      throw new Error('isMoveLagel() first requires updateGameState() call!');
    }
    return (
      this.moves.indexOf(move) !== -1 || this.moves.indexOf(move + 'q') !== -1
    );
  }

  async bestMove(): Promise<string> {
    return new Promise((resolve: (bm: string) => void) => {
      this.stockfish.postMessage(`go depth ${this.depth} movetime 1000`);
      this.onBestMove = resolve;
    });
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
    return new Promise<void>(async (resolve: () => void) => {
      this.enemy = await this.bestMove();
      const command = `position fen ${this.fen} moves ${this.enemy}`;
      this.stockfish.postMessage(command);
      this.stockfish.postMessage('d');
      this.onChangeGameState = resolve;
    });
  }

  get currentGameState(): ChessGameState {
    if (this.memorizedState) {
      return this.memorizedState;
    }
    if (this.checkers.length === 0 && this.moves.length === 0) {
      this.memorizedState = ChessGameState.STALEMATE;
    } else if (this.checkers.length !== 0 && this.moves.length === 0) {
      this.memorizedState = ChessGameState.CHECKMATE;
    } else if (Number(this.fen.match(/(\d+) (\d+)/)[1]) >= 50) {
      this.memorizedState = ChessGameState.FIFTYMOVEDRAW;
    } else if (this.checkers.length !== 0 && this.moves.length !== 0) {
      this.memorizedState = ChessGameState.CHECK;
    } else {
      this.memorizedState = ChessGameState.OK;
    }
    return this.memorizedState;
  }

  set onChangeGameState(handler: () => void) {
    this.stateChangeHandler = () => {
      this.stateChangeHandler = null;
      handler();
    };
  }
  set onBestMove(handler: (bm: string) => void) {
    this.bestMoveHandler = (bm: string) => {
      this.bestMoveHandler = null;
      handler(bm);
    };
  }

  get legalMoves(): string[] {
    if (!this.moves) {
      throw new Error('legalMoves prop first requires updateGameState() call!');
    }
    return this.moves;
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

  get whoseTurn(): ChessSide {
    const side = this.fen.split(' ')[1];
    if (side === 'w') {
      return ChessSide.WHITE;
    } else {
      return ChessSide.BLACK;
    }
  }
}
