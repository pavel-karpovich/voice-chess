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
  sin?: string;
  plr?: string;
  na?: string;
  vin?: string;
  'mus/sin'?: string;
  'fem/sin'?: string;
  'mus/plr'?: string;
  'fem/plr'?: string;
  'mus/vin'?: string;
  'fem/vin'?: string;
  'mus/rod'?: string;
  'fem/rod'?: string;
  'mus/tvr'?: string;
  'fem/tvr'?: string;
  'sin/rod'?: string;
  'plr/rod'?: string;
  'plr/tvr'?: string;
  'fem/sin/rod'?: string;
  'mus/sin/rod'?: string;
  'fem/plr/rod'?: string;
  'mus/plr/rod'?: string;
  'fem/plr/tvr'?: string;
  'mus/plr/tvr'?: string;
  'fem/plr/vin'?: string;
  'mus/plr/vin'?: string;
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

export const enum WhoseSide {
  PLAYER = '1',
  ENEMY = '2',
}

export function mix(cond: boolean, perc = 0.2): boolean {
  const mix = Math.random();
  return (cond && mix < 1 - perc) || mix < perc;
}
