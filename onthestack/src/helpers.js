
export function shuffledClone(arr) {
  const copy = arr.slice(); // clone
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function sanitizeString(str) {
  return str
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/gi, '')
    // .replace(/[^a-z0-9 ]/gi, '') // Use this instead if we want to keep internal spaces.
}

export function getFormattedDate(){
  const date = new Date()
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: '2-digit' }
  return date.toLocaleDateString('en-US', options)
}

export function getFormattedTimeStamp(){
  const date = new Date()
  return date.toISOString()
}