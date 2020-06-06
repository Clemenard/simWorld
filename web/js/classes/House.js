function House(isGenerate=false,leader){
    this.leader=leader;
    this.state="common";
    this.id=lastHouseId;
    if(isGenerate==true){
        this.gold= (leader.avatar)?utils.getRandomArbitrary(150,250):utils.getRandomArbitrary(20,250);
        leader.house=lastHouseId;
        this.town=utils.getRandomArbitrary(0,dc.townsNumber);
        if(!dc.getOneBy("town","id",this.town)){
            let foundTown = new Town(leader);
            new LogMessage("town",leader.display("safename")+" founded the town of "+foundTown.name+".",[leader.id],foundTown.id);
            dc.alivetownList.push(foundTown);
            this.state="king";
        }
    }
    else{
        this.gold=0;
//the father give gold

        //the mother give gold
        let partner=dc.getOneBy('human','id',leader.pairedWith);
        let partnerIsKing=false
        if(partner){
            partnerIsKing=partner.isKing()
        }

        this.town=(leader.isKing())?leader.getHouse().town : (partnerIsKing)?partner.getHouse().town : utils.getRandomArbitrary(0,dc.alivetownList.length-1);
        leader.house=this.newMember(leader)
        if(partner){
            partner.house=this.newMember(partner)
        }
    }
    dc.alivehouseList.push(this);
    lastHouseId++;

}

House.prototype.newMember= function(human){
    let formerHouse=human.getHouse()
    this.gold+=Math.round((formerHouse.gold)/10);
    formerHouse.gold=Math.round((formerHouse.gold)*9/10);
    return lastHouseId;
}
House.prototype.isEmpty= function(){
    let housekeepers=this.getHousemembers()
    if(housekeepers.length>1 || this instanceof Orphanage){
        return false;}
    return true;
}
House.prototype.inheritance= function(){
    let childs=dc.getBy("human","parents",this.leader.id);
    if(childs.length>0){
    let share=Math.round(this.gold/childs.length);
    let message=''
    let relativeArray=new Array();
    childs.forEach((element,index,childs)=> {
      element.getHouse().gold+=share;
      message+=element.display('job');
      relativeArray.push(element.id);

      if(index<childs.length-1){message+=', '}
    });
    relativeArray.push(this.leader.id);
    message+=' share an inheritance of '+this.gold+' gold from '+this.leader.display('job')
    new LogMessage("inheritance",message,relativeArray,this.town)}
    else{
        new LogMessage("inheritance",this.leader.display('job')+" dies without heritors.",[this.leader.id],this.town)
    }
    this.gold=-10000;
    return true;
}

House.prototype.payTax= function(town=''){
    //gvt taxes
    if(this.gold>100){ this.gold-=Math.floor((this.gold-100)*0.1+5); }
    else if(this.gold>20){this.gold-=Math.floor(this.gold*0.05)}

    //house taxes
    if(this.state=="noble"){this.gold-=36}
    else{this.gold-=24}
    if(this.gold<0 && this.gold>-1000 ){
        this.gold=0;
    this.robbing();}
    //state change
this.checkNobility();
    return true;
}
House.prototype.checkNobility= function(){
if(this.gold>400 && this.state=="common"){
    this.gold-=100;
    this.state="noble";
    new LogMessage("rank",this.leader.display("job")+" became a noble.",[this.leader.id],this.town)}
if(this.gold<200 && this.state=="noble"){
    this.state="common";
    new LogMessage("rank",this.leader.display("job")+" became a commoner.",[this.leader.id],this.town)}
return false;
}
House.prototype.robbing = function(){
    let robbed= world.getNobleHouse('random');
    try{
    if(robbed){
    if(0.5>Math.random())
    {this.gold+=50;robbed.gold-=50;}
    else{
    let hanged=this.getHousemembers()[0];
    if(hanged!=undefined && !(hanged.getHouse() instanceof Orphanage)){
    hanged.death();
    new LogMessage("crime",hanged.display("job")+" get hanged for robbery.",[hanged.id],this.town);}}}}
    catch(e){
    }
}

House.prototype.getHousemembers = function(year=-1){
    let myself=this;
    if(year>-1){
            let search=dc.census.human[year].filter(function(ele){ return ele.house == myself.id; })[0];
            if (search){return search;}}
    
    return dc.alivehumanList.filter(function(ele){ return ele.house == myself.id; })
}

//CLASS
function Orphanage(town){
    this.leader={
        id:1,
        surname:"none",
        getChilds:function(){return false;},
        display:function(){return false;}

    }
    this.gold=100;
    this.town=town;
    this.id=lastHouseId;
    
    dc.alivehouseList.push(this);
    lastHouseId++;

}
Orphanage.prototype = Object.create(House.prototype);
Orphanage.prototype.constructor = Orphanage;
Object.defineProperty(this, "gold", {
    get() {
      return this.gold;
    }
  });
