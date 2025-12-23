
export class Puzzle {
  /**
   * @param {Object} options
   * @param {string} [options.startWord]
   * @param {string} [options.endWord]
   * @param {number} [options.length]
   * @param {Object[]} [options.middleWords]
   */
  constructor({ startWord = null, endWord = null, length = null, middleWords = null } = {}) {
    this.startWord = startWord;
    this.endWord = endWord;
    this.length = length;
    this.middleWords = middleWords;
  }
}
