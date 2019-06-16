// MIT License

// Copyright (c) 2017 Evgeny Poberezkin
// Source: https://github.com/epoberezkin/fast-deep-equal

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.


// tslint:disable: triple-equals

const isArray = Array.isArray;
const keyList = Object.keys;
const hasProp = Object.prototype.hasOwnProperty;

// The equality algorithm has been changed by reducing 
// the check of the order of the elements in comparing arrays.
export function unorderedEqual(a: any, b: any) {
  if (a === b) return true;

  if (a && b && typeof a == 'object' && typeof b == 'object') {
    const arrA = isArray(a);
    const arrB = isArray(b);

    if (arrA && arrB) {
      if (a.length != b.length) return false;
      // It's here
      let eq = false;
      const usedIndexes = [] as number[];
      for (let i = a.length; i-- !== 0;) {
        for (let j = b.length; j-- !== 0;) {
          if (usedIndexes.indexOf(j) != -1) continue;
          if (unorderedEqual(a[i], b[j])) {
            eq = true;
            usedIndexes.push(j);
            break;
          }
        }
        if (!eq) return false;
      }
      return true;
    }

    if (arrA != arrB) return false;

    const dateA = a instanceof Date;
    const dateB = b instanceof Date;
    if (dateA != dateB) return false;
    if (dateA && dateB) return a.getTime() == b.getTime();

    const regexpA = a instanceof RegExp;
    const regexpB = b instanceof RegExp;
    if (regexpA != regexpB) return false;
    if (regexpA && regexpB) return a.toString() == b.toString();

    const keys = keyList(a);

    if (keys.length !== keyList(b).length) return false;

    for (let i = keys.length; i-- !== 0;) {
      if (!hasProp.call(b, keys[i])) return false;
    }

    let key;
    for (let i = keys.length; i-- !== 0;) {
      key = keys[i];
      if (!unorderedEqual(a[key], b[key])) return false;
    }

    return true;
  }

  return a !== a && b !== b;
}
