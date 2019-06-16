import { extend } from 'expect';
import { unorderedEqual } from './unordered-equal';

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeArray(array: any[]): R;
    }
    interface Matchers<R> {
      toUnorderedEqual(obj: R): R;
    }
  }
}

extend({
  toBeArray(received: any[], expected: any[]) {
    const pass = unorderedEqual(received, expected);
    return {
      message: () =>
        `Array ${received} and array ${expected} do not contain the same elements`,
      pass,
    };
  },
});

extend({
  toUnorderedEqual<R>(received: R, expected: R) {
    const pass = unorderedEqual(received, expected);
    return {
      message: () =>
        `Object ${received} and object ${expected} do not contain the same elements`,
      pass,
    };
  },
});