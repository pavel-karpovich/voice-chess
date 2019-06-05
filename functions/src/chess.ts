const loadEngine = require('stockfish');
import * as path from 'path';
import { ChessBoard } from './chessboard';
const stockfishPath = '../node_modules/stockfish/src/stockfish.wasm';

export const chessBoardSize = 8;

export enum ChessGameState {
  OK = 1,
  CHECK = 2,
  CHECKMATE = 3,
  STALEMATE = 4,
  FIFTYMOVEDRAW = 5,
}

export enum ChessSide {
  WHITE = 1,
  BLACK = 2,
}

export interface Move {
  to: string;
  beat?: string;
  promo?: boolean;
}
export interface PieceMoves {
  type: string;
  pos: string;
  moves: Move[];
}
interface MovesBulk {
  end: boolean;
  next: number;
  pieces: PieceMoves[];
}

/**
 * Class for making move in chess
 */
export class Chess {
  private stockfish: any;
  private fen: string;
  private moves: string[];
  private checkers: string[];
  private asyncHandler: () => void;
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
    this.asyncHandler = null;
    this.enemy = null;
    this.memorizedState = null;
    this.stockfish.postMessage('isready');
    this.stockfish.postMessage('ucinewgame');
    this.configureDifficulty(difficulty);
    this.stockfish.postMessage('setoption name Ponder value false');
    this.stockfish.postMessage('setoption name Slow Mover value 10');
    if (this.fen === undefined) {
      this.fen = Chess.initialFen;
    }
    this.stockfish.postMessage(`position fen ${this.fen}`);

    this.stockfish.onmessage = (e: any) => {
      if (typeof e !== 'string') return;
      if (e.startsWith('bestmove')) {
        this.enemy = e.split(' ')[1];
        const command = `position fen ${this.fen} moves ${this.enemy}`;
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
        this.memorizedState = null;
        this.asyncHandler();
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
      this.stockfish.postMessage(`go depth ${this.depth} movetime 1000`);
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

  getBulkOfMoves(n: number, beatsSorted = true): MovesBulk {
    if (!this.moves) {
      throw new Error(
        'getBulkOfMoves() first requires updateGameState() call!'
      );
    }
    const ret = { end: true, next: n, pieces: [] as PieceMoves[] };
    if (n >= this.moves.length) {
      return ret;
    }
    const board = new ChessBoard(this.fen);
    if (beatsSorted) {
      this.moves.sort((move1, move2) => {
        const beat1 = board.pos(move1.slice(2, 4));
        const beat2 = board.pos(move2.slice(2, 4));
        if (move1.length === 4 && move2.length === 5) return 1;
        else if (move1.length === 5 && move2.length === 4) return -1;
        else if (beat1 === null && beat2 !== null) return 1;
        else if (beat1 !== null && beat2 === null) return -1;
        else return move1.localeCompare(move2);
      });
    } else {
      this.moves.sort((move1, move2) => {
        const from1 = move1.slice(0, 2);
        const from2 = move2.slice(0, 2);
        const beat1 = board.pos(move1.slice(2, 4));
        const beat2 = board.pos(move2.slice(2, 4));
        if (from1.localeCompare(from2) === 1) return 1;
        else if (from1.localeCompare(from2) === -1) return -1;
        else if (beat1 === null && beat2 !== null) return 1;
        else if (beat1 !== null && beat2 === null) return -1;
        else if (move1.length === 4 && move2.length === 5) return 1;
        else if (move1.length === 5 && move2.length === 4) return -1;
        else return 0;
      });
    }
    console.log(this.moves.join(', '));
    const standardSize = 10;
    const permissibleVariation = 5;
    const unnecessary =
      this.moves
        .slice(n)
        .reduce((sum, el) => (sum += Number(el.length === 5)), 0) * 0.75;
    const maxN = n + standardSize + permissibleVariation + unnecessary;
    if (maxN > this.moves.length) {
      ret.next = this.moves.length;
      let lastPos = this.moves[n].slice(0, 2);
      let piece = {
        pos: lastPos,
        type: board.pos(lastPos),
        moves: [] as Move[],
      };
      for (let i = n; i < this.moves.length; ++i) {
        const currentPos = this.moves[i].slice(0, 2);
        const posTo = this.moves[i].slice(2, 4);
        const promo = this.moves[i].length === 5;
        let mv = null;
        if (promo) {
          const beat = board.pos(posTo);
          if (beat) {
            mv = { to: posTo, beat, promo };
          } else {
            mv = { to: posTo, promo };
          }
          i += 3;
        } else {
          const beat = board.pos(posTo);
          if (beat) {
            mv = { to: posTo, beat };
          } else {
            mv = { to: posTo };
          }
        }
        if (currentPos === lastPos) {
          piece.moves.push(mv);
        } else {
          ret.pieces.push(piece);
          lastPos = currentPos;
          piece = { pos: lastPos, type: board.pos(lastPos), moves: [mv] };
        }
      }
      ret.pieces.push(piece);
    } else {
      const totalLength = (bulk: MovesBulk): number => {
        return bulk.pieces.reduce((sum, el) => (sum += el.moves.length), 0);
      };
      ret.end = false;
      let lastPos = this.moves[n].slice(0, 2);
      let piece = {
        pos: lastPos,
        type: board.pos(lastPos),
        moves: [] as Move[],
      };
      let i;
      for (i = n; i < maxN + 1; ++i) {
        const currentPos = this.moves[i].slice(0, 2);
        const posTo = this.moves[i].slice(2, 4);
        const promo = this.moves[i].length === 5;
        let mv = null;
        if (promo) {
          const beat = board.pos(posTo);
          if (beat) {
            mv = { to: posTo, beat, promo };
          } else {
            mv = { to: posTo, promo };
          }
          i += 3;
        } else {
          const beat = board.pos(posTo);
          if (beat) {
            mv = { to: posTo, beat };
          } else {
            mv = { to: posTo };
          }
        }
        if (currentPos === lastPos) {
          if (i === maxN) {
            if (totalLength(ret) <= standardSize - permissibleVariation) {
              ret.pieces.push(piece);
            } else {
              i -= piece.moves.length;
            }
            break;
          }
          piece.moves.push(mv);
        } else {
          ret.pieces.push(piece);
          if (totalLength(ret) >= standardSize) {
            break;
          }
          lastPos = currentPos;
          piece = { pos: lastPos, type: board.pos(lastPos), moves: [mv] };
        }
      }
      ret.next = i;
    }
    return ret;
  }

  set onChangeGameState(handler: () => void) {
    this.asyncHandler = () => {
      this.asyncHandler = null;
      handler();
    };
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
