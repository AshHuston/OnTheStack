import { Puzzle } from "./puzzle";

export const testPuzzle = new Puzzle({

  length: null,
  words: [
    {
      isFirstWord: true,
      isLastWord: false,
      topConnector: '',
      cardname: 'thing in the ice',//'ghalta, primal hunger',
      bottomConnector: 'ger',
      blankMap: '______, ______ ______',
      isSolved: true
    },
    {
      isFirstWord: false,
      isLastWord: false,
      topConnector: 'ger',
      cardname: 'geralf, visionary stitcher',
      bottomConnector: 'her',
      blankMap: '______, _________ ________',
      isSolved: false
    },
    {
      isFirstWord: false,
      isLastWord: false,
      topConnector: 'her',
      cardname: 'heraldic banner',
      bottomConnector: 'banner',
      blankMap: '________ ______',
      isSolved: false
    },
    {
      isFirstWord: false,
      isLastWord: false,
      topConnector: 'banner',
      cardname: 'banner of kinship',
      bottomConnector: 'ship',
      blankMap: '______ __ _______',
      isSolved: false
    },
    {
      isFirstWord: false,
      isLastWord: false,
      topConnector: 'ship',
      cardname: 'shipwreck marsh',
      bottomConnector: 'marsh',
      blankMap: '_________ _____',
      isSolved: false
    },
    {
      isFirstWord: false,
      isLastWord: true,
      topConnector: 'marsh',
      cardname: 'marsh flats',
      bottomConnector: '',
      blankMap: '_____ _____',
      isSolved: false
    }
  ]
}






//   length: 4,
//   words: [
//     {
//       isFirstWord: true,
//       isLastWord: false,
//       topConnector: '',
//       cardname: "tezzeret's gambit",
//       bottomConnector: 'bit',
//       blankMap: "________'_ ______",
//       isSolved: true
//     },
//     {
//       isFirstWord: false,
//       isLastWord: false,
//       topConnector: 'bit',
//       cardname: 'bitterblossom',
//       bottomConnector: 'blossom',
//       blankMap: '_____________',
//       isSolved: false
//     },
//     {
//       isFirstWord: false,
//       isLastWord: false,
//       topConnector: 'blossom',
//       cardname: 'blossoming bogbeast',
//       bottomConnector: 'beast',
//       blankMap: '__________ ________',
//       isSolved: false
//     },
//     {
//       isFirstWord: false,
//       isLastWord: true,
//       topConnector: 'beast',
//       cardname: 'beast whisperer',
//       bottomConnector: '',
//       blankMap: '_____ _________',
//       isSolved: false
//     }
//   ]
// }
)