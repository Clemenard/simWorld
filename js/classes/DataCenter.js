function DataCenter(){
    this.alivehumanList=new Array();
    this.deadhumanList=new Array();
    this.alivehouseList=new Array();
    this.deadhouseList=new Array();
    this.alivetownList=new Array();
    this.deadtownList=new Array();
    this.alivelogList=new Array();
    this.deadlogList=new Array();
    this.userList=new Array();
    this.census={"human":new Array(),"house":new Array()};
    this.age=0;
    this.pseudo="Booba"
    this.townsNumber=10;

}
DataCenter.prototype.getOneBy= function(obj,arg,value,year=-1){
    let search=false;
    if(year>-1){
        search=dc.census[`${obj}`][year].filter(function(ele){
             return ele[`${arg}`] == value; })[0];
        if (search){return search;}
    }
    else{
        let list=dc[`alive${obj}List`].concat(dc[`dead${obj}List`]);
        search=list.filter(function(ele){ 
            return ele[`${arg}`] == value; })[0];
        if (search){return search;}
    }
        return null;
}

DataCenter.prototype.getBy= function(obj,arg,value,year=-1){
    let search=false;
    if(year>-1){
        search=dc.census[`${obj}`][year].filter(function(ele){
            if(arg=="parents"){return ele.father==value || ele.mother==value;}
            else{
            return ele[`${arg}`] == value; }});
        if (search){return search;}
    }
    else{
        let list=dc[`alive${obj}List`].concat(dc[`dead${obj}List`]);
        search=list.filter(function(ele){
            if(arg=="related"){return ele[`${arg}`].includes(value);}
            if(arg=="parents"){return ele.father==value || ele.mother==value;}
            else {
                if(/(.+?)\.(.+)/.test(arg)){
                    let tabMatch=arg.match(/(.+?)\.(.+)/)
                    return ele[`${tabMatch[1]}`][`${tabMatch[2]}`] == value;}
                else{
             return ele[`${arg}`] == value; }}});
        if (search){return search;}
    }
        return null;
}
DataCenter.prototype.richest= function(town){
    let towns=dc.alivehouseList.filter(function(ele){ return ele.town == town.id; });
    return towns.reduce((accumulator, currentValue) => {
        return accumulator.gold > currentValue.gold ? accumulator : currentValue;},{gold:-100});
}
DataCenter.prototype.TOWN_NAME_LIST = ['Paris',    'Marseille',    'Lyon',    'Nice',    'Lille',    'Rennes',    'Nantes',    'Angers',    'Strasbourg',    'Poitiers',    'Angouleme',    'Grenoble',    'Amiens',    'Rouen',    'Caen',    'Bordeau',    'Pau',    'Montpellier',    'Narbonne',    'Orange',    'Avignon',    'Limoges'];
DataCenter.prototype.GENE_NAME_LIST = ['crazy',    'logical',    'healthy',    'sickly',    'handsome',    'ugly',    'cunning',    'naive',    'smart',    'dull',    'curious',    'indifferent',    'ermit',    'sociable',    'patient',    'ambitious',    'humble',    'calm',    'angry',    'talkative',    'silent',    'go genius'];
DataCenter.prototype.GRAPH_CAT = ['Medium Age',    'Total Money',    'Total Population'];

DataCenter.prototype.SURNAME_LIST = ['Martin',
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
'Allard',
'Le Calvé',
'Labouret',
'Corneggia',
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
DataCenter.prototype.FEMALE_NAME_LIST = ['Emma',    'Jade',    'Louise',    'Alice',    'Chloé',    'Lina',    'Léa',    'Rose',    'Anna',    'Mila',    'Inès',    'Ambre',    'Julia',    'Mia',    'Léna',    'Manon',    'Juliette',    'Lou',    'Camille',    'Zoé',    'Lola',    'Agathe',    'Jeanne',    'Lucie',    'Éva',    'Nina',    'Sarah',    'Romane',    'Inaya',    'Charlotte',    'Léonie',    'Romy',    'Adèle',    'Iris',    'Louna',    'Sofia',    'Margaux',    'Luna',    'Olivia',    'Clémence',    'Victoria',    'Léana',    'Clara',    'Éléna',    'Victoire',    'Aya',    'Margot',    'Nour',    'Giulia',    'Charlie',    'Capucine',    'Mya',    'Mathilde',    'Lana',    'Anaïs',    'Lilou',    'Alicia',    'Théa',    'Gabrielle',    'Lya',    'Yasmine',    'Maëlys',    'Assia',    'Apolline',    'Élise',    'Alix',    'Emy',    'Lise',    'Elsa',    'Lily',    'Lyana',    'Lisa',    'Noémie',    'Marie',    'Roxane',    'Lyna',    'Héloïse',    'Candice',    'Valentine',    'Zélie',    'Maya',    'Soline',    'Maria',    'Célia',    'Maëlle',    'Emmy',    'Éléna',    'Faustine',    'Salomé',    'Lila',    'Louane',    'Alya',    'Thaïs',    'Constance',    'Laura',    'Mélina',    'Livia',    'Amelia',    'Océane',    'Sara']
DataCenter.prototype.MALE_NAME_LIST = ['Gabriel',    'Raphaël',    'Léo',    'Louis',    'Lucas',    'Adam',    'Arthur',    'Jules',    'Hugo',    'Maël',    'Liam',    'Ethan',    'Paul',    'Nathan',    'Gabin',    'Sacha',    'Noah',    'Tom',    'Mohamed',    'Aaron',    'Théo',    'Noé',    'Victor',    'Martin',    'Mathis',    'Timéo',    'Nolan',    'Enzo',    'Éden',    'Axel',    'Antoine',    'Léon',    'Marius',    'Robin',    'Valentin',    'Clément',    'Baptiste',    'Tiago',    'Rayan',    'Samuel',    'Amir',    'Augustin',    'Naël',    'Maxime',    'Maxence',    'Gaspard',    'Eliott',    'Alexandre',    'Isaac',    'Mathéo',    'Yanis',    'Évan',    'Simon',    'Malo',    'Nino',    'Marceau',    'Kylian',    'Thomas',    'Ibrahim',    'Imran',    'Ayden',    'Lenny',    'Camille',    'Lyam',    'Kaïs',    'Oscar',    'Naïm',    'Sohan',    'Côme',    'Milo',    'Noa',    'Ilyes',    'Noam',    'Diego',    'Ismaël',    'Léandre',    'Soan',    'Mathys',    'Alexis',    'Lorenzo',    'Esteban',    'Owen',    'Youssef',    'Ilyan',    'William',    'Adrien',    'Ayoub',    'Jean',    'David',    'Ali',    'Adem',    'Wassim',    'Logan',    'Sandro',    'Pablo',    'Antonin',    'Joseph',    'Benjamin',    'Noham',    'Kenzo'];