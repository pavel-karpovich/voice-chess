import '../../extend/toIncludeAll';

import { getBulkOfMoves, listMoves,  } from '../../../src/support/moves';
import { initLanguage } from '../../../src/locales/initLang';

const log = false;

interface PieceMoves {
  type: string;
  pos: string;
  moves: Array<{
    to: string;
    beat?: string;
    promo?: boolean;
    from?: string;
  }>;
  enPassant?: boolean;
  castling?: boolean;
}

interface MovesBulk {
  end: boolean;
  next: number;
  pieces: PieceMoves[];
}

describe('List of moves', () => {

  describe.each([
    true, false,
  ])('Getting the first bulk when sorting = %p', (sort) => {

    test('Creating bulk from a small number of simple moves', () => {
      const fen = 'rn2k1n1/p7/8/8/8/5P1P/8/7K w kq - 3 35';
      const moves = ['f3f4', 'h3h4', 'h1g1', 'h1g2', 'h1h2'];
      const fromN = 0;
      const bulk = getBulkOfMoves(fen, moves, fromN, sort);
      expect(bulk).toMatchSnapshot();
    });

    test.each([
      35, -2,
    ])('Bulk with inсorrect start number %n return null', (n) => {
      const fen = 'rn2k1n1/p7/8/8/8/5P1P/8/7K w kq - 3 35';
      const moves = ['f3f4', 'h3h4', 'h1g1', 'h1g2', 'h1h2'];
      const bulk = getBulkOfMoves(fen, moves, n, sort);
      expect(bulk).toBeNull();
    });

    test('Bulk from a big number of moves', () => {
      const fen = '8/p5q1/k7/2n1pP1p/1pNpP3/n4P2/P2PB3/R3K2R b KQkq - 2 30';
      const moves = [
        'b4b3', 'd4d3', 'h5h4', 'c5b3', 'c5d3', 'c5a4',
        'c5e4', 'c5e6', 'c5b7', 'c5d7', 'a3b1', 'a3c2',
        'a3c4', 'a3b5', 'g7g1', 'g7g2', 'g7g3', 'g7g4',
        'g7g5', 'g7f6', 'g7g6', 'g7h6', 'g7b7', 'g7c7',
        'g7d7', 'g7e7', 'g7f7', 'g7h7', 'g7f8', 'g7g8',
        'g7h8', 'a6b7', 'a6b5',
      ];
      const fromN = 0;
      const bulk = getBulkOfMoves(fen, moves, fromN, sort);
      expect(bulk).toMatchSnapshot();
    });

    test('Bulk with capturing moves', () => {
      const fen = 'rn1qkb1r/p1pp2pp/5pn1/b3p3/3P2NP/1pB4R/PPP1PPP1/RN1QKB2 w KQkq - 3 14';
      const moves = [
        'a2a3', 'e2e3', 'f2f3', 'g2g3', 'd4d5', 'h4h5',
        'a2a4', 'e2e4', 'f2f4', 'a2b3', 'd4e5', 'c2b3',
        'g4h2', 'g4e3', 'g4e5', 'g4f6', 'g4h6', 'b1d2',
        'b1a3', 'c3d2', 'c3b4', 'c3a5', 'h3h1', 'h3h2',
        'h3d3', 'h3e3', 'h3f3', 'h3g3', 'd1c1', 'd1d2',
        'd1d3', 'e1d2',
      ];
      const fromN = 0;
      const bulk = getBulkOfMoves(fen, moves, fromN, sort);
      expect(bulk).toMatchSnapshot();
    });

    test('Bulk with En Passant move', () => {
      const fen = 'rn1qkb1r/p1p3pp/5pn1/b1Ppp3/3P2NP/1pB4R/PP2PPP1/RN1QKB2 w KQkq d6 0 20';
      const moves = [
        'a2a3', 'e2e3', 'f2f3', 'g2g3', 'h4h5', 'c5c6',
        'a2a4', 'e2e4', 'f2f4', 'a2b3', 'd4e5', 'c5d6',
        'g4h2', 'g4e3', 'g4e5', 'g4f6', 'g4h6', 'b1d2',
        'b1a3', 'c3d2', 'c3b4', 'c3a5', 'h3h1', 'h3h2',
        'h3d3', 'h3e3', 'h3f3', 'h3g3', 'd1c1', 'd1c2',
        'd1d2', 'd1b3', 'd1d3', 'e1d2',
      ];
      const fromN = 0;
      const bulk = getBulkOfMoves(fen, moves, fromN, sort);
      expect(bulk).toMatchSnapshot();
    });

    test('Bulk with Castling moves', () => {
      const fen = 'r3k2r/4b3/1np4p/p1Pq2p1/3P2P1/N1P1Q3/P7/2KR1B2 b kq - 3 41';
      const moves = [
        'a5a4', 'h6h5', 'b6a4', 'b6c4', 'b6d7', 'b6c8',
        'e8c8', 'e8g8', 'e8f8', 'e8d8', 'e8f7', 'a8a6',
        'a8a7', 'a8b8', 'a8c8', 'a8d8', 'h8h7', 'h8f8',
        'h8g8', 'd5h1', 'd5a2', 'd5g2', 'd5b3', 'd5f3',
        'd5c4', 'd5d4', 'd5e4', 'd5c5', 'd5e5', 'd5f5',
        'd5d6', 'd5e6', 'd5d7', 'd5f7', 'd5d8', 'd5g8',
        'e8d7',
      ];
      const fromN = 0;
      const bulk = getBulkOfMoves(fen, moves, fromN, sort);
      expect(bulk).toMatchSnapshot();
    });

    test('Bulk with Promotion moves', () => {
      const fen = '2r5/1P2P3/2p5/p6k/6p1/N6p/1K6/8 w KQkq - 0 54';
      const moves = [
        'b7c8q', 'b7c8r', 'b7c8b', 'b7c8n', 'b7b8q', 'b7b8r',
        'b7b8b', 'b7b8n', 'e7e8q', 'e7e8r', 'e7e8b', 'e7e8n',
        'a3b1', 'a3c2', 'a3c4', 'a3b5', 'b2a1', 'b2b1',
        'b2c1', 'b2a2', 'b2c2', 'b2b3', 'b2c3',
      ];
      const fromN = 0;
      const bulk = getBulkOfMoves(fen, moves, fromN, sort);
      expect(bulk).toMatchSnapshot();
    });
    
    test('Bulk with All', () => {
      const fen = 'k5b1/1rq2P1P/3b4/pP1pn3/n1pPN3/6Q1/1R1B1P2/4K2R w K a6 0 29';
      const moves = [
        'f2f3', 'b5b6', 'f2f4', 'f7g8q', 'f7g8r', 'f7g8b',
        'f7g8n', 'h7g8q', 'h7g8r', 'h7g8b', 'h7g8n', 'f7f8q',
        'f7f8r', 'f7f8b', 'f7f8n', 'h7h8q', 'h7h8r', 'h7h8b',
        'h7h8n', 'd4e5', 'b5a6', 'e4c3', 'e4c5', 'e4g5',
        'e4d6', 'e4f6', 'd2c1', 'd2c3', 'd2e3', 'd2b4',
        'd2f4', 'd2a5', 'd2g5', 'd2h6', 'b2b1', 'b2a2',
        'b2c2', 'b2b3', 'b2b4', 'h1f1', 'h1g1', 'h1h2',
        'h1h3', 'h1h4', 'h1h5', 'h1h6', 'g3g1', 'g3g2',
        'g3h2', 'g3a3', 'g3b3', 'g3c3', 'g3d3', 'g3e3',
        'g3f3', 'g3h3', 'g3f4', 'g3g4', 'g3h4', 'g3e5',
        'g3g5', 'g3g6', 'g3g7', 'g3g8', 'e1d1', 'e1f1',
        'e1e2', 'e1g1',
      ];
      const fromN = 0;
      const bulk = getBulkOfMoves(fen, moves, fromN, sort);
      expect(bulk).toMatchSnapshot();
    });

    test('Bulk chain works correctly', () => {
      const fen = 'k5b1/1rq2P1P/3b4/pP1pn3/n1pPN3/6Q1/1R1B1P2/4K2R w K a6 0 29';
      const moves = [
        'f2f3', 'b5b6', 'f2f4', 'f7g8q', 'f7g8r', 'f7g8b',
        'f7g8n', 'h7g8q', 'h7g8r', 'h7g8b', 'h7g8n', 'f7f8q',
        'f7f8r', 'f7f8b', 'f7f8n', 'h7h8q', 'h7h8r', 'h7h8b',
        'h7h8n', 'd4e5', 'b5a6', 'e4c3', 'e4c5', 'e4g5',
        'e4d6', 'e4f6', 'd2c1', 'd2c3', 'd2e3', 'd2b4',
        'd2f4', 'd2a5', 'd2g5', 'd2h6', 'b2b1', 'b2a2',
        'b2c2', 'b2b3', 'b2b4', 'h1f1', 'h1g1', 'h1h2',
        'h1h3', 'h1h4', 'h1h5', 'h1h6', 'g3g1', 'g3g2',
        'g3h2', 'g3a3', 'g3b3', 'g3c3', 'g3d3', 'g3e3',
        'g3f3', 'g3h3', 'g3f4', 'g3g4', 'g3h4', 'g3e5',
        'g3g5', 'g3g6', 'g3g7', 'g3g8', 'e1d1', 'e1f1',
        'e1e2', 'e1g1',
      ];
      let n = 0;
      let bulk: MovesBulk;
      do {
        bulk = getBulkOfMoves(fen, moves, n, sort);
        n = bulk.next;
      } while (!bulk.end);
      expect(bulk.next).toBe(moves.length);
    });
  });

  describe('All bulks with sorting', () => {
    test.each([
      0, 22, 36, 45, 60,
    ])('Bulk from %n', (n) => {
      const fen = 'k5b1/1rq2P1P/3b4/pP1pn3/n1pPN3/6Q1/1R1B1P2/4K2R w K a6 0 29';
      const moves = [
        'f2f3', 'b5b6', 'f2f4', 'f7g8q', 'f7g8r', 'f7g8b',
        'f7g8n', 'h7g8q', 'h7g8r', 'h7g8b', 'h7g8n', 'f7f8q',
        'f7f8r', 'f7f8b', 'f7f8n', 'h7h8q', 'h7h8r', 'h7h8b',
        'h7h8n', 'd4e5', 'b5a6', 'e4c3', 'e4c5', 'e4g5',
        'e4d6', 'e4f6', 'd2c1', 'd2c3', 'd2e3', 'd2b4',
        'd2f4', 'd2a5', 'd2g5', 'd2h6', 'b2b1', 'b2a2',
        'b2c2', 'b2b3', 'b2b4', 'h1f1', 'h1g1', 'h1h2',
        'h1h3', 'h1h4', 'h1h5', 'h1h6', 'g3g1', 'g3g2',
        'g3h2', 'g3a3', 'g3b3', 'g3c3', 'g3d3', 'g3e3',
        'g3f3', 'g3h3', 'g3f4', 'g3g4', 'g3h4', 'g3e5',
        'g3g5', 'g3g6', 'g3g7', 'g3g8', 'e1d1', 'e1f1',
        'e1e2', 'e1g1',
      ];
      const sort = true;
      const bulk = getBulkOfMoves(fen, moves, n, sort);
      expect(bulk).toMatchSnapshot();
    });
  });
  
  describe('All bulks without sorting', () => {
    test.each([
      0, 16, 30, 53,
    ])('Bulk from %n', (n) => {
      const fen = 'k5b1/1rq2P1P/3b4/pP1pn3/n1pPN3/6Q1/1R1B1P2/4K2R w K a6 0 29';
      const moves = [
        'f2f3', 'b5b6', 'f2f4', 'f7g8q', 'f7g8r', 'f7g8b',
        'f7g8n', 'h7g8q', 'h7g8r', 'h7g8b', 'h7g8n', 'f7f8q',
        'f7f8r', 'f7f8b', 'f7f8n', 'h7h8q', 'h7h8r', 'h7h8b',
        'h7h8n', 'd4e5', 'b5a6', 'e4c3', 'e4c5', 'e4g5',
        'e4d6', 'e4f6', 'd2c1', 'd2c3', 'd2e3', 'd2b4',
        'd2f4', 'd2a5', 'd2g5', 'd2h6', 'b2b1', 'b2a2',
        'b2c2', 'b2b3', 'b2b4', 'h1f1', 'h1g1', 'h1h2',
        'h1h3', 'h1h4', 'h1h5', 'h1h6', 'g3g1', 'g3g2',
        'g3h2', 'g3a3', 'g3b3', 'g3c3', 'g3d3', 'g3e3',
        'g3f3', 'g3h3', 'g3f4', 'g3g4', 'g3h4', 'g3e5',
        'g3g5', 'g3g6', 'g3g7', 'g3g8', 'e1d1', 'e1f1',
        'e1e2', 'e1g1',
      ];
      const sort = false;
      const bulk = getBulkOfMoves(fen, moves, n, sort);
      expect(bulk).toMatchSnapshot();
    });

  });

  describe.each([
    'en', 'ru',
  ])('Output string listing moves for locale %s', (locale) => {
    
    beforeAll(() => {
      initLanguage(locale);
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
          {
            pos: 'f3',
            type: 'P',
            moves: [{ to: 'f4' }],
          },
          {
            pos: 'h1',
            type: 'K',
            moves: [{ to: 'g1' }, { to: 'g2' }, { to: 'h2' }],
          },
          {
            moves: [{ to: 'h4' }],
            pos: 'h3',
            type: 'P',
          },
        ] as PieceMoves[],
      ],
      [
        [
          {
            pos: 'a5',
            type: 'P',
            moves: [{ from: 'b5', to: 'a6' }],
            enPassant: true,
          },
          {
            pos: 'f7',
            type: 'P',
            moves: [{ beat: 'b', promo: true, to: 'g8' }],
          },
          {
            pos: 'h7',
            type: 'P',
            moves: [{ beat: 'b', promo: true, to: 'g8' }],
          },
          {
            pos: 'f7',
            type: 'P',
            moves: [{ promo: true, to: 'f8' }],
          },
          {
            pos: 'h7',
            type: 'P',
            moves: [{ promo: true, to: 'h8' }],
          },
          {
            pos: 'd2',
            type: 'B',
            moves: [{ beat: 'p', to: 'a5' }],
          },
          {
            pos: 'd4',
            type: 'P',
            moves: [{ beat: 'n', to: 'e5' }],
          },
          {
            pos: 'e4',
            type: 'N',
            moves: [{ beat: 'b', to: 'd6' }],
          },
          {
            pos: 'g3',
            type: 'Q',
            moves: [{ beat: 'n', to: 'e5'}, { beat: 'b', to: 'g8' }],
          },
        ],
      ],
    ])('Move string', (posAndMoves) => {
      const allPos = posAndMoves.reduce((arr, pos) => {
        arr.push(pos.pos);
        arr.push(...pos.moves.map((move) => pos.enPassant ? move.from : move.to));
        return arr;
      }, []);
      const str = listMoves(posAndMoves);
      console.log(str);
      expect(str).toIncludeAll(allPos);
    });
  });

});