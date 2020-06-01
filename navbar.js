//generate new world
$('#begin').click(function(){
    world= new World(Number($('#age').val()),Number($('#pop-start').val()),Number($('#pop-max').val()),Number($('#frame-duration').val()));
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

//get a table of all humans
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
