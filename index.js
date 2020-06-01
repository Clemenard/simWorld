/*

*/
let utils= new Utils();
let human = new Human();
let world= new World();
function oneTurn(){
    let timeLog=new LogMessage("time",world.age+" month of game. There is "+world.aliveHumanList.length+' humans.',world.age)
    $('#timelapse').html(timeLog.message);
    $('#myLogs').append(timeLog);
    world.logsList.push(timeLog);
    world.aliveHumanList.forEach(element => {
        element.getOlder();
        //marriage
        if (element.pairedWith==-1 && element.age<600 && element.age>180){
            let partner=element.getMarried();
            if(partner){
            world.logsList.push(partner.logMarriage);}
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
world.age++;
if(world.age%12==0){
    world.census.push(new Array());
    world.aliveHumanList.forEach(element => {
        world.census[world.census.length-1].push(jQuery.extend({}, element));
    });
}
 if(world.age<world.duration){
 setTimeout(oneTurn,world.frameDuration);}

}