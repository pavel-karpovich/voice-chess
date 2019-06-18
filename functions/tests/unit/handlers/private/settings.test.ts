import { SettingsHandlers } from '../../../../src/handlers/private/settings';
import { initLanguage } from '../../../../src/locales/initLang';
import { Env } from './env';

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

  describe('Direct to the next logical action', () => {

    test('With a running game', () => {
      env.contexts.set('game', 1);
      SettingsHandlers.directToNextLogicalAction();
      expect(env.contexts.is('turn-intent')).toBeTruthy();
      expect(env.output.length).toBe(1);
    });

    test('Without a running game', () => {
      SettingsHandlers.directToNextLogicalAction();
      expect(env.contexts.is('ask-to-new-game')).toBeTruthy();
      expect(env.output.length).toBe(1);
    });
  });

  describe('Difficulty settings', () => {

    beforeEach(() => {
      jest.spyOn(SettingsHandlers, 'safeGameContext').mockImplementationOnce(() => {});
      jest.spyOn(SettingsHandlers, 'directToNextLogicalAction').mockImplementationOnce(() => {});
    });
    
    test('Basic difficulty handler', () => {
      const difficulty = 2;
      env.userStorage.options = { difficulty };
      SettingsHandlers.difficulty();
      expect(env.output.length).toBe(2);
    });

    describe('Change difficulty level', () => {

      test('Set new value to difficulty level', () => {
        const initDifficulty = 8;
        env.userStorage.options = { difficulty: initDifficulty };
        const newValue = 12;
        SettingsHandlers.modifyDifficulty(newValue);
        expect(env.output.length).toBe(1);
        expect(env.userStorage.options.difficulty).toBe(newValue);
      });

      test('Trying to set the same value', () => {
        const initDifficulty = 8;
        env.userStorage.options = { difficulty: initDifficulty };
        const newValue = 8;
        SettingsHandlers.modifyDifficulty(newValue);
        expect(env.userStorage.options.difficulty).toBe(newValue);
      });
    });
  });

  describe('Move confirmation settings', () => {

    beforeEach(() => {
      jest.spyOn(SettingsHandlers, 'directToNextLogicalAction').mockImplementationOnce(() => {});
    });

    test('Enable confirmation', () => {
      env.userStorage.options = {};
      SettingsHandlers.enableConfirm();
      expect(env.userStorage.options.confirm).toBeTruthy();
      expect(env.output.length).toBe(1);
    });

    test('Disable confirmation', () => {
      env.userStorage.options = {};
      SettingsHandlers.disableConfirm();
      expect(env.userStorage.options.confirm).toBeFalsy();
      expect(env.output.length).toBe(1);
    });
  });
  
});