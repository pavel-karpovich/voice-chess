import { rookMoveForCastlingMove, isMoveSuitableForCastling } from "../../../src/chess/castling";

describe('Tests for castling utility functions', () => {

  test.each([
    ['e1g1', 'h1f1'],
    ['e1c1', 'a1d1'],
    ['e8g8', 'h8f8'],
    ['e8c8', 'a8d8'],
    ['g3h5', null],
    ['f8c8', null],
  ])('Castling rook move from king move', (kMove, rMove) => {
    const actual = rookMoveForCastlingMove(kMove);
    expect(actual).toBe(rMove);
  });

  test.each([
    ['k', 'e8g8', true],
    ['K', 'e1c1', true],
    ['Q', 'e1c1', false],
    ['p', 'g7g5', false],
  ])('Check if move is suitable for castling', (piece, move, itIs) => {
    const actual = isMoveSuitableForCastling(piece as string, move as string);
    expect(actual).toBe(itIs);
  });
});
