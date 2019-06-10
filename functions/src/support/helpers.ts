/**
 * Upper case the first character of the given string
 * @param {string} str Given string
 * @return {string} String with first upper letter
 */
export function upFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Get random element from the array
 * @param {string[]} arr Given array of elements
 * @return {string} Randomly choosen element from the array
 */
export function rand(arr: string[]): string {
  if (arr.length !== 0) {
    return arr[Math.floor(Math.random() * arr.length)];
  } else {
    return null;
  }
}

export interface LocalizationObject<T> {
  [key: string]: T;
  en: T;
  ru: T;
}

export interface WordForms {
  [key: string]: string;
  mus?: string;
  fem?: string;
  na?: string;
  sin?: string;
  vin?: string;
  'mus/sin'?: string;
  'fem/sin'?: string;
  'mus/vin'?: string;
  'fem/vin'?: string;
  'mus/rod'?: string;
  'fem/rod'?: string;
  'plr/rod'?: string;
  'plr/tvr'?: string;
}

export function char(str: string): string {
  return `<say-as interpret-as="characters">${str}</say-as>`;
}

export function pause(interval: number): string {
  return `<break time="${interval}"/>`;
}

export function gaussianRandom(iter = 4): number {
  let sum = 0;
  for (let i = 0; i < iter; ++i) {
    sum += Math.random();
  }
  return sum / iter;
}
