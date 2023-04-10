export function secondsToDhms(seconds) {
  seconds = Number(seconds);
  var d = Math.floor(seconds / (3600 * 24));
  var h = Math.floor((seconds % (3600 * 24)) / 3600);
  var m = Math.floor((seconds % 3600) / 60);
  var s = Math.floor(seconds % 60);

  var dDisplay = d > 0 ? d + "D:" : "";
  var hDisplay = h > 0 ? h + ":" : "";
  var mDisplay = m > 0 ? m + ":" : "";
  var sDisplay = s > 0 ? s + ":" : "";
  return (dDisplay + hDisplay + mDisplay + sDisplay).replace(/:\s*$/, "");
}
