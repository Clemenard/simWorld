//generate new world
$('#begin').click(function(){
    $('#navbar').show();
    world= new World(Number($('#age').val())*12,Number($('#pop-start').val()),Number($('#pop-max').val()),Number($('#frame-duration').val()));
    $('#myLogs').html('');
    world.census.human.push(new Array());
    world.aliveHumanList.forEach(element => {
        world.census.human[world.census.human.length-1].push(jQuery.extend({}, element));
    });
    world.census.house.push(new Array());
    world.houseList.forEach(element => {
        world.census.house[world.census.house.length-1].push(jQuery.extend({}, element));
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
    let data=''
    if($('#curve_chart').val()){
        
        $('#curve_chart').html('');
        data=world.getDataGraph([$('#chooseGraph').val()]);}
    else{
    let html='<select class="mt-3" id=chooseGraph>'
    html+='<option value="Medium Age">Medium Age</option>'
    html+='<option value="Total Money">Total Money</option>'
    html+="</select>"
    $('#myLogs').html(html)
    $('#myLogs').append('<div id="curve_chart" style="width: 900px; height: 500px"></div>');
    console.log($('#chooseGraph').val())
 data=world.getDataGraph(["Medium Age"]);}
google.charts.setOnLoadCallback(utils.drawChart(data,'Medium Age'));
})

$('body').on('click', '.link',function(){
    humanData(Number($(this).attr('value')))   
})
$('body').on('change', '#chooseGraph',function(){
console.log($('#chooseGraph').val())
let data=world.getDataGraph([$('#chooseGraph').val()]);
google.charts.setOnLoadCallback(utils.drawChart(data,'Medium Age'));
})

//get a table of all humans
$('#all-human').click(function(){
    let html=''
    let year=(Number($('#year').val())*12>world.age || Number($('#year').val())<0)?(world.age-world.age%12)/12:Number($('#year').val());
    let list=(year==(world.age-world.age%12)/12)?world.houseList:world.census.house[year];

    list=list.sort(utils.compareValues('gold', 'desc'))

    html+='<h1> Census of the year '+year+'</h1>';
    html+='<div class="row"><div id="census-table" class="col">'
    html+="<table><tr><th>Surname</th><th>Housekeeper</th><th>Other half</th><th>Childs</th><th>Gold</th></tr>";
    list.forEach(element=>{
        let father=world.getHumanById(element.leader.id,year);
        let mother=world.getHumanById(element.leader.pairedWith,year);
        let wife=''
        if(mother){wife=mother.display()}
        let childsAtHome = element.leader.getChilds("none",year).filter(function(ele){
            return (ele.home==element.id);
        });;
        var childString='';
        if(childsAtHome){  
            childsAtHome.forEach((child,index,childs)=>{
            if(child.logDay("birth")>year*12){return;}
            if(index!=0){childString+=", ";}
childString+=child.display();
        })}
        html+="<tr><td>"+father.surname+"</td>";
        html+="<td>"+father.display()+"</td>";
        html+="<td>"+wife+"</td>";
        html+="<td>"+childString+"</td>";   
        html+="<td>"+element.gold+"</td></tr>";
    })
    html+="</table></div><div class='col' id='census-stats'>";
    let mainSurnames=world.getMainFamilies(year);
    mainSurnames=utils.getSortedKeys(mainSurnames);
    html+="<h3>Most used surnames</h3>"
    for( let i=0;i<10;i++){
        let housesName = world.getHousesBySurname(mainSurnames[i].key);
        let gold=0
        housesName.forEach(house => {
           gold+=house.gold; 
        });
        html+="<p>"+(i+1)+". "+mainSurnames[i].key+" has "+mainSurnames[i].value+" members and "+gold+" gold.</p>";   
    }
    html+="</div></div>"
    html=utils.applyBBCode(html);
    $('#myLogs').html(html);
})

function humanData(id){
    try{
    let search=world.getHumanById(id);
    let maleAncestors=search.getAncestors("male",new Array());
    let femaleAncestors=search.getAncestors("female",new Array());
    let html=''
    html+='<h1>'+search.display("history")+'</h1>';
    html+="<h2> Male ancestors</h2>";
    maleAncestors.forEach(element=>{
        html+='<p>'+element.display("history")+'</p>'; 
    })
    html+="<h2> Female ancestors</h2>";
    femaleAncestors.forEach(element=>{
        html+='<p>'+element.display("history")+'</p>'; 
    })
    html+="<h2> Life history</h2>";
    search.getRelatedLogs().forEach(element=>{
        html+=element.display();  
    }) 
    if(search.getHouse(true)){
    html+="<h3>My home has "+search.getHouse().gold+" thunes.</h3>";}
    html=utils.applyBBCode(html);
    $('#myLogs').html(html);}
catch(error){
    console.log(error)
}
    
}
