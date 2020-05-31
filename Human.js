function Human(isGenerate=false){
    if(isGenerate){
        this.age=getRandomArbitrary(0,human.AGE_MAX);
        this.childs=getRandomArbitrary(0,3);
    }
    else{
this.age=0;
this.childs=0;
    }
    this.name=this.getNamed();
    this.surname=this.getSurNamed();
    this.father="anonymous";
    this.sex=(Math.random()>0.5)?"M":"F";
    this.pairedWith=-1;

}
Human.prototype.AGE_MAX = 900;
Human.prototype.NAME_LIST = ['Pierre','Paul','Jacques','Arthur','Damien','Aziz','Mamadou','Eric','Daniel','Samuel','John',"Anttirnet", "Carnil", "Estiv", "Halt", "Hoijof", "Laen", "Lisiern", "Berin", "Ton", "Shome", "Regit",
"Lurin", "Maers", "Musten", "Oanei", "Raesh", "Terio", "Unt", "Ust", "Redik", "James", "Loki", "Tem", "Regot",
"Josh", "Tom" ,"Jei", "Lioth"];
Human.prototype.SURNAME_LIST = ["Golpeo", "Anorda", "Severnin", "Part", "Kek-vek-loah", "Vaen", "Nerivin", "Haeshi", "Vin-ti-selh","Ver-to", "Vintoret", "Da Teri", "Von Bien", "Maer", "Serisn", "Vintaren", "Bertis", "Tetirit", "Tornet", "Bellabi","Geron", "Tornes", "Gorez", "Lorez", "Gareth"];
Human.prototype.getOlder = function(){
    this.age++;}
Human.prototype.deathProbability= function(){   
    return  Math.random()*(this.AGE_MAX*10-this.age*9)*12;
}
Human.prototype.getMarried= function(){
    var myself=this;
    let partner=world.aliveHumanList.filter(function(ele){
        return (ele.sex!=myself.sex &&ele.pairedWith==-1 && ele.age<600 && ele.age>180 && ele.id!=myself.id );
    })[0];
if(partner){
    this.pairedWith=partner.id;
    partner.pairedWith=this.id;
    let husband= (this.sex=="M")?this:partner
    let wife=(this.sex=="M")?partner:this
    let logMessage= new LogMessage("marriage","<span style='color:blue;' title='id="+husband.id+"'>"+husband.name+" "+husband.surname+"</span> get married with <span style='color:pink;' title='id="+wife.id+"'>"+wife.name+" "+wife.surname+"</span>.",world.age,[husband.id,wife.id])
    wife.surname=husband.surname;
    return  {"partnerId":partner.id,"logMarriage":logMessage};}
    return false;
}
Human.prototype.death= function(deathList){ 
    if(this.deathProbability()<this.age) {
        let logWidow=false;
        deathList.push(this)
        if(this.pairedWith>0){
        let partner= this.getPartner();
        console.log(this);
        partner.pairedWith=-partner.pairedWith;
        logWidow= new LogMessage("death","<span title='id="+partner.id+"'>"+partner.name+" "+partner.surname+"</span> became a widow"+genderMark(partner.sex,"widow")+" at the age of "+Math.floor(partner.age/12)+".",world.age,[partner.id]);}
        let logDeath= new LogMessage("death","<span title='id="+this.id+"'>"+this.name+" "+this.surname+"</span> died at the age of "+Math.floor(this.age/12)+".",world.age,[this.id]);
        this.age=-this.age;
        return {'logDeath':logDeath,'logWidow':logWidow};
    }
    return false;
}
Human.prototype.birthProbability= function(){   
    return  1*(Math.min(world.maxPop*0.2/world.aliveHumanList.length,20))/(Math.abs(this.age-this.AGE_MAX/2)+1+this.childs*150);
}
Human.prototype.getNamed= function(){
    let index=Math.round(getRandomArbitrary(0,this.NAME_LIST.length-1));
    return  this.NAME_LIST[index];
}
Human.prototype.getSurNamed= function(){
    let index=Math.round(getRandomArbitrary(0,this.SURNAME_LIST.length-1));
    return  this.SURNAME_LIST[index];
}
Human.prototype.birth= function(){
    if(this.birthProbability()>Math.random() && this.pairedWith>0) {
        let partner= this.getPartner();
        if(partner){
        this.childs++;
        partner.childs++;
        let newborn= new Human();
        newborn.id=world.lastHumanId;
        world.lastHumanId++;
        newborn.surname=this.surname;
        newborn.father=this.id;
        let logMessage= new LogMessage("birth","<span title='id="+newborn.id+"'>"+newborn.name+"</span> is born from <span title='id="+this.id+"'>"+this.name+"</span> "+this.surname+", who was "+Math.floor(this.age/12)+".",world.age,[newborn.id,this.id])
        return {"newborn":newborn,"logBirth":logMessage};}
    }
    return false;
}
Human.prototype.getPartner= function(){
    let myself=this;
    return world.aliveHumanList.filter(function(ele){ return ele.id == myself.pairedWith; })[0];
}
Human.prototype.getRelatedLogs= function(){
    let myself=this;
    return world.logsList.filter(function(ele){ return ele.related.includes(myself.id); });
}