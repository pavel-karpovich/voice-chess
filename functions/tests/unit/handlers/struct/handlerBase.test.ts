import { HandlerBase } from '../../../../src/handlers/struct/handlerBase';
import { MockContextManager } from '../../../mocks/mockContextManager';

describe('Tests for HandlerBase class', () => {

  test('Load method', () => {
    expect(() => {
      HandlerBase.load(
        console.log,
        new MockContextManager(),
        {},
        {},
        console.log
      );
    }).not.toThrowError();
  });

});