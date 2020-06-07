let town=($('#chooseTown').val()>=0)?$('#chooseTown').val():false;
let logs=($('#chooseStat').val()!="all")?$('#chooseStat').val():false;
let graph='Medium Age';

$('body').on('click', '#homepage',function(){
    $('#myLogs').html(frontBlock.homePanel());
    $('#navbar').hide();
    $('#timelapse').hide();
    if(world){
    world.frameDuration="pause";}
})
$('body').on('click', '#changelog',function(){
    $('#myLogs').html(frontBlock.changelog());
})

//generate new world
$('body').on('click', '#begin',function(){
    $('#navbar').show();
    $('#timelapse').show();
    world= new World(Number($('#age').val())*12,Number($('#pop-start').val()),Number($('#pop-max').val()));
    $('#myLogs').html('');
    dc.census.human.push(new Array());
    dc.alivehumanList.forEach(element => {
        dc.census.human[dc.census.human.length-1].push(jQuery.extend({}, element));
    });
    dc.census.house.push(new Array());
    dc.alivehouseList.forEach(element => {
        dc.census.house[dc.census.house.length-1].push(jQuery.extend({}, element));
    });
oneTurn();
})
$('body').on('click', '.timelapse',function(){
    let formerDuration=world.frameDuration
            $('.timelapse').prop('disabled', false);
            $(this).prop('disabled', true);
            switch($(this).attr('id')){
                case 'timelapse-play':  world.frameDuration=1000;$('#myLogs').css('transition','background-color 3s ease');break;
                case 'timelapse-play2':  world.frameDuration=500;$('#myLogs').css('transition','background-color 1.5s ease');break;
                case 'timelapse-play10':  world.frameDuration=100;$('#myLogs').css('transition','background-color 0.3s ease');break;
                case 'timelapse-play50':  world.frameDuration=20;$('#myLogs').css('transition','background-color 30s ease');break;
                case 'timelapse-pause':  world.frameDuration="pause";
    }
    if($(this).attr('id')!="timelapse-pause" && formerDuration=="pause"){
        oneTurn();
    }
})

//get logs for a kind of event
$('body').on('change', '#chooseStat',function(){
    logs=($('#chooseStat').val()!="all")?$('#chooseStat').val():false;
    world.page="logs"
    getLogs();
})

//get town to display stats
$('body').on('change', '#chooseTown',function(){
    town=($('#chooseTown').val()>=0)?$('#chooseTown').val():false;
    if(world.page=="logs"){
getLogs();
}
else if(world.page=="census"){
    getCensus();   
}
else if(world.page=="graphs"){
    getGraphs();   
}
})

//get data about an human defined by id
$('body').on('click', '#search-human',function(){
    world.page=Number($(this).attr('value'))
    humanData(Number($('#id-human').val())) 
})

//get data about an human by clicking on it
$('body').on('click', '.link',function(){
    world.page=Number($(this).attr('value'))
    humanData(Number($(this).attr('value')))   
})



$('body').on('click', '#graph, #graph-change',function(){
    world.page="graphs"
    getGraphs();
})
$('body').on('change', '#chooseGraph',function(){
    graph=$('#chooseGraph').val();
    world.getDataGraph(graph);

    })

//get a table of all humans
$('body').on('click', '#census',function(){
    world.page="census"
    getCensus()
})

function humanData(id){
    try{
        id=Number(id)
    let search=dc.getOneBy('human','id',id);
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
    html+="<h2 id='champcache' style='display:none;' data-id='"+id+"'>champcache</h2>";
    dc.getBy("log","related",id).forEach(element=>{
        html+=element.display();  
    }) 
    if(search.getHouse(true)){
    html+="<h3>My home has "+search.getHouse().gold+" thunes and is "+search.getHouse().state+".</h3>";}
    html=utils.applyBBCode(html);
    $('#myLogs').html(html);
    let data=world.getHouseGraph(search.id);
    let max=(search.logDay('death'))?search.logDay('death'):10000000
    let min=(search.logDay('birth'))?search.logDay('birth'):0
    let htm=frontBlock.graphPanel(min,max,"house","")
    $('#myLogs').append(htm)
 google.charts.setOnLoadCallback(utils.drawChart(data,"House"));
}
    catch(error){
        console.log(error)
    }   
}
function getLogs(){
    $('#myLogs').html('');
    dc.alivelogList.forEach(element => {
        let cTown=element.town==$('#chooseTown').val()
        let cLogs=element.type==$('#chooseStat').val()
        let condition=(Math.floor(element.age/12) == Number($('#year').val()) || Number($('#year').val())==-1)
        if (town && logs){
            condition= condition && cLogs && cTown
            }
            else if(town){
                condition= condition  && cTown
            }
            else if(logs){
            condition= condition && cLogs }
            if(condition){$('#myLogs').append(element.display());}
    });
}
function getGraphs(){
    let min=$('#graph-min').val();
    if(!min){min=0;}
    let max=$('#graph-max').val();
    if(!max){max=100000;}
    $('#myLogs').html(frontBlock.graphPanel(min,max,"census",graph))
 world.getDataGraph(graph);

}
function getCensus(){
    let html=''
    let year=(Number($('#year').val())*12>dc.age || Number($('#year').val())<0)?(dc.age-dc.age%12)/12:Number($('#year').val());
    let list=(year==(dc.age-dc.age%12)/12)?dc.alivehouseList:dc.census.house[year];
    if(town){
    list=list.filter(function(ele){return (ele.town==$('#chooseTown').val());});}
    list=list.sort(utils.compareValues('gold', 'desc'))

    if(town){
        let city=dc.getOneBy("town","id",town)
        html+='<h1> Census of the year '+year+' in '+dc.TOWN_NAME_LIST[$('#chooseTown').val()]+'</h1>';
        html+='This town is '+city.weather;
        if(city.laws.orphanage){
            let orphanage=city.getOrphanage();
            if(orphanage!=undefined){
            let orphans=orphanage.getHousemembers()
            let orphanString=''
            if(orphans){
                orphans.forEach(child => {
                    orphanString+=child.display('child')+'--';
                });
            html+=' and has an orphanage of '+orphans.length+' childs :'+orphanString;}}
            else{
                console.log("where is the orphanage?")
            }
        }
    }
        else{
            html+='<h1> Census of the year '+year+'</h1>';
        }
    html+='<div class="row"><div id="census-table" class="col">'
    html+="<table><tr><th>Surname</th><th>Housekeeper</th><th>Other half</th><th>Childs</th><th>Gold</th></tr>";
    list.forEach(element=>{
        if(!(element instanceof Orphanage)){
        let father=dc.getOneBy('human','id',element.leader.id,year);
        let mother=dc.getOneBy('human','id',element.leader.pairedWith,year);
        let wife='',husband='';
        if(mother){wife=mother.display()}
        if(father){husband=father.display()}
        let childs=dc.getBy("human","parents",element.leader.id,year)
        let childsAtHome = childs.filter(function(ele){
            return (ele.house==element.id);
        });
        var childString='';
        if(childsAtHome){  
            childsAtHome.forEach((child,index,childs)=>{
            if(child.logDay("birth")>year*12){return;}
            if(index!=0){childString+=", ";}
childString+=child.display("child");
        })}
        html+="<tr><td>"+element.leader.nobleParticle()+''+element.leader.surname+"</td>";
        html+="<td>"+husband+"</td>";
        html+="<td>"+wife+"</td>";
        html+="<td>"+childString+"</td>";   
        html+="<td>"+element.gold+"</td></tr>";}
    })
    html+="</table></div><div class='col' id='census-stats'>";
    let mainSurnames=world.countObjByArg(list,"surname",year);
    mainSurnames=utils.getSortedKeys(mainSurnames);
    html+="<h3>Most used surnames</h3>"
    for( let i=0;i<10;i++){
        let housesName = world.getHousesBySurname(mainSurnames[i].key,year);
        let gold=0
        housesName.forEach(house => {
           gold+=house.gold; 
        });
        html+="<p>"+(i+1)+". "+mainSurnames[i].key+" has "+mainSurnames[i].value+" members and "+gold+" gold.</p>";   
    }
    html+="</div></div>"
    html=utils.applyBBCode(html);
    $('#myLogs').html(html);
}
