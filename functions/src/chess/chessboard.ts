import { chessBoardSize } from './chess';

export interface ChessSquareData {
  pos: string;
  val: string;
}

const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

export class ChessBoard {
  private board: Map<string, string>;

  constructor(fen: string) {
    this.board = new Map();
    const fenRanks = fen.split(/[// ]/);
    for (let i = 1; i <= chessBoardSize; i++) {
      let j = 0;
      for (const code of fenRanks[chessBoardSize - i]) {
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
  }

  rank(i: number): ChessSquareData[] {
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
}
