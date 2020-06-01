function getRandomArbitrary(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}
function arrayRemove(arr, value) { return arr.filter(function(ele){ return ele != value; });}
function numberParticle(number){
  switch (number) {
    case 1: return "st";
    case 2: return "nd";
    case 3: return "rd";
    default: return "th";
  }
}
function genderMark(sex,kind){
  switch(kind){
    case "er": return (sex=="male")?"er":"";
    case "name":return (sex=="male")?"Mr":"Mme";
    default:return "";}
}