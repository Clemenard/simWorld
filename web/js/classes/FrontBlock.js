function FrontBlock(){}
FrontBlock.prototype.homePanel = function(){
let html=''
html+='<div class="row justify-content-center">'
html+='<h1 class="mb-3 col-12 text-center">Settings</h1>'
html+='<div class=" col-8 row mt-5">'
html+='     <div class="form-group col-6">'
html+='            <label for="year">Number of years</label>'
html+='            <input type="number" id="age" value=100 step=1 min=1>'
html+='     </div>'
html+='     <div class="form-group col-6">'
html+='             <label for="year">Starting population</label>'
html+='             <input type="number" id="pop-start" value=200 step=1 min=100 >'
html+='     </div>'
html+='      <div class="form-group col-6">'
html+='             <label for="year">Ceiling population</label>'
html+='             <input type="number" id="pop-max" value=10000 step=1 min=100 max=1000000>'
html+='      </div>'
html+='      <button id="begin" class="ml-5">Generate a new world</button>'
html+='</div>'
html+='<h2 class="mt-5 text-center col-12">Choose your avatar</h2>'
html+='<div class="row col-8">'
html+='     <div class="form-group col-6">'
html+='             <label for="avatar-name">Name</label>'
html+='             <input type="text" id="avatar-name" value="James">'
html+='     </div >'
html+='     <div class="form-group col-6">'
html+='             <label for="avatar-surname">Surname</label>'
html+='             <input type="text" id="avatar-surname" value="Doe">'
html+='     </div >'
html+='     <div class="form-group col-6">'
html+='             <label for="avatar-sex">Sex</label>'
html+='             <select id="avatar-sex" >'
html+='             <option value="male" >Male </option>'
html+='             <option value="female" >Female </option>'
html+='             </select >'
html+='     </div >'
html+='</div>'
html+='</div>'
return html;}

FrontBlock.prototype.graphPanel = function(min=0,max=100000,interface="census",category){
    let hiddenStyle="";
    if(interface=="house"){hiddenStyle=' style="display:none;" '}
    let html='';
    if(town){
        html+='<h2 class="mt-3">City of '+dc.getOneBy('town','id',town).name+'</h2>'
    }
    html+='<select class="mt-3"'+hiddenStyle+' id=chooseGraph>'
    dc.GRAPH_CAT.forEach(cat => {
        html+='<option value="'+cat+'" ';
        if(cat==graph){
        html+='selected';}
        html+='>'+cat+'</option>' ;
    });
    html+="</select>"
    html+='<label'+hiddenStyle+'> Range of the graph : Min</label>'
    html+='<input'+hiddenStyle+' type="number" id="graph-min" value='+min+' step=1 min=0 >'
    html+='<label'+hiddenStyle+'>Max</label>'
    html+='<input '+hiddenStyle+'type="number" id="graph-max" value='+max+' step=1 min=-1 >'
    html+='<button '+hiddenStyle+' id="graph-change" class="ml-3">Update values</button>'
    html+='<div id="curve_chart" style="width: 900px; height: 500px"></div>'
    return html;}

    FrontBlock.prototype.changelog = function(){
        let html='<h1 class="mt-5">Changelog</h1>'
        html+='<h2 class="mt-3"> 6 June : Towns laws</h2>'
        html+='<ul>'
        html+='<li>- Bugfix : some houses weren\'t dissolved after death</li>'
        html+='<li>- Orphanage law to protect childs from the harsh world</li>'
        html+='<li>- Season themes</li>'
        html+='<li>- </li>'
        html+='<li>- </li>'
        html+='</ul>'
        html+='<h2 class="mt-3"> 5 June : Towns introduced</h2>'
        html+='<ul>'
        html+='<li>- X towns are create. the founder become king</li>'
        html+='<li>- town filter for logs & census</li>'
        html+='<li>- social inequalities, the noble live longer and have better jobs</li>'
        html+='<li>- kingship get inherited by the elder. if no child, genealogic search or the richest</li>'
        html+='<li>- this changelog panel</li>'
        html+='</ul>'
        return html;}