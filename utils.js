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
    case"widow": return (sex=="M")?"er":"";
    case "name":return (sex=="M")?"Mr":"Mme";
    default:return "";}
}