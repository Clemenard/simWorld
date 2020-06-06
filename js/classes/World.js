function World(duration=50,startPop=100,maxPop=10000,frameDuration=1000){
    this.duration=(duration>1)?duration:50;
    this.startPop=(startPop>1)?startPop:100;
    this.maxPop=(maxPop>10)?maxPop:10000;
    this.frameDuration=(frameDuration>5)?frameDuration:20;
    for(let i=0;i<this.startPop-1;i++){
        let human=new Human(true)
        dc.alivehumanList.push(human);
    }
    let avatar=new Avatar()
    dc.alivehumanList.push(avatar);
    new House(true,avatar);
}
World.prototype.getTownById= function(id){

    let search=dc.alivetownList.filter(function(ele){ return ele.id == id; })[0];
    if (search){return search;}
    return false;

}

World.prototype.getHousesBySurname= function(surname,year=-1){
    if(year>-1){
    let search=dc.census.house[year].filter(function(ele){ 
        if(ele.gold!=100){
        return ele.leader.surname == surname;} });
    if (search){return search;}}
    return dc.alivehouseList.filter(function(ele){ return ele.leader.surname == surname; });
}

World.prototype.getNobleHouse= function(option){
    let nobles= search=dc.alivehouseList.filter(function(ele){ return ele.state == "noble"; });
    if(option=="random"){
        return nobles[utils.getRandomArbitrary(0,nobles.length-1)]}
        if(nobles.length>0){
    return nobles}
    return false;
}

World.prototype.getMainFamilies= function(year,town){
    let mainFamilies=new Array();

    dc.census.human[year].forEach(element => {
        if(!town || dc.getOneBy("town",'id',dc.getOneBy("house",'id',element.house).town).id ==town){
        if(!mainFamilies[element.surname]){mainFamilies[element.surname]=0;}
        mainFamilies[element.surname]++; }
    });
    return mainFamilies;
} 
 
World.prototype.getDataGraph= function(graphs){
    let data= new Array();
    let header=['Year'].concat(graphs)
    switch(graphs){
        case "Medium Age":    data.push(header.concat(['Eldest']));break;
        case "Total Money":    data.push(header);break;
        case "Total population":        data.push(header.concat(['0-15 yo','15-30 yo','30-45 yo','45-60 yo','60+ yo']));break;
    }   
    dc.census.human.forEach((element,i,childs)=>{
        let dataRow = [i];
switch(graphs){
    case "Medium Age": 
        dataRow.push(element.reduce((accumulator, currentValue) => {
            return (accumulator + currentValue.age);},0)/(element.length*12));
        dataRow.push(element.reduce((accumulator, currentValue) => {
            return (accumulator > currentValue.age ? accumulator : currentValue.age);},0)/12);
        break;
    case "Total Money": 
        dataRow.push(dc.census.house[i].reduce((accumulator, currentValue) => {
            return (accumulator + currentValue.gold);},0));
        break;
    case "Total Population":
        dataRow.push(element.length);
        dataRow.push(element.filter(function(ele){ return ele.age <= 180; }).length);
        dataRow.push(element.filter(function(ele){ return (ele.age > 180 && ele.age<=360); }).length);
        dataRow.push(element.filter(function(ele){ return (ele.age > 360 && ele.age<=540); }).length);
        dataRow.push(element.filter(function(ele){ return (ele.age > 540 && ele.age<=720); }).length);
        dataRow.push(element.filter(function(ele){ return (ele.age > 720 ); }).length);
        break;
}
        data.push(dataRow)
    
});
google.charts.setOnLoadCallback(utils.drawChart(data,graph));
return true;
}

World.prototype.getHouseGraph= function(human){
    let data=[['Year','Gold']];
    let dataRow=new Array();
    let age=-1;
    let gold=0;
dc.census.human.forEach((ele,i,childs) =>{
    ele.forEach((e,j,childs) => {
     if( e.id==human){
        age=i;
        gold=dc.census.house[i].filter(function(house){ return (house.id == e.house ); })[0].gold;
    } 
          
    });
    if(age>=0 &&  typeof age=="number"){
    dataRow=[age,gold];
    data.push(dataRow);
    age=-1;
}
});
return data;
}

World.prototype.payday= function(){
    dc.alivehumanList.forEach((human,index,childs)=>{
        try{
        var house = human.getHouse();
        if(human.isKing()){house.gold+=24;}
        house.gold+=human.job.salary*12;}
        catch(error){
            console.log("payday : "+error)
        }
        
    });
    dc.alivehouseList.forEach((house,index,childs)=>{
        if(!(house instanceof Orphanage))
        house.payTax();   
    });
return true;}


