import { chessBoardSize } from './chess';
import { ChessSide } from './chessUtils';

export interface ChessSquareData {
  pos: string;
  val: string;
}

const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

const wCastling = new Map([['e1g1', 'h1f1'], ['e1c1', 'a1d1']]);
const bCastling = new Map([['e8g8', 'h8f8'], ['e8c8', 'a8d8']]);

export class ChessBoard {
  private board: Map<string, string>;
  private fen: string;
  private dirty: boolean;
  private side: string;
  private castling: string;
  private enpsnt: string;
  private clock: number;
  private count: number;

  constructor(fen: string) {
    this.board = new Map();
    this.fen = fen;
    this.dirty = false;
    const fenParts = fen.split(/[// ]/);
    for (let i = 1; i <= chessBoardSize; i++) {
      let j = 0;
      for (const code of fenParts[chessBoardSize - i]) {
        const int = Number(code);
        if (isNaN(int)) {
          this.board.set(files[j] + i, code);
          ++j;
        } else {
          for (let k = 0; k < int; ++k, ++j) {
            this.board.set(files[j] + i, null);
          }
        }
      }
    }
    this.side = fenParts[chessBoardSize];
    this.castling = fenParts[chessBoardSize + 1];
    this.enpsnt = fenParts[chessBoardSize + 2];
    this.clock = Number(fenParts[chessBoardSize + 3]);
    this.count = Number(fenParts[chessBoardSize + 4]);
  }

  rank(i: number): ChessSquareData[] {
    console.log('i: ' + i);
    if (i < 1 || i > chessBoardSize) {
      return null;
    }
    return files.map<ChessSquareData>(file => ({
      pos: file + i,
      val: this.board.get(file + i),
    }));
  }

  pos(pos: string): string {
    if (!this.board.has(pos)) {
      return null;
    } else {
      return this.board.get(pos);
    }
  }

  isCastling(move: string, piece: string): string {
    if (piece === 'K' && wCastling.has(move)) {
      return wCastling.get(move);
    } else if (piece === 'k' && bCastling.has(move)) {
      return bCastling.get(move);
    } else {
      return null;
    }
  }

  getAvailableCastlingMoves(side: ChessSide): string[] {
    const availableCastling = [] as string[];
    const rank = side === ChessSide.WHITE ? '1' : '8';
    const c = (p: string): string => {
      return side === ChessSide.WHITE ? p.toUpperCase() : p.toLowerCase();
    };
    if (this.castling.includes(c('Q'))) {
      if (
        this.board.get(`a${rank}`) === c('R') &&
        this.board.get(`b${rank}`) === null &&
        this.board.get(`c${rank}`) === null &&
        this.board.get(`d${rank}`) === null &&
        this.board.get(`e${rank}`) === c('K')
      ) {
        availableCastling.push(`e${rank}c${rank}`);
      }
    }
    if (this.castling.includes(c('K'))) {
      if (
        this.board.get(`e${rank}`) === c('K') &&
        this.board.get(`f${rank}`) === null &&
        this.board.get(`g${rank}`) === null &&
        this.board.get(`h${rank}`) === c('R')
      ) {
        availableCastling.push(`e${rank}g${rank}`);
      }
    }
    return availableCastling;
  }

  extract(
    move: string,
    captured?: string,
    enPassantPawnPos?: string,
    castlingRockMove?: string
  ): boolean {
    let isReverseMoveValid = true;
    const from = move.slice(0, 2);
    const to = move.slice(2, 4);
    if (this.board.get(from)) {
      isReverseMoveValid = false;
    }
    // TODO: Adequate move validation check
    if (isReverseMoveValid) {
      let piece;
      if (move.length === 5) {
        piece = this.side === 'w' ? 'p' : 'P';
      } else {
        piece = this.board.get(to);
      }
      this.board.set(from, piece);
      if (captured) {
        this.board.set(to, captured);
      } else {
        this.board.set(to, null);
      }
      if (enPassantPawnPos) {
        const enemyPawn = this.side === 'w' ? 'P' : 'p';
        this.board.set(enPassantPawnPos, enemyPawn);
        this.enpsnt = to;
      } else if (castlingRockMove) {
        const rockFrom = castlingRockMove.slice(0, 2);
        const rockTo = castlingRockMove.slice(2, 4);
        const rock = this.board.get(rockTo);
        this.board.set(rockTo, null);
        this.board.set(rockFrom, rock);
      }
      if (this.side === 'w') {
        this.side = 'b';
        this.count--;
      } else {
        this.side = 'w';
      }
      if (this.clock !== 0) {
        this.clock--;
      }
      this.dirty = true;
      return true;
    } else {
      return false;
    }
  }

  loadCorrectCastlingFen(cstFen: string): void {
    this.castling = cstFen;
  }

  convertToFen(): string {
    if (!this.dirty) {
      return this.fen;
    }
    let fen = '';
    for (let i = 8; i > 0; --i) {
      let emptyCount = 0;
      for (let j = 0; j < chessBoardSize; ++j) {
        const square = files[j] + i;
        const piece = this.board.get(square);
        if (piece) {
          if (emptyCount) {
            fen += emptyCount;
            emptyCount = 0;
          }
          fen += piece;
        } else {
          emptyCount++;
        }
      }
      if (emptyCount) {
        fen += emptyCount;
      }
      if (i !== 1) {
        fen += '/';
      }
    }
    fen += ` ${this.side}`;
    fen += ` ${this.castling} ${this.enpsnt}`;
    fen += ` ${this.clock} ${this.count}`;
    this.fen = fen;
    this.dirty = false;
    return fen;
  }

  get enPassant(): string {
    return this.enpsnt;
  }

  get cstFen(): string {
    return this.castling;
  }
}
