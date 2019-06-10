export const enum ChessSide {
  WHITE = '1',
  BLACK = '2',
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

export function enPawnPos(enPassant: string): string {
  const rank = Number(enPassant[1]);
  if (rank === 3) {
    return enPassant[0] + '4';
  } else if (rank === 6) {
    return enPassant[0] + '5';
  } else {
    return null;
  }
}
