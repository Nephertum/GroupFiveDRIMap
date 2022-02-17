function makeTable(data, container) {
    var cols = [];
    for (var i = 0; i < data.length; i++) {
        for (var k in data[i]) {
            if (cols.indexOf(k) === -1) {
                // Push all keys to the array
                cols.push(k);
            }
        }
    }
    // Adding the data to the table
    let newHtml = '';
    newHtml = "<table class='dataTable><tr>"

    let heading;
    for (var i = 0; i < cols.length; i++) {
        heading =  "<th>" + cols[i] + "</th>";
        newHtml += heading;
    }

    newHtml += "</tr>"

    for (var i = 0; i < data.length; i++) {
        newHtml +=  "<tr>"
        for (var j = 0; j < cols.length; j++) {
            newHtml += "<td><input id='"+container+i+j+"' value='"+data[i][cols[j]]+"'></input></td>"
        }
        newHtml += "</tr>"
    }
    newHtml += "</table>"

    document.getElementById(container).innerHTML = newHtml;
    for (let i = 0; i < data.length; i++) {
        document.getElementById(container+i+0).addEventListener('click', function (e) {
            e.preventDefault();
            console.log(e.target.id);
    })}

}

window.addEventListener('load', function(e){
let buildings;
fetch('/buildings')
    .then(response => response.json())
    .then(function (body) {
        makeTable(body, "buildingsData")
    })})

let entrances;
fetch('/entrances')
    .then(response => response.json())
    .then(function (body) {
        makeTable(body, "entrancesData")
    })
let corridors;
fetch('/corridors')
    .then(response => response.json())
    .then(function (body) {
        makeTable(body, "corridorsData")
    })
let rooms;
fetch('/rooms')
    .then(response => response.json())
    .then(function (body) {
        makeTable(body, "roomsData")
    })
let unmarkedRooms;
fetch('/unmarkedRooms')
    .then(response => response.json())
    .then(function (body) {
        makeTable(body, "unmarkedRoomsData")
    })

    