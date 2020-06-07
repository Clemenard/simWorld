function Avatar(owner,name,surname,sex){
    this.age=180;
    this.avatar=true;
        this.father="anonymous";
        this.mother="anonymous";
        this.house=0;
        this.sex=sex;
    this.name=name;
    this.ownership=[owner,owner,owner,owner,owner,owner,owner,owner]
    this.surname=surname;
    this.job=this.getJob();
    this.pairedWith=-1;
    this.childs=0;
    this.pregnancyState=0;
    this.id=lastHumanId;
    lastHumanId++;
}
Avatar.prototype = Object.create(Human.prototype);
Avatar.prototype.constructor = Avatar;