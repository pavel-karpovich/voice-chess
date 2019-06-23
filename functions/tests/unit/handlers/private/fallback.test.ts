import { FallbackHandlers } from '../../../../src/handlers/private/fallback';
import { initLanguage } from "../../../../src/locales/initLang";
import { Env } from "../../../mocks/env";
import { OtherHandlers } from '../../../../src/handlers/private/other';

describe('Tests for Fallback handlers', () => {

  const locale = 'ru';
  beforeAll(() => {
    initLanguage(locale);
  });

  let env: Env;
  beforeEach(() => {
    env = new Env();
    FallbackHandlers.load(
      env.toOutput.bind(env),
      env.contexts,
      env.convData,
      env.userStorage,
      env.addSuggestions.bind(env),
      env.endConversation.bind(env)
    );
  });

  describe('Main fallback handler', () => {
      
    let suggestMock: jest.SpyInstance;
    beforeEach(() => {
      suggestMock = jest.spyOn(OtherHandlers, 'helpSuggestions');
      suggestMock.mockImplementationOnce(() => {});
    });
    afterEach(() => {
      suggestMock.mockReset();
    });
    
    test('Preserve context', () => {
      const ctx = 'confirm-move';
      const fallbackCount = 0;
      env.contexts.set(ctx, 0);
      env.convData.fallbackCount = fallbackCount;
      FallbackHandlers.fallback();
      expect(env.contexts.get(ctx).lifespan).toBe(1);
    });

    describe('Fallback actions', () => {

      test('Less than 3 fallbacks count', () => {
        const fallbackCount = 1;
        env.convData.fallbackCount = fallbackCount;
        FallbackHandlers.fallback();
        expect(env.output.length).toBe(1);
        expect(env.isEnd).toBeFalsy();
        expect(OtherHandlers.helpSuggestions).toBeCalledTimes(1);
      });

      test('3 fallbacks count within a game', () => {
        const mock = jest.spyOn(OtherHandlers, 'help').mockImplementation(() => {});
        env.contexts.set('game', 4);
        const fallbackCount = 3;
        env.convData.fallbackCount = fallbackCount;
        FallbackHandlers.fallback();
        expect(env.output.length).toBe(1);
        expect(env.isEnd).toBeFalsy();
        expect(OtherHandlers.helpSuggestions).toBeCalledWith();
        mock.mockReset();
      });
      
      test('3 fallbacks count out of game', () => {
        const mock = jest.spyOn(OtherHandlers, 'help').mockImplementation(() => {});
        const fallbackCount = 3;
        env.convData.fallbackCount = fallbackCount;
        FallbackHandlers.fallback();
        expect(env.output.length).toBe(1);
        expect(env.isEnd).toBeFalsy();
        expect(OtherHandlers.helpSuggestions).toBeCalledWith();
        mock.mockReset();
      });
      
      test('4 fallbacks count', () => {
        const mock = jest.spyOn(OtherHandlers, 'help').mockImplementation(() => {});
        const fallbackCount = 4;
        env.convData.fallbackCount = fallbackCount;
        FallbackHandlers.fallback();
        expect(env.output.length).toBe(1);
        expect(env.isEnd).toBeFalsy();
        expect(OtherHandlers.help).toBeCalledTimes(1);
        expect(OtherHandlers.helpSuggestions).toBeCalledWith(false);
        mock.mockReset();
      });
      
      test('More than 4 fallbacks count', () => {
        const fallbackCount = 5;
        env.convData.fallbackCount = fallbackCount;
        FallbackHandlers.fallback();
        expect(env.output.length).toBe(1);
        expect(env.isEnd).toBeTruthy();
        expect(OtherHandlers.helpSuggestions).not.toBeCalled();
      });
    });
  });
});
