function World(duration=50,startPop=100,maxPop=10000,frameDuration=1000){
    lastHumanId=10;
 lastHouseId=10;
    this.duration=(duration>1)?duration:50;
    this.startPop=(startPop>1)?startPop:100;
    this.maxPop=(maxPop>10)?maxPop:10000;
    this.page=0;
    this.frameDuration=(frameDuration>5)?frameDuration:20;
    this.aliveHumanList=new Array();
    this.deadHumanList=new Array();
    this.houseList=new Array();
    this.logsList=new Array();
    this.census={"human":new Array(),"house":new Array()};
    this.age=0;
    for(let i=0;i<this.startPop;i++){
        let human=new Human(true)
        this.aliveHumanList.push(human);
        this.houseList.push(new House(true,human));
    }
}
World.prototype.getHumanById= function(id,year=-1){
    if(year>-1){
    let search=this.census.human[year].filter(function(ele){ return ele.id == id; })[0];
    if (search){return search;}}
    let humanList=this.aliveHumanList.concat(this.deadHumanList);
    return humanList.filter(function(ele){ return ele.id == id; })[0];
}

World.prototype.getHousesBySurname= function(surname,year=-1){
    if(year>-1){
    let search=this.census.house[year].filter(function(ele){ return ele.leader.surname == surname; });
    if (search){return search;}}
    let humanList=this.aliveHumanList.concat(this.deadHumanList);
    return this.houseList.filter(function(ele){ return ele.leader.surname == surname; });
}

World.prototype.getNobleHouse= function(option){
    let nobles= search=this.houseList.filter(function(ele){ return ele.state == "noble"; });
    if(option=="random"){
        return nobles[utils.getRandomArbitrary(0,nobles.length-1)]}
    return nobles
}

World.prototype.getMainFamilies= function(year){
    let mainFamilies=new Array();
    this.census.human[year].forEach(element => {
        if(!mainFamilies[element.surname]){mainFamilies[element.surname]=0;}
        mainFamilies[element.surname]++; 
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
    this.census.human.forEach((element,i,childs)=>{
        let dataRow = [i];
switch(graphs){
    case "Medium Age": 
        dataRow.push(element.reduce((accumulator, currentValue) => {
            return (accumulator + currentValue.age);},0)/(element.length*12));
        dataRow.push(element.reduce((accumulator, currentValue) => {
            return (accumulator > currentValue.age ? accumulator : currentValue.age);},0)/12);
        break;
    case "Total Money": 
        dataRow.push(world.census.house[i].reduce((accumulator, currentValue) => {
            return (accumulator + currentValue.gold);},0));
        break;
    case "Total population":
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
return data;
}

World.prototype.getHouseGraph= function(human){
    let data=[['Year','Gold']];
    let dataRow=new Array();
    let age=-1;
    let gold=0;
world.census.human.forEach((ele,i,childs) =>{
    ele.forEach((e,j,childs) => {
     if( e.id==human){
        age=i;
        gold=world.census.house[i].filter(function(house){ return (house.id == e.house ); })[0].gold;} 
          
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
    this.aliveHumanList.forEach((human,index,childs)=>{
        try{
        var house = human.getHouse();
        
        house.gold+=human.job.salary*12;}
        catch(error){
            console.log("error")
        }
        
    });
    this.houseList.forEach((house,index,childs)=>{
        house.payTax();   
    });
return true;}


