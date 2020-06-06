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

Utils.prototype.getDate= function(age){
  let year = Math.floor(age/12);
  let month=utils.getMonth(age%12+1);
  let date=this.capitalize(month)+" "+year
  return date;
}

Utils.prototype.getMonth= function(month){
  switch(month){
    case 1:return "january";
    case 2:return "febuary";
    case 3:return "march";
    case 4:return "april";
    case 5:return "may";
    case 6:return "june";
    case 7:return "july";
    case 8:return "august";
    case 9:return "september";
    case 10:return "october";
    case 11:return "november";
    case 12:return "december";
  }
  return (month+" "+year);
}
Utils.prototype.capitalize= function(s){
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}
Utils.prototype.genderMark= function(sex,kind){
  switch(kind){
    case "er": return (sex=="male")?"er":"";
    case "name":return (sex=="male")?"Mr":"Mme";
    case "name":return (sex=="male")?"Mr":"Mme";
    default:return "";}
}
Utils.prototype.aOrAn= function(word){
  return(['a','e','i','o','u','y'].includes(word.slice(0,1)))?"n":"";}

 Utils.prototype.applyBBCode = function(string){
  string=string.replace(/\[(avatar)? (\w*?) id=(\d+)\](.*?)\[\/id\]/g,"<span class='$1 $2 link' value='$3' title='id : $3'>$4</span>");
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
        var dataView = google.visualization.arrayToDataTable(data);
        let xMax=$('#graph-max').val();
let xMin=$('#graph-min').val();
if(xMax<0 || xMax>dc.age/12){xMax=Math.round(dc.age/12);}
if(xMin<0 || xMin>dc.age/12){xMin=0;}
        var options = {
          title: title,
          curveType: 'function',
          legend: { position: 'bottom' },
          hAxis : {
            viewWindow: {
              min: xMin,
              max: xMax
            }}
        };
        var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));

        chart.draw(dataView, options);
};

      

Utils.prototype.compareValues= function(key, order = 'asc') {
        return function innerSort(a, b) {
          if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
            return 0;
          }
      
          const varA = (typeof a[key] === 'string')
            ? a[key].toUpperCase() : a[key];
          const varB = (typeof b[key] === 'string')
            ? b[key].toUpperCase() : b[key];
      
          let comparison = 0;
          if (varA > varB) {
            comparison = 1;
          } else if (varA < varB) {
            comparison = -1;
          }
          return (
            (order === 'desc') ? (comparison * -1) : comparison
          );
        };
      }