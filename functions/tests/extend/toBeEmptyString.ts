import { extend, MatcherState } from 'expect';

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeEmptyString(): R;
    }
  }
}

extend({
  toBeEmptyString(this: MatcherState, received: string) {
    let pass;
    if (typeof received !== 'string') {
      pass = (this.isNot ? true : false);
    } else {
      pass = received === '';
    }
    return {
      message: () => `Received string is ${this.isNot ? '' : 'not '}empty`,
      pass,
    };
  },
});
