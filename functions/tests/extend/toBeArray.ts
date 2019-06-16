import { extend, MatcherState } from 'expect';
import { unorderedEqual } from './sup/unordered-equal';

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeArray(array: any[]): R;
    }
  }
}

extend({
  toBeArray(this: MatcherState, received: any[], expected: any[]) {
    const pass = unorderedEqual(received, expected);
    return {
      message: () =>
        `Array [${received}] and array [${expected}] ${this.isNot ? '' : 'do not '}contain the same elements`,
      pass,
    };
  },
});
