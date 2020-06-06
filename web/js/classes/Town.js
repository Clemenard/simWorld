function Town(founder){
    this.name=dc.TOWN_NAME_LIST[lastTownId];
    this.king=founder;
    this.birth=dc.age;
    this.laws={
        orphanage:(Math.random()>0.5)?true:false,
    };
    this.weather=(Math.random()>0.5)?"normal":(Math.random()>0.5)?"hot":"cold",
    this.id=lastTownId;
    $('#chooseTown').append('<option value="'+this.id+'">'+this.name+'</option>')
    lastTownId++;
    if(this.laws.orphanage){
        new Orphanage(this.id);
    }
}
Town.prototype.getOrphanage= function(){
    let myself=this;   
    return dc.alivehouseList.filter(function(ele){
        return (ele.town!=myself.id && ele instanceof Orphanage );
    })[0];
   
}

