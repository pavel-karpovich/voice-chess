import '../../extend/toBeInRange';
import '../../extend/toBeEmptyString';

import { rand, upFirst, gaussianRandom, mix, char, pause } from '../../../src/support/helpers';

describe('Testing support helper functions', () => {

  test.each([
    ['test string', 'Test string'],
    ['123 test', '123 test'],
    ['- test', '- test'],
    ['', ''],
  ])('String "%s" with the first captial letter should be "%s"', (str, capitalized) => {
    const after = upFirst(str);
    expect(after).toBe(capitalized);
  });

  describe('Getting random element from an array', () => {

    test.each([
      [[1, 3, 65, 32, 32, 0, -2] as any[]],
      [['I', 'you', 'we', 'they']],
      [[{ a: 1, b: 2 }, { a: 4, b: 2 }, { a: 8, b: 1 }]],
    ])('The return value present in the source array', array => {
      const randEl = rand(array);
      expect(array).toContain(randEl);
    });

    test('Calling on empty array return null', () => {
      const array = [] as any[];
      const randEl = rand(array);
      expect(randEl).toBeNull();
    });
  });

  describe('Gaussian random function', () => {

    test('Recieved number is within a range [0, 1]', () => {
      const rnd = gaussianRandom();
      expect(rnd).toBeInRange(0, 1);
    });

    test.each([
      [0],
      [-2],
    ])('%n iterations returns null', (iterNum) => {
      const rnd = gaussianRandom(iterNum);
      expect(rnd).toBeNull();
    });
  });

  describe('Mix logical expression results', () => {
  
    test('0% chance of mixing', () => {
      const chance = 0;
      const bool = mix(true, chance);
      expect(bool).toBeTruthy();
    });

    test('100% chance of mixing', () => {
      const chance = 1;
      const bool = mix(true, chance);
      expect(bool).toBeFalsy();
    });
  });

  test('Character pronunciation wrapper return string that contain original', () => {
    const original = 'jigga-jigga';
    const wrapped = char(original);
    expect(wrapped).toEqual(expect.stringContaining(original));
  });

  describe('Creating pause string for a given time via SSML', () => {

    test('Received string contain time number', () => {
      const time = 1.4;
      const pauseStr = pause(time);
      expect(pauseStr).toEqual(expect.stringContaining(time.toString()));
    });

    test('Pause with incorrect time interval return empty string', () => {
      const time = -222;
      const pauseStr = pause(time);
      expect(pauseStr).toBeEmptyString();
    });
  });
  
});
