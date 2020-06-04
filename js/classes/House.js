function House(isGenerate=false,leader){
    this.leader=leader;
    this.state="common";
    this.id=lastHouseId;
    if(isGenerate==true){
        this.gold= (leader.avatar)?utils.getRandomArbitrary(150,250):utils.getRandomArbitrary(20,250);
        leader.house=lastHouseId;
    }
    else{
        this.gold=0;
//the father give gold
leader.house=this.newMember(leader)

        //the mother give gold
        let partner=world.getHumanById(leader.pairedWith);
        if(partner){
            partner.house=this.newMember(partner)
        }
    }

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
    if(housekeepers.length>1){
        return false;}
    return true;
}
House.prototype.inheritance= function(){
    let childs=this.leader.getChilds("alive");
    if(childs.length>0){
    let share=Math.round(this.gold/childs.length);
    let message=''
    let relativeArray=new Array();
    childs.forEach((element,index,childs)=> {
      element.getHouse().gold+=share;
      message+="["+element.sex+" id="+element.id+"]"+element.name+" "+element.surname+"[/id]";
      relativeArray.push(element.id);

      if(index<childs.length-1){message+=', '}
    });
    relativeArray.push(this.leader.id);
    message+=' share an inheritance of '+this.gold+' gold from '+"["+this.leader.sex+" id="+this.leader.id+"]"+this.leader.name+" "+this.leader.surname+"[/id]"
    let logMessage= new LogMessage("inheritance",message,relativeArray)
    world.logsList.push(logMessage);}
    else{
        let logMessage= new LogMessage("inheritance","["+this.leader.sex+" id="+this.leader.id+"]"+this.leader.name+" "+this.leader.surname+"[/id] dies without heritors.",[this.leader.id])
        world.logsList.push(logMessage);
    }
    this.gold=-1;
    return true;
}

House.prototype.payTax= function(town=''){
    //gvt taxes
    if(this.gold>100){ this.gold-=Math.floor((this.gold-100)*0.1+5); }
    else if(this.gold>20){this.gold-=Math.floor(this.gold*0.05)}

    //house taxes
    if(this.state=="noble"){this.gold-=36}
    else{this.gold-=24}
    if(this.gold<0){
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
    let logMessage= new LogMessage("rank",this.leader.display("job")+" became a noble.",[this.leader.id])
    world.logsList.push(logMessage);}
if(this.gold<200 && this.state=="noble"){
    this.state="common";
    let logMessage= new LogMessage("rank",this.leader.display("job")+" became a commoner.",[this.leader.id])
    world.logsList.push(logMessage);}
return false;
}
House.prototype.robbing = function(){
    let robbed= world.getNobleHouse('random');
    try{
    if(0.5>Math.random())
    {this.gold+=50;robbed.gold-=50;}
    else{
    let hanged=this.getHousemembers()[0];
    hanged.death();
    let logMessage= new LogMessage("crime",hanged.display("job")+" get hanged for robbery.",[hanged.id]);
    world.logsList.push(logMessage);}}
    catch(e){
        console.log(e)
    }
}

House.prototype.getHousemembers = function(){
    let myself=this;
    return world.aliveHumanList.filter(function(ele){ return ele.house == myself.id; })
}