import '../../extend/toBeEmptyString';

import { 
  oneRank,
  manyRanks,
  allPiecesForType,
  allPiecesForSide,
  listCapturedPieces,
  someonePlayForColor
} from '../../../src/support/board';
import { Vocabulary } from '../../../src/locales/vocabulary';
import { ChessSide, WhoseSide } from '../../../src/chess/chessUtils';
import { ChessSquareData, Captured } from '../../../src/chess/chessboard';

const log = false;

describe('Tests for board support functions', () => {

  describe.each([
    'en',
    'ru',
  ])(`Functions that produce output for locale %s`, (locale) => {

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
      [1, 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'],
      [3, 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'],
      [4, 'r2qkb1r/p5pp/3pbn2/1P3p2/Q4P2/2B1PN2/P5PP/R3KB1R w KQkq - 1 15'],
      [6, 'r2qkb1r/p5pp/3pbn2/1P3p2/Q4P2/2B1PN2/P5PP/R3KB1R w KQkq - 1 15'],
    ])('Info about rank %i from fen %s', (rowNum, fen) => {
      const str = oneRank(fen as string, rowNum as number);
      console.log(str);
      expect(str).not.toBeEmptyString();
    });

    test.each([
      [1, 3, 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'],
      [5, 8, 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'],
      [1, 8, 'r2qkb1r/p5pp/3pbn2/1P3p2/Q4P2/2B1PN2/P5PP/R3KB1R w KQkq - 1 15'],
      [1, 1, 'r2qkb1r/p5pp/3pbn2/1P3p2/Q4P2/2B1PN2/P5PP/R3KB1R w KQkq - 1 15'],
    ])('Info about range of ranks %i - %i from fen %s', (fromRowNum, toRowNum, fen) => {
      const str = manyRanks(fen as string, fromRowNum as number, toRowNum as number);
      console.log(str);
      expect(str).not.toBeEmptyString();
    });

    test.each([
      ['P', ['b7', 'c7', 'e5', 'g6'], WhoseSide.PLAYER, ChessSide.WHITE],
      ['B', ['g4', 'b3'], WhoseSide.ENEMY, ChessSide.WHITE],
      ['q', ['g2'], WhoseSide.PLAYER, ChessSide.BLACK],
      ['n', ['c6'], WhoseSide.ENEMY, ChessSide.BLACK],
    ])('Info about all positions for specified piece type and side', (piece, positions, who, side) => {
      const str = allPiecesForType(
        piece as string,
        positions as string[],
        who as WhoseSide,
        side as ChessSide
      );
      console.log(str);
      expect(str).not.toBeEmptyString();
    });

    test.each([
      [
        [
          { pos: 'e1', val: 'K' },
          { pos: 'h1', val: 'R' },
          { pos: 'd4', val: 'P' },
          { pos: 'g5', val: 'P' },
        ], ChessSide.WHITE, ChessSide.WHITE,
      ],
      [
        [
          { pos: 'h5', val: 'k' },
          { pos: 'a8', val: 'b' },
        ], ChessSide.BLACK, ChessSide.WHITE,
      ],
      [
        [
          { pos: 'c5', val: 'P' },
          { pos: 'e3', val: 'P' },
          { pos: 'g2', val: 'N' },
          { pos: 'h5', val: 'N' },
          { pos: 'b4', val: 'K' },
        ], ChessSide.WHITE, ChessSide.BLACK,
      ],
      [
        [
          { pos: 'h7', val: 'b' },
          { pos: 'e5', val: 'k' },
          { pos: 'd6', val: 'r' },
        ], ChessSide.BLACK, ChessSide.BLACK,
      ],
    ])('Info about all pieces of the specified side', (sqares, side, playerSide) => {
      const str = allPiecesForSide(
        sqares as ChessSquareData[],
        side as ChessSide,
        playerSide as ChessSide
      );
      console.log(str);
      expect(str).not.toBeEmptyString();
    });

    test.each([
      [
        { 
          white: [{ piece: 'P', count: 3 }, { piece: 'N', count: 2 }, { piece: 'B', count: 1 }],
          black: [{ piece: 'p', count: 4 }, { piece: 'N', count: 1 },],
        }, ChessSide.WHITE,
      ],
      [
        { 
          white: [{ piece: 'P', count: 1 }],
          black: [],
        }, ChessSide.BLACK,
      ],
    ])('Info about all captured pieces for the both sides', (captured, playerSide) => {
      const str = listCapturedPieces(captured as Captured, playerSide as ChessSide);
      console.log(str);
      expect(str).not.toBeEmptyString();
    });

    test.each([
      [WhoseSide.ENEMY, ChessSide.BLACK, ChessSide.WHITE],
      [WhoseSide.PLAYER, null, ChessSide.WHITE],
      [null, ChessSide.BLACK, ChessSide.WHITE],
      [null, null, ChessSide.WHITE],
    ])('Info about colors of sides', (who, side, playerSide) => {
      const str = someonePlayForColor(who as WhoseSide, side as ChessSide, playerSide as ChessSide);
      console.log(str);
      expect(str).not.toBeEmptyString();
    });

  });

});
