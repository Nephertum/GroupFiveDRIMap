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
    // Create a table element
    var table = document.createElement("table");
    table = document.createElement('table');
    table.className = "dataTable";
    // Create table row tr element of a table
    var tr = table.insertRow(-1);
    for (var i = 0; i < cols.length; i++) {
        // Create the table header th element
        var theader = document.createElement("th");
        theader.innerHTML = cols[i];
        // Append columnName to the table row
        tr.appendChild(theader);
    }
    // Adding the data to the table
    for (var i = 0; i < data.length; i++) {

        // Create a new row
        trow = table.insertRow(-1);
        for (var j = 0; j < cols.length; j++) {
            var cell = trow.insertCell(-1);

            // Inserting the cell at particular place
            cell.innerHTML = data[i][cols[j]];
        }
    }
    // Add the newly created table containing json data
    var el = document.getElementById(container);
    el.innerHTML = "";
    el.appendChild(table);
}

let buildings;
fetch('/buildings')
    .then(response => response.json())
    .then(function (body) {
        makeTable(body, "buildingsData")
    })
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
