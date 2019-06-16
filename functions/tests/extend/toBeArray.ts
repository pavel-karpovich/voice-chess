import { extend, MatcherState } from 'expect';
import { unorderedEqual } from './sup/unordered-equal';
import { inspect } from 'util';

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
      message: () => {
        const a1 = inspect(received, { colors: true });
        const a2 = inspect(expected, { colors: true });
        const pr = (this.isNot ? '' : 'do not ');
        return `Recieved array \n${a1}\n and expected array \n${a2}\n ${pr}contain the same elements`;
      },
      pass,
    };
  },
});
