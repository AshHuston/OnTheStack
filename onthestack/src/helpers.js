
export function shuffledClone(arr) {
  const copy = arr.slice(); // clone
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function sanitizeString(str, keepSpaces=false) {
  if ( keepSpaces ) {
    return str
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9 ]/gi, '')
  } else {
    return str
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]/gi, '')
  }
}

export function getFormattedDate(date = new Date()){
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: '2-digit' }
  return date.toLocaleDateString('en-US', options)
}

export function getFormattedTimeStamp(date = new Date()){
  return date.toISOString()
}
