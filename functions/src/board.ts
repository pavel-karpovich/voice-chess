import { ChessBoard, ChessSquareData } from './chess/chessboard';
import { upFirst, pause } from './helpers';
import { Vocabulary as Voc } from './locales/vocabulary';

function singleRank(rank: ChessSquareData[], rankNum: number): string {
  let resultString = '';
  if (rank.every(el => el.val === null)) {
    const emptyRankString = upFirst(Voc.emptyRank(rankNum));
    resultString += emptyRankString + '\n';
  } else {
    resultString += Voc.nRank(rankNum) + ': ';
    for (const square of rank) {
      if (square.val !== null) {
        resultString += Voc.coloredPieceOnPosition(square.val, square.pos) + ', ';
      }
    }
    resultString = resultString.slice(0, -2) + '.\n';
  }
  return resultString;
}

export function showRank(fen: string, rankNum: number): string {
  const board = new ChessBoard(fen);
  const rankData = board.rank(rankNum);
  const result = singleRank(rankData, rankNum);
  return result;
}

export function showRanks(fen: string, fromRank: number, toRank: number): string {
  const board = new ChessBoard(fen);
  let result = '<p>';
  for (let i = fromRank; i <= toRank; ++i) {
    result += `<s>${singleRank(board.rank(i), i)}</s>${pause(0.7)}`;
  }
  result += '</p>';
  return result;
}
