function Human(isGenerate=false,father,mother){
    this.sex=(Math.random()>0.5)?"male":"female";
    this.name=this.getNamed();
    this.id=lastHumanId;

    if(isGenerate){
        this.surname=this.getSurNamed();
        this.age=utils.getRandomArbitrary(240,this.AGE_MAX/2);
        this.father="anonymous";
        this.mother="anonymous";
        this.job=this.getJob(false);
        this.talents=utils.racialTraits(false);
        this.stats=jQuery.extend({}, this.talents);
        this.ownership=new Array();
        for(let i=0;i<8;i++){
            this.ownership.push({id:0,trait:false}) 
        }
        this.owner={id:0,trait:false}
    }
    else{
this.age=0;
if(father){
this.father=father.id;
this.surname=father.surname;
this.house=father.house;
this.mother=mother.id;
let genes= father.ownership.concat(mother.ownership)
this.ownership=new Array();
for(let i=0;i<8;i++){
    let rand=utils.getRandomArbitrary(0,genes.length);
    this.ownership.push(genes.splice(rand,1)[0]) 
}
this.owner=utils.getOwner(this.ownership)
this.talents=utils.birthTraits(father,mother,this.owner.trait);
this.stats=[1,1,1,1,1,1];
this.job={name:"student",salary:0};
}
    }
    this.pairedWith=-1;
    this.childs=0;
    this.pregnancyState=0;
    lastHumanId++;
}
Human.prototype.AGE_MAX = 1200;
Human.prototype.getOlder = function(){
    this.age++;
    for(let i=0;i<6;i++){
        this.stats[i]+=Math.random()*this.talents[i]/100
    }
}
Human.prototype.deathProbability= function(){
    let socialFactor=(this.isNoble)?14:12
    let geneFactor=(this.stats[5]+30)/60
    let ageFactor=(this.age<360)?5:(this.age>840)?0.5:1
    return  Math.random()*(this.AGE_MAX*15-this.age*14)*socialFactor*geneFactor*ageFactor;
}
Human.prototype.weddingProbability= function(){
    let weddingChances=60
    if(this instanceof Avatar){
    weddingChances/=2;}

    return  Math.ceil(weddingChances*50/this.stats[3]);
}
Human.prototype.wedding= function(){
    try{
    var myself=this;
    let partner=dc.alivehumanList.filter(function(ele){
        return (ele.sex!=myself.sex && ele.pairedWith==-1 && ele.age<600 && ele.age>180 && ele.id!=myself.id );
    });
    partner=partner[utils.getRandomArbitrary(0,partner.length-1)]
if(partner && utils.getRandomArbitrary(0,this.weddingProbability())==1){
    this.pairedWith=partner.id;
    partner.pairedWith=this.id;
    let husband= (this.sex=="male")?this:partner
    let wife=(this.sex=="male")?partner:this
    let wifeHouse=wife.getHouse("wife")
    let bonusGold=0;
    if(wifeHouse && wifeHouse.isEmpty(false)){
        bonusGold+=wifeHouse.gold;
        wifeHouse.gold=-1;
        dc.deadhouseList.push(wifeHouse);
                }
                let husbandHouse=husband.getHouse()
    if(husbandHouse && husbandHouse.isEmpty(false)){
        bonusGold+=husbandHouse.gold;
        husbandHouse.gold=-1;
        dc.deadhouseList.push(husbandHouse);
                }
    let house=new House(false,husband);
    house.gold+=bonusGold;
    house.checkNobility();
    let checkTown=(dc.getOneBy("town","id",house.town))?dc.getOneBy("town","id",house.town).name:"unknown";
    new LogMessage("wedding",husband.display("fullname")+" get married with "+wife.display()+". They begin with "+house.gold+" gold in the city of "+checkTown+".",[husband.id,wife.id],house.town)
    wife.surname=husband.surname;
    return  true;}
    return false;}
catch(error){
    console.log("wedding "+error)
}
}
Human.prototype.death= function(){ 
    
        dc.deadhumanList.push(this);
        let house=this.getHouse()
        if(house && house.isEmpty(false)){
house.inheritance();
        }
        let partner= dc.getOneBy('human','id',this.pairedWith);
        if(this.pairedWith<-2){
            this.orphans();
        }
        else if(partner && this.pairedWith>0){
        partner.pairedWith=-partner.pairedWith;
        new LogMessage("widow",partner.display("fullname")+", became a widow"+utils.genderMark(partner.sex,"er")+" at the age of "+partner.getAge()+".",[partner.id],partner.getHouse().town);
    }
        new LogMessage("death",this.display("fullname")+", died at the age of "+this.getAge()+".",[this.id],this.getHouse().town);
        if(world.page==this.id){$('#graph-max').val(Math.floor(dc.age/12))}
        this.age=-this.age;
        return true;

}
Human.prototype.birthProbability= function(){   
    
    return  1*(Math.min(world.maxPop*0.2/dc.alivehumanList.length,20))/(Math.abs(this.age-this.AGE_MAX/2)+1+this.childs*300);
}
Human.prototype.orphans= function(){ 
    let town= dc.getOneBy("town","id",this.getHouse().town) 
    if(town.laws.orphanage){
        let myself=this
        let childs =dc.getBy("human","parents",this.id,year)
        childs.forEach(child => {
        if(child.house==myself.house && child.age<180){
            new LogMessage("orphan",child.display("fullname")+", is now in an orphanage.",[child.id],town.id);
            if(town.getOrphanage()){
child.house=town.getOrphanage().id;}
else{console.log("no orphenage")}
        }    
        });
    }
    return  1*(Math.min(world.maxPop*0.2/dc.alivehumanList.length,20))/(Math.abs(this.age-this.AGE_MAX/2)+1+this.childs*300);
}
Human.prototype.getNamed= function(){
    let nameList=(this.sex=='male')?dc.MALE_NAME_LIST:dc.FEMALE_NAME_LIST
    let index=Math.round(utils.getRandomArbitrary(0,nameList.length-1));
    return  nameList[index];
}

Human.prototype.succession= function(town){
    let successor=dc.getBy("human","parents",this.id)[0];
    if(successor==undefined){
        successor=dc.richest(town).getHousemembers()[0];}
    if(successor!=undefined){
        if(successor.getHouse().town!=town.id){
        successor.getHouse().town=town.id;}
        town.king=successor;
    new LogMessage("town",successor.display("fullname")+" became king of "+town.name+".",[successor.id,this.id],town.id)
    return true  }
    return false;
}
Human.prototype.getHouse= function(){
    let house = dc.getOneBy('house','id',this.house);
    if(house){return house;}
    else{
    let house =new House(true,this);
        return house;}
}
Human.prototype.getSurNamed= function(){
    let index=Math.round(utils.getRandomArbitrary(0,dc.SURNAME_LIST.length-1));
    return  dc.SURNAME_LIST[index];
}
Human.prototype.isKing = function(){
    let myself=this
 let town = dc.alivetownList.filter(function(ele){
     return (ele.king==myself);})

    if(town && town.length>0){
        return true;}

    return false;
}
Human.prototype.birth= function(){
    if(this.birthProbability()>Math.random() && this.pairedWith>0 && this.pregnancyState==0) {
        this.pregnancyState++;
    }
    else if(this.pregnancyState<9 && this.pregnancyState>0){
        this.pregnancyState++;   
    }
    else if(this.pregnancyState==9){
        let partner= dc.getOneBy('human','id',this.pairedWith);
        if(partner){
            let father=(this.sex=="male")? this : partner;
            let mother=(this.sex=="female")? this : partner;
            father.childs++;
            mother.childs++;
            father.pregnancyState=0;
            mother.pregnancyState=0;
        let newborn= new Human(false,father,mother);
        new LogMessage("birth",newborn.display("birth")+" is born from "+mother.display()+", and "+father.display()+".",[newborn.id,mother.id,father.id],father.getHouse().town)
        newborn.surname= father.surname;
        return newborn;}
        else{
            console.log('abortion'+this.pairedWith);
            this.pregnancyState=0;
    }
    }
        return false;
    }
Human.prototype.getAge= function(){
    return Math.floor(this.age/12);
}
Human.prototype.getJob= function(init=true){
    let job=false
    if(init){
    job= (!this.isNoble())?this.JOB_LIST[utils.getRandomArbitrary(2,this.JOB_LIST.length-1)]:this.JOB_LIST[utils.getRandomArbitrary(0,this.JOB_LIST.length-2)];}
    else{job=this.JOB_LIST[utils.getRandomArbitrary(0,this.JOB_LIST.length-1)];}
    if(job){
    new LogMessage("job",this.display('job')+" became a"+utils.aOrAn(job.name)+" "+job.name+', earning '+job.salary+' gold',[this.id],this.getHouse().town)}
    return job;
}
Human.prototype.logDay= function(type){
    let myself=this;
    let log=dc.alivelogList.filter(function(ele){ return ele.related[0]==myself.id && ele.type==type; })[0]
    if (log){
    return Math.floor(log.age/12);}
    return '';
}

Human.prototype.display= function(style="basic"){
    let html='';
    if(this.isKing()){html+='&#128081;';}
    let setClasses=(this.owner && this.owner.id>0)?'avatar'+this.owner.id+' '+this.sex:' '+this.sex;
    switch(style){
        case "history":
            html+=utils.genderMark(this.sex,"name")+' ['+setClasses+' id='+this.id+']'+this.nobleParticle().toUpperCase()+''+this.surname.toUpperCase()+" "+this.name+"[/id], "+this.logDay('birth')+"-"+this.logDay('death')
            break;
            case "birth":
            html+=' ['+setClasses+' id='+this.id+']'+this.nobleParticle().toUpperCase()+''+this.surname.toUpperCase()+" "+this.name+"[/id]"
            break;
            case "child":
            html+="["+setClasses+" id="+this.id+"]"+this.name+"[/id], "+this.getAge()
            break;
            case "fullname":
                html+= "["+setClasses+" id="+this.id+"]"+this.nobleParticle().toUpperCase()+''+this.surname.toUpperCase()+" "+this.name+"[/id], "+this.getAge()+", "+this.job.name;
            break;
            case "safename":
                html+= "["+setClasses+" id="+this.id+"]"+this.surname.toUpperCase()+" "+this.name+"[/id], "+this.getAge();
            break;
            case "job":
            html+='['+setClasses+' id='+this.id+']'+this.nobleParticle().toUpperCase()+''+this.surname.toUpperCase()+" "+this.name+"[/id] "
            break;
        default: 
        if(this.age<0){html+= "["+setClasses+" id="+this.id+"]"+this.name+"[/id]";}
        else{
        html+= "["+setClasses+" id="+this.id+"]"+this.name+"[/id], "+this.getAge()+", "+this.job.name;}
            break;}
            return html;
    }

Human.prototype.getAncestors= function(sex,array){
let idAncestor =(sex=="male")?this.father:this.mother;
let ancestor=dc.getOneBy('human','id',idAncestor);
if(ancestor){
    array.push(ancestor);    
    return ancestor.getAncestors(sex,array)
}
else{return array;}
}
Human.prototype.isNoble= function(){
    try{
    return particle= (this.getHouse().state=='noble'|| this.getHouse().state=='king')?true:false
    }
    catch(error){
        console.log(error)
        return false;
    }}

Human.prototype.nobleParticle= function(){
    return particle= (this.isNoble())?"de ":'' } 

Human.prototype.JOB_LIST = [
    {name:"bourgeois",salary:4},
    {name:"engineer",salary:3},
    {name:"technician",salary:2},
    {name:"proletarian",salary:1}]


    //CLASS
    function Avatar(owner,name,surname,sex,trait){
        this.age=180;
            this.father="anonymous";
            this.mother="anonymous";
            this.house=0;
            this.sex=sex;
        this.name=name;
        this.ownership=new Array();
        for(let i=0;i<24;i++){
            this.ownership.push({id:owner,trait:trait})
        }
        this.owner={id:owner,trait:Number(trait)};
        this.talents=utils.racialTraits(Number(trait));
        this.stats=this.talents;
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