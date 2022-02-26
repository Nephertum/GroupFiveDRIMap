// THESE FIRST FUNCTIONS ARE JUST FOR SHORTENING CODE
function getCols(data) {
    var cols = [];
    for (var i = 0; i < data.length; i++) {
        for (var k in data[i]) {
            if (cols.indexOf(k) === -1) {
                // Push all keys to the array
                cols.push(k);
            }
        }
    }
    return cols;
}

function getCategory(letter) {
    let category;
    if (letter == "a") {
        category = "archive"
    }
    else if (letter == "b") {
        category = "building"
    }
    else if (letter == "c") {
        category = "corridor"
    }
    else if (letter == "r") {
        category = "room"
    }
    else if (letter == "e") {
        category = "entrance"
    }
    return category
}

// FOLLOWING TWO FUNCTIONS MAKE THE TABLES ON THE PAGE
// type variable should be the first letter of the ids, e.g "b" for buildings
function makeTable(data, type, container) {
    if (data.length == 0) {
        container.innerHTML = "Currently empty"
        return;
    }
    var cols = getCols(data);
    // Make a table
    let newHtml = '';
    let tableName = container + 'Tbl'
    newHtml = "<table class='dataTable' id='" + tableName + "'><tr>"

    // Add headings
    let heading;
    for (var i = 0; i < cols.length; i++) {
        heading = "<th>" + cols[i] + "</th>"; // Headings for each key
        newHtml += heading;
    }
    newHtml += "<th></th>" // Heading for delete buttons
    newHtml += "</tr>"

    // Add data as changeable inputs
    let id;
    let property;
    let rowName;
    let inputName;
    let deleteBtnName;
    for (var i = 0; i < data.length; i++) {
        id = data[i].id;
        rowName = "row" + data[i].id
        newHtml += "<tr id='" + rowName + "'>"
        for (var j = 0; j < cols.length; j++) {
            property = cols[j]
            inputName = id + '-' + property
            if (property == "id") {
                newHtml += "<td><p id='" + inputName + "'>" + data[i][cols[j]] + "</p></td>"
            }
            else {
                newHtml += "<td><input id='" + inputName + "' value='" + data[i][cols[j]] + "'></input></td>"
            }
        }
        // Add delete button
        deleteBtnName = "delete" + id;
        newHtml += '<td><i class="fa-solid fa-circle-xmark dataDltBtn" id="' + deleteBtnName + '"></i></td>'
        newHtml += "</tr>"
    }

    // Add an add button
    let addRowName = "addRow" + container
    let addBtnName = "plus" + container
    newHtml += "<tr>"
    for (var j = 0; j < cols.length; j++) {
        newHtml += "<td></td>"
    }
    newHtml += '<td id="' + addRowName + '"><i class="fa-solid fa-circle-plus dataPlusBtn" id="' + addBtnName + '"></i></td></tr>'

    // Add table to document
    newHtml += "</table>"
    document.getElementById(container).innerHTML = newHtml;

    // Add event listeners that change the background colour when a value is changed
    // and store the change in the global array
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < cols.length; j++) {
            id = data[i].id;
            property = cols[j]
            checkChange(id + '-' + property);
        }
    }
    // Add event listeners that delete the row when cross clicked,
    // after a confirmation message is sent
    for (let i = 0; i < data.length; i++) {
        id = data[i].id
        enableDeleteButton('delete' + id);
    }
    // Add event listeners that add a new row when plus button is clicked
    document.getElementById('plus' + container).addEventListener('click', function (e) {
        let container = e.target.id.slice(4);
        tableId = container + 'Tbl';
        type = tableId.charAt(0);
        id = 'new' + numberOfNewObjs + type;
        console.log(id);

        console.log('New ' + id)
        newRowName = "row" + id
        newRow = "<tr id='" + newRowName + "'>";
        for (var j = 0; j < cols.length; j++) {
            if (cols[j] == 'id') {
                newRow += "<td><p id='" + id + '-' + 'id' + "'>tbd</p></td>";
            }
            else {
                property = cols[j];
                inputName = id + '-' + property;
                newRow += "<td><input class='changedValue' id='" + inputName + "''></input></td>";
            }
        }
        deleteBtnName = "delete" + id;
        newRow += '<td><i class="fa-solid fa-circle-xmark dataDltBtn" id="' + deleteBtnName + '"></i></td>'; // Delete button
        newRow += "</tr>";
        document.getElementById('addRow' + container).parentElement.insertAdjacentHTML('beforebegin', newRow);
        enableDeleteButton(deleteBtnName);
        change = 'New row ' + newRowName;
        changes.push(change);
        numberOfNewObjs += 1;
    });
}

// type variable should be the first letter of the ids, e.g "b" for buildings
function makeArchiveTable(data, container) {
    if (data.length == 0) {
        container.innerHTML = "Currently empty"
    }
    var cols = ["id", "name"];

    // Make a table
    let newHtml = '';
    let tableName = container + 'Tbl'
    newHtml = "<table class='dataTable' id='" + tableName + "'><tr>"

    // Add headings
    let heading;
    for (var i = 0; i < cols.length; i++) {
        heading = "<th>" + cols[i] + "</th>"; // Headings for each key
        newHtml += heading;
    }
    newHtml += "<th>View Info</th>" // Heading for view info buttons
    newHtml += "<th></th>" // Heading for delete buttons
    newHtml += "<th></th>" // Heading for restore buttons
    newHtml += "</tr>"

    // Add data as unchangeable text
    let id;
    let property;
    let rowName;
    let textName;
    let btnName;
    for (var i = 0; i < data.length; i++) {
        id = data[i].id;
        rowName = "row" + data[i].id
        newHtml += "<tr id='" + rowName + "'>"
        for (var j = 0; j < cols.length; j++) {
            property = cols[j]
            textName = id + '-' + property
            newHtml += "<td><p id='" + textName + "'>" + data[i][cols[j]] + "</p></td>"
        }
        btnName = "view" + id;
        newHtml += '<td><i class="fas fa-eye dataViewBtn" id="' + btnName + '"></i></td>' // View info button
        btnName = "delete" + id;
        newHtml += '<td><i class="fa-solid fa-circle-xmark dataDltBtn" id="' + btnName + '"></i></td>' // Delete button
        btnName = "restore" + id;
        newHtml += '<td><i class="fa-solid fa-trash-arrow-up dataRestoreBtn" id="' + btnName + '"></i></td>' // Restore button
        newHtml += "</tr>"
    }

    // Add table to document
    newHtml += "</table>"
    document.getElementById(container).innerHTML = newHtml;

    // Enable buttons
    for (var i = 0; i < data.length; i++) {
        id = data[i].id;
        // delete
        btnName = "delete" + id;
        enableDeleteButton(btnName);
        // view
        btnName = "view" + id;
        enableViewButton(btnName);
        // restore
        btnName = "restore" + id;
        enableRestoreButton(btnName);
    }
}

// FOLLOWING FUNCTIONS ENABLE BUTTONS IN THE TABLES
function enableDeleteButton(id) {
    document.getElementById(id).addEventListener('click', function (e) {
        e.preventDefault();
        let id = e.target.id.slice(6);
        let checkType = id.charAt(0);
        let rowId = "row" + e.target.id.slice(6);
        if (checkType == 'a' || checkType == 'n') {
            functionConfirm("Are you sure you want to delete this? (Note new or already-archived objects cannot be archived)",
                function del() {
                    document.getElementById(rowId).remove();
                    changes.push('Deleted ' + id)
                });
        }
        else {
            functionConfirm("Are you sure you want to delete this?",
                function del() {
                    document.getElementById(rowId).remove();
                    changes.push('Deleted ' + id)
                },
                function archive() {
                    archiveTbl = document.getElementById("archiveDataTbl")
                    if (!archiveTbl) {
                        // Make the archive table
                    }
                    let elName = document.getElementById(id + "-name").value;
                    let type = document.getElementById(id + "-id").innerHTML.charAt(0);

                    let oldId = id;
                    elNewId = 'a' + numberofNewArchives + type;
                    numberofNewArchives += 1;

                    let rowName = "row" + oldId
                    let newRow = "<tr id='" + rowName + "'>"
                    // Add id
                    textName = oldId + '-' + oldId;
                    newRow += "<td><p id='" + textName + "'>tbd</p></td>";
                    // Add name
                    textName = oldId + '-' + elName;
                    newRow += "<td><p id='" + textName + "'>" + elName + "</p></td>";
                    // Add view button
                    let btnName = "view" + oldId;
                    newRow += '<td><i class="fas fa-eye dataViewBtn" id="' + btnName + '"></i></td>'
                    // Add delete button
                    btnName = "delete" + oldId;
                    newRow += '<td><i class="fa-solid fa-circle-xmark dataDltBtn" id="' + btnName + '"></i></td>'
                    // Add restore button
                    btnName = "restore" + oldId;
                    newRow += '<td><i class="fa-solid fa-trash-arrow-up dataRestoreBtn" id="' + btnName + '"></i></td>'
                    newRow += "</tr>"

                    document.getElementById(rowId).remove();

                    archiveTbl.insertAdjacentHTML('beforeend', newRow);
                    enableDeleteButton("delete" + oldId);
                    enableViewButton("view" + oldId);
                    enableRestoreButton("restore" + oldId);
                    changes.push(id + ' archived');
                });
        }
    })
}

function enableViewButton(id) {
    document.getElementById(id).addEventListener("click", function (e) {
        elId = e.target.id.substring(4);
        popup(elId);
    })
}

function enableRestoreButton(id) {
    document.getElementById(id).addEventListener("click", function (e) {
        let elId = e.target.id.substring(7);
        let type = elId.charAt(0);
        let category = getCategory(type);
        let origType = type;
        let newIdText = elId;
        let classes = ""
        if (type == 'a') {
            origType = elId.charAt(elId.length - 1);
            newIdText = 'tbd';
            classes = "changedValue";
            changes.push(elId + ' restored');
        }
        else{
            removeChange = elId + ' archived';
            changes = changes.filter(function (e) { return e !== removeChange });
        }
        origCategory = getCategory(origType);

        let tblName = origCategory + 'DataTbl'
        tbl = document.getElementById(tblName);
        let container = origCategory + 'Data'

        fetch('/info/' + category + '/' + elId)
            .then(response => response.json())
            .then(function (body) {
                cols = getCols([body]);
                rowName = "row" + body.id;
                newRow = "<tr id='" + rowName + "'>";
                for (var j = 0; j < cols.length; j++) {
                    property = cols[j];
                    inputName = elId + '-' + property;
                    if (property == "id") {
                        newRow += "<td><p id='" + inputName + "'>" + newIdText + "</p></td>"
                    }
                    else {
                        newRow += "<td><input class='"+ classes + "' id='" + inputName + "' value='" + body[cols[j]] + "'></input></td>";
                    }
                }
                // Add delete button
                deleteBtnName = "delete" + elId;
                newRow += '<td><i class="fa-solid fa-circle-xmark dataDltBtn" id="' + deleteBtnName + '"></i></td>'
                newRow += "</tr>"
                document.getElementById(rowName).remove();
                document.getElementById('addRow' + container).parentElement.insertAdjacentHTML('beforebegin', newRow);
                enableDeleteButton(deleteBtnName);
            })

        alert('Restored');
    })
}

// FUNCTIONS FOR SAVING CHANGES
function checkChange(id) {
    document.getElementById(id).addEventListener('input', function (e) {
        e.preventDefault();
        box = document.getElementById(e.target.id)
        change = box.id + ' value altered';
        changes = changes.filter(function (e) { return e !== change });
        if (box.value != box.defaultValue) {
            box.className += " changedValue";
            changes.push(change);
        }
        else {
            box.classList.remove("changedValue");
        }
    })
}
function logout() {
    fetch("/logout",{
        credentials: 'include'
    })
    .then (response => {
        if (response.ok) {
            window.location.href="http://127.0.0.1:3000"
        }
    })
}
function signup() {
    const username = prompt("enter username for new staff member")
    const password = prompt("enter password for new staff member")
    const message = {username, password}
    fetch("/signup",{
        method: 'POST',
        headers : {
            'Content-Type' : 'application/json'
        },
        credentials: 'include',
        body : JSON.stringify(message)
    })
    .then(response => {
        if (response.ok) {
            alert("account created")
        } else {
            alert("error in account creation")
        }
    })
}

function saveChanges() {
    alert("Changes: " + changes)
    // Will go through changes and post them all
}

// FOLLOWING FUNCTIONS MAKE POPUP BOXES
function functionConfirm(msg, del, archive, cancel) {
    var confirmBox = $("#confirm");
    confirmBox.find(".message").text(msg);
    confirmBox.find(".confirmDelete,.confirmArchive,.confirmCancel").unbind().click(function () {
        confirmBox.hide();
    });
    confirmBox.find(".confirmDelete").click(del);
    if (archive != undefined) {
        confirmBox.find(".confirmArchive").click(archive);
        confirmBox.find(".confirmArchive").show();
    }
    else {
        confirmBox.find(".confirmArchive").hide();
    }
    confirmBox.find(".confirmCancel").click(cancel);
    confirmBox.show();
}

function msgAndCancel(msg, cancel) {
    var infoBox = $("#info");
    infoBox.find(".message").text(msg);
    infoBox.find(".confirmCancel").unbind().click(function () {
        infoBox.hide();
    });
    infoBox.find(".confirmCancel").click(cancel);
    infoBox.show();
}

function popup(id) {
    let type = id.charAt(0);
    category = getCategory(type);
    console.log(id, category)
    fetch('/info/' + category + '/' + id)
        .then(response => response.json())
        .then(function (body) {
            let send = JSON.stringify(body);
            msgAndCancel(send);
        })
}

// ON LOAD, MAKE ALL THE TABLES
window.addEventListener('load', function (e) {
    // Global storage
    numberOfNewObjs = 0; // Used for unique ids
    numberofNewArchives = 0; // Used for unique ids
    changes = []; // Used for save changes at the end
    // Make tables
    fetch('/buildings')
        .then(response => response.json())
        .then(function (body) {
            makeTable(body, "b", "buildingData")
        })
    fetch('/entrances')
        .then(response => response.json())
        .then(function (body) {
            makeTable(body, "e", "entranceData")
        })
    fetch('/corridors')
        .then(response => response.json())
        .then(function (body) {
            makeTable(body, "c", "corridorData")
        })
    fetch('/rooms')
        .then(response => response.json())
        .then(function (body) {
            makeTable(body, "r", "roomData")
        })
    fetch('/unmarkedRooms')
        .then(response => response.json())
        .then(function (body) {
            makeTable(body, "u", "unmarkedRoomData")
        })
    fetch('/archive')
        .then(response => response.json())
        .then(function (body) {
            makeArchiveTable(body, "archiveData")
        })
})