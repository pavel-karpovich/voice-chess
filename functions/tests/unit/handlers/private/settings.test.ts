import { SettingsHandlers } from '../../../../src/handlers/private/settings';
import { initLanguage } from '../../../../src/locales/initLang';
import { Env } from '../../../mocks/env';
import { OtherHandlers } from '../../../../src/handlers/private/other';

describe('Tests for Settings Handlers', () => {
  
  const locale = 'ru';
  beforeAll(() => {
    initLanguage(locale);
  });

  let env: Env;
  beforeEach(() => {
    env = new Env();
    SettingsHandlers.load(
      env.toOutput.bind(env),
      env.contexts,
      env.convData,
      env.userStorage,
      env.addSuggestions.bind(env),
      env.sendImage.bind(env),
      env.endConversation.bind(env)
    );
  });

  describe('Saving game context', () => {

    test('When there is a running game', () => {
      const lifespan = 2;
      env.contexts.set('game', lifespan);
      SettingsHandlers.safeGameContext();
      expect(env.contexts.get('game').lifespan).toBe(lifespan + 1);
    });

    test("When a running game doesn't actually exist", () => {
      SettingsHandlers.safeGameContext();
      expect(env.contexts.is('game')).toBeFalsy();
    });
  });

  describe('Difficulty settings', () => {

    let safeGameMock: jest.SpyInstance;
    let directMock: jest.SpyInstance;
    const initDifficulty = 9;
    beforeEach(() => {
      safeGameMock = jest.spyOn(SettingsHandlers, 'safeGameContext');
      safeGameMock.mockImplementationOnce(() => {});
      directMock = jest.spyOn(OtherHandlers, 'directToNextLogicalAction');
      directMock.mockImplementationOnce(() => {});
      env.userStorage.options = { difficulty: initDifficulty };
    });
    afterEach(() => {
      safeGameMock.mockReset();
      directMock.mockReset();
    });
    
    test('Basic difficulty handler', () => {
      SettingsHandlers.difficulty();
      expect(env.output.length).toBe(2);
      expect(env.suggestions).not.toHaveLength(0);
    });

    test.each([
      12, initDifficulty,
    ])('Set value to difficulty level', (newVal) => {
      SettingsHandlers.modifyDifficulty(newVal);
      expect(env.output.length).toBe(1);
      expect(env.userStorage.options.difficulty).toBe(newVal);
      expect(OtherHandlers.directToNextLogicalAction).toBeCalledTimes(1);
    });
  });

  describe('Move confirmation settings', () => {

    let directMock: jest.SpyInstance;
    beforeEach(() => {
      directMock = jest.spyOn(OtherHandlers, 'directToNextLogicalAction');
      directMock.mockImplementationOnce(() => {});
    });
    afterEach(() => {
      directMock.mockReset();
    });

    test('Enable confirmation', () => {
      env.userStorage.options = {};
      SettingsHandlers.enableConfirm();
      expect(env.userStorage.options.confirm).toBeTruthy();
      expect(env.output.length).toBe(1);
      expect(OtherHandlers.directToNextLogicalAction).toBeCalledTimes(1);
    });

    test('Disable confirmation', () => {
      env.userStorage.options = {};
      SettingsHandlers.disableConfirm();
      expect(env.userStorage.options.confirm).toBeFalsy();
      expect(env.output.length).toBe(1);
      expect(OtherHandlers.directToNextLogicalAction).toBeCalledTimes(1);
    });
  });
});
