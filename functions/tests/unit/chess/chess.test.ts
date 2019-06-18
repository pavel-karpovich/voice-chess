import { Mockfish } from '../../mocks/mockfish';
jest.mock('stockfish', () => {
  return (path: string) => new Mockfish();
});
import { Chess, ChessGameState } from '../../../src/chess/chess';

describe('Testing Stockfish Chess class', () => {

  describe('Engine initialize correctly', () => {
    test('Initial fen string', () => {
      const actualInitFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
      const chess = new Chess(null, 10);
      const newFen = chess.fenstring;
      expect(newFen).toBe(actualInitFen);
    });

    test('Difficulty settings are sent to Stockfish', () => {
      const chess = new Chess(null, 10);
      const opt = Mockfish.instance.options;
      expect(chess).toBeDefined();
      expect(opt.skillLevel).toBeDefined();
      expect(opt.skillLevelMaximumError).toBeDefined();
      expect(opt.skillLevelPropability).toBeDefined();
    });

    test('Other settings are sent to Stockfish', () => {
      const chess = new Chess(null, 10);
      const opt = Mockfish.instance.options;
      expect(chess).toBeDefined();
      expect(opt.ponder).toBeDefined();
      expect(opt.slowMover).toBeDefined();
    });

    test('Custom fen string is sent to Stockfish', () => {
      const fen = '2q1k1n1/1pp1pp2/p3PP2/1b6/1Pp3N1/1B1P4/P1PPK2R/R2Q1B2 b KQkq - 3 14';
      const chess = new Chess(fen, 2);
      const chessFen = chess.fenstring;
      expect(chessFen).toBe(fen);
    });
  });

  describe('Updating game state', () => {
    test('Gets the Legal moves from Stockfish', async () => {
      const chess = new Chess(null, 5);
      await chess.updateGameState();
      expect(chess.legalMoves).toEqual(Mockfish.retMoves);
    });

    test('Gets the new Fen string from Stockfish', async () => {
      const chess = new Chess(null, 5);
      await chess.updateGameState();
      expect(chess.fenstring).toEqual(Mockfish.retFen);
    });
  });

  describe('Test moves', () => {
    test("The player's move is sent to Stockfish", async () => {
      const chess = new Chess(null, 5);
      const move = 'b2b4';
      await chess.move(move);
      expect(Mockfish.instance.moves[0]).toBe(move);
    });
    test('Automatic move is sent to Stockfish', async () => {
      const chess = new Chess(null, 5);
      await chess.moveAuto();
      expect(chess.enemyMove).toBe(Mockfish.retBestMove);
    });
    
    test("The player's move updates the state", async () => {
      const chess = new Chess(null, 5);
      const move = 'b2b4';
      await chess.move(move);
      expect(Mockfish.instance.history).toContain('d');
    });

    test("Automatic move updates the state", async () => {
      const chess = new Chess(null, 5);
      await chess.moveAuto();
      expect(Mockfish.instance.history).toContain('d');
    });
  });

  test('Getting the best move', async () => {
    const chess = new Chess(null, 5);
    const bestMove = await chess.bestMove();
    expect(bestMove).toBe(Mockfish.retBestMove);
  });

  describe('Legal moves', () => {
    test("Can't get it without an updated game state", () => {
      const chess = new Chess(null, 5);
      const moves = chess.legalMoves;
      expect(moves).toBeNull();
    });

    test('Getting legal moves after update game state', async () => {
      const chess = new Chess(null, 5);
      await chess.updateGameState();
      const moves = chess.legalMoves;
      expect(moves).toEqual(Mockfish.retMoves);
    });

    test('Check legal move', async () => {
      const legalMove = 'e1f1';
      const chess = new Chess(null, 5);
      await chess.updateGameState();
      const isLegal = chess.isMoveLegal(legalMove);
      expect(isLegal).toBeTruthy();
    });

    test('Check illegal move', async () => {
      const illegalMove = 'g4a6';
      const chess = new Chess(null, 5);
      await chess.updateGameState();
      const isLegal = chess.isMoveLegal(illegalMove);
      expect(isLegal).toBeFalsy();
    });

    test('Check actual promotion move', async () => {
      const promotionMove = 'b7b8';
      const chess = new Chess(null, 5);
      await chess.updateGameState();
      const isProm = chess.isPromotion(promotionMove);
      expect(isProm).toBeTruthy();
    });
    
    test('Check not actual promotion move', async () => {
      const notPromotionMove = 'e1e2';
      const chess = new Chess(null, 5);
      await chess.updateGameState();
      const isProm = chess.isPromotion(notPromotionMove);
      expect(isProm).toBeFalsy();
    });
  });
  
  describe('Test different statuses', () => {

    afterEach(() => {
      Mockfish.resetMockedData();
    });

    test("Can't get game status without updating game state", () => {
      const chess = new Chess(null, 7);
      const status = chess.currentGameState;
      expect(status).toBeNull();
    });

    test('Basic status', async () => {
      const chess = new Chess(null, 7);
      Mockfish.retCheckers = [];
      Mockfish.retMoves = ['e1f2', 'e1f1', 'g4e2'];
      await chess.updateGameState();
      const status = chess.currentGameState;
      expect(status).toBe(ChessGameState.OK);
    });

    test('Check status', async () => {
      const chess = new Chess(null, 7);
      Mockfish.retCheckers = ['e6', 'g5'];
      Mockfish.retMoves = ['e1f2', 'e1f1', 'g4e2'];
      await chess.updateGameState();
      const status = chess.currentGameState;
      expect(status).toBe(ChessGameState.CHECK);
    });

    test('Checkmate status', async () => {
      const chess = new Chess(null, 7);
      Mockfish.retCheckers = ['e6', 'g5'];
      Mockfish.retMoves = [];
      await chess.updateGameState();
      const status = chess.currentGameState;
      expect(status).toBe(ChessGameState.CHECKMATE);
    });

    test('Stalemate status', async () => {
      const chess = new Chess(null, 7);
      Mockfish.retCheckers = [];
      Mockfish.retMoves = [];
      await chess.updateGameState();
      const status = chess.currentGameState;
      expect(status).toBe(ChessGameState.STALEMATE);
    });

    test('Fifty idle moves status', async () => {
      const chess = new Chess(null, 7);
      Mockfish.retFen = '4k3/8/8/8/8/8/8/4K3 b - - 51 39';
      await chess.updateGameState();
      const status = chess.currentGameState;
      expect(status).toBe(ChessGameState.FIFTYMOVEDRAW);
    });
  });
});