export const enum CastlingType {
  KINGSIDE = '1',
  QUEENSIDE = '2',
}

const castlings = new Map([['e1g1', 'h1f1'], ['e1c1', 'a1d1'], ['e8g8', 'h8f8'], ['e8c8', 'a8d8']]);

export function rookMoveForCastlingMove(move: string): string {
  if (castlings.has(move)) {
    return castlings.get(move);
  } else {
    return null;
  }
}

export function isMoveSuitableForCastling(piece: string, move: string): boolean {
  return piece.toLowerCase() === 'k' && castlings.has(move);
}

export function getTypeOfCastling(move: string): CastlingType {
  if (!castlings.has(move)) {
    return null;
  }
  if (move[2] === 'g') {
    return CastlingType.KINGSIDE;
  } else {
    return CastlingType.QUEENSIDE;
  }
}
