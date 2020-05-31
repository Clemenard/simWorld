function getRandomArbitrary(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}
function arrayRemove(arr, value) { return arr.filter(function(ele){ return ele != value; });}