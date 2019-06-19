import { NavigationHandlers } from '../../../../src/handlers/private/naviagation';
import { InfoHandlers } from '../../../../src/handlers/private/info';
import { initLanguage } from "../../../../src/locales/initLang";
import { Env } from "./_env";
import { FallbackHandlers } from '../../../../src/handlers/private/fallback';
import { SettingsHandlers } from '../../../../src/handlers/private/settings';
import { GameHandlers } from '../../../../src/handlers/private/game';
import { AroundMoveHandlers } from '../../../../src/handlers/private/aroundMove';

describe('Tests for navigation handlers', () => {

  const locale = 'ru';
  beforeAll(() => {
    initLanguage(locale);
  });

  let env: Env;
  beforeEach(() => {
    env = new Env();
    NavigationHandlers.load(
      env.toOutput.bind(env),
      env.contexts,
      env.convData,
      env.userStorage,
      env.endConversation.bind(env)
    );
  });

  describe('Next action handler', () => {

    test('In the context of listing legal moves', async () => {
      const mock = jest.spyOn(InfoHandlers, 'listOfMoves').mockImplementationOnce(async() => {});
      const startNum = 24;
      env.contexts.set('moves-next', 1, { start: startNum });
      await NavigationHandlers.next();
      expect(InfoHandlers.listOfMoves).toBeCalledWith(startNum);
      expect(env.convData.fallbackCount).toBe(0);
      mock.mockReset();
    });

    test('In the context of the showing the board', async () => {
      const mock = jest.spyOn(InfoHandlers, 'secondPartOfBoard').mockImplementationOnce(() => {});
      env.contexts.set('board-next', 1);
      await NavigationHandlers.next();
      expect(InfoHandlers.secondPartOfBoard).toBeCalledTimes(1);
      expect(env.convData.fallbackCount).toBe(0);
      mock.mockReset();
    });

    describe('In the context of getting the next rank info', () => {

      test('To get next rank', async () => {
        const mock = jest.spyOn(InfoHandlers, 'nextRank').mockImplementationOnce(() => {});
        const direction = 'u';
        env.contexts.set('rank-next', 1, { dir: direction });
        await NavigationHandlers.next();
        expect(InfoHandlers.nextRank).toBeCalledTimes(1);
        expect(env.convData.fallbackCount).toBe(0);
        mock.mockReset();
      });

      test('To get previous rank', async () => {
        const mock = jest.spyOn(InfoHandlers, 'prevRank').mockImplementationOnce(() => {});
        const direction = 'd';
        env.contexts.set('rank-next', 1, { dir: direction });
        await NavigationHandlers.next();
        expect(InfoHandlers.prevRank).toBeCalledTimes(1);
        expect(env.convData.fallbackCount).toBe(0);
        mock.mockReset();
      });
    });

    test('Without any suitable context', async () => {
      const mock = jest.spyOn(FallbackHandlers, 'fallback').mockImplementationOnce(() => {});
      await NavigationHandlers.next();
      expect(FallbackHandlers.fallback).toBeCalledTimes(1);
      expect(env.convData.fallbackCount).not.toBe(0);
      mock.mockReset();
    });
  });

  describe('Refuse handler', () => {

    let mock: jest.SpyInstance;
    beforeEach(() => {
      mock = jest.spyOn(SettingsHandlers, 'safeGameContext').mockImplementationOnce(() => {});
    });
    afterEach(() => {
      mock.mockClear();
    });

    test.each([
      ['turn-intent'],
      ['moves-next'],
      ['board-next'],
      ['rank-next'],
      ['ask-to-resign'],
      ['ask-to-new-game'],
      ['turn-showboard'],
      ['confirm-move'],
      ['advice-made'],
      ['correct-last-move'],
    ])('With "%s" context', (context) => {
      env.contexts.set(context, 1);
      NavigationHandlers.no();
      expect(SettingsHandlers.safeGameContext).toBeCalledTimes(1);
      expect(env.output.length).toBe(1);
      expect(env.convData.fallbackCount).toBe(0);
    });

    test.each([
      ['reduce-difficulty-instead-of-resign', 'ask-to-resign'],
      ['ask-to-continue', 'ask-to-new-game'],
    ])('With "%s" context and output context "%s', (inputCtx, outputCtx) => {
      env.contexts.set(inputCtx, 1);
      NavigationHandlers.no();
      expect(SettingsHandlers.safeGameContext).toBeCalledTimes(1);
      expect(env.output.length).toBe(1);
      expect(env.contexts.is(outputCtx)).toBeTruthy();
      expect(env.convData.fallbackCount).toBe(0);
    });

    test('Without any suitable context', () => {
      const mock = jest.spyOn(FallbackHandlers, 'fallback').mockImplementationOnce(() => {});
      NavigationHandlers.no();
      expect(SettingsHandlers.safeGameContext).toBeCalledTimes(1);
      expect(FallbackHandlers.fallback).toBeCalledTimes(1);
      expect(env.convData.fallbackCount).not.toBe(0);
      mock.mockReset();
    });
  });

  describe('Consent handler', () => {

    let mock: jest.SpyInstance;
    beforeEach(() => {
      mock = jest.spyOn(SettingsHandlers, 'safeGameContext').mockImplementationOnce(() => {});
    });
    afterEach(() => {
      mock.mockClear();
    });

    test('With "turn-intent" context', async () => {
      env.contexts.set('turn-intent', 1);
      await NavigationHandlers.yes();
      expect(env.output.length).toBe(1);
      expect(SettingsHandlers.safeGameContext).toBeCalledTimes(1);
      expect(env.convData.fallbackCount).toBe(0);
    });
    
    test('With "moves-next" context', async () => {
      const mock = jest.spyOn(InfoHandlers, 'listOfMoves').mockImplementationOnce(async() => {});
      const startNum = 8;
      env.contexts.set('moves-next', 1, { start: startNum });
      await NavigationHandlers.yes();
      expect(SettingsHandlers.safeGameContext).toBeCalledTimes(1);
      expect(env.convData.fallbackCount).toBe(0);
      expect(InfoHandlers.listOfMoves).toBeCalledWith(startNum);
      mock.mockReset();
    });

    test('With "board-next" context', async () => {
      const mock = jest.spyOn(InfoHandlers, 'secondPartOfBoard').mockImplementationOnce(() => {});
      env.contexts.set('board-next', 1);
      await NavigationHandlers.yes();
      expect(SettingsHandlers.safeGameContext).toBeCalledTimes(1);
      expect(env.convData.fallbackCount).toBe(0);
      expect(InfoHandlers.secondPartOfBoard).toBeCalledTimes(1);
      mock.mockReset();
    });

    describe('With "rank-next" context', () => {

      test('To get next rank', async () => {
        const mock = jest.spyOn(InfoHandlers, 'nextRank').mockImplementationOnce(() => {});
        const direction = 'u';
        env.contexts.set('rank-next', 1, { dir: direction });
        await NavigationHandlers.yes();
        expect(SettingsHandlers.safeGameContext).toBeCalledTimes(1);
        expect(env.convData.fallbackCount).toBe(0);
        expect(InfoHandlers.nextRank).toBeCalledTimes(1);
        mock.mockReset();
      });

      test('To get previous rank', async () => {
        const mock = jest.spyOn(InfoHandlers, 'prevRank').mockImplementationOnce(() => {});
        const direction = 'd';
        env.contexts.set('rank-next', 1, { dir: direction });
        await NavigationHandlers.yes();
        expect(SettingsHandlers.safeGameContext).toBeCalledTimes(1);
        expect(env.convData.fallbackCount).toBe(0);
        expect(InfoHandlers.prevRank).toBeCalledTimes(1);
        mock.mockReset();
      });
    });

    test('With "reduce-difficulty-instead-of-resign" context', async () => {
      const mock = jest.spyOn(SettingsHandlers, 'modifyDifficulty').mockImplementationOnce(() => {});
      const difficulty = 8;
      env.contexts.set('reduce-difficulty-instead-of-resign', 1);
      env.userStorage.options = { difficulty };
      const expectedParam = Math.floor(difficulty / 2);
      await NavigationHandlers.yes();
      expect(SettingsHandlers.safeGameContext).toBeCalledTimes(1);
      expect(env.convData.fallbackCount).toBe(0);
      expect(SettingsHandlers.modifyDifficulty).toBeCalledWith(expectedParam);
      mock.mockReset();
    });

    test('With "ask-to-resign" context', async () => {
      const fen = 'rnbqk1nr/p3pp1p/1p4p1/3P4/P7/1Q3NP1/1P1K1P1P/RNB2B1R w KQkq - 10 20';
      env.contexts.set('game', 5);
      env.userStorage.fen = fen;
      env.contexts.set('ask-to-resign', 1);
      await NavigationHandlers.yes();
      expect(SettingsHandlers.safeGameContext).toBeCalledTimes(1);
      expect(env.convData.fallbackCount).toBe(0);
      expect(env.output.length).toBe(2);
      expect(env.contexts.is('ask-to-new-game')).toBeTruthy();
      expect(env.contexts.is('game')).toBeFalsy();
      expect(env.userStorage.fen).toBeNull();
    });

    test('With "ask-to-new-game" context', async () => {
      const mock = jest.spyOn(GameHandlers, 'newGame').mockImplementationOnce(() => {});
      env.contexts.set('ask-to-new-game', 1);
      await NavigationHandlers.yes();
      expect(SettingsHandlers.safeGameContext).toBeCalledTimes(1);
      expect(env.convData.fallbackCount).toBe(0);
      expect(GameHandlers.newGame).toBeCalledTimes(1);
      mock.mockReset();
    });

    test('With "ask-to-continue" context', async () => {
      const mock = jest.spyOn(GameHandlers, 'continueGame').mockImplementationOnce(() => {});
      env.contexts.set('ask-to-continue', 1);
      await NavigationHandlers.yes();
      expect(SettingsHandlers.safeGameContext).toBeCalledTimes(1);
      expect(env.convData.fallbackCount).toBe(0);
      expect(GameHandlers.continueGame).toBeCalledTimes(1);
      mock.mockReset();
    });
    
    test('With "turn-showboard" context', async () => {
      const mock = jest.spyOn(InfoHandlers, 'firstPartOfBoard').mockImplementationOnce(() => {});
      env.contexts.set('turn-showboard', 1);
      await NavigationHandlers.yes();
      expect(SettingsHandlers.safeGameContext).toBeCalledTimes(1);
      expect(env.convData.fallbackCount).toBe(0);
      expect(InfoHandlers.firstPartOfBoard).toBeCalledTimes(1);
      mock.mockReset();
    });
    
    test('With "confirm-move" context', async () => {
      const mock = jest.spyOn(AroundMoveHandlers, 'acceptMove').mockImplementationOnce(async() => {});
      env.contexts.set('confirm-move', 1);
      await NavigationHandlers.yes();
      expect(SettingsHandlers.safeGameContext).toBeCalledTimes(1);
      expect(env.convData.fallbackCount).toBe(0);
      expect(AroundMoveHandlers.acceptMove).toBeCalledTimes(1);
      mock.mockReset();
    });
    
    test('With "advice-made" context', async () => {
      const mock = jest.spyOn(AroundMoveHandlers, 'acceptAdvice').mockImplementationOnce(async() => {});
      env.contexts.set('advice-made', 1);
      await NavigationHandlers.yes();
      expect(SettingsHandlers.safeGameContext).toBeCalledTimes(1);
      expect(env.convData.fallbackCount).toBe(0);
      expect(AroundMoveHandlers.acceptAdvice).toBeCalledTimes(1);
      mock.mockReset();
    });

    test('Without any suitable context', async () => {
      const mock = jest.spyOn(FallbackHandlers, 'fallback').mockImplementationOnce(async() => {});
      await NavigationHandlers.yes();
      expect(SettingsHandlers.safeGameContext).toBeCalledTimes(1);
      expect(env.convData.fallbackCount).not.toBe(0);
      expect(FallbackHandlers.fallback).toBeCalledTimes(1);
      mock.mockReset();
    });
  });
});
