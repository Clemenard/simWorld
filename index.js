/*

*/
let human = new Human();
var world= new World();
$('#begin').click(function(){
    world= new World(Number($('#age').val()),Number($('#pop-start').val()),Number($('#pop-max').val()),Number($('#frame-duration').val()));
oneTurn();
})
$('#search').click(function(){
    $('#myLogs').html('');
    console.log(Number($('#year').val()));
    console.log($('#chooseStat').val());
    world.logsList.forEach(element => {
        if((Math.floor(element.age/12) == Number($('#year').val()) || Number($('#year').val())==-1) && element.type==$('#chooseStat').val()){
        $('#myLogs').append("<strong>"+element.age%12+"th month of the "+Math.floor(element.age/12)+" year</strong> : "+element.message+"<br>") }
    });
})
function oneTurn(){
    console.log(world.age+" month of game. There is "+world.aliveHumanList.length+' humans.')
    world.aliveHumanList.forEach(element => {
        element.getOlder();
        let logDeath=element.death(world.deadHumanList);
        if(logDeath){world.logsList.push(logDeath);}
        if(element.age>16*12 && element.age<50*12){
        let birth=element.birth(world);
        if(birth){
            world.logsList.push(birth.logBirth);
            birth.newborn.id=world.lastHumanId;
            world.aliveHumanList.push(birth.newborn);
            world.lastHumanId++;}}
    
});
world.aliveHumanList=world.aliveHumanList.filter(function(ele){ return ele.age >= 0; });
world.age++;
 if(world.age<world.duration){
 setTimeout(oneTurn,world.frameDuration);}
 else{
     console.log(world.logsList)
 }

}