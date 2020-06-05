function Human(isGenerate=false,father,mother){
    this.sex=(Math.random()>0.5)?"male":"female";
    this.name=this.getNamed();
    this.id=lastHumanId;

    if(isGenerate){
        this.surname=this.getSurNamed();
        this.age=utils.getRandomArbitrary(240,this.AGE_MAX/2);
        this.avatar=false;
        this.father="anonymous";
        this.mother="anonymous";
        this.job=this.getJob(false);
    }
    else{
this.age=0;
if(father){
this.father=father.id;
this.surname=father.surname;
this.house=father.house;
this.mother=mother.id;
this.job={name:"student",salary:0};
this.avatar=(father.avatar||mother.avatar)?true:false;
}
    }
    this.pairedWith=-1;
    this.childs=0;
    this.pregnancyState=0;
    lastHumanId++;
}
Human.prototype.AGE_MAX = 1200;
Human.prototype.getOlder = function(){
    this.age++;}
Human.prototype.deathProbability= function(){
    let socialFactor=(this.isNoble)?14:12
    return  Math.random()*(this.AGE_MAX*15-this.age*14)*socialFactor;
}
Human.prototype.wedding= function(){
    try{
    var myself=this;
    let partner=dc.aliveHumanList.filter(function(ele){
        return (ele.sex!=myself.sex && ele.pairedWith==-1 && ele.age<600 && ele.age>180 && ele.id!=myself.id );
    });
    partner=partner[utils.getRandomArbitrary(0,partner.length-1)]
if(partner && utils.getRandomArbitrary(0,60)==1){
    this.pairedWith=partner.id;
    partner.pairedWith=this.id;
    let husband= (this.sex=="male")?this:partner
    let wife=(this.sex=="male")?partner:this
    let wifeHouse=wife.getHouse("wife")
    let bonusGold=0;
    if(wifeHouse && wifeHouse.isEmpty()){
        bonusGold+=wifeHouse.gold;
        wifeHouse.gold=-1;
                }
                let husbandHouse=husband.getHouse()
    if(husbandHouse && husbandHouse.isEmpty()){
        bonusGold+=husbandHouse.gold;
        husbandHouse.gold=-1;
                }
    let house=new House(false,husband);
    house.gold+=bonusGold;
    house.checkNobility();
    let checkTown=(dc.getTown(house.town)!=undefined)?dc.getTown(house.town).name:"unknown";
    new LogMessage("wedding",husband.display("fullname")+" get married with "+wife.display()+". They begin with "+house.gold+" gold in the city of "+checkTown+".",[husband.id,wife.id],house.town)
    wife.surname=husband.surname;
    return  true;}
    return false;}
catch(error){
    console.log("wedding "+error)
}
}
Human.prototype.death= function(){ 
    try{
        dc.deadHumanList.push(this);
        let house=this.getHouse(true)
        if(house && house.isEmpty()){
house.inheritance();
        }
        let partner= world.getHumanById(this.pairedWith);
        if(this.pairedWith<-2){
            this.orphans();
        }
        else if(partner && this.pairedWith>0){
        let partner= world.getHumanById(this.pairedWith);
        partner.pairedWith=-partner.pairedWith;
        new LogMessage("widow",partner.display("fullname")+", became a widow"+utils.genderMark(partner.sex,"er")+" at the age of "+partner.getAge()+".",[partner.id],partner.getHouse().town);
    }
        new LogMessage("death",this.display("fullname")+", died at the age of "+this.getAge()+".",[this.id],this.getHouse().town);
        if(world.page==this.id){$('#graph-max').val(Math.floor(dc.age/12))}
        this.age=-this.age;
        return true;
}catch(error){
        console.log("death : "+error)
        return false;
    }
}
Human.prototype.birthProbability= function(){   
    
    return  1*(Math.min(world.maxPop*0.2/dc.aliveHumanList.length,20))/(Math.abs(this.age-this.AGE_MAX/2)+1+this.childs*300);
}
Human.prototype.orphans= function(){ 
    let town= dc.getTown(this.getHouse().town) 
    if(town.laws.orphanage){
        let myself=this
        let childs =myself.getChilds('alive')
        childs.forEach(child => {
        if(child.house==myself.house && child.age<180){
            new LogMessage("orphan",child.display("fullname")+", is now in an orphanage.",[child.id],town.id);
child.house=town.getOrphanage().id;
        }    
        });

    }
    return  1*(Math.min(world.maxPop*0.2/dc.aliveHumanList.length,20))/(Math.abs(this.age-this.AGE_MAX/2)+1+this.childs*300);
}
Human.prototype.getNamed= function(){
    let nameList=(this.sex=='male')?dc.MALE_NAME_LIST:dc.FEMALE_NAME_LIST
    let index=Math.round(utils.getRandomArbitrary(0,nameList.length-1));
    return  nameList[index];
}

Human.prototype.succession= function(town){
    let successor=this.getChilds('alive')[0]
    if(successor==undefined){successor=dc.richest(town).getHousemembers()[0];}
    if(successor!=undefined){
        if(successor.getHouse().town!=town.id){
        successor.getHouse().town=town.id;}
        town.king=successor;
    new LogMessage("town",successor.display("fullname")+" became king of "+town.name+".",[successor.id,this.id],town.id)
    return true  }
    return false;
}
Human.prototype.getHouse= function(stat){
    let myself=this;
    let house = dc.houseList.filter(element => {return myself.house==element.id;})[0]
    if(house!=undefined){return house;}
    else{
    let house =new House(true,myself);
        return house;}
}
Human.prototype.getSurNamed= function(){
    let index=Math.round(utils.getRandomArbitrary(0,dc.SURNAME_LIST.length-1));
    return  dc.SURNAME_LIST[index];
}
Human.prototype.isKing = function(){
    let myself=this
 let town = dc.townList.filter(function(ele){
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
        let partner= world.getHumanById(this.pairedWith);
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

Human.prototype.getChilds= function(state="none",year=-1){
    let myself=this;
    if(state=="alive"){
        return dc.aliveHumanList.filter(function(ele){ return (ele.father == myself.id || ele.mother == myself.id) ; });}
        if(year>-1){
            let search=dc.census.human[year].filter(function(ele){ return (ele.father == myself.id || ele.mother == myself.id); });
    if (search){return search;}}
    let humanList=dc.aliveHumanList.concat(dc.deadHumanList);
    return humanList.filter(function(ele){ return (ele.father == myself.id || ele.mother == myself.id) ; });
}
Human.prototype.getRelatedLogs= function(){
    let myself=this;
    return dc.logsList.filter(function(ele){
        return ele.related.includes(myself.id);

     });
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
    let log=dc.logsList.filter(function(ele){ return ele.related[0]==myself.id && ele.type==type; })[0]
    if (log){
    return Math.floor(log.age/12);}
    return '';
}

Human.prototype.display= function(style="basic"){
    let html='';
    if(this.isKing()){html+='&#128081;';}
    let setClasses=(this.avatar)?'avatar '+this.sex:' '+this.sex;
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
let ancestor=world.getHumanById(idAncestor);
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
    function Avatar(){
        this.age=180;
        this.avatar=true;
            this.father="anonymous";
            this.mother="anonymous";
            this.house=0;
            this.sex=$('#avatar-sex').val();
        this.name=$('#avatar-name').val();
        this.surname=$('#avatar-surname').val();
        this.job=this.getJob();
        this.pairedWith=-1;
        this.childs=0;
        this.pregnancyState=0;
        this.id=lastHumanId;
        lastHumanId++;
    }
    Avatar.prototype = Object.create(Human.prototype);
    Avatar.prototype.constructor = Avatar;