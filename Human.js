function Human(isGenerate=false,father,mother){
    if(isGenerate){
        this.age=getRandomArbitrary(0,human.AGE_MAX);
        this.father="anonymous";
        this.mother="anonymous";
    }
    else{
this.age=0;
if(father){
this.father=father.id;
this.mother=mother.id;}
    }
    this.sex=(Math.random()>0.5)?"male":"female";
    this.name=this.getNamed();
    this.surname=this.getSurNamed();
    this.pairedWith=-1;
    this.childs=0;
    this.pregnancyState=0;

}
Human.prototype.AGE_MAX = 900;
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
    let husband= (this.sex=="male")?this:partner
    let wife=(this.sex=="male")?partner:this
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
        logWidow= new LogMessage("death","[ id="+partner.id+"]"+partner.name+" "+partner.surname+"[/id] became a widow"+genderMark(partner.sex,"er")+" at the age of "+partner.getAge()+".",world.age,[partner.id]);}
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
    let nameList=(this.sex=='male')?this.MALE_NAME_LIST:this.FEMALE_NAME_LIST
    let index=Math.round(getRandomArbitrary(0,nameList.length-1));
    return  nameList[index];
}
Human.prototype.getSurNamed= function(){
    let index=Math.round(getRandomArbitrary(0,this.SURNAME_LIST.length-1));
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
        let partner= this.getPartner();
        if(partner){
            let father=(this.sex=="male")? this : partner;
            let mother=(this.sex=="female")? this : partner;
            father.childs++;
            mother.childs++;
            father.pregnancyState=0;
            mother.pregnancyState=0;
        let newborn= new Human(false,father,mother);
        newborn.id=world.lastHumanId;
        world.lastHumanId++;
        newborn.surname= father.surname;
        let logMessage= new LogMessage("birth","["+newborn.sex+" id="+newborn.id+"]"+newborn.name+"[/id] is born from [female id="+mother.id+"]"+mother.name+" "+mother.surname+"[/id], who was "+mother.getAge()+" and [male id="+father.id+"]"+father.name+" "+father.surname+"[/id], who was "+father.getAge()+".",world.age,[newborn.id,mother.id,father.id])
        return {"newborn":newborn,"logBirth":logMessage};}}
        return false;
    }

Human.prototype.getPartner= function(){
    let myself=this;
    let humanList=world.aliveHumanList.concat(world.deadHumanList);
    return humanList.filter(function(ele){ return ele.id == myself.pairedWith; })[0];
}
Human.prototype.getChilds= function(){
    let myself=this;
    let humanList=world.aliveHumanList.concat(world.deadHumanList);
    return humanList.filter(function(ele){ return ele.father == myself.id ; });
}
Human.prototype.getRelatedLogs= function(){
    let myself=this;
    return world.logsList.filter(function(ele){ return ele.related.includes(myself.id); });
}
Human.prototype.getAge= function(){
    return Math.floor(this.age/12);
}
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