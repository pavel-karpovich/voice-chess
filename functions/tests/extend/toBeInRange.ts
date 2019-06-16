import { extend, MatcherState } from 'expect';

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInRange(from: number, to: number): R;
    }
  }
}

extend({
  toBeInRange(this: MatcherState, received: number, from: number, to: number) {
    const pass = (received >= from && received <= to);
    return {
      message: () => `Value ${received} is ${this.isNot ? '' : 'not '} within a range [${from}, ${to}]`,
      pass,
    };
  },
});
