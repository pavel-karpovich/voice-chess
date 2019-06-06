
export enum ChessSide {
  WHITE = 1,
  BLACK = 2,
}

export function getSide(pieceCode: string): ChessSide {
  if (pieceCode === pieceCode.toUpperCase()) {
    return ChessSide.WHITE;
  } else {
    return ChessSide.BLACK;
  }
}

export function oppositeSide(side: ChessSide): ChessSide {
  return side === ChessSide.WHITE ? ChessSide.BLACK : ChessSide.WHITE;
}