import { ChessBoard, ChessCellInfo } from './chess/chessboard';
import { upFirst, pause } from './helpers';
import { Vocabulary as Voc } from './locales/vocabulary';

function singleRow(row: ChessCellInfo[], rowNum: number): string {
  let resultString = '';
  if (row.every(el => el.val === null)) {
    const emptyRowString = upFirst(Voc.emptyRow(rowNum));
    resultString += emptyRowString + '\n';
  } else {
    resultString += Voc.nRow(rowNum) + ': ';
    for (const cell of row) {
      if (cell.val !== null) {
        resultString += Voc.coloredPieceOnPosition(cell.val, cell.pos) + ', ';
      }
    }
    resultString = resultString.slice(0, -2) + '.\n';
  }
  return resultString;
}

export function showRow(fen: string, rowNum: number): string {
  const board = new ChessBoard(fen);
  const rowData = board.row(rowNum);
  const result = singleRow(rowData, rowNum);
  return result;
}

export function showRows(fen: string, fromRow: number, toRow: number): string {
  const board = new ChessBoard(fen);
  let result = '<p>';
  for (let i = fromRow; i <= toRow; ++i) {
    result += `<s>${singleRow(board.row(i), i)}</s>${pause(0.7)}`;
  }
  result += '</p>';
  return result;
}
