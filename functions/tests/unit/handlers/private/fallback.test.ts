import { FallbackHandlers } from '../../../../src/handlers/private/fallback';
import { initLanguage } from "../../../../src/locales/initLang";
import { Env } from "./_env";
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
      env.endConversation.bind(env)
    );
  });

  describe('Main fallback handler', () => {

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
      });

      test('Exactly 3 fallbacks count', () => {
        const mock = jest.spyOn(OtherHandlers, 'help').mockImplementation(() => {});
        const fallbackCount = 3;
        env.convData.fallbackCount = fallbackCount;
        FallbackHandlers.fallback();
        expect(env.output.length).toBe(1);
        expect(env.isEnd).toBeFalsy();
        expect(OtherHandlers.help).toBeCalledTimes(1);
        mock.mockReset();
      });
      
      test('More than 3 fallbacks count', () => {
        const fallbackCount = 4;
        env.convData.fallbackCount = fallbackCount;
        FallbackHandlers.fallback();
        expect(env.output.length).toBe(1);
        expect(env.isEnd).toBeTruthy();
      });
    });
  });
});
