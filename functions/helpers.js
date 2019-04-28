
module.exports = class Helpers {
  /**
   * Upper case the first character of the given string
   * @param {String} string Given string
   * @return {String} String with first upper letter
   */
  static upFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
};
