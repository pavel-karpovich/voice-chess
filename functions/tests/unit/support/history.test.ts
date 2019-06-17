import '../../extend/toIncludeAll';

import { historyOfMoves, HistoryFrame } from '../../../src/support/history';
import { ChessSide } from '../../../src/chess/chessUtils';
import { Vocabulary } from '../../../src/locales/vocabulary';

const log = false;

describe('Testing moves history functionality', () => {

  describe.each([
    'en', 'ru',
  ])('For locale %s', (locale) => {

    beforeAll(() => {
      Vocabulary.setLanguage(locale);
      let newLog: (str: string) => void;
      if (log) {
        const consoleLog = console.log;
        newLog = str =>  consoleLog('\n' + str);
      } else {
        newLog = str => void 0;
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
          { m: 'ke8c8', c: 'a8d8' }, { m: 'Qh8h7', b: 'p' }, { m: 'qd6f6' },
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