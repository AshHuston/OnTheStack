
export class Puzzle {
  /**
   * @param {Object} options
   * @param {string[]} [options.words]
   * @param {number} [options.length]
   */
  constructor({  
    length = null,
    words = [] 
  } = {}) {
    this.length = length;
    this.words = words
  }

  addCard({isFirstWord, isLastWord, topConnector, cardname, bottomConnector}) {
    console.log(isFirstWord, isLastWord, topConnector, cardname, bottomConnector)
    const blankMap = this._buildMap(cardname)
    if (!isFirstWord) { this.words.at(-1).bottomConnector = topConnector }
    this.words.push({isFirstWord, isLastWord, topConnector, cardname, bottomConnector, blankMap})
  }

  _buildMap(word) {
    let map = ""
    //IMPROVE: Rather than use a manual whitelist, make this a blacklist. It can be modified for difficulty.
    const charsToKeep = [
      " ",
      "'",
      "/",
      ",",
      "\"",
      ".",
      "-",
      "&",
      "!",
      "?",
      ":",
    ]
    console.log(word)
    for (let l=0; l<word.length; l++) {
      if (charsToKeep.includes(word[l])) {
        map += word[l];
      }
      else {
        map += "_"
      }
    }
    return map
  }
}
