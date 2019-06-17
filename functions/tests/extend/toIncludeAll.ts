import { extend, MatcherState } from 'expect';

declare global {
  namespace jest {
    interface Matchers<R> {
      toIncludeAll(substrings: string[]): R;
    }
  }
}

extend({
  toIncludeAll(this: MatcherState, received: string, substrings: string[]) {
    const pass = substrings.every(str => received.includes(str));
    return {
      message: () => {
        if (this.isNot) {
          return `The received string contains all the substrings`;
        } else {
          const notIncluded = substrings.filter(str => !received.includes(str));
          return `The received string not contains [${notIncluded.join(', ')}] substrings`;
        }
      },
      pass,
    };
  },
});
