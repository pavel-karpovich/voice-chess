import { ChessBoard, ChessSquareData } from '../chess/chessboard';
import { upFirst, pause, WhoseSide } from './helpers';
import { Vocabulary as Voc } from '../locales/vocabulary';
import { ChessSide, totalPiecesNumber } from '../chess/chessUtils';

function singleRank(rank: ChessSquareData[], rankNum: number): string {
  let resultString = '';
  if (rank.every(el => el.val === null)) {
    const emptyRankString = Voc.emptyRank(rankNum);
    resultString += emptyRankString + '\n';
  } else {
    resultString += upFirst(Voc.nRank(rankNum)) + ': ';
    for (const square of rank) {
      if (square.val !== null) {
        resultString +=
          Voc.coloredPieceOnPosition(square.val, square.pos) + ', ';
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

export function showRanks(
  fen: string,
  fromRank: number,
  toRank: number
): string {
  const board = new ChessBoard(fen);
  let result = '<p>';
  for (let i = fromRank; i <= toRank; ++i) {
    result += `<s>${singleRank(board.rank(i), i)}</s>${pause(0.7)}`;
  }
  result += '</p>';
  return result;
}

export function showAllPieces(
  pieceCode: string,
  positions: string[],
  side: ChessSide,
  whose: WhoseSide,
  playerSide: ChessSide
): string {
  let result = '';
  if (positions.length === 1) {
    const total = totalPiecesNumber(pieceCode);
    if (total === 1) {
      result += Voc.someonesOnlyOnePieceIsHere(
        pieceCode,
        positions[0],
        side,
        whose
      );
    } else {
      result += Voc.someonesOneLeftPieceIsHere(
        pieceCode,
        positions[0],
        whose,
        playerSide
      );
    }
  } else {
    result +=
      Voc.someonesPieces(pieceCode, whose, playerSide, positions.length) + ' ';
    for (let i = 0; i < positions.length; ++i) {
      if (i === positions.length - 1) {
        result += ' ' + Voc.and() + ' ';
      } else if (i !== 0) {
        result += ', ';
      }
      result += Voc.onPosition(positions[i]);
    }
    result += '.';
  }
  return result;
}
