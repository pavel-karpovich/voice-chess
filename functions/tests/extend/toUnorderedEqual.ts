import { extend, MatcherState } from 'expect';
import { unorderedEqual } from './sup/unordered-equal';
import { inspect } from 'util';

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
      message: () => {
        const o1 = inspect(received, { colors: true });
        const o2 = inspect(expected, { colors: true });
        const pr = (this.isNot ? '' : 'do not ');
        return `Received object \n${o1}\n and expected object \n${o2}\n are ${pr}unordered equal`;
      },
      pass,
    };
  },
});
