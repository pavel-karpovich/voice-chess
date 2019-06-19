import { MockBoard } from '../../../mocks/mockBoard';
jest.doMock('../../../../src/chess/chessboard', () => {
  return { ChessBoard: MockBoard };
});
import { Mochess } from '../../../mocks/mochess';
jest.doMock('../../../../src/chess/chess', () => {
  return {
    Chess: Mochess,
    chessBoardSize: 8,
  };
});
import { Env } from './_env';
import { initLanguage } from '../../../../src/locales/initLang';
import { MoveHandlers } from '../../../../src/handlers/private/move';
import { Chess, ChessGameState } from '../../../../src/chess/chess';
import { GameHandlers } from '../../../../src/handlers/private/game';
import { ChessSide, oppositeSide } from '../../../../src/chess/chessUtils';

describe('Tests for move handlers', () => {

  const locale = 'ru';
  beforeAll(() => {
    initLanguage(locale);
  });

  let env: Env;
  beforeEach(() => {
    env = new Env();
    MoveHandlers.load(
      env.toOutput.bind(env),
      env.contexts,
      env.convData,
      env.userStorage,
      env.endConversation.bind(env)
    );
  });

  describe('Ask to move next or remain the board positions', () => {

    test('In the context of correcting last move', () => {
      env.contexts.set('correct-last-move', 1);
      MoveHandlers.askOrRemind();      
      expect(env.output).toHaveLength(1);
      expect(env.contexts.is('turn-showboard')).toBeFalsy();
    });

    test('With 100% chance to ask move', () => {
      MoveHandlers.askOrRemind(1);
      expect(env.output).toHaveLength(1);
      expect(env.contexts.is('turn-showboard')).toBeFalsy();
    });

    test('With 100% chance to remind the board positions', () => {
      MoveHandlers.askOrRemind(0);      
      expect(env.output).toHaveLength(1);
      expect(env.contexts.is('turn-showboard')).toBeTruthy();
    });
  });

  describe("Preparing to the player's move", () => {

    let pMoveMock: jest.SpyInstance;
    let cMoveMock: jest.SpyInstance;
    beforeEach(() => {
      pMoveMock = jest.spyOn(MoveHandlers, 'moveByPlayer').mockImplementationOnce(async() =>{});
      cMoveMock = jest.spyOn(MoveHandlers, 'moveByAI').mockImplementationOnce(async() => {});
    });
    afterEach(() => {
      pMoveMock.mockRestore();
      cMoveMock.mockRestore();
      Mochess.resetMockedData();
    });

    test('No preparation, make moves', async () => {
      Mochess.isPromo = false;
      const chess = new Chess('Fen', 10);
      const move = 'move1';
      await MoveHandlers.prepareToMove(move, chess);
      expect(env.contexts.is('ask-to-promotion')).toBeFalsy();
      expect(MoveHandlers.moveByPlayer).toBeCalledWith(move, chess);
      expect(MoveHandlers.moveByAI).toBeCalledWith(chess);
      expect(env.output).toHaveLength(0);
    });
    
    test("When a player's move expects to be promotion", async () => {
      Mochess.isPromo = true;
      const fen = 'Fen string';
      const difficulty = 10;
      const move = 'move1';
      env.userStorage.fen = fen;
      env.userStorage.options = { difficulty };
      await MoveHandlers.prepareToMove(move);
      expect(env.contexts.get('ask-to-promotion').parameters).toEqual({ move });
      expect(env.contexts.is('correct-last-move')).toBeFalsy();
      expect(env.output).toHaveLength(2);
      expect(MoveHandlers.moveByPlayer).not.toBeCalled();
    });

    test("When a player's move is a promotion and correction", async () => {
      Mochess.isPromo = true;
      const fen = 'Fen string';
      const difficulty = 10;
      const move = 'move1';
      env.userStorage.fen = fen;
      env.userStorage.options = { difficulty };
      env.contexts.set('correct-last-move', 1);
      await MoveHandlers.prepareToMove(move);
      expect(env.contexts.is('ask-to-promotion')).toBeTruthy();
      expect(env.contexts.is('correct-last-move')).toBeTruthy();
      expect(env.output).toHaveLength(2);
      expect(MoveHandlers.moveByPlayer).not.toBeCalled();
    });
  });

  describe("Player's move", () => {

    afterEach(() => {
      Mochess.resetMockedData();
      MockBoard.resetMockedData();
    });

    test.each([
      ['b2b4', false, false, false],
      ['b2b4', true, false, false],
      ['b2b4', false, true, true],
      ['b2b4q', false, false, false],
      ['b2b4q', true, false, false],
    ])('Different types of move', async (move, isCapturing, isEnPassant, isCastling) => {
      const fen = 'Test fen';
      const difficulty = 4;
      env.userStorage.fen = fen;
      env.userStorage.options = { difficulty };
      env.userStorage.history = [];
      const cstFen = 'castling fen';
      MockBoard.cstFen = cstFen;
      MockBoard.isCapturing = isCapturing as boolean;
      MockBoard.isEnPassant = isEnPassant as boolean;
      MockBoard.isCastling = isCastling as boolean;
      MockBoard.pos = 'p';
      MockBoard.rookMove = 'e2e4';
      Mochess.state = ChessGameState.OK;
      await MoveHandlers.moveByPlayer(move as string);
      expect(env.output).toHaveLength(1);
      expect(env.userStorage.cstFen).toBe(cstFen);
      expect(env.userStorage.history).toHaveLength(1);
    });

    describe('Types of result', () => {

      let endGameMock: jest.SpyInstance;
      beforeEach(() => {
        endGameMock = jest.spyOn(GameHandlers, 'dropGame');
        endGameMock.mockImplementationOnce(() => {});
      });
      afterEach(() => {
        endGameMock.mockRestore();
      });
      
      test.each([
        ChessGameState.CHECKMATE,
        ChessGameState.FIFTYMOVEDRAW,
        ChessGameState.STALEMATE,
      ])('Various game ending types', async (state) => {
        const move = 'h5c4';
        const fen = 'Test fen';
        const difficulty = 4;
        env.userStorage.fen = fen;
        env.userStorage.options = { difficulty };
        env.userStorage.history = [];
        MockBoard.isCapturing = false;
        MockBoard.isEnPassant = false;
        MockBoard.isCastling = false;
        MockBoard.pos = 'p';
        Mochess.state = state;
        await MoveHandlers.moveByPlayer(move);
        expect(env.output).toHaveLength(2);
        expect(env.userStorage.history).toHaveLength(1);
        expect(GameHandlers.dropGame).toBeCalledTimes(1);
      });

      test.each([
        ChessGameState.CHECK,
        ChessGameState.OK,
      ])('Non-ending results', async (state) => {
        const move = 'h5c4';
        const fen = 'Test fen';
        const difficulty = 4;
        env.userStorage.fen = fen;
        env.userStorage.options = { difficulty };
        env.userStorage.history = [];
        MockBoard.isCapturing = false;
        MockBoard.isEnPassant = false;
        MockBoard.isCastling = false;
        MockBoard.pos = 'p';
        Mochess.state = state;
        await MoveHandlers.moveByPlayer(move);
        expect(env.output).toHaveLength(1);
        expect(env.userStorage.history).toHaveLength(1);
        expect(GameHandlers.dropGame).not.toBeCalledTimes(1);
      });
    });

    test('With prologue', async () => {
      const move = 'b2b4';
      const fen = 'Test fen';
      const newFen = 'Fen after move';
      const difficulty = 4;
      Mochess.state = ChessGameState.OK;
      Mochess.fen = newFen;
      const chess = new Chess(fen, difficulty);
      env.userStorage.fen = fen;
      env.userStorage.options = { difficulty };
      env.userStorage.history = [];
      MockBoard.isCapturing = false;
      MockBoard.isEnPassant = false;
      MockBoard.isCastling = false;
      MockBoard.pos = 'p';
      const prologue = 'Prologue';
      await MoveHandlers.moveByPlayer(move, chess, prologue);
      expect(env.output).toHaveLength(1);
      expect(env.userStorage.history).toHaveLength(1);
      expect(env.output[0].startsWith(prologue)).toBeTruthy();
      expect(env.userStorage.fen).toBe(newFen);
    });

    test('When a move is correction', async () => {
      const move = 'b2b4';
      const fen = 'Test fen';
      const newFen = 'Fen after converting';
      const difficulty = 4;
      env.userStorage.fen = fen;
      env.userStorage.options = { difficulty };
      env.userStorage.history = [{ m: 'move1' }, { m: 'move3' }];
      env.contexts.set('correct-last-move', 1);
      MockBoard.isCapturing = false;
      MockBoard.isEnPassant = false;
      MockBoard.isCastling = false;
      MockBoard.pos = 'p';
      MockBoard.convFen = newFen;
      Mochess.state = ChessGameState.OK;
      await MoveHandlers.moveByPlayer(move);
      expect(env.output).toHaveLength(1);
      expect(env.userStorage.history).toHaveLength(1);
      expect(env.userStorage.fen).toBe(newFen);
    });
  });

  
  describe("Computer's move", () => {

    afterEach(() => {
      Mochess.resetMockedData();
      MockBoard.resetMockedData();
    });

    test.each([
      ['b2b4', false, false, false],
      ['b2b4', true, false, false],
      ['b2b4', false, true, true],
      ['b2b4q', false, false, false],
      ['b2b4q', true, false, false],
    ])('Different types of move', async (move, isCapturing, isEnPassant, isCastling) => {
      const fen = 'Test fen';
      const newFen = 'Fen after move';
      const difficulty = 4;
      env.userStorage.fen = fen;
      env.userStorage.options = { difficulty };
      env.userStorage.history = [];
      MockBoard.isCapturing = isCapturing as boolean;
      MockBoard.isEnPassant = isEnPassant as boolean;
      MockBoard.isCastling = isCastling as boolean;
      MockBoard.pos = 'p';
      MockBoard.rookMove = 'e2e4';
      Mochess.state = ChessGameState.OK;
      Mochess.enemyMove = move as string;
      Mochess.fen = newFen;
      await MoveHandlers.moveByAI();
      expect(env.output).toHaveLength(1);
      expect(env.userStorage.history).toHaveLength(1);
      expect(env.userStorage.fen).toBe(newFen);
    });

    describe('Types of result', () => {

      let endGameMock: jest.SpyInstance;
      const move = 'h5c4';
      const fen = 'Test fen';
      const difficulty = 4;

      beforeEach(() => {
        endGameMock = jest.spyOn(GameHandlers, 'dropGame');
        endGameMock.mockImplementationOnce(() => {});
        env.userStorage.fen = fen;
        env.userStorage.options = { difficulty };
        env.userStorage.history = [];
        MockBoard.isCapturing = false;
        MockBoard.isEnPassant = false;
        MockBoard.isCastling = false;
        Mochess.enemyMove = move;
        MockBoard.pos = 'p';
      });
      
      afterEach(() => {
        endGameMock.mockRestore();
      });
      
      test.each([
        ChessGameState.CHECKMATE,
        ChessGameState.FIFTYMOVEDRAW,
        ChessGameState.STALEMATE,
      ])('Various game ending types', async (state) => {
        Mochess.state = state;
        await MoveHandlers.moveByAI();
        expect(env.output).toHaveLength(1);
        expect(env.userStorage.history).toHaveLength(1);
        expect(GameHandlers.dropGame).toBeCalledTimes(1);
      });

      test.each([
        ChessGameState.CHECK,
        ChessGameState.OK,
      ])('Non-ending results', async (state) => {
        Mochess.state = state;
        await MoveHandlers.moveByAI();
        expect(env.output).toHaveLength(1);
        expect(env.userStorage.history).toHaveLength(1);
        expect(GameHandlers.dropGame).not.toBeCalledTimes(1);
      });
    });
  });

  test('Simple move by AI without anything unsuspectable', async () => {
    const fen = 'Fen';
    const newFen = 'Fen after move';
    const difficulty = 12;
    const move = 'my-move';
    env.userStorage.fen = fen;
    env.userStorage.options = { difficulty };
    env.userStorage.history = [];
    Mochess.enemyMove = move;
    Mochess.fen = newFen;
    await MoveHandlers.simpleMoveByAI();
    expect(env.output).toHaveLength(1);
    expect(Mochess.instance.moveAuto).toBeCalledTimes(1);
    expect(env.userStorage.fen).toBe(newFen);
    expect(env.userStorage.history).toHaveLength(1);
    Mochess.resetMockedData();
    MockBoard.resetMockedData();
  });

  test('Player move by AI', async () => {
    const pMoveMock = jest.spyOn(MoveHandlers, 'moveByPlayer');
    pMoveMock.mockImplementationOnce(async() => {});
    const fen = 'Fen';
    const difficulty = 12;
    const move = 'my-move';
    env.userStorage.fen = fen;
    env.userStorage.options = { difficulty };
    Mochess.bestMove = move;
    await MoveHandlers.playerMoveByAI();
    expect(env.output).toHaveLength(0);
    expect(Mochess.instance.bestMove).toBeCalledTimes(1);
    pMoveMock.mockRestore();
    Mochess.resetMockedData();
    MockBoard.resetMockedData();
  });

  describe('Turn handler', () => {

    let moveMock: jest.SpyInstance;
    let remindMock: jest.SpyInstance;
    const from = 'a2';
    const to = 'a4';
    const fen = 'Test fen';
    const playerSide = ChessSide.WHITE;
    const difficulty = 4;
    const moveConfirm = false;

    beforeEach(() => {
      moveMock = jest.spyOn(MoveHandlers, 'prepareToMove');
      moveMock.mockImplementationOnce(async() => {});
      remindMock = jest.spyOn(MoveHandlers, 'askOrRemind');
      remindMock.mockImplementationOnce(async() => {});
      env.userStorage.fen = fen;
      env.userStorage.side = playerSide;
      env.userStorage.options = { difficulty, confirm: moveConfirm };
      env.userStorage.history = [{ m: 'move1' }, { m: 'move2' }];
      MockBoard.pos = 'P';
      MockBoard.moveSide = playerSide;
      Mochess.isLegal = true;
    });

    afterEach(() => {
      Mochess.resetMockedData();
      MockBoard.resetMockedData();
      moveMock.mockRestore();
      remindMock.mockRestore();
    });

    test('Side mismatch', async () => {
      MockBoard.moveSide = oppositeSide(playerSide);
      await MoveHandlers.turn(from, to);
      expect(env.output).toHaveLength(2);
      expect(MoveHandlers.prepareToMove).not.toBeCalled();
    });

    test('All ok, with disabled move confirmation', async () => {
      await MoveHandlers.turn(from, to);
      expect(env.output).toHaveLength(0);
      expect(MoveHandlers.prepareToMove).toBeCalled();
      expect(env.contexts.is('confirm-move')).toBeFalsy();
    });
    
    describe('In context of correction last move', () => {

      test('Just correct move context', async () => {
        env.contexts.set('correct-last-move', 0);
        await MoveHandlers.turn(from, to);
        expect(env.output).toHaveLength(0);
        expect(MoveHandlers.prepareToMove).toBeCalled();
      });

      test('All ok, with enabled move confirmation', async () => {
        const moveConfirm = true;
        env.userStorage.options = { difficulty, confirm: moveConfirm };
        env.contexts.set('correct-last-move', 0);
        await MoveHandlers.turn(from, to);
        expect(env.output).toHaveLength(1);
        expect(env.contexts.is('confirm-move')).toBeTruthy();
        expect(env.contexts.get('correct-last-move').lifespan).toBe(1);
        expect(MoveHandlers.prepareToMove).not.toBeCalled();
      });
    });

    test('Move is not legal', async () => {
      Mochess.isLegal = false;
      Mochess.state = ChessGameState.CHECK;
      await MoveHandlers.turn(from, to);
      expect(env.output).toHaveLength(1);
      expect(MoveHandlers.askOrRemind).toBeCalled();
      expect(MoveHandlers.prepareToMove).not.toBeCalled();
    });

    describe('Move variations', () => {

      test('Wrong side', async () => {
        MockBoard.pos = 'p';
        await MoveHandlers.turn(from, to);
        expect(env.output).toHaveLength(1);
        expect(MoveHandlers.askOrRemind).toBeCalled();
        expect(MoveHandlers.prepareToMove).not.toBeCalled();
      });

      test("The piece is not known, and actually doesn't exist", async () => {
        MockBoard.pos = null;
        await MoveHandlers.turn(from, to);
        expect(env.output).toHaveLength(1);
        expect(MoveHandlers.askOrRemind).toBeCalled();
        expect(MoveHandlers.prepareToMove).not.toBeCalled();
      });

      
      test("The piece known, but doesn't exist actually", async () => {
        const piece = 'B';
        MockBoard.pos = null;
        await MoveHandlers.turn(from, to, piece);
        expect(env.output).toHaveLength(1);
        expect(MoveHandlers.askOrRemind).toBeCalled();
        expect(MoveHandlers.prepareToMove).not.toBeCalled();
      });
      
      test("Known piece and actually piece doesn't match", async () => {
        const piece = 'B';
        MockBoard.pos = "Q";
        const expParams = { move: from + to };
        await MoveHandlers.turn(from, to, piece);
        expect(env.output).toHaveLength(2);
        expect(env.contexts.get('confirm-move').parameters).toEqual(expParams);
        expect(MoveHandlers.prepareToMove).not.toBeCalled();
      });
    });
  });
});
