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
    if($('#chooseStat').val()=="child-number"){}
    else{
    world.logsList.forEach(element => {
        if((Math.floor(element.age/12) == Number($('#year').val()) || Number($('#year').val())==-1) && element.type==$('#chooseStat').val()){
        $('#myLogs').append(element.display()) }
    });}
})
$('#search-human').click(function(){
    $('#myLogs').html('');
    let search=world.getHumanById(Number($('#id-human').val()));
    $('#myLogs').append('<h1>'+genderMark(search.sex,"name")+' '+search.surname.toUpperCase()+" "+search.name+'</h1>');
    search.getRelatedLogs().forEach(element=>{
        $('#myLogs').append(element.display());  
    }) 
})
$('#all-human').click(function(){
    let html=''
    html+="<table><tr><th>Nom</th><th>Prénom</th><th>Age</th><th>Conjoint</th><th>Enfants</th></tr>";
    world.aliveHumanList.forEach(element=>{
        let partner=element.getPartner();
        if (partner && partner.age>=0){var partnerName="<span class='"+partner.sex+" link' value='"+partner.id+"' title='id : "+partner.id+"'>"+partner.name+"</span>";var status="";}
        else if (partner ){var partnerName="<span class='"+partner.sex+" link' value='"+partner.id+"' title='id : "+partner.id+"'>"+partner.name+"</span>";var status=", dead";}
        else {var partnerName="";var status="";}
        let childs = element.getChilds();
        var childString='';
        if(childs){     
        childs.forEach((child,index,childs)=>{
            if(index!=0){childString+=", ";}
childString+="<span class='"+child.sex+" link' value='"+child.id+"' title='id : "+child.id+"'>"+child.name+"</span>";
        })}
        html+="<tr><td class="+element.sex+">"+element.surname+"</td>";
        html+="<td class="+element.sex+">"+element.name+"</td>";
        html+="<td>"+element.getAge()+"</td>"; 
        html+="<td>"+partnerName+""+status+"</td>";   
        html+="<td>"+childString+"</td></tr>";
    })
    html+="</table>";
    $('#myLogs').html(html);
})
$('body').on('click', '.link',function(){
    $('#myLogs').html('');
    console.log(Number($(this).attr('value')));
    let search=world.getHumanById(Number($(this).attr('value')));
    $('#myLogs').append('<h1>'+genderMark(search.sex,"name")+' '+search.surname.toUpperCase()+" "+search.name+'</h1>');
    search.getRelatedLogs().forEach(element=>{
        $('#myLogs').append(element.display());  
    })   
})
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
 if(world.age<world.duration){
 setTimeout(oneTurn,world.frameDuration);}

}