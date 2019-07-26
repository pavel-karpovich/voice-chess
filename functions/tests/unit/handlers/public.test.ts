import { HandlerBase } from '../../../src/handlers/struct/handlerBase';
import { MoveHandlers } from '../../../src/handlers/private/move';
import { SettingsHandlers } from '../../../src/handlers/private/settings';
import { InfoHandlers } from '../../../src/handlers/private/info';
import { GameHandlers } from '../../../src/handlers/private/game';
import { NavigationHandlers } from '../../../src/handlers/private/naviagation';
import { AroundMoveHandlers  } from '../../../src/handlers/private/aroundMove';
import { FallbackHandlers } from '../../../src/handlers/private/fallback';
import { OtherHandlers } from '../../../src/handlers/private/other';
import { Handlers } from '../../../src/handlers/public';

describe('Test public Handlers API', () => {

  beforeAll(() => {
    HandlerBase.load = jest.fn(() => {});
    MoveHandlers.load = jest.fn(() => {});
    SettingsHandlers.load = jest.fn(() => {});
    InfoHandlers.load = jest.fn(() => {});
    GameHandlers.load = jest.fn(() => {});
    NavigationHandlers.load = jest.fn(() => {});
    AroundMoveHandlers.load = jest.fn(() => {});
    FallbackHandlers.load = jest.fn(() => {});
    OtherHandlers.load = jest.fn(() => {});
  });

  test('Load all handlers', () => {
    Handlers.load(null, null, null, {}, null);
    expect(HandlerBase.load).toBeCalledTimes(1);
    expect(MoveHandlers.load).toBeCalledTimes(1);
    expect(SettingsHandlers.load).toBeCalledTimes(1);
    expect(InfoHandlers.load).toBeCalledTimes(1);
    expect(GameHandlers.load).toBeCalledTimes(1);
    expect(NavigationHandlers.load).toBeCalledTimes(1);
    expect(AroundMoveHandlers.load).toBeCalledTimes(1);
    expect(FallbackHandlers.load).toBeCalledTimes(1);
    expect(OtherHandlers.load).toBeCalledTimes(1);
  });

});
