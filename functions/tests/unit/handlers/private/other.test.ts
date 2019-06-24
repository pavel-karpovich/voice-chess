import { OtherHandlers } from '../../../../src/handlers/private/other';
import { Env } from '../../../mocks/env';
import { initLanguage } from '../../../../src/locales/initLang';

describe('Tests for the others handlers', () => {

  const locale = 'ru';
  beforeAll(() => {
    initLanguage(locale);
  });

  let env: Env;
  beforeEach(() => {
    env = new Env();
    OtherHandlers.load(
      env.toOutput.bind(env),
      env.contexts,
      env.convData,
      env.userStorage,
      env.addSuggestions.bind(env),
      env.sendImage.bind(env),
      env.endConversation.bind(env)
    );
  });

  describe('Help suggestions', () => {

    test('Within the game', () => {
      env.contexts.set('game', 5);
      OtherHandlers.helpSuggestions();
      expect(env.suggestions).toHaveLength(8);
    });

    test('Out of the game', () => {
      env.userStorage.fen = 'Fen';
      OtherHandlers.helpSuggestions(false);
      expect(env.suggestions).toHaveLength(4);
    });
  });

  test('Help command', () => {
    const helpSugMock = jest.spyOn(OtherHandlers, 'helpSuggestions');
    helpSugMock.mockImplementationOnce(() => {});
    OtherHandlers.help();
    expect(env.output.length).toBe(1);
    expect(OtherHandlers.helpSuggestions).lastCalledWith(false);
    helpSugMock.mockRestore();
  });

  describe('Silence command', () => {

    test('Within a game', () => {
      env.contexts.set('game', 5);
      OtherHandlers.silence();
      expect(env.output.length).toBe(1);
      expect(env.suggestions).not.toHaveLength(0);
    });

    test('Out of the game with a running one', () => {
      env.userStorage.fen = 'Test fen';
      OtherHandlers.silence();
      expect(env.output.length).toBe(1);
      expect(env.suggestions).not.toHaveLength(0);
    });

    test('Out of the game without running game', () => {
      env.contexts.set('game', 5);
      OtherHandlers.silence();
      expect(env.output.length).toBe(1);
      expect(env.suggestions).not.toHaveLength(0);
    });
  });

  test('Repeat command', () => {
    const directMock = jest.spyOn(OtherHandlers, 'directToNextLogicalAction');
    directMock.mockImplementation(() => {});
    OtherHandlers.repeat();
    expect(env.output.length).toBe(1);
    expect(OtherHandlers.directToNextLogicalAction).toBeCalledTimes(1);
    directMock.mockRestore();
  });

  describe('Direct to the next logical action', () => {

    test('Within a running game', () => {
      env.contexts.set('game', 1);
      OtherHandlers.directToNextLogicalAction();
      expect(env.contexts.is('turn-intent')).toBeTruthy();
      expect(env.output.length).toBe(1);
      expect(env.suggestions).not.toHaveLength(0);
    });

    test('Out of the running game', () => {
      env.userStorage.fen = 'Test fenstring';
      OtherHandlers.directToNextLogicalAction();
      expect(env.contexts.is('ask-to-new-game')).toBeTruthy();
      expect(env.output.length).toBe(1);
      expect(env.suggestions).not.toHaveLength(0);
    });

    test('Without running game', () => {
      OtherHandlers.directToNextLogicalAction();
      expect(env.contexts.is('ask-to-new-game')).toBeTruthy();
      expect(env.output.length).toBe(1);
      expect(env.suggestions).not.toHaveLength(0);
    });
  });
  
  describe('Ask to move next or remain the board positions', () => {

    test('In the context of correcting last move', () => {
      env.contexts.set('correct-last-move', 1);
      OtherHandlers.askOrRemind();      
      expect(env.output).toHaveLength(1);
      expect(env.contexts.is('turn-showboard')).toBeFalsy();
      expect(env.suggestions).not.toHaveLength(0);
    });

    test('With 100% chance to ask move', () => {
      OtherHandlers.askOrRemind(1);
      expect(env.output).toHaveLength(1);
      expect(env.contexts.is('turn-showboard')).toBeFalsy();
      expect(env.suggestions).not.toHaveLength(0);
    });

    test('With 100% chance to remind the board positions', () => {
      OtherHandlers.askOrRemind(0);      
      expect(env.output).toHaveLength(1);
      expect(env.contexts.is('turn-showboard')).toBeTruthy();
      expect(env.suggestions).not.toHaveLength(0);
    });
  });
});
