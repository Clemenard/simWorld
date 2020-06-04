function Human(isGenerate=false,father,mother){
    if(isGenerate){
        this.age=utils.getRandomArbitrary(240,human.AGE_MAX/2);
        this.father="anonymous";
        this.mother="anonymous";
        this.job=this.getJob();
        this.house=0;
    }
    else{
this.age=0;
if(father){
this.father=father.id;
this.house=father.house;
this.mother=mother.id;
this.job={name:"student",salary:0};}
    }
    this.sex=(Math.random()>0.5)?"male":"female";
    this.name=this.getNamed();
    this.surname=this.getSurNamed();
    this.pairedWith=-1;
    this.childs=0;
    this.pregnancyState=0;
    this.id=lastHumanId;
    lastHumanId++;
}
Human.prototype.AGE_MAX = 1200;
Human.prototype.getOlder = function(){
    this.age++;}
Human.prototype.deathProbability= function(){   
    return  Math.random()*(this.AGE_MAX*15-this.age*14)*12;
}
Human.prototype.wedding= function(){
    try{
    var myself=this;
    let partner=world.aliveHumanList.filter(function(ele){
        return (ele.sex!=myself.sex && ele.pairedWith==-1 && ele.age<600 && ele.age>180 && ele.id!=myself.id );
    });
    partner=partner[utils.getRandomArbitrary(0,partner.length-1)]
if(partner && utils.getRandomArbitrary(0,60)==1){
    this.pairedWith=partner.id;
    partner.pairedWith=this.id;
    let husband= (this.sex=="male")?this:partner
    let wife=(this.sex=="male")?partner:this
    
    let wifeHouse=wife.getHouse()
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
    world.houseList.push(house);
    let logMessage= new LogMessage("wedding",husband.display("fullname")+" get married with "+wife.display()+". They begin with "+house.gold+" gold.",[husband.id,wife.id])
    world.logsList.push(logMessage);
    wife.surname=husband.surname;
    return  true;}
    return false;}
catch(error){
    let logMessage= new LogMessage("error",error,[])
    world.logsList.push(logMessage);
}
}
Human.prototype.death= function(){ 
    try{
        let logWidow=false;
        world.deadHumanList.push(this);
        let house=this.getHouse(true)
        if(house && house.isEmpty()){
house.inheritance();
        }
        if(this.pairedWith>0){
        let partner= world.getHumanById(this.pairedWith);
        partner.pairedWith=-partner.pairedWith;
        logWidow= new LogMessage("widow",partner.display("fullname")+", became a widow"+utils.genderMark(partner.sex,"er")+" at the age of "+partner.getAge()+".",[partner.id]);
        world.logsList.push(logWidow);
    }
        let logDeath= new LogMessage("death",this.display("fullname")+", died at the age of "+this.getAge()+".",[this.id]);
        if(world.page==this.id){$('#graph-max').val(Math.floor(world.age/12))}
        world.logsList.push(logDeath);
        this.age=-this.age;
        return true;
}catch(error){
        console.log(error)
        return false;
    }
}
Human.prototype.birthProbability= function(){   
    
    return  1*(Math.min(world.maxPop*0.2/world.aliveHumanList.length,20))/(Math.abs(this.age-this.AGE_MAX/2)+1+this.childs*300);
}
Human.prototype.getNamed= function(){
    let nameList=(this.sex=='male')?this.MALE_NAME_LIST:this.FEMALE_NAME_LIST
    let index=Math.round(utils.getRandomArbitrary(0,nameList.length-1));
    return  nameList[index];
}
Human.prototype.getHouse= function(stat=false){
    let myself=this;
    let house = world.houseList.filter(element => {return myself.house==element.id;})[0]
    if(house){return house;}
if(stat){return false}
    throw new Error(world.age+" month : The house of "+this.id+" don't exist : "+this.house)
}
Human.prototype.getSurNamed= function(){
    let index=Math.round(utils.getRandomArbitrary(0,this.SURNAME_LIST.length-1));
    return  this.SURNAME_LIST[index];
}
Human.prototype.birth= function(){
    if(this.birthProbability()>Math.random() && this.pairedWith>0 && this.pregnancyState==0) {
        this.pregnancyState++;
    }
    else if(this.pregnancyState<9 && this.pregnancyState>0){
        this.pregnancyState++;   
    }
    else if(this.pregnancyState==9){
        let partner= world.getHumanById(this.pairedWith);;
        if(partner){
            let father=(this.sex=="male")? this : partner;
            let mother=(this.sex=="female")? this : partner;
            father.childs++;
            mother.childs++;
            father.pregnancyState=0;
            mother.pregnancyState=0;
        let newborn= new Human(false,father,mother);
        newborn.surname= father.surname;
        let logMessage= new LogMessage("birth",newborn.display("birth")+" is born from "+mother.display()+", and "+father.display()+".",[newborn.id,mother.id,father.id])
        return {"newborn":newborn,"logBirth":logMessage};}}
        return false;
    }

Human.prototype.getChilds= function(state="none",year=-1){
    let myself=this;
    if(state=="alive"){
        return world.aliveHumanList.filter(function(ele){ return (ele.father == myself.id || ele.mother == myself.id) ; });}
        if(year>-1){
            let search=world.census.human[year].filter(function(ele){ return (ele.father == myself.id || ele.mother == myself.id); });
    if (search){return search;}}
    let humanList=world.aliveHumanList.concat(world.deadHumanList);
    return humanList.filter(function(ele){ return (ele.father == myself.id || ele.mother == myself.id) ; });
}
Human.prototype.getRelatedLogs= function(){
    let myself=this;
    return world.logsList.filter(function(ele){
        return ele.related.includes(myself.id);

     });
}
Human.prototype.getAge= function(){
    return Math.floor(this.age/12);
}
Human.prototype.getJob= function(){
    let job=this.JOB_LIST[utils.getRandomArbitrary(0,this.JOB_LIST.length-1)]
    if(this.job){
    let logMessage= new LogMessage("job",this.display('job')+" became a"+utils.aOrAn(job.name)+" "+job.name+', earning '+job.salary+' gold',[this.id])
    world.logsList.push(logMessage);}
    return job;
}
Human.prototype.logDay= function(type){
    let myself=this;
    let log=world.logsList.filter(function(ele){ return ele.related[0]==myself.id && ele.type==type; })[0]
    if (log){
    return Math.floor(log.age/12);}
    return '';
}

Human.prototype.display= function(style="basic"){
    let html='';
    switch(style){
        case "history":
            html=utils.genderMark(this.sex,"name")+' ['+this.sex+' id='+this.id+']'+this.isNoble().toUpperCase()+''+this.surname.toUpperCase()+" "+this.name+"[/id], "+this.logDay('birth')+"-"+this.logDay('death')
            break;
            case "birth":
            html=' ['+this.sex+' id='+this.id+']'+this.isNoble().toUpperCase()+''+this.surname.toUpperCase()+" "+this.name+"[/id]"
            break;
            case "child":
            html="["+this.sex+" id="+this.id+"]"+this.name+"[/id], "+this.getAge()
            break;
            case "fullname":
                html= "["+this.sex+" id="+this.id+"]"+this.isNoble().toUpperCase()+''+this.surname.toUpperCase()+" "+this.name+"[/id], "+this.getAge()+", "+this.job.name;
            break;
            case "job":
            html='['+this.sex+' id='+this.id+']'+this.isNoble().toUpperCase()+''+this.surname.toUpperCase()+" "+this.name+"[/id] "
            break;
        default: 
        html= "["+this.sex+" id="+this.id+"]"+this.name+"[/id], "+this.getAge()+", "+this.job.name;
            if(this.age<0){html= "["+this.sex+" id="+this.id+"]"+this.name+"[/id]";}
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
Human.prototype.isNoble= function(){try{
    return particle= (this.getHouse().state=='noble')?"de ":''
    }
    catch(error){
        let logMessage= new LogMessage("error",error,[])
        world.logsList.push(logMessage);
        return '';
    }}

Human.prototype.JOB_LIST = [
    {name:"boss",salary:4},
    {name:"engineer",salary:3},
    {name:"technician",salary:2},
    {name:"proletarian",salary:1}]

Human.prototype.SURNAME_LIST = ['Martin',
'Bernard',
'Thomas',
'Petit',
'Robert',
'Richard',
'Durand',
'Dubois',
'Moreau',
'Laurent',
'Simon',
'Michel',
'Lefebvre',
'Leroy',
'Roux',
'David',
'Bertrand',
'Morel',
'Fournier',
'Girard',
'Bonnet',
'Dupont',
'Lambert',
'Fontaine',
'Rousseau',
'Vincent',
'Muller',
'Lefevre',
'Faure',
'Andre',
'Mercier',
'Blanc',
'Guerin',
'Boyer',
'Garnier',
'Chevalier',
'Francois',
'Legrand',
'Gauthier',
'Garcia',
'Perrin',
'Robin',
'Clement',
'Morin',
'Nicolas',
'Henry',
'Roussel',
'Mathieu',
'Gautier',
'Masson',
'Marchand',
'Duval',
'Denis',
'Dumont',
'Marie',
'Lemaire',
'Noel',
'Meyer',
'Dufour',
'Meunier',
'Brun',
'Blanchard',
'Giraud',
'Joly',
'Riviere',
'Lucas',
'Brunet',
'Gaillard',
'Barbier',
'Arnaud',
'Martinez',
'Gerard',
'Roche',
'Renard',
'Schmitt',
'Roy',
'Leroux',
'Colin',
'Vidal',
'Caron',
'Picard',
'Roger',
'Fabre',
'Aubert',
'Lemoine',
'Renaud',
'Dumas',
'Lacroix',
'Olivier',
'Philippe',
'Bourgeois',
'Pierre',
'Benoit',
'Rey',
'Leclerc',
'Payet',
'Rolland',
'Leclercq',
'Guillaume',
'Lecomte',
'Lopez',
'Jean',
'Dupuy',
'Guillot',
'Hubert',
'Berger',
'Carpentier',
'Sanchez',
'Dupuis',
'Moulin',
'Louis',
'Deschamps',
'Huet',
'Vasseur',
'Perez',
'Boucher',
'Fleury',
'Royer',
'Klein',
'Jacquet',
'Adam',
'Paris',
'Poirier',
'Marty',
'Aubry',
'Guyot',
'Carre',
'Charles',
'Renault',
'Charpentier',
'Menard',
'Maillard',
'Baron',
'Bertin',
'Bailly',
'Herve',
'Schneider',
'Fernandez',
'Le Gall',
'Collet',
'Leger',
'Bouvier',
'Julien',
'Prevost',
'Millet',
'Perrot',
'Daniel',
'Le Roux',
'Cousin',
'Germain',
'Breton',
'Besson',
'Langlois',
'Remy',
'Le Goff',
'Pelletier',
'Leveque',
'Perrier',
'Leblanc',
'Barre',
'Lebrun',
'Marchal',
'Weber',
'Mallet',
'Hamon',
'Boulanger',
'Jacob',
'Monnier',
'Michaud',
'Rodriguez',
'Guichard',
'Gillet',
'Etienne',
'Grondin',
'Poulain',
'Tessier',
'Chevallier',
'Collin',
'Chauvin',
 'Da Silva',
'Bouchet',
'Gay',
'Lemaitre',
'Benard',
'Marechal',
'Humbert',
'Reynaud',
'Antoine',
'Hoarau',
'Perret',
'Barthelemy',
'Cordier',
'Pichon',
'Lejeune',
'Gilbert',
'Lamy',
'Delaunay',
'Pasquier',
'Carlier',
'Laporte'];
Human.prototype.FEMALE_NAME_LIST = ['Emma',    'Jade',    'Louise',    'Alice',    'Chloé',    'Lina',    'Léa',    'Rose',    'Anna',    'Mila',    'Inès',    'Ambre',    'Julia',    'Mia',    'Léna',    'Manon',    'Juliette',    'Lou',    'Camille',    'Zoé',    'Lola',    'Agathe',    'Jeanne',    'Lucie',    'Éva',    'Nina',    'Sarah',    'Romane',    'Inaya',    'Charlotte',    'Léonie',    'Romy',    'Adèle',    'Iris',    'Louna',    'Sofia',    'Margaux',    'Luna',    'Olivia',    'Clémence',    'Victoria',    'Léana',    'Clara',    'Éléna',    'Victoire',    'Aya',    'Margot',    'Nour',    'Giulia',    'Charlie',    'Capucine',    'Mya',    'Mathilde',    'Lana',    'Anaïs',    'Lilou',    'Alicia',    'Théa',    'Gabrielle',    'Lya',    'Yasmine',    'Maëlys',    'Assia',    'Apolline',    'Élise',    'Alix',    'Emy',    'Lise',    'Elsa',    'Lily',    'Lyana',    'Lisa',    'Noémie',    'Marie',    'Roxane',    'Lyna',    'Héloïse',    'Candice',    'Valentine',    'Zélie',    'Maya',    'Soline',    'Maria',    'Célia',    'Maëlle',    'Emmy',    'Éléna',    'Faustine',    'Salomé',    'Lila',    'Louane',    'Alya',    'Thaïs',    'Constance',    'Laura',    'Mélina',    'Livia',    'Amelia',    'Océane',    'Sara']
Human.prototype.MALE_NAME_LIST = ['Gabriel',    'Raphaël',    'Léo',    'Louis',    'Lucas',    'Adam',    'Arthur',    'Jules',    'Hugo',    'Maël',    'Liam',    'Ethan',    'Paul',    'Nathan',    'Gabin',    'Sacha',    'Noah',    'Tom',    'Mohamed',    'Aaron',    'Théo',    'Noé',    'Victor',    'Martin',    'Mathis',    'Timéo',    'Nolan',    'Enzo',    'Éden',    'Axel',    'Antoine',    'Léon',    'Marius',    'Robin',    'Valentin',    'Clément',    'Baptiste',    'Tiago',    'Rayan',    'Samuel',    'Amir',    'Augustin',    'Naël',    'Maxime',    'Maxence',    'Gaspard',    'Eliott',    'Alexandre',    'Isaac',    'Mathéo',    'Yanis',    'Évan',    'Simon',    'Malo',    'Nino',    'Marceau',    'Kylian',    'Thomas',    'Ibrahim',    'Imran',    'Ayden',    'Lenny',    'Camille',    'Lyam',    'Kaïs',    'Oscar',    'Naïm',    'Sohan',    'Côme',    'Milo',    'Noa',    'Ilyes',    'Noam',    'Diego',    'Ismaël',    'Léandre',    'Soan',    'Mathys',    'Alexis',    'Lorenzo',    'Esteban',    'Owen',    'Youssef',    'Ilyan',    'William',    'Adrien',    'Ayoub',    'Jean',    'David',    'Ali',    'Adem',    'Wassim',    'Logan',    'Sandro',    'Pablo',    'Antonin',    'Joseph',    'Benjamin',    'Noham',    'Kenzo'];