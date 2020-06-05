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
    let timeLog=new LogMessage("time",utils.getDate(dc.age)+". There is "+dc.aliveHumanList.length+' humans.')
    $('#calendar').html(timeLog.message);
    $('#myLogs').append(timeLog);
    dc.aliveHumanList.forEach(element => {
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
            dc.aliveHumanList.push(birth);
            }}
    
});
dc.aliveHumanList=dc.aliveHumanList.filter(function(ele){ return ele.age >= 0; });
dc.houseList=dc.houseList.filter(function(ele){ return ele.gold >= 0; });
dc.townList.forEach(town => {
    if(town.king.age<0){town.king.succession(town);}
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
            let data=world.getDataGraph($('#chooseGraph').val());
            let title=$('#chooseGraph').val()
             google.charts.setOnLoadCallback(utils.drawChart(data,title));
        }
    }
    //world.archive('human','house');
    dc.census.human.push(new Array());
    dc.census.house.push(new Array());
    dc.aliveHumanList.forEach(element => {
        dc.census.human[dc.census.human.length-1].push(jQuery.extend({}, element));
    });
    dc.houseList.forEach(element => {
        dc.census.house[dc.census.house.length-1].push(jQuery.extend({}, element));
    });
}
 if(dc.age<world.duration && world.frameDuration!="pause"){
 setTimeout(oneTurn,world.frameDuration);}

}