/*

*/
let lastHumanId=10;
let lastHouseId=10;
let utils= new Utils();
let human = new Human();
let world= new World();
let frontBlock= new FrontBlock();

$('#myLogs').html(frontBlock.homePanel());
google.charts.load('current', {'packages':['corechart']});


function oneTurn(){
    let timeLog=new LogMessage("time",utils.getDate(world.age)+". There is "+world.aliveHumanList.length+' humans.')
    $('#calendar').html(timeLog.message);
    $('#myLogs').append(timeLog);
    world.logsList.push(timeLog);
    world.aliveHumanList.forEach(element => {
        element.getOlder();
        if(element.age==180){
            element.job=element.getJob();
        }
        //marriage
        if (element.pairedWith==-1 && element.age<600 && element.age>180){
           element.wedding();
        }
        //death
        if(element.deathProbability()<element.age &&(!element.avatar || element.age>620) ){
        element.death();
        }

        //birth
        if(element.age>16*12 && element.age<50*12){
        let birth=element.birth(world);
        if(birth){
            world.logsList.push(birth.logBirth);
            world.aliveHumanList.push(birth.newborn);
            }}
    
});
world.aliveHumanList=world.aliveHumanList.filter(function(ele){ return ele.age >= 0; });
world.houseList=world.houseList.filter(function(ele){ return ele.gold >= 0; });
world.age++;
if(world.age%12==0){
    world.payday();
    if($('#curve_chart').css("display")=='block' && ($('#graph-max').val()<0 || $('#graph-max').val()*12>world.age)){
        style='census';
        if($('#champcache').html()=='champcache'){
            console.log($('#champcache').attr('data-id'))
            humanData($('#champcache').attr('data-id'))
        }
        else{
            let data=world.getDataGraph($('#chooseGraph').val());
            let title=$('#chooseGraph').val()
             google.charts.setOnLoadCallback(utils.drawChart(data,title));
        }
    }
    //world.archive('human','house');
    world.census.human.push(new Array());
    world.census.house.push(new Array());
    world.aliveHumanList.forEach(element => {
        world.census.human[world.census.human.length-1].push(jQuery.extend({}, element));
    });
    world.houseList.forEach(element => {
        world.census.house[world.census.house.length-1].push(jQuery.extend({}, element));
    });
}
 if(world.age<world.duration && world.frameDuration!="pause"){
 setTimeout(oneTurn,world.frameDuration);}

}