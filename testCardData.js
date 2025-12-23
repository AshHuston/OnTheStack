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
(async () => {
  const topCards = await fetchTopEdhrecCards(0);

  // Example: log name + EDHREC rank
  topCards.forEach((card, index) => {
    console.log(
      //`${index + 1}. ${card.name} (EDHREC rank: ${card.edhrec_rank})`
      `'${card.name}',`
    );
  });
})();










import { MtgCard } from './cardData.js';
import { topEDHRcardnames } from './lists.js'

const cardPool = []
const testCard = new MtgCard("counterspell");
console.log(testCard)
topEDHRcardnames.forEach((e) => {
  //console.log(e)
  const card = new MtgCard(e);
  cardPool.push(card)
  //console.log()
});
console.log(cardPool[11]==testCard)

import generatePuzzle from "./generatePuzzle.js";

console.log(generatePuzzle(5, cardPool))