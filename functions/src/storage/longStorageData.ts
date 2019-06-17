import { HistoryFrame } from '../support/history';
import { ChessSide } from '../chess/chessUtils';

interface Options {
  difficulty?: number;
  confirm?: boolean;
}

export interface LongStorageData {
  fen?: string;
  side?: ChessSide;
  history?: HistoryFrame[];
  options?: Options;
  cstFen?: string;
}
