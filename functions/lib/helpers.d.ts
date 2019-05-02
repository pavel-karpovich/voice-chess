/**
 * Upper case the first character of the given string
 * @param {string} str Given string
 * @return {string} String with first upper letter
 */
export declare function upFirst(str: string): string;
/**
 * Get random element from the array
 * @param {string[]} arr Given array of elements
 * @return {string} Randomly choosen element from the array
 */
export declare function rand(arr: string[]): string;
export interface LocalizationObject<T> {
    [key: string]: T;
    en: T;
    ru: T;
}
export interface WordForms {
    [key: string]: string;
    mus: string;
    fem: string;
    na: string;
}
