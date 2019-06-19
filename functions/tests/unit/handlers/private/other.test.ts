import { OtherHandlers } from '../../../../src/handlers/private/other';
import { Env } from './_env';
import { initLanguage } from '../../../../src/locales/initLang';
import { SettingsHandlers } from '../../../../src/handlers/private/settings';

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
      env.endConversation.bind(env)
    );
  });

  test('Help command', () => {
    OtherHandlers.help();
    expect(env.output.length).toBe(1);
  });

  test('Silence command', () => {
    env.contexts.set('game', 5);
    OtherHandlers.silence();
    expect(env.output.length).toBe(1);
  });

  test('Repeat command', () => {
    const mock = jest.spyOn(
      SettingsHandlers,
      'directToNextLogicalAction'
    ).mockImplementation(() => {});
    OtherHandlers.repeat();
    expect(env.output.length).toBe(1);
    expect(SettingsHandlers.directToNextLogicalAction).toBeCalledTimes(1);
    mock.mockReset();
  });

});
