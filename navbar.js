//generate new world
$('#begin').click(function(){
    world= new World(Number($('#age').val()),Number($('#pop-start').val()),Number($('#pop-max').val()),Number($('#frame-duration').val()));
    world.census.push(new Array());
    world.aliveHumanList.forEach(element => {
        world.census[world.census.length-1].push(jQuery.extend({}, element));
    });
oneTurn();
})

//get logs for a kind of event
$('#search').click(function(){
    $('#myLogs').html('');
    if($('#chooseStat').val()=="child-number"){}
    else{
    world.logsList.forEach(element => {
        if((Math.floor(element.age/12) == Number($('#year').val()) || Number($('#year').val())==-1) && element.type==$('#chooseStat').val()){
        $('#myLogs').append(element.display()) }
    });}
})

//get data about an human defined by id
$('#search-human').click(function(){
    humanData(Number($('#id-human').val())) 
})

//get data about an human by clicking on it
$('body').on('click', '.link',function(){
    humanData(Number($(this).attr('value')))   
})
$('body').on('click', '#graph',function(){
    $('#myLogs').html('<div id="curve_chart" style="width: 900px; height: 500px"></div>');

let data=world.getMediumAgeOnTime();
google.charts.setOnLoadCallback(utils.drawChart(data,'Medium Age'));
})

//get a table of all humans
$('#all-human').click(function(){
    let html=''
    let year=(Number($('#year').val())*12>world.age || Number($('#year').val())<0)?(world.age-world.age%12)/12:Number($('#year').val());
    let list=(year==(world.age-world.age%12)/12)?world.aliveHumanList:world.census[year];
    html+='<h1> Census of the year '+year+'</h1>';
    html+='<div class="row"><div id="census-table" class="col">'
    html+="<table><tr><th>Surname</th><th>Name</th><th>Age</th><th>Conjoint</th><th>Childs</th></tr>";
    list.forEach(element=>{
        let partner=world.getHumanById(element.pairedWith);;
        if (partner && partner.age>=0){var partnerName="["+partner.sex+" id="+partner.id+"]"+partner.name+"[/id]";var status="";}
        else if (partner ){var partnerName="["+partner.sex+" id="+partner.id+"]"+partner.name+"[/id]";var status=", dead";}
        else {var partnerName="";var status="";}
        let childs = element.getChilds();
        var childString='';
        if(childs){     
        childs.forEach((child,index,childs)=>{
            if(index!=0){childString+=", ";}
childString+="["+child.sex+" id="+child.id+"]"+child.name+"[/id]";
        })}
        html+="<tr><td>["+element.sex+" id="+element.id+"]"+element.surname+"[/id]</td>";
        html+="<td>["+element.sex+" id="+element.id+"]"+element.name+"[/id]</td>";
        html+="<td>"+element.getAge()+"</td>"; 
        html+="<td>"+partnerName+""+status+"</td>";   
        html+="<td>"+childString+"</td></tr>";
    })
    html+="</table></div><div class='col' id='census-stats'>";
    let mainSurnames=world.getMainFamilies(year);
    mainSurnames=utils.getSortedKeys(mainSurnames);
    html+="<h3>Most used surnames</h3>"
    for( let i=0;i<10;i++){
        html+="<p>"+(i+1)+". "+mainSurnames[i].key+" has "+mainSurnames[i].value+" members.</p>";   
    }
    html+="</div></div>"
    html=utils.applyBBCode(html);
    $('#myLogs').html(html);
})

function humanData(id){
    $('#myLogs').html('');
    let search=world.getHumanById(id);
    let maleAncestors=search.getAncestors("male",new Array());
    let femaleAncestors=search.getAncestors("female",new Array());
    $('#myLogs').append('<h1>'+search.display()+'</h1>');
    $('#myLogs').append("<h2> Male ancestors</h2>");
    maleAncestors.forEach(element=>{
        $('#myLogs').append('<p>'+element.display()+'</p>'); 
    })
    $('#myLogs').append("<h2> Female ancestors</h2>");
    femaleAncestors.forEach(element=>{
        $('#myLogs').append('<p>'+element.display()+'</p>'); 
    })
    $('#myLogs').append("<h2> Life history</h2>");
    search.getRelatedLogs().forEach(element=>{
        $('#myLogs').append(element.display());  
    }) 
}
