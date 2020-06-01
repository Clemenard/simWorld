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
 Utils.prototype.applyBBCode = function(string){
  string=string.replace(/\[(\w*?) id=(\d+)\](.*?)\[\/id\]/g,"<span class='$1 link' value='$2' title='id : $2'>$3</span>");
  return string;
}

Utils.prototype.getSortedKeys = function(obj) {
  var keys = [];
  var sortedKeys = [];
  for(var key in obj) keys.push(key);
  keys= keys.sort(function(a,b){return obj[b]-obj[a]});
  keys.forEach(element => {sortedKeys.push({"key":element,"value":obj[element]})})
return sortedKeys
}


      Utils.prototype.drawChart = function(data,title) {
        var data = google.visualization.arrayToDataTable(data);
        var options = {
          title: title,
          curveType: 'function',
          legend: { position: 'bottom' }
        };

        var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));

        chart.draw(data, options);
      }