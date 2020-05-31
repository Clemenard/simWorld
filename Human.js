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
Human.prototype.death= function(deathList){ 
    if(this.deathProbability()<this.age) {
        deathList.push(this)
        let logMessage= new LogMessage("death",this.name+" "+this.surname+", died at the age of "+Math.floor(this.age/12)+".",world.age)
        this.age=-this.age;
        return logMessage;
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
    if(this.birthProbability()>Math.random()) {
        this.childs++;
        let newborn= new Human();
        newborn.surname=this.surname;
        newborn.father=this.id;
        let logMessage= new LogMessage("birth",newborn.name+" is born from "+this.name+" "+this.surname+", who was "+Math.floor(this.age/12)+".",world.age)
        return {"newborn":newborn,"logBirth":logMessage};
    }
    return false;
}