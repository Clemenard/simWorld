/*

*/
let lastHumanId=10;
let lastHouseId=10;
let utils= new Utils();
let human = new Human();
let world= new World();
google.charts.load('current', {'packages':['corechart']});
function oneTurn(){
    let timeLog=new LogMessage("time",world.age+" month of game. There is "+world.aliveHumanList.length+' humans.')
    $('#timelapse').html(timeLog.message);
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
        let logDeath=element.death(world.deadHumanList);
        if(logDeath){
            world.logsList.push(logDeath.logDeath);
        if(logDeath.logWidow){
            world.logsList.push(logDeath.logWidow);
        }}

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
 if(world.age<world.duration){
 setTimeout(oneTurn,world.frameDuration);}

}