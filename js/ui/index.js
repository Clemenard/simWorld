/*

*/
let lastHumanId=10;
let lastHouseId=10;
let lastTownId=0;
let world;
let dc = new DataCenter();
let utils= new Utils();
let frontBlock= new FrontBlock();

$('#myLogs').html(frontBlock.homePanel());
google.charts.load('current', {'packages':['corechart']});


function oneTurn(){
    switch(dc.age%12){
        case 2 : $('body').toggleClass('winter spring' );break;
        case 5 : $('body').toggleClass('spring summer');break;
        case 8 : $('body').toggleClass('summer fall');break;
        case 11 : $('body').toggleClass('fall winter')
    }
    let timeLog=new LogMessage("time",utils.getDate(dc.age)+". There is "+dc.alivehumanList.length+' humans.')
    $('#calendar').html(timeLog.message);
    $('#myLogs').append(timeLog);
    dc.alivehumanList.forEach(element => {
        element.getOlder();
        if(element.age==180){
            element.job=element.getJob();
        }
        //marriage
        if (element.pairedWith==-1 && element.age<600 && element.age>180){
           element.wedding();
        }
        //death
        if(element.deathProbability()<element.age &&(!(element instanceof Avatar) || element.age>620) ){
        element.death();
        }

        //birth
        if(element.age>16*12 && element.age<50*12){
        let birth=element.birth(world);
        if(birth ){
            dc.alivehumanList.push(birth);
            }}
    
});
dc.alivehumanList=dc.alivehumanList.filter(function(ele){ return ele.age >= 0; });

dc.alivehouseList=dc.alivehouseList.filter(function(ele){ 
    if(ele.isEmpty(true))
    if(ele instanceof Orphanage && ele.gold < 0){console.log("orphanage destroyed")}
    return ele.gold >= 0 && !ele.isEmpty(true); });


dc.alivetownList.forEach(town => {
    
    if(town.king.age<0){
        town.king.succession(town);}
});
dc.age++;
if(dc.age%12==0){
    world.payday();
    if($('#curve_chart').css("display")=='block' && ($('#graph-max').val()<0 || $('#graph-max').val()*12>dc.age)){
        style='census';
        if($('#champcache').html()=='champcache'){
            humanData($('#champcache').attr('data-id'))
        }
        else{
            world.getDataGraph($('#chooseGraph').val());
        }
    }
    //world.archive('human','house');
    dc.census.human.push(new Array());
    dc.census.house.push(new Array());
    dc.alivehumanList.forEach(element => {
        dc.census.human[dc.census.human.length-1].push(jQuery.extend({}, element));
    });
    dc.alivehouseList.forEach(element => {
        dc.census.house[dc.census.house.length-1].push(jQuery.extend({}, element));
    });
}
 if(dc.age<world.duration && world.frameDuration!="pause"){
 setTimeout(oneTurn,world.frameDuration);}

}