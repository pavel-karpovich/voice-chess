import { ChessBoard, ChessSquareData, Captured } from '../chess/chessboard';
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

export function oneRank(fen: string, rankNum: number): string {
  const board = new ChessBoard(fen);
  const rankData = board.rank(rankNum);
  const result = singleRank(rankData, rankNum);
  return result;
}

export function manyRanks(
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

export function allPiecesForType(
  pieceCode: string,
  positions: string[],
  whose: WhoseSide,
  playerSide: ChessSide,
  mixPerc = 0.2
): string {
  let result = '<s>';
  if (positions.length === 1) {
    const total = totalPiecesNumber(pieceCode);
    if (total === 1) {
      result += Voc.someonesOnlyOnePieceIsHere(
        pieceCode,
        positions[0],
        whose,
        mixPerc
      );
    } else {
      result += Voc.someonesOneLeftPieceIsHere(
        pieceCode,
        positions[0],
        whose,
        playerSide,
        mixPerc
      );
    }
  } else {
    result +=
      Voc.someonesPieces(
        pieceCode,
        whose,
        playerSide,
        positions.length,
        mixPerc
      ) + ' ';
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
  result += '</s>';
  return result;
}

export function allPiecesForSide(
  squares: ChessSquareData[],
  side: ChessSide,
  playerSide: ChessSide
): string {
  let result = `<p><s>${Voc.fullSidePieces(side)}</s> \n`;
  const pos = [] as string[];
  for (let i = 0; i < squares.length; ++i) {
    pos.push(squares[i].pos);
    if (i === squares.length - 1 || squares[i + 1].val !== squares[i].val) {
      result +=
        allPiecesForType(squares[i].val, pos, null, playerSide, 0) + ' ';
      pos.length = 0;
    }
  }
  result += '</p>';
  return result;
}

export function listCapturedPieces(
  captured: Captured,
  playerSide: ChessSide
): string {
  let result = '<p>';
  let who = playerSide === ChessSide.WHITE ? WhoseSide.ENEMY : WhoseSide.PLAYER;
  let whose = who === WhoseSide.ENEMY ? WhoseSide.PLAYER : WhoseSide.ENEMY;
  if (captured.white.length === 0) {
    result += `<s>${upFirst(
      Voc.someoneDontCapture(who, whose, ChessSide.WHITE)
    )}</s>`;
  } else {
    const firstPiece = captured.white[0].piece;
    const gen = Voc.pieceGender(firstPiece);
    const totalAmount = captured.white.reduce(
      (sum, el) => (sum += el.count),
      0
    );
    result += '<s>' + Voc.someoneCapture1(who, totalAmount, gen);
    result +=
      ' ' +
      Voc.nSomeonesColoredPieces(
        captured.white[0].count,
        whose,
        ChessSide.WHITE,
        firstPiece
      );
    for (let i = 1; i < captured.white.length; ++i) {
      if (i === captured.white.length - 1) {
        result += ' ' + Voc.and() + ' ';
      } else {
        result += ', ';
      }
      const el = captured.white[i];
      result += Voc.nSomeonesPieces(el.count, whose, el.piece);
    }
    result += '.</s>';
  }
  result += ' ';
  const tmp = who;
  who = whose;
  whose = tmp;
  if (captured.black.length === 0) {
    result += '<s>' + upFirst(Voc.andA()) + ' ';
    result += Voc.someoneDontCapture(who, whose, ChessSide.BLACK) + '</s>';
  } else {
    const firstPiece = captured.black[0].piece;
    const gen = Voc.pieceGender(firstPiece);
    const totalAmount = captured.black.reduce(
      (sum, el) => (sum += el.count),
      0
    );
    result += '<s>' + Voc.someoneCapture2(who, totalAmount, gen);
    result +=
      ' ' +
      Voc.nSomeonesColoredPieces(
        captured.black[0].count,
        whose,
        ChessSide.BLACK,
        firstPiece
      );
    for (let i = 1; i < captured.black.length; ++i) {
      if (i === captured.black.length - 1) {
        result += ' ' + Voc.and() + ' ';
      } else {
        result += ', ';
      }
      const el = captured.black[i];
      result += Voc.nSomeonesPieces(el.count, whose, el.piece);
    }
    result += '.</s>';
  }
  result += '</p>';
  return result;
}
