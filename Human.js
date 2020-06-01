function Human(isGenerate=false){
    if(isGenerate){
        this.age=getRandomArbitrary(0,human.AGE_MAX);
    }
    else{
this.age=0;
    }
    this.name=this.getNamed();
    this.surname=this.getSurNamed();
    this.father="anonymous";
    this.mother="anonymous";
    this.sex=(Math.random()>0.5)?"M":"F";
    this.pairedWith=-1;
    this.childs=0;

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
        return (ele.sex!=myself.sex && ele.pairedWith==-1 && ele.age<600 && ele.age>180 && ele.id!=myself.id );
    });
    partner=partner[getRandomArbitrary(0,partner.length-1)]
if(partner && getRandomArbitrary(0,12)==1){
    this.pairedWith=partner.id;
    partner.pairedWith=this.id;
    let husband= (this.sex=="M")?this:partner
    let wife=(this.sex=="M")?partner:this
    let logMessage= new LogMessage("marriage","[male id="+husband.id+"]"+husband.name+" "+husband.surname+"[/id] get married with [female id="+wife.id+"]"+wife.name+" "+wife.surname+"[/id].",world.age,[husband.id,wife.id])
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
        partner.pairedWith=-partner.pairedWith;
        logWidow= new LogMessage("death","[ id="+partner.id+"]"+partner.name+" "+partner.surname+"[/id] became a widow"+genderMark(partner.sex,"widow")+" at the age of "+partner.getAge()+".",world.age,[partner.id]);}
        let logDeath= new LogMessage("death","[ id="+this.id+"]"+this.name+" "+this.surname+"[/id] died at the age of "+this.getAge()+".",world.age,[this.id]);
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
            let father=(this.sex=="M")? this : partner;
            let mother=(this.sex=="F")? this : partner;
            father.childs++;
            mother.childs++;
        let newborn= new Human();
        newborn.id=world.lastHumanId;
        world.lastHumanId++;
        newborn.surname= father.surname;
        let sexClass=(newborn.sex=="M")? "male" : "female";
        let logMessage= new LogMessage("birth","["+sexClass+" id="+newborn.id+"]"+newborn.name+"[/id] is born from [female id="+mother.id+"]"+mother.name+" "+mother.surname+"[/id], who was "+mother.getAge()+" and [male id="+father.id+"]"+father.name+" "+father.surname+"[/id], who was "+father.getAge()+".",world.age,[newborn.id,mother.id,father.id])
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
Human.prototype.getAge= function(){
    return Math.floor(this.age/12);
}