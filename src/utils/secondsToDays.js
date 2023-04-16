export function secondsToDhms(seconds) {
  seconds = Number(seconds);
  return Math.floor(seconds / (3600 * 24));
}
