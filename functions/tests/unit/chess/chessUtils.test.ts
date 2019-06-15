import { getSide, ChessSide, oppositeSide, enPawnPos, totalPiecesNumber } from '../../../src/chess/chessUtils';

describe('Tests for the chess utils', () => {
  
  test.each([
    ['P', ChessSide.WHITE],
    ['p', ChessSide.BLACK],
  ])('Getting color side by the code of piece', (pieceCode, actualSide) => {
    const side = getSide(pieceCode);
    expect(side).toBe(actualSide);
  });

  test.each([
    [ChessSide.WHITE, ChessSide.BLACK],
    [ChessSide.BLACK, ChessSide.WHITE],
  ])('Getting the color of opposite side', (color, opposite) => {
    const side = oppositeSide(color);
    expect(side).toBe(opposite);
  });

  test.each([
    ['g3', 'g4'],
    ['b6', 'b5'],
  ])('Getting the pawn pos from En Passant pos', (enPass, pawnPos) => {
    const pos = enPawnPos(enPass);
    expect(pos).toBe(pawnPos);
  });

  test.each([
    ['P', 8],
    ['k', 1],
    ['Q', 1],
    ['b', 2],
    ['R', 2],
    ['n', 2],
  ])('Getting the total number of certain type of piece', (pieceCode, totalNum) => {
    const num = totalPiecesNumber(pieceCode as string);
    expect(num).toBe(totalNum);
  });

});