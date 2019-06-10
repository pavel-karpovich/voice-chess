import { chessBoardSize } from './chess';

export interface ChessSquareData {
  pos: string;
  val: string;
}

const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

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

  extract(move: string, captured?: string, enPassantPawnPos?: string): boolean {
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
      // TODO: castling
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
}
