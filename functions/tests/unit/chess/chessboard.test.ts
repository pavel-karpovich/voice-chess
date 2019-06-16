import '../../extend/toUnorderedEqual';
import '../../extend/toBeArray';

import { ChessBoard, ChessSquareData } from '../../../src/chess/chessboard';
import { ChessSide } from '../../../src/chess/chessUtils';

describe('Tests of Chess Board class', () => {

  describe('Tests without changing board', () => {

    const globalFenstring = 'rn2kb2/p1p4p/b2p2p1/1B2p3/P3P2q/1P1n1P1N/2PQ2P1/R1B1K2R w KQkq e6 2 17';
    let board: ChessBoard;

    beforeAll(() => {
      board = new ChessBoard(globalFenstring);
    });

    test.each([
      ['a1', 'R'],
      ['b2', null],
      ['b5', 'B'],
      ['h7', 'p'],
    ])('Getting a piece from specified position', (pos, piece) => {
      const pp = board.pos(pos);
      expect(pp).toBe(piece);
    });

    test.each([
      [1, [ 
        { pos: 'a1', val: 'R' },
        { pos: 'c1', val: 'B' },
        { pos: 'e1', val: 'K' },
        { pos: 'h1', val: 'R' },
      ]],
      [5, [ 
        { pos: 'b5', val: 'B' },
        { pos: 'e5', val: 'p' },
      ]],
    ])('Getting all pieces from the specified rank', (rank, pieces) => {
      const rankData = board.rank(rank as number);
      expect(rankData).toBeArray(pieces as ChessSquareData[]);
    });
    
    test.each([
      ['P', ['c2', 'g2', 'b4', 'f3', 'a4', 'e4']],
      ['b', ['f8', 'a6']],
      ['K', ['e1']],
    ])('Getting all pieces by given type', (type, pieces) => {
      const allPiecesOfType = board.allPiecesByType(type as string);
      expect(allPiecesOfType).toBeArray(pieces as string[]);
    });

    test.each([
      [ChessSide.WHITE, [ 
        { pos: 'a1', val: 'R' }, { pos: 'c1', val: 'B' }, { pos: 'e1', val: 'K' },
        { pos: 'h1', val: 'R' }, { pos: 'c2', val: 'P' }, { pos: 'd2', val: 'Q' }, 
        { pos: 'g2', val: 'P' }, { pos: 'b3', val: 'P' }, { pos: 'f3', val: 'P' },
        { pos: 'h3', val: 'N' }, { pos: 'a4', val: 'P' }, { pos: 'e4', val: 'P' },
        { pos: 'b5', val: 'B' }, 
      ]],
      [ChessSide.BLACK, [ 
        { pos: 'a8', val: 'r' }, { pos: 'b8', val: 'n' }, { pos: 'e8', val: 'k' },
        { pos: 'd8', val: 'b' }, { pos: 'a7', val: 'p' }, { pos: 'c7', val: 'p' },
        { pos: 'h7', val: 'p' }, { pos: 'a6', val: 'p' }, { pos: 'd6', val: 'p' }, 
        { pos: 'g6', val: 'p' }, { pos: 'e5', val: 'p' }, { pos: 'h4', val: 'q' },
        { pos: 'd3', val: 'n' },
      ]],
    ])('Getting all pieces for chosen side', (side, pieces) => {
      const allPieces = board.allPiecesBySide(side as ChessSide);
      expect(allPieces).toBeArray(pieces as ChessSquareData[]);
    });

    test('Get all captured pieces', () => {
      const actual = {
        white: [{ piece: 'P', count: 2 }, { piece: 'N', count: 1 }],
        black: [{ piece: 'p', count: 2 }, { piece: 'r', count: 1 }],
      };
      const captured = board.capturedPieces();
      expect(captured).toUnorderedEqual(actual);
    });

    test.each([
      [ChessSide.WHITE, ['e1g1']],
      [ChessSide.BLACK, []],
    ])('Available castling moves', (side, available) => {
      const castl = board.getAvailableCastlingMoves(side as ChessSide);
      expect(castl).toBeArray(available as string[]);
    });

    test.each([
      ['e8g8', false],
      ['e1c1', false],
      ['e1g1', true],
    ])('Is particular move a castling now or not', (move, isIt) => {
      const isCastl = board.isMoveCastling(move as string);
      expect(isCastl).toBe(isIt);
    });

    test.each([
      ['e1g1', 'h1f1'],
      ['e1c1', 'a1d1'],
      ['e8c8', 'a8d8'],
      ['e8h8', null],
      ['g5c1', null],
    ])('Getting the Rook move for th king castling move', (kingMove, rookMove) => {
      const recievedMove = board.rookMoveForCastlingMove(kingMove);
      expect(recievedMove).toBe(rookMove);
    });

    describe('Testing getters', () => {
      test('Get En Passant', () => {
        const expectedEnPassant = 'e6';
        const actual = board.enPassant;
        expect(actual).toBe(expectedEnPassant);
      });

      test('Get castling string', () => {
        const expectedCastlings = 'KQkq';
        const actual = board.cstFen;
        expect(actual).toBe(expectedCastlings);
      });

      test('Get number of full moves', () => {
        const expectFullMoves = 17;
        const actual = board.movesNumber;
        expect(actual).toBe(expectFullMoves);
      });

      test('Get side whose turn is now', () => {
        const expectSide = ChessSide.WHITE;
        const actual = board.moveSide;
        expect(actual).toBe(expectSide);
      });
      
      test('Fen converting without move extraction just returned an initial fen', () => {
        const initFen = 'r1b1kb1r/p3p1pp/npp2n2/q2p1p2/4P3/NQPB1P1P/PP1P2P1/R3KBNR w KQkq - 1 8';
        const board = new ChessBoard(initFen);
        const retFen = board.convertToFen();
        expect(retFen).toBe(initFen);
      });
    });
  });

  describe('Move extracting and generating fen string', () => {

    describe('Returned value of extract', () => {

      const fen = 'rnb1kb1r/pp1p1ppp/1q2pn2/2p5/2P1P3/N2B4/PP1P1PPP/R1BQK1NR w KQkq - 2 6';
      test.each([
        ['g8f6', true],
        ['d8b6', true],
        ['e2e4', false],
        ['b1d3', false],
        ['e8f6', false],
        ['a7a8', false],
      ])("Extraction of move %s will return %p", (move, isCorrect) => {
        const board = new ChessBoard(fen);
        const result = board.extract(move as string);
        expect(result).toBe(isCorrect);
      });
    });

    function oneMove(
        before: string,
        move1: [string, string?, string?, string?],
        after: string,
        tweak?: string
      ): void {
        const board = new ChessBoard(after);
        board.extract(...move1);
        if (tweak) board.loadCorrectCastlingFen(tweak);
        const generated = board.convertToFen();
        expect(generated).toBe(before);
    }
    
    function twoMoves(
        before: string,
        move1: [string, string?, string?, string?],
        move2: [string, string?, string?, string?],
        after: string,
        tweak?: string
      ): void {
        const board = new ChessBoard(after);
        board.extract(...move2);
        board.extract(...move1);
        if (tweak) board.loadCorrectCastlingFen(tweak);
        const generated = board.convertToFen();
        expect(generated).toBe(before);
    }

    test('One simple move', () => {
      oneMove(
        'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        ['e2e3'],
        'rnbqkbnr/pppppppp/8/8/8/4P3/PPPP1PPP/RNBQKBNR b KQkq - 0 1'
      );
    });
    
    test('Two simple moves', () => {
      twoMoves(
        'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        ['e2e3'],
        ['d7d5'],
        'rnbqkbnr/ppp1pppp/8/3p4/8/4P3/PPPP1PPP/RNBQKBNR w KQkq - 0 2'
      );
    });

    test('Move with capturing', () => {
      oneMove(
        'rnbqk1r1/ppp2ppp/3bpn2/6P1/3pP3/P1NP4/1PP2PBP/R1BQK1NR w KQkq - 0 7',
        ['g5f6', 'n'],
        'rnbqk1r1/ppp2ppp/3bpP2/8/3pP3/P1NP4/1PP2PBP/R1BQK1NR b KQkq - 0 7'
      );
    });

    test('Two moves with capturing', () => {
      twoMoves(
        'rnbqk1r1/ppp2p1p/3bp3/5p2/3pP3/P1NP1N1B/1PP2P1P/R1BQK2R b KQkq - 0 10',
        ['d4c3', 'N'],
        ['b2c3', 'p'],
        'rnbqk1r1/ppp2p1p/3bp3/5p2/4P3/P1PP1N1B/2P2P1P/R1BQK2R b KQkq - 0 11'
      );
    });
    
    test('Move with En Passant capturing', () => {
      oneMove(
        'rnbqk1r1/ppp2p2/3bp3/5p1p/4P3/P1PP1N1B/2P2P1P/R1BQK2R w KQkq h6 0 12',
        ['c1h6', null, 'h5'],
        'rnbqk1r1/ppp2p2/3bp2B/5p2/4P3/P1PP1N1B/2P2P1P/R2QK2R b KQkq - 0 12'
      );
    });

    test('Simple move and next move with En Passant capturing', () => {
      twoMoves(
        'rnbqk1r1/ppp2p1p/3bp3/5p2/4P3/P1PP1N1B/2P2P1P/R1BQK2R b KQkq - 0 11',
        ['h7h5'],
        ['c1h6', null, 'h5'],
        'rnbqk1r1/ppp2p2/3bp2B/5p2/4P3/P1PP1N1B/2P2P1P/R2QK2R b KQkq - 0 12'
      );
    });

    test('Promotion move', () => {
      oneMove(
        'rnb1kr2/1p5P/2p2p2/p4pq1/4P3/R1PPBN2/2P2P2/3QK2R w KQkq - 0 21',
        ['h7h8q'],
        'rnb1kr1Q/1p6/2p2p2/p4pq1/4P3/R1PPBN2/2P2P2/3QK2R b KQkq - 0 21'
      );
    });

    test('Promotion move and next move with capturing', () => {
      twoMoves(
        'rnb1kr2/1p5P/2p2p2/p4pq1/4P3/R1PPBN2/2P2P2/3QK2R w KQkq - 0 21',
        ['h7h8n'],
        ['f8h8', 'N'],
        'rnb1k2r/1p6/2p2p2/p4pq1/4P3/R1PPBN2/2P2P2/3QK2R w KQkq - 0 22'
      );
    });
    
    test('Promotion move with capturing', () => {
      oneMove(
        'Q2n3r/2P2k2/4p3/p4pq1/5P2/R3B3/5P2/4K2R w KQkq - 0 32',
        ['c7d8n', 'n'],
        'Q2N3r/5k2/4p3/p4pq1/5P2/R3B3/5P2/4K2R b KQkq - 0 32'
      );
    });
    
    test('Two promotion moves with capturing', () => {
      twoMoves(
        'rn3p2/6P1/2kbb2B/4p3/2pP4/2q2N1B/p1P1QP1P/1R4K1 w KQkq - 0 27',
        ['g7f8q', 'p'],
        ['a2b1q', 'R'],
        'rn3Q2/8/2kbb2B/4p3/2pP4/2q2N1B/2P1QP1P/1q4K1 w KQkq - 0 28'
      );
    });
    
    test('Queenside castling move', () => {
      oneMove(
        'r3k1nr/1p4qp/p2pB3/n3Q3/4P1P1/2PP4/P1P2P1P/R3K2R w KQkq - 3 34',
        ['e1c1', null, null, 'a1d1'],
        'r3k1nr/1p4qp/p2pB3/n3Q3/4P1P1/2PP4/P1P2P1P/2KR3R b kq - 4 34',
        'KQkq'
      );
    });

    test('Kingside castling move', () => {
      oneMove(
        'r3k2r/1p5p/p2pB2n/8/4P1P1/2PP4/P6P/2KR2R1 b kq - 1 41',
        ['e8g8', null, null, 'h8f8'],
        'r4rk1/1p5p/p2pB2n/8/4P1P1/2PP4/P6P/2KR2R1 w - - 2 42',
        'kq'
      );
    });

    test('Two castling moves', () => {
      twoMoves(
        'r3kbnr/ppp1q1pp/2npbp2/4p3/2B1P3/2PPBQ1N/P1P2PPP/RN2K2R w KQkq - 2 8',
        ['e1g1', null, null, 'h1f1'],
        ['e8c8', null, null, 'a8d8'],
        '2kr1bnr/ppp1q1pp/2npbp2/4p3/2B1P3/2PPBQ1N/P1P2PPP/RN3RK1 w - - 4 9',
        'KQkq'
      );
    });

  });
});
