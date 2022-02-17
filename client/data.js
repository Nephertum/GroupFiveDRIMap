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
    // Make a table
    let newHtml = '';
    newHtml = "<table class='dataTable'><tr>"

    // Add headings
    let heading;
    for (var i = 0; i < cols.length; i++) {
        heading = "<th>" + cols[i] + "</th>"; // Headings for each key
        newHtml += heading;
    }
    newHtml += "<th></th>" // Heading for delete buttons
    newHtml += "</tr>"

    // Add data as changeable inputs
    for (var i = 0; i < data.length; i++) {
        newHtml += "<tr>"
        for (var j = 0; j < cols.length; j++) {
            newHtml += "<td><input id='" + container + i + j + "' value='" + data[i][cols[j]] + "'></input></td>"
        }
        newHtml += '<td><i class="fa-solid fa-circle-xmark dataDltBtn" id="delete'+container+i+'"></i></td>' // Delete button
        newHtml += "</tr>"
    }
    newHtml+= "<tr>"
    for (var j = 0; j < cols.length; j++){
        newHtml += "<td></td>"
    }
    newHtml+= '<td><i class="fa-solid fa-circle-plus dataPlusBtn" id="plus'+container+i+'"></i></td></tr>'
    newHtml += "</table>"

    // Add table to document
    document.getElementById(container).innerHTML = newHtml;

    // Add event listeners that change the background // colour when a value is changed
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < cols.length; j++) {
            document.getElementById(container + i + j).addEventListener('input', function (e) {
                e.preventDefault();
                box = document.getElementById(e.target.id)
                if (box.value != box.defaultValue) {
                    box.style.backgroundColor = "#FDCFF3";
                }
                else {
                    box.style.backgroundColor = "transparent";
                }
            })
        }
    }
}

window.addEventListener('load', function (e) {
    fetch('/buildings')
        .then(response => response.json())
        .then(function (body) {
            makeTable(body, "buildingsData")
        })
    fetch('/entrances')
        .then(response => response.json())
        .then(function (body) {
            makeTable(body, "entrancesData")
        })
    fetch('/corridors')
        .then(response => response.json())
        .then(function (body) {
            makeTable(body, "corridorsData")
        })
    fetch('/rooms')
        .then(response => response.json())
        .then(function (body) {
            makeTable(body, "roomsData")
        })
    fetch('/unmarkedRooms')
        .then(response => response.json())
        .then(function (body) {
            makeTable(body, "unmarkedRoomsData")
        })
})
