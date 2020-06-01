function Utils(){}
Utils.prototype.getRandomArbitrary= function(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}
Utils.prototype.numberParticle= function (number){
  switch (number) {
    case 1: return "st";
    case 2: return "nd";
    case 3: return "rd";
    default: return "th";
  }
}
Utils.prototype.genderMark= function(sex,kind){
  switch(kind){
    case "er": return (sex=="male")?"er":"";
    case "name":return (sex=="male")?"Mr":"Mme";
    default:return "";}
}