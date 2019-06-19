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
import { InfoHandlers } from '../../../../src/handlers/private/info';
import { Env } from './_env';
import { initLanguage } from '../../../../src/locales/initLang';
import * as board from '../../../../src/support/board';
import { chessBoardSize } from '../../../../src/chess/chess';
import * as moves from '../../../../src/support/moves';
import { ChessSide, WhoseSide } from '../../../../src/chess/chessUtils';
import * as history from '../../../../src/support/history';
import { FallbackHandlers } from '../../../../src/handlers/private/fallback';

describe('Tests for info handlers', () => {

  const locale = 'ru';
  beforeAll(() => {
    initLanguage(locale);
  });

  let env: Env;
  beforeEach(() => {
    env = new Env();
    InfoHandlers.load(
      env.toOutput.bind(env),
      env.contexts,
      env.convData,
      env.userStorage,
      env.endConversation.bind(env)
    );
  });

  describe('Getting the info about board ranks', () => {

    test('First part of the board ranks', () => {
      const mock = jest.spyOn(board, 'manyRanks').mockImplementation(() => '');
      const fen = 'fen string';
      const fromRank = 1;
      const toRank = chessBoardSize / 2;
      env.userStorage.fen = fen;
      InfoHandlers.firstPartOfBoard();
      expect(env.output).toHaveLength(2);
      expect(env.contexts.is('board-next')).toBeTruthy();
      expect(env.contexts.is('rank-info')).toBeTruthy();
      expect(board.manyRanks).toBeCalledWith(fen, fromRank, toRank);
      mock.mockReset();
    });

    test('Second part of the board ranks', () => {
      const mock = jest.spyOn(board, 'manyRanks').mockImplementation(() => '');
      const fen = 'fen string';
      const fromRank = chessBoardSize / 2 + 1;
      const toRank = chessBoardSize;
      env.userStorage.fen = fen;
      InfoHandlers.secondPartOfBoard();
      expect(env.output).toHaveLength(2);
      expect(env.contexts.is('turn-intent')).toBeTruthy();
      expect(board.manyRanks).toBeCalledWith(fen, fromRank, toRank);
      mock.mockReset();
    });

    describe('Info about one rank', () => {

      let mock: jest.SpyInstance;
      beforeEach(() => {
        mock = jest.spyOn(board, 'oneRank').mockImplementation(() => '');
      });
      afterEach(() => {
        mock.mockClear();
      });
      
      describe('Getting the info about a specific rank', () => {

        test('With valid rank number', () => {
          const fen = 'fen string';
          const rankNum = '3';
          env.userStorage.fen = fen;
          const expParams = { rank: Number(rankNum), dir: 'u' };
          InfoHandlers.rank(rankNum);
          expect(env.contexts.is('rank-info')).toBeTruthy();
          expect(env.output).toHaveLength(2);
          expect(env.contexts.get('rank-next').parameters).toEqual(expParams);
          expect(board.oneRank).toBeCalledWith(fen, Number(rankNum));
        });

        test('With invalid rank number', () => {
          const rankNum = '12';
          InfoHandlers.rank(undefined, rankNum);
          expect(env.output).toHaveLength(2);
          expect(board.oneRank).not.toBeCalled();
        });

        test('Even without specifying the rank number', () => {
          InfoHandlers.rank();
          expect(env.output).toHaveLength(1);
          expect(board.oneRank).not.toBeCalled();
        });
      });

      describe('Getting the info about the next rank', () => {

        test('Not the last rank', () => {
          const afterRank = '2';
          const fen = 'This is the test fen string';
          env.contexts.set('rank-next', 1, { rank: afterRank, dir: 'u' });
          env.userStorage.fen = fen;
          const expectedParams = { rank: Number(afterRank) + 1, dir: 'u' };
          InfoHandlers.nextRank();
          expect(env.output).toHaveLength(2);
          expect(env.contexts.is('rank-info')).toBeTruthy();
          expect(board.oneRank).toBeCalledWith(fen, Number(afterRank) + 1); 
          expect(env.contexts.get('rank-next').parameters).toEqual(expectedParams);
        });

        test('The last rank', () => {
          const afterRank = '7';
          const fen = 'This is the test fen string';
          env.contexts.set('rank-next', 1, { rank: afterRank, dir: 'u' });
          env.userStorage.fen = fen;
          InfoHandlers.nextRank();
          expect(env.output).toHaveLength(2);
          expect(env.contexts.is('rank-info')).toBeTruthy();
          expect(board.oneRank).toBeCalledWith(fen, Number(afterRank) + 1); 
        });

        test('Next after last rank', () => {
          const afterRank = '8';
          env.contexts.set('rank-next', 1, { rank: afterRank, dir: 'u' });
          InfoHandlers.nextRank();
          expect(env.output).toHaveLength(2);
          expect(env.contexts.is('rank-info')).toBeTruthy();
          expect(board.oneRank).not.toBeCalled();
          expect(env.contexts.is('turn-intent')).toBeTruthy();
        });
      });

      describe('Getting the info about the previous rank', () => {

        test('Not the first rank', () => {
          const beforeRank = '6';
          const fen = 'This is the test fen string';
          env.contexts.set('rank-next', 1, { rank: beforeRank, dir: 'd' });
          env.userStorage.fen = fen;
          const expectedParams = { rank: Number(beforeRank) - 1, dir: 'd' };
          InfoHandlers.prevRank();
          expect(env.output).toHaveLength(2);
          expect(env.contexts.is('rank-info')).toBeTruthy();
          expect(board.oneRank).toBeCalledWith(fen, Number(beforeRank) - 1); 
          expect(env.contexts.get('rank-next').parameters).toEqual(expectedParams);
        });

        test('The first rank', () => {
          const beforeRank = '2';
          const fen = 'This is the test fen string';
          env.contexts.set('rank-next', 1, { rank: beforeRank, dir: 'd' });
          env.userStorage.fen = fen;
          InfoHandlers.prevRank();
          expect(env.output).toHaveLength(2);
          expect(env.contexts.is('rank-info')).toBeTruthy();
          expect(board.oneRank).toBeCalledWith(fen, Number(beforeRank) - 1);
        });

        test('Previous to the first rank', () => {
          const beforeRank = '1';
          env.contexts.set('rank-next', 1, { rank: beforeRank, dir: 'd' });
          InfoHandlers.prevRank();
          expect(env.output).toHaveLength(2);
          expect(env.contexts.is('rank-info')).toBeTruthy();
          expect(board.oneRank).not.toBeCalled();
          expect(env.contexts.is('turn-intent')).toBeTruthy();
        });
      });
    });
  });

  describe('Getting the info about the list of available moves', () => {

    let getBulkMock: jest.SpyInstance;
    let listMovesMock: jest.SpyInstance;
    beforeEach(() => {
      getBulkMock = jest.spyOn(moves, 'getBulkOfMoves');
      listMovesMock = jest.spyOn(moves, 'listMoves').mockImplementationOnce(() => '');
    });
    afterEach(() => {
      Mochess.resetMockedData();
      getBulkMock.mockReset();
      listMovesMock.mockReset();
    });

    test('Not last bulk of available moves', async () => {
      const fen = 'Test fen string';
      const difficulty = 6;
      const startNum = 2;
      const mvs = ['m1', 'm2', 'm3', 'm4'];
      env.userStorage.fen = fen;
      env.userStorage.options = { difficulty };
      Mochess.moves = mvs;
      const testBulk = {
        end: false,
        pieces: [] as any[],
        next: 3,
      };
      getBulkMock.mockImplementationOnce(() => testBulk);
      await InfoHandlers.listOfMoves(startNum);
      expect(moves.getBulkOfMoves).toBeCalledWith(fen, mvs, startNum);
      expect(moves.listMoves).toBeCalledWith(testBulk.pieces);
      expect(env.output).toHaveLength(2);
      expect(env.contexts.get('moves-next').parameters).toEqual({ start: testBulk.next });
    });

    test('The last bulk of available moves', async () => {
      const fen = 'Test fen string';
      const difficulty = 6;
      const startNum = 2;
      const mvs = ['m1', 'm2', 'm3', 'm4'];
      env.userStorage.fen = fen;
      env.userStorage.options = { difficulty };
      Mochess.moves = mvs;
      const testBulk = {
        end: true,
        pieces: [] as any[],
        next: 4,
      };
      getBulkMock.mockImplementationOnce(() => testBulk);
      await InfoHandlers.listOfMoves(startNum);
      expect(moves.getBulkOfMoves).toBeCalledWith(fen, mvs, startNum);
      expect(moves.listMoves).toBeCalledWith(testBulk.pieces);
      expect(env.output).toHaveLength(2);
      expect(env.contexts.is('moves-next')).toBeFalsy();
    });

    test('No available moves', async () => {
      const fen = 'Test fen string';
      const difficulty = 6;
      const startNum = 0;
      env.userStorage.fen = fen;
      env.userStorage.options = { difficulty };
      const mvs = [] as string[];
      Mochess.moves = mvs;
      await InfoHandlers.listOfMoves(startNum);
      expect(moves.getBulkOfMoves).not.toBeCalled();
      expect(env.output).toHaveLength(2);
      expect(env.contexts.is('moves-next')).toBeFalsy();
    });
  });

  describe('Getting history of moves', () => {

    let historyMock: jest.SpyInstance;
    beforeEach(() => {
      historyMock = jest.spyOn(history, 'historyOfMoves').mockImplementationOnce(() => '');
    });
    afterEach(() => {
      historyMock.mockReset();
    });

    test('Show full history', () => {
      const movesNum = 10;
      const playerSide = ChessSide.WHITE;
      const histMoves = [
        { m: 'mv1' }, { m: 'mv2' },
        { m: 'mv3' }, { m: 'mv4' },
      ];
      env.userStorage.history = histMoves;
      env.userStorage.side = playerSide;
      InfoHandlers.history(movesNum);
      expect(history.historyOfMoves).toBeCalledWith(histMoves, playerSide);
      expect(env.output).toHaveLength(2);
    });

    test('When the history is actually empty', () => {
      const movesNum = 10;
      const histMoves = [] as any[];
      env.userStorage.history = histMoves;
      InfoHandlers.history(movesNum);
      expect(history.historyOfMoves).not.toBeCalled();
      expect(env.output).toHaveLength(2);
    });

    test('With an invalid number of moves', () => {
      const movesNum = -10;
      const histMoves = [{ m: 'mv1' }, { m: 'mv2' }];
      env.userStorage.history = histMoves;
      InfoHandlers.history(movesNum);
      expect(history.historyOfMoves).not.toBeCalled();
      expect(env.output).toHaveLength(2);
    });
  });

  test('Getting the info about a specific board square', () => {
    const square = 'g5';
    const fen = 'Test fen';
    const playerSide = ChessSide.BLACK;
    env.userStorage.fen = fen;
    env.userStorage.side = playerSide;
    MockBoard.pos = 'p';
    InfoHandlers.square(square);
    expect(env.output).toHaveLength(2);
    expect((MockBoard.instance as MockBoard).pos).toBeCalledWith(square);
    MockBoard.resetMockedData();
  });

  describe('Getting the info about all pieces by specific type', () => {

    let piecesMock: jest.SpyInstance;
    beforeEach(() => {
      MockBoard.piecesByType = ['a1', 'a2', 'a3'];
      piecesMock = jest.spyOn(board, 'allPiecesForType').mockImplementation(() => '');
    });
    afterEach(() => {
      MockBoard.resetMockedData();
      piecesMock.mockReset();
    });

    test.each([
      [ChessSide.WHITE, WhoseSide.ENEMY],
      [undefined, WhoseSide.PLAYER],
      [ChessSide.BLACK, undefined],
      [undefined, undefined],
    ])('When such pieces remained on the board', (side, whose) => {
      const piece = 'p';
      const fen = 'Test fen';
      const playerSide = ChessSide.WHITE;
      env.userStorage.fen = fen;
      env.userStorage.side = playerSide;
      InfoHandlers.piece(piece, side as ChessSide, whose as WhoseSide);
      expect(env.output).toHaveLength(2);
      expect(board.allPiecesForType).toBeCalled();
    });

    test('When no such pieces left on the board', () => {
      const piece = 'p';
      const fen = 'Test fen';
      const playerSide = ChessSide.BLACK;
      env.userStorage.fen = fen;
      env.userStorage.side = playerSide;
      MockBoard.piecesByType = [] as any[];
      InfoHandlers.piece(piece);
      expect(env.output).toHaveLength(2);
      expect(board.allPiecesForType).not.toBeCalled();
    });
  });

  describe('Getting all pieces of specific side', () => {

    
    test.each([
      [undefined, WhoseSide.PLAYER],
      [undefined, WhoseSide.ENEMY],
      [ChessSide.BLACK, WhoseSide.PLAYER],
    ])('With a different ways of specifying side', (side, whose) => {
      const mock = jest.spyOn(board, 'allPiecesForSide').mockImplementationOnce(() => '');
      const pieces = [
        { pos: 'pos1', val: 'val1' },
        { pos: 'pos2', val: 'val2' },
        { pos: 'pos3', val: 'val3' },
      ];
      MockBoard.piecesBySide = pieces;
      const playerSide = ChessSide.WHITE;
      const fen = 'Fen for test';
      env.userStorage.side = playerSide;
      env.userStorage.fen = fen;
      InfoHandlers.all(side as ChessSide, whose as WhoseSide);
      expect(env.output).toHaveLength(2);
      expect((MockBoard.instance as MockBoard).allPiecesBySide).toBeCalledTimes(1);
      expect(board.allPiecesForSide).toBeCalledTimes(1);
      MockBoard.resetMockedData();
      mock.mockReset();
    });

    test('Without specifying the side', () => {
      const mock = jest.spyOn(FallbackHandlers, 'fallback').mockImplementationOnce(() => void 0);
      InfoHandlers.all();
      expect(env.output).toHaveLength(0);
      expect(FallbackHandlers.fallback).toBeCalledTimes(1);
      mock.mockReset();
    });
  });

  test('Getting the info about capturing pieces', () => {
    const mock = jest.spyOn(board, 'listCapturedPieces').mockImplementationOnce(() => '');
    const capt = {
      white: [ { piece: 'p1', count: 1 }],
      black: [ { piece: 'P2', count: 2 }],
    };
    MockBoard.captured = capt;
    const fen = 'Test fen string';
    const playerSide = ChessSide.BLACK;
    env.userStorage.fen = fen;
    env.userStorage.side = playerSide;
    InfoHandlers.captured();
    expect(env.output).toHaveLength(2);
    expect((MockBoard.instance as MockBoard).capturedPieces).toBeCalledTimes(1);
    expect(board.listCapturedPieces).toBeCalledWith(capt, playerSide);
    MockBoard.resetMockedData();
    mock.mockReset();
  });

  test('Getting someones side', () => {
    const mock = jest.spyOn(board, 'someonePlayForColor').mockImplementationOnce(() => '');
    const playerSide = ChessSide.WHITE;
    const side = ChessSide.BLACK;
    const who = WhoseSide.ENEMY;
    env.userStorage.side = playerSide;
    InfoHandlers.side(side, who);
    expect(board.someonePlayForColor).toBeCalledWith(who, side, playerSide);
    expect(env.output).toHaveLength(2);
    mock.mockReset();
  });

  test('Getting the number of full moves throughout the game', () => {
    MockBoard.movesNumber = 10;
    const fen = 'Just fen';
    env.userStorage.fen = fen;
    InfoHandlers.fullmove();
    expect(env.output).toHaveLength(2);
  });

});
