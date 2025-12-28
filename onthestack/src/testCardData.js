const cardsByEDHRecRankURL = "https://api.scryfall.com/cards/search?q=format:edh&order=edhrec&dir=asc&unique=cards"

async function fetchTopEdhrecCards(limit = 1000) {
  let cards = [];

  // Initial search URL
  let url =
    "https://api.scryfall.com/cards/search" +
    "?q=format:edh" +
    "&order=edhrec" +
    "&dir=asc" +
    "&unique=cards";

  while (url && cards.length < limit) {
    const response = await fetch(url);
    const data = await response.json();

    // Add cards from this page
    // console.log("Adding: ", data.name)
    cards.push(...data.data);

    // Move to next page if available
    if (data.has_more) {
      url = data.next_page;
    } else {
      url = null;
    }
  }

  // Trim to exactly the number requested
  return cards.slice(0, limit);
}

// Example usage
// (async () => {
//   const topCards = await fetchTopEdhrecCards(0);

//   // Example: log name + EDHREC rank
//   topCards.forEach((card, index) => {
//     if (card.card_faces){
//       console.log(
//         `'${card.card_faces[0].name.replace("'", "\\'")}',`
//       );
//     }
//     else {
//       console.log(
//         //`${index + 1}. ${card.name} (EDHREC rank: ${card.edhrec_rank})`
//         `'${card.name.replace("'", "\\'")}',`
//       );
//     }
//   });
// })();

// -------------------------------------------------------------------------------------------------- //

// import { MtgCard } from './backend/cardData.js';
// import { topEDHRcardnames } from './backend/lists.js'

// const cardPool = []
// const testCard = new MtgCard("counterspell");
// console.log(testCard)
// topEDHRcardnames.forEach((e) => {
//   //console.log(e)
//   const card = new MtgCard(e);
//   cardPool.push(card)
//   //console.log()
// });
// console.log(cardPool[11]==testCard)

// import fs from 'fs'

// fs.writeFileSync(
//   'data.json',
//   JSON.stringify(cardPool, null, 2),
//   'utf-8'
// )
import { edhrecTopTwoTousand as cardPool } from "./edhrecTopTwoThousand.js";
import generatePuzzle from "./backend/generatePuzzle.js";

console.log(generatePuzzle(6, cardPool))


// -------------------------------------------------------------------------------------------------- //

// import { Puzzle } from "./puzzle.js";

// const words = [
//   'test',
//   'Nott, the brave',
//   'Hello, sir!',
//   'my-name-is-horatio'
// ]
// const myPuzz = new Puzzle({length: 4, words})
// console.log(myPuzz.characterMaps)