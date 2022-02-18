function makeTable(data, container, addOption="yes", restoreOption="no") {
    if (data.length == 0) {
        container.innerHTML = "Currently empty"
    }
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
    newHtml = "<table class='dataTable' id='"+container+"Tbl"+"'><tr>"

    // Add headings
    let heading;
    for (var i = 0; i < cols.length; i++) {
        heading = "<th>" + cols[i] + "</th>"; // Headings for each key
        newHtml += heading;
    }
    newHtml += "<th></th>" // Heading for delete buttons
    if (restoreOption == "yes"){
        newHtml += "<th></th>" // Heading for restore buttons
    }
    newHtml += "</tr>"

    // Add data as changeable inputs
    for (var i = 0; i < data.length; i++) {
        newHtml += "<tr id='row"+container+i+"'>"
        for (var j = 0; j < cols.length; j++) {
            newHtml += "<td><input id='" + container + i + j + "' value='" + data[i][cols[j]] + "'></input></td>"
        }
        newHtml += '<td><i class="fa-solid fa-circle-xmark dataDltBtn" id="delete'+container+i+'"></i></td>' // Delete button
        if (restoreOption == "yes"){
            newHtml += '<td><i class="fa-solid fa-trash-arrow-up dataRestoreBtn" id="restore'+container+i+'"></i></td>' // Restore button
        }
        newHtml += "</tr>"
    }

    // Add an add button if the option is enabled
    if (addOption == "yes"){
        newHtml+= "<tr>"
        for (var j = 0; j < cols.length; j++){
            newHtml += "<td></td>"
        }
        newHtml+= '<td id="addRow'+container+'"><i class="fa-solid fa-circle-plus dataPlusBtn" id="plus'+container+'"></i></td></tr>'
    }

    // Add table to document
    newHtml += "</table>"
    document.getElementById(container).innerHTML = newHtml;

    // Add event listeners that change the background colour when a value is changed
    // and store the change in the global array
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < cols.length; j++) {
            checkChange(container+i+j);
        }
    }
    // Add event listeners that delete the row when cross clicked,
    // after a confirmation message is sent
    for (let i = 0; i < data.length; i++) {
        enableDeleteButton('delete'+container+i);
    }
    // Add event listeners that add a new row when plus button is clicked
    if (addOption == "yes"){
        document.getElementById('plus' + container).addEventListener('click', function (e) {
            let container = e.target.id.slice(4);
            let tableId = container + 'Tbl';
            let i = document.getElementById(tableId).firstChild.childElementCount;
            newRow = "<tr id='row"+container+i+"'>";
            for (var j = 0; j < cols.length; j++) {
                newRow += "<td><input class='changedValue' id='" + container + i + j + "' value=''></input></td>";
            }
            newRow += '<td><i class="fa-solid fa-circle-xmark dataDltBtn" id="delete'+container+i+'"></i></td>'; // Delete button
            newRow += "</tr>";
            document.getElementById('addRow'+container).parentElement.insertAdjacentHTML('beforebegin', newRow);
            enableDeleteButton('delete'+container+i);
            change = container + i + ' row added';
            changes.push(change);
        });
    }

    // Add event listeners for restore if option enabled
    if (restoreOption == "yes"){
        for (let i = 0; i < data.length; i++) {
            document.getElementById('restore'+container+i).addEventListener('click', function(e){
                alert("Restoring (doesn't actually move row back yet, but does save change)");
                change = 'Restore row ' + e.target.id.substring(7);
                changes.push(change);
            })
        }
    }
}

function enableDeleteButton(id){
    //d = function del(){alert("Deleting (not yet functional)")}
    a = function archive(){alert("Moving to archive (not yet functional)")}
    document.getElementById(id).addEventListener('click', function (e) {
        e.preventDefault();
        let checkType = e.target.id.slice(6,13);
        let rowId = "row" + e.target.id.slice(6)
        if(checkType == 'archive'){
            functionConfirm("Are you sure you want to delete this?", 
            function del(){
                document.getElementById(rowId).remove();
                changes.push('Deleted row ' + rowId)
            });
        }
        else {
            functionConfirm("Are you sure you want to delete this?", 
            function del(){
                document.getElementById(rowId).remove();
                changes.push('Deleted row ' + rowId)
            }, 
            function archive(){
                moveRow = document.getElementById(rowId);
                document.getElementById(rowId).remove();
                archiveTbl = document.getElementById("archiveDataTbl")
                if (!archiveTbl){
                    // Make the archive table
                }
                else {
                    archiveTbl.firstChild.appendChild(moveRow); // still need to adjust for new headings and add restore btn
                }
                changes.push('row ' + moveRow.id + ' archived')
            });
        }
    })
}

function checkChange(id){
    document.getElementById(id).addEventListener('input', function (e) {
        e.preventDefault();
        box = document.getElementById(e.target.id)
        change = 'cell ' + box.id + ' value altered';
        changes = changes.filter(function(e) { return e !== change});
        if (box.value != box.defaultValue) {
            box.className += " changedValue";
            changes.push(change);
        }
        else {
            box.classList.remove("changedValue");
        }
        oldValues.push(box.value);
        inputs.push(box);
    })
}

function undo() {
    console.log('here')
    // Not currently working as oldValues is getting the values
    // after the change not before
    let input = inputs.pop()
    let oldValue = oldValues.pop()
    console.log(input)
    console.log(oldValue)
    if (!oldValue) return
    input.value = oldValue;
}

function functionConfirm(msg, del, archive, cancel) {
    var confirmBox = $("#confirm");
    confirmBox.find(".message").text(msg);
    confirmBox.find(".confirmDelete,.confirmArchive,.confirmCancel").unbind().click(function() {
       confirmBox.hide();
    });
    confirmBox.find(".confirmDelete").click(del);
    if (archive != undefined){
        confirmBox.find(".confirmArchive").click(archive);
        confirmBox.find(".confirmArchive").show();
    }
    else{
        confirmBox.find(".confirmArchive").hide();
    }
    confirmBox.find(".confirmCancel").click(cancel);
    confirmBox.show();
 }

function saveChanges() {
    alert("Changes: " + changes)
    // Will go through changes and post them all
}

window.addEventListener('load', function (e) {
    // Global storage
    oldValues = [] // Used for undo btn
    inputs = [] // Used for undo btn
    changes = [] // Used for save changes at the end
    // Make tables
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
    fetch('/archive')
        .then(response => response.json())
        .then(function (body) {
            makeTable(body, "archiveData", "no", "yes")
        })
})
