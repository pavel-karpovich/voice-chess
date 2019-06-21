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
import { Env } from '../../../mocks/env';
import { initLanguage } from '../../../../src/locales/initLang';
import { AroundMoveHandlers } from '../../../../src/handlers/private/aroundMove';
import { MoveHandlers } from '../../../../src/handlers/private/move';
import { ChessSide, CastlingType } from '../../../../src/chess/chessUtils';
import { FallbackHandlers } from '../../../../src/handlers/private/fallback';
import { OtherHandlers } from '../../../../src/handlers/private/other';

describe('Tests for Around move handlers', () => {

  const locale = 'ru';
  let prepareToMoveMock: jest.SpyInstance;
  let moveByPlayerMock: jest.SpyInstance;
  let moveByAIMock: jest.SpyInstance;
  beforeAll(() => {
    initLanguage(locale);
    prepareToMoveMock = jest.spyOn(MoveHandlers, 'prepareToMove');
    prepareToMoveMock.mockImplementationOnce(async() => {});
    moveByPlayerMock = jest.spyOn(MoveHandlers, 'moveByPlayer');
    moveByPlayerMock.mockImplementationOnce(async() => {});
    moveByAIMock = jest.spyOn(MoveHandlers, 'moveByAI');
    moveByAIMock.mockImplementationOnce(async() => {});
  });

  afterEach(() => {
    prepareToMoveMock.mockReset();
    moveByPlayerMock.mockReset();
    moveByAIMock.mockReset();
  });

  let env: Env;
  beforeEach(() => {
    env = new Env();
    AroundMoveHandlers.load(
      env.toOutput.bind(env),
      env.contexts,
      env.convData,
      env.userStorage,
      env.addSuggestions.bind(env),
      env.endConversation.bind(env)
    );
  });

  test('Accepting the move', async () => {
    const move = 'move1';
    env.contexts.set('confirm-move', 1, { move });
    await AroundMoveHandlers.acceptMove();
    expect(MoveHandlers.prepareToMove).toBeCalledTimes(1);
  });
  
  test('Promotion to the piece', async () => {
    const move = 'move1';
    const promotionTo = 'to';
    env.contexts.set('ask-to-promotion', 1, { move });
    await AroundMoveHandlers.promotion(promotionTo);
    expect(MoveHandlers.moveByPlayer).toBeCalledWith(move + promotionTo);
    expect(MoveHandlers.moveByAI).toBeCalledTimes(1);
  });

  describe('Chose side', () => {

    let simpleCompMove: jest.SpyInstance;
    let suggestMock: jest.SpyInstance;
    beforeAll(() => {
      simpleCompMove = jest.spyOn(MoveHandlers, 'simpleMoveByAI');
      simpleCompMove.mockImplementationOnce(async() => {});
      suggestMock = jest.spyOn(MoveHandlers, 'moveSuggestions');
      suggestMock.mockImplementationOnce(async() => ['sug1']);
    });
    afterEach(() => {
      simpleCompMove.mockReset();
      suggestMock.mockReset();
    });

    test('White', async () => {
      const side = ChessSide.WHITE;
      await AroundMoveHandlers.chooseSide(side);
      expect(env.output).toHaveLength(2);
      expect(MoveHandlers.simpleMoveByAI).not.toBeCalled();
      expect(MoveHandlers.moveSuggestions).toBeCalledTimes(1);
      expect(env.suggestions).not.toHaveLength(0);
    });

    test('Black', async () => {
      const side = ChessSide.BLACK;
      await AroundMoveHandlers.chooseSide(side);
      expect(env.output).toHaveLength(1);
      expect(MoveHandlers.simpleMoveByAI).toBeCalledTimes(1);
    });
  });

  test('Computer makes a move for the player', async () => {
    const mock = jest.spyOn(MoveHandlers, 'playerMoveByAI');
    mock.mockImplementationOnce(async() => {});
    const fen = 'Fen for tests';
    const difficulty = 20;
    env.userStorage.fen = fen;
    env.userStorage.options = { difficulty };
    await AroundMoveHandlers.moveAuto();
    expect(MoveHandlers.playerMoveByAI).toBeCalledTimes(1);
    expect(MoveHandlers.moveByAI).toBeCalledTimes(1);
    mock.mockReset();
  });

  describe('Castling handler', () => {

    const fen = 'Fensting-blah-blah-blah';
    const side = ChessSide.WHITE;
    const rookMove = 'test';
    beforeEach(() => {
      env.userStorage.fen = fen;
      env.userStorage.side = side;
      MockBoard.rookMove = rookMove;
    });
    afterEach(() => {
      MockBoard.resetMockedData();
    });

    test('Castling is not available', async () => {
      const mock = jest.spyOn(OtherHandlers, 'askOrRemind');
      mock.mockImplementationOnce(() => {});
      MockBoard.availableCastlings = [];
      await AroundMoveHandlers.castling();
      expect(env.output).toHaveLength(1);
      expect(OtherHandlers.askOrRemind).toBeCalledTimes(1);
      expect(MoveHandlers.moveByPlayer).not.toBeCalled();
      mock.mockReset();
    });

    test('Need to choose one type of castling from two', async () => {
      MockBoard.availableCastlings = ['oneCst', 'twoCst'];
      await AroundMoveHandlers.castling();
      expect(env.output).toHaveLength(2);
      expect(env.contexts.is('choose-castling')).toBeTruthy();
      expect(MoveHandlers.moveByPlayer).not.toBeCalled();
      expect(env.suggestions).not.toHaveLength(0);
    });

    test('Can do castling, but need a confirmation', async () => {
      const confirm = true;
      env.userStorage.options = { confirm };
      const cstMove = 'oneCst';
      MockBoard.availableCastlings = [cstMove];
      await AroundMoveHandlers.castling();
      expect(env.output).toHaveLength(1);
      expect(env.contexts.get('confirm-move').parameters).toEqual({ move: cstMove });
      expect(MoveHandlers.moveByPlayer).not.toBeCalled();
      expect(env.suggestions).not.toHaveLength(0);
    });

    test('Do castling', async () => {
      const confirm = false;
      env.userStorage.options = { confirm };
      const cstMove = 'oneCst';
      MockBoard.availableCastlings = [cstMove];
      await AroundMoveHandlers.castling();
      expect(env.output).toHaveLength(0);
      expect(MoveHandlers.moveByPlayer).toBeCalledWith(cstMove);
      expect(MoveHandlers.moveByAI).toBeCalledTimes(1);
    });
  });

  describe('Last move correction', () => {

    test('No move to correct', async () => {
      const hist = [] as any[];
      env.userStorage.history = hist;
      await AroundMoveHandlers.correct();
      expect(env.output).toHaveLength(2);
      expect(env.contexts.is('correct-last-move')).toBeFalsy();
      expect(env.suggestions).not.toHaveLength(0);
    });

    test('Start correction action', async () => {
      const rollbackMock = jest.spyOn(MoveHandlers, 'rollbackLastMoves');
      rollbackMock.mockImplementationOnce(() => {});
      const suggestMock = jest.spyOn(MoveHandlers, 'moveSuggestions');
      suggestMock.mockImplementationOnce(async() => ['sug1']);
      const fen = 'Test fen';
      env.userStorage.fen = fen;
      const hist = [{ m: 'move1' }, { m: 'move2' }];
      env.userStorage.history = hist;
      await AroundMoveHandlers.correct();
      expect(env.output).toHaveLength(1);
      expect(env.contexts.is('correct-last-move')).toBeTruthy();
      expect(env.suggestions).not.toHaveLength(0);
      rollbackMock.mockReset();
      suggestMock.mockReset();
      Mochess.resetMockedData();
    });
  });

  describe('Choose castling', () => {

    const fen = 'Test fen';
    const side = ChessSide.BLACK;
    const cstMove1 = 'move1';
    const cstMove2 = 'move2';
    const rookMove = 'rook';
    beforeEach(() => {
      env.userStorage.fen = fen;
      env.userStorage.side = side;
      MockBoard.availableCastlings = [cstMove1, cstMove2];
      MockBoard.rookMove = rookMove;
    });

    test('When no information provided', async () => {
      const mock = jest.spyOn(FallbackHandlers, 'fallback');
      mock.mockImplementationOnce(() => {});
      await AroundMoveHandlers.chooseCastling();
      expect(FallbackHandlers.fallback).toBeCalledTimes(1);
      expect(MoveHandlers.moveByAI).not.toBeCalled();
      mock.mockReset();
    });

    test('Can do castling, but need confirmation', async () => {
      const castl = CastlingType.KINGSIDE;
      const confirm = true;
      env.userStorage.options = { confirm };
      await AroundMoveHandlers.chooseCastling(castl);
      expect(env.output).toHaveLength(1);
      expect(env.contexts.is('confirm-move')).toBeTruthy();
      expect(MoveHandlers.moveByAI).not.toBeCalled();
      expect(env.suggestions).not.toHaveLength(0);
    });

    test('Do castling', async () => {
      const castlPiece = 'q';
      const confirm = false;
      env.userStorage.options = { confirm };
      await AroundMoveHandlers.chooseCastling(null, castlPiece);
      expect(env.output).toHaveLength(0);
      expect(MoveHandlers.moveByPlayer).toBeCalledTimes(1);
      expect(MoveHandlers.moveByAI).toBeCalledTimes(1);
    });
  });

  describe('Accepting an move advice', () => {

    const move = 'testMove';
    const fen = 'testFen';
    beforeEach(() => {
      env.contexts.set('advice-made', 1, { move });
      env.userStorage.fen = fen;
    });

    test('Confirmation needed for full acceptance', async () => {
      const confirm = true;
      env.userStorage.options = { confirm };
      MockBoard.pos = 'p';
      await AroundMoveHandlers.acceptAdvice();
      expect(env.output).toHaveLength(1);
      expect(env.contexts.get('confirm-move').parameters).toEqual({ move });
      expect(env.suggestions).not.toHaveLength(0);
    });

    test('Accept advice and make a move', async () => {
      const confirm = false;
      env.userStorage.options = { confirm };
      await AroundMoveHandlers.acceptAdvice();
      expect(env.output).toHaveLength(0);
      expect(MoveHandlers.prepareToMove).toBeCalledTimes(1);
    });
  });

  describe('Give to player an advice for move', () => {
  
    const fen = 'Fen';
    const difficulty = 5;
    const legalMoves = ['move1'];
    const bestMove = 'move2';
    beforeEach(() => {
      env.userStorage.fen = fen;
      env.userStorage.options = { difficulty };
      Mochess.moves = legalMoves;
      Mochess.bestMove = bestMove;
    });

    test('100% stupid advice', async () => {
      const expected = { move: legalMoves[0] };
      await AroundMoveHandlers.advice(1);
      expect(Mochess.instance.updateGameState).toBeCalledTimes(1);
      expect(env.output).toHaveLength(2);
      expect(env.contexts.get('advice-made').parameters).toEqual(expected);
      expect(env.suggestions).not.toHaveLength(0);
    });

    test('100% best move advice', async () => {
      const expected = { move: bestMove };
      await AroundMoveHandlers.advice(0);
      expect(Mochess.instance.bestMove).toBeCalledTimes(1);
      expect(env.output).toHaveLength(2);
      expect(env.contexts.get('advice-made').parameters).toEqual(expected);
      expect(env.suggestions).not.toHaveLength(0);
    });
  });
});
