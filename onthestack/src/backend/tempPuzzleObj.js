
export const testPuzzle = {
  length: 4,
  words: [
    {
      isFirstWord: true,
      isLastWord: false,
      topConnector: '',
      cardname: "tezzeret's gambit",
      bottomConnector: 'bit',
      blankMap: "________'_ ______",
      isSolved: true
    },
    {
      isFirstWord: false,
      isLastWord: false,
      topConnector: 'bit',
      cardname: 'bitterblossom',
      bottomConnector: 'blossom',
      blankMap: '_____________',
      isSolved: false
    },
    {
      isFirstWord: false,
      isLastWord: false,
      topConnector: 'blossom',
      cardname: 'blossoming bogbeast',
      bottomConnector: 'beast',
      blankMap: '__________ ________',
      isSolved: false
    },
    {
      isFirstWord: false,
      isLastWord: true,
      topConnector: 'beast',
      cardname: 'beast whisperer',
      bottomConnector: '',
      blankMap: '_____ _________',
      isSolved: false
    }
  ]
}