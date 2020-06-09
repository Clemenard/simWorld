function FrontBlock() {}
FrontBlock.prototype.homePanel = function () {
    let html = ''

    html += '<div class="row justify-content-center">'
    html += '<h1 class="mb-3 col-12 text-center">Settings</h1>'
    html += '<div class=" col-8 row mt-5 ">'
    html += '     <div class="form-group col-6 inner-block">'
    html += '            <label for="year">Your pseudo</label>'
    html += '            <input type="text" id="pseudo" placeholder="Booba" ><br>'
    html += '      <button id="begin" class="ml-5">Generate a new world</button>'
    html += '     </div>'
    html += '     <div class="form-group col-6 row inner-block">'
    html += '             <h3 class="col-12">Racial trait</h3>'
    html += '             <p class="avatar-trait col-4" >Your specialty is </p>'
    html += '             <select id="avatar-spec" >'
    html += '             <option value=1 >Intelligence </option>'
    html += '             <option value=2 >Wisdom </option>'
    html += '             <option value=3 >Dexterity </option>'
    html += '             <option value=4 >Charisma </option>'
    html += '             <option value=5 >Luck </option>'
    html += '             <option value=6 >Constitution </option>'
    html += '             </select >'
    html += '     </div>'
    html += '</div>'
    html += '<div class="row col-8 inner-block">'
    html += '<h2 class="mt-3 text-center col-12 avatar10">Choose your avatar</h2>'
    html += '     <div class="form-group col-6">'
    html += '             <label for="avatar-name">Name</label>'
    html += '             <input type="text" id="avatar-name" value="James">'
    html += '     </div >'
    html += '     <div class="form-group col-6">'
    html += '             <label for="avatar-surname">Surname</label>'
    html += '             <input type="text" id="avatar-surname" value="Doe">'
    html += '     </div >'
    html += '     <div class="form-group col-12">'
    html += '             <label for="avatar-sex">Sex</label>'
    html += '             <select id="avatar-sex" >'
    html += '             <option value="male" >Male </option>'
    html += '             <option value="female" >Female </option>'
    html += '             </select >'
    html += '     </div>'
    html += '</div>'
    html += '     <div class="form-group col-8 row mt-5 inner-block text-center">'
    html += '             <h3 class="mt-3 col-12 avatar11">Your rival : Lebogossdu49</h3>'
    html += '             <p id="rival-spec col-4" id="av-for" value="4">Your rival specialty is charisma </p>'
    html += '<div class="row col-8">'
    html += '     <div class="form-group col-3">'
    html += '             <label >Name : </label>'
    html += '             <strong>Lara</strong>'
    html += '     </div >'
    html += '     <div class="form-group col-3">'
    html += '             <label >Surname : </label>'
    html += '             <strong>Croft</strong>'
    html += '     </div >'
    html += '     <div class="form-group col-3">'
    html += '             <label >Sex : </label>'
    html += '             <strong>Female</strong>'
    html += '     </div>'
    html += '</div>'
    html += '     </div>'
    html += '</div>'
    return html;
}

FrontBlock.prototype.graphPanel = function (min = 0, max = 100000, interface = "census", category) {
    let hiddenStyle = "";
    if (interface == "house") {
        hiddenStyle = ' style="display:none;" '
    }
    let html = '';
    html += '<select class="mt-3"' + hiddenStyle + ' id=chooseGraph>'
    dc.GRAPH_CAT.forEach(cat => {
        html += '<option value="' + cat + '" ';
        if (cat == graph) {
            html += 'selected';
        }
        html += '>' + cat + '</option>';
    });
    html += "</select>"
    html += '<label' + hiddenStyle + '> Range of the graph : Min</label>'
    html += '<input' + hiddenStyle + ' type="number" id="graph-min" value=' + min + ' step=1 min=0 >'
    html += '<label' + hiddenStyle + '>Max</label>'
    html += '<input ' + hiddenStyle + 'type="number" id="graph-max" value=' + max + ' step=1 min=-1 >'
    html += '<button ' + hiddenStyle + ' id="graph-change" class="ml-3">Update values</button>'
    html += '<div id="curve_chart" style="width: 900px; height: 500px"></div>'
    return html;
}

FrontBlock.prototype.changelog = function () {

    let html = '<h1 class="mt-5">Changelog</h1>'
    html += '<h2 class="mt-3"> 7 June : Genetic & rivals</h2>'
    html += '<ul>'
    html += '<li>- Now each human are bounded to 6 talents</li>'
    html += '<li>- Stats grow depending on the talent with age</li>'
    html += '<li>- A rival has appeared! who will have the biggest clan? </li>'
    html += '<li>- Use for stat will appear soon...</li>'
    html += '</ul>'
    html += '<h2 class="mt-3"> 6 June : Towns laws</h2>'
    html += '<ul>'
    html += '<li>- Bugfix : some houses weren\'t dissolved after death</li>'
    html += '<li>- Orphanage law to protect childs from the harsh world</li>'
    html += '<li>- Season themes</li>'
    html += '<li>- Town filters for graphs, but they make things laggy</li>'
    html += '</ul>'
    html += '<h2 class="mt-3"> 5 June : Towns introduced</h2>'
    html += '<ul>'
    html += '<li>- X towns are create. the founder become king</li>'
    html += '<li>- town filter for logs & census</li>'
    html += '<li>- social inequalities, the noble live longer and have better jobs</li>'
    html += '<li>- kingship get inherited by the elder. if no child, genealogic search or the richest</li>'
    html += '<li>- this changelog panel</li>'
    html += '</ul>'
    return html;
}

FrontBlock.prototype.statDisplay = function (human) {
    let maleAncestors = human.getAncestors("male", new Array());
    let femaleAncestors = human.getAncestors("female", new Array());
    let html = ''
    html += '<h1 class="justify-content-center  d-flex ">' + human.display("history") + '</h1>';
    html += '     <div class=" row">'
    html += '     <div class="form-group col-6 row mt-2">'
    html += '             <h3 class="col-12  d-flex justify-content-center">Stats</h3>'
    html += '             <p class="avatar-trait col-4" id="av-for">Intelligence <br><strong> ' + Math.floor(human.stats[0]) + '</strong></p>'
    html += '             <p class="avatar-trait col-4" id="av-end">Wisdom <br><strong> ' + Math.floor(human.stats[1]) + '</strong></p>'
    html += '             <p class="avatar-trait col-4" id="av-agi">Dexterity <br><strong> ' + Math.floor(human.stats[2]) + '</strong></p>'
    html += '             <p class="avatar-trait col-4" id="av-dex">Charisma <br><strong> ' + Math.floor(human.stats[3]) + '</strong></p>'
    html += '             <p class="avatar-trait col-4" id="av-int">Luck <br><strong> ' + Math.floor(human.stats[4]) + '</strong></p>'
    html += '             <p class="avatar-trait col-4" id="av-sag">Constitution <br><strong> ' + Math.floor(human.stats[5]) + '</strong></p>'
    html += '     </div>'
    html += '     <div class="form-group col-6 row mt-2" style="border-left:solid 3px black;">'
    html += '             <h3 class="col-12 d-flex justify-content-center">Genes</h3>'
    let mainGenes = human.getMainGenes()
    mainGenes = utils.getSortedKeys(mainGenes);
    for (let i = 0; i < 4; i++) {
        html += '             <p class="avatar-trait col-3" > ' + mainGenes[i].key + '</strong></p>'
    }
    html += '     </div>'
    html += '     </div>'

    html += "<h2> Life history</h2>";
    html += "<h2 id='champcache' style='display:none;' data-id='" + human.id + "'>champcache</h2>";
    dc.getBy("log", "related", human.id).forEach(element => {
        html += element.display();
    })
    if (human.getHouse(true) && human.getHouse().gold >= 0) {
        html += "<h3 class='mt-2'>My home has " + human.getHouse().gold + " thunes and is " + human.getHouse().state + ".</h3>";
    }

    html += "<h2 class='mt-2'> Male ancestors</h2>";
    maleAncestors.forEach(element => {
        html += '<p>' + element.display("history") + '</p>';
    })
    html += "<h2 class='mt-2'> Female ancestors</h2>";
    femaleAncestors.forEach(element => {
        html += '<p>' + element.display("history") + '</p>';
    })

    html = utils.applyBBCode(html);
    return html;
}

FrontBlock.prototype.userDisplay = function (user) {
    let html = "<p> You have " + dc.userList[0].gp + " genetic points.</p>"
    html += "<h2 class='mt-2'> People of the " + dc.userList[0].pseudo + " clan.</h2>"
    let minions = dc.getBy("human", "owner.id", user)
    minions.forEach(m => {
        if (m.age > 0) {
            html += "<p>" + m.display("fullname") + "</p>"
        }
    });
    html = utils.applyBBCode(html)
    return html
}