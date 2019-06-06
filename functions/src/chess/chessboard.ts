import { chessBoardSize } from './chess';

export interface ChessCellInfo {
  pos: string;
  val: string;
}

const columns = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

export class ChessBoard {
  private board: Map<string, string>;

  constructor(fen: string) {
    this.board = new Map();
    const fenRows = fen.split(/[// ]/);
    for (let i = 1; i <= chessBoardSize; i++) {
      let j = 0;
      for (const code of fenRows[chessBoardSize - i]) {
        const int = Number(code);
        if (isNaN(int)) {
          this.board.set(columns[j] + i, code);
          ++j;
        } else {
          for (let k = 0; k < int; ++k, ++j) {
            this.board.set(columns[j] + i, null);
          }
        }
      }
    }
  }

  row(i: number): ChessCellInfo[] {
    if (i < 1 || i > chessBoardSize) {
      return null;
    }
    return columns.map<ChessCellInfo>(col => ({
      pos: col + i,
      val: this.board.get(col + i),
    }));
  }

  pos(pos: string): string {
    if (!this.board.has(pos)) {
      return null;
    } else {
      return this.board.get(pos);
    }
  }
}
