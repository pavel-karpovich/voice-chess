/**
 * Converting the first character of a given string to uppercase
 * @param str Given string
 * @return First-char-Uppercased string
 */
export function upFirst(str: string): string {
  if (str === '') return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Get random element from the array
 * @param arr Given array of elements
 * @return  Randomly choosen element from the array
 */
export function rand(arr: any[]): string {
  if (arr.length !== 0) {
    return arr[Math.floor(Math.random() * arr.length)];
  } else {
    return null;
  }
}

export function gaussianRandom(iter = 4): number {
  if (iter < 1) return null;
  let sum = 0;
  for (let i = 0; i < iter; ++i) {
    sum += Math.random();
  }
  return sum / iter;
}

export function mix(cond: boolean, perc = 0.2): boolean {
  const mix = Math.random();
  if (cond) return mix > perc;
  else return mix < perc;
}

export function shuffle<type>(original: type[]): type[] {
  const arr = original.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function char(str: string): string {
  return `<say-as interpret-as="characters">${str}</say-as>`;
}

export function pause(interval: number): string {
  if (interval <= 0) return '';
  return `<break time="${interval}"/>`;
}
