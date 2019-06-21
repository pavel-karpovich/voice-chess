import '../../extend/toIncludeAll';

import { 
  historyOfMoves,
  HistoryFrame,
  createHistoryItem
} from '../../../src/support/history';
import { ChessSide } from '../../../src/chess/chessUtils';
import { Vocabulary } from '../../../src/locales/vocabulary';

const log = false;

describe('Testing moves history functionality', () => {

  describe('Creating one history item', () => {

    test('For simple move', () => {
      const piece = 'k';
      const move = 'g4g5';
      const expected = { m: piece + move };
      const hItem = createHistoryItem(piece, move);
      expect(hItem).toEqual(expected);
    });
    
    test('For move with capturing', () => {
      const piece = 'k';
      const move = 'g4g5';
      const capturedPiece = 'p';
      const expected = { m: piece + move, b: capturedPiece };
      const hItem = createHistoryItem(piece, move, capturedPiece);
      expect(hItem).toEqual(expected);
    });

    test('For En Passant move', () => {
      const piece = 'P';
      const move = 'h4g3';
      const enPawn = 'g4';
      const expected = { m: piece + move, e: enPawn };
      const hItem = createHistoryItem(piece, move, null, enPawn);
      expect(hItem).toEqual(expected);
    });
    
    test('Can be only one additional field', () => {
      const piece = 'P';
      const move = 'h4g3';
      const capt = 'p';
      const enPawn = 'g4';
      const expected = { m: piece + move, b: capt };
      const hItem = createHistoryItem(piece, move, capt, enPawn);
      expect(hItem).toEqual(expected);
    });
  });

  describe.each([
    'en', 'ru',
  ])('For locale %s', (locale) => {

    beforeAll(() => {
      Vocabulary.setLanguage(locale);
      let newLog: (str: string) => void;
      if (log) {
        const consoleLog = console.log;
        newLog = str => consoleLog('\n' + str);
      } else {
        newLog = str => {};
      }
      console.log = jest.fn().mockImplementation(newLog);
    });

    test.each([
      [
        [
          { m: 'Pe2e4' }, { m: 'pd7d6' }, { m: 'Nb1c3' },
        ] as HistoryFrame[], ChessSide.WHITE,
      ],
      [
        [
          { m: 'Pe2e4' }, { m: 'pd7d6' }, { m: 'Nb1c3' }, { m: 'ng8f6' },
          { m: 'Pd2d3' }, { m: 'nb1d2' }, { m: 'Bc1e3' }, { m: 'nd7c5' },
          { m: 'Be3c5',  b: 'n' }, { m: 'pd6c5', b: 'B' },
        ], ChessSide.BLACK,
      ],
      [
        [
          { m: 'Pd3e4', b: 'b' }, { m: 'nf6d4', b: 'P' }, { m: 'Qc3h8', b: 'r' },
          { m: 'ke8c8' }, { m: 'Qh8h7', b: 'p' }, { m: 'qd6f6' },
          { m: 'Qh7h6', b: 'b' },
        ], ChessSide.WHITE,
      ],
      [
        [
          { m: 'be7g5' }, { m: 'Pd2d4' }, { m: 'pe4d3', e: 'd4' }, { m: 'Qd1d3', b: 'p' },
        ], ChessSide.BLACK,
      ],
      [
        [
          { m: 'Pf7f8q' }, { m: 'pg5g4' }, { m: 'Qf8g8', b: 'n' },
        ], ChessSide.WHITE,
      ],
      [
        [
          { m: 'pb2c1n', b: 'r' }, { m: 'Kd1c1', b: 'n' },
        ], ChessSide.BLACK,
      ],
    ])('Building strings for different histories', (moves, playerSide) => {
      const hist = (moves as HistoryFrame[]);
      const allPos = hist.reduce((arr, el) => {
        const from = el.m.slice(1, 3);
        const to = el.m.slice(3, 5);
        arr.push(from, to);
        return arr;
      }, []);
      const str = historyOfMoves(hist, playerSide as ChessSide);
      console.log(str);
      expect(str).toIncludeAll(allPos);
    });

  });
});