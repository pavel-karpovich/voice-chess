import { extend, MatcherState } from 'expect';
import { unorderedEqual } from './sup/unordered-equal';

declare global {
  namespace jest {
    interface Matchers<R> {
      toUnorderedEqual(obj: R): R;
    }
  }
}

extend({
  toUnorderedEqual<R>(this: MatcherState, received: R, expected: R) {
    const pass = unorderedEqual(received, expected);
    return {
      message: () =>
        `Object ${received} and object ${expected} are ${this.isNot ? '' : 'not '}unordered equal`,
      pass,
    };
  },
});
