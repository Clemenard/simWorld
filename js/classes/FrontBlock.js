function FrontBlock(){}
FrontBlock.prototype.homePanel = function(){
let html='<h1 class="mb-3 text-center">Settings</h1>'
html+='<div class="row mt-5">'
html+='<div class="form-group col-6">'
html+='<label for="year">Number of years</label>'
html+='<input type="number" id="age" value=100 step=1 min=1>'
html+='</div>'
html+='<div class="form-group col-6">'
html+='<label for="year">Starting population</label>'
html+='<input type="number" id="pop-start" value=200 step=1 min=100 ></div>'
html+='<div class="form-group col-6">'
html+='<label for="year">Ceiling population</label>'
html+='<input type="number" id="pop-max" value=10000 step=1 min=100 max=1000000></div>'
html+='<button id="begin" class="ml-5">Generate a new world</button>'
html+='</div>'
return html;}

FrontBlock.prototype.graphPanel = function(min=0,max=100000,interface="census",category){
    let hiddenStyle="";
    if(interface=="house"){hiddenStyle=' style="display:none;" '}
    let html='<select class="mt-3"'+hiddenStyle+' id=chooseGraph>'
    html+='<option value="Medium Age">Medium Age</option>'
    html+='<option value="Total Money">Total Money</option>'
    html+='<option value="Total population">Total population</option>'
    html+="</select>"
    html+='<label'+hiddenStyle+'> Range of the graph : Min</label>'
    html+='<input'+hiddenStyle+' type="number" id="graph-min" value='+min+' step=1 min=0 >'
    html+='<label'+hiddenStyle+'>Max</label>'
    html+='<input '+hiddenStyle+'type="number" id="graph-max" value='+max+' step=1 min=-1 >'
    html+='<button '+hiddenStyle+' id="graph-change" class="ml-3">Update values</button>'
    html+='<div id="curve_chart" style="width: 900px; height: 500px"></div>'
    return html;}