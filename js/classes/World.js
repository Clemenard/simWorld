function World(duration=50,startPop=100,maxPop=10000,frameDuration=1000){
    lastHumanId=10;
 lastHouseId=10;
    this.duration=(duration>1)?duration:50;
    this.startPop=(startPop>1)?startPop:100;
    this.maxPop=(maxPop>10)?maxPop:10000;
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
    data.push(header)
    this.census.human.forEach((element,i,childs)=>{
        let dataRow = [i];
        graphs.forEach((elt,j,childs)=>{
switch(elt){
    case "Medium Age": dataRow.push(element.reduce((accumulator, currentValue) => {
        return (accumulator + currentValue.age);},0)/(element.length*12));
        break;
        case "Total Money": dataRow.push(world.census.house[i].reduce((accumulator, currentValue) => {
            return (accumulator + currentValue.gold);},0));
            break;
}
});

        data.push(dataRow)
    
});
return data;
}

World.prototype.payday= function(){
    try{
    this.aliveHumanList.forEach((human,index,childs)=>{
        let house = human.getHouse();
        if(house){
        house.gold+=human.job.salary;}
        
    });
    this.houseList.forEach((house,index,childs)=>{
        house.payTax();   
    });
return true;}
catch(error){
    console.log(error)
}
}

