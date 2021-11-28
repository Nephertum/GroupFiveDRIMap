// Default category to entrance on load
window.addEventListener("load", function (e){
    document.getElementById("catE").checked = true;
    document.getElementById("catE2").checked = true;
    document.getElementById("editName").checked = true;
})
// Only show properties belonging to the category checked
document.getElementById("catE").addEventListener("click", function (e){
    let roomOnly = document.getElementsByClassName("roomOnly");
    for (var i = 0; i < roomOnly.length; i++){
        roomOnly[i].style.display = "none";
    }
})

document.getElementById("catR").addEventListener("click", function (e){
    let roomOnly = document.getElementsByClassName("roomOnly");
    for (var i = 0; i < roomOnly.length; i++){
        roomOnly[i].style.display = "inline";
    }
})

document.getElementById("catB").addEventListener("click", function (e){
    let roomOnly = document.getElementsByClassName("roomOnly");
    for (var i = 0; i < roomOnly.length; i++){
        roomOnly[i].style.display = "none";
    }
})

document.getElementById("catE2").addEventListener("click", function (e){
    let roomOnly = document.getElementsByClassName("roomOnly2");
    for (var i = 0; i < roomOnly.length; i++){
        roomOnly[i].style.display = "none";
    }
})

document.getElementById("catR2").addEventListener("click", function (e){
    let roomOnly = document.getElementsByClassName("roomOnly2");
    for (var i = 0; i < roomOnly.length; i++){
        roomOnly[i].style.display = "inline";
    }
})

document.getElementById("catB2").addEventListener("click", function (e){
    let roomOnly = document.getElementsByClassName("roomOnly2");
    for (var i = 0; i < roomOnly.length; i++){
        roomOnly[i].style.display = "none";
    }
})

// Indicate format to enter new value in on edit form
var textFormat = document.getElementsByClassName("textFormat");
for (var i = 0; i < textFormat.length; i++) {
    textFormat.item(i).addEventListener("click", function(e){
        document.getElementById("formatIndicator").innerHTML = ""
    })
}

var locationFormat = document.getElementsByClassName("locationFormat");
for (var i = 0; i < locationFormat.length; i++) {
    locationFormat.item(i).addEventListener("click", function(e){
        document.getElementById("formatIndicator").innerHTML = "<br>Format: lat, lng";
    })
}

var hoursFormat = document.getElementsByClassName("hoursFormat");
for (var i = 0; i < hoursFormat.length; i++) {
    hoursFormat.item(i).addEventListener("click", function(e){
        document.getElementById("formatIndicator").innerHTML = "<br>Format: [[days], [hours]], [[days], [hours]], ...";
    })
}
const addPlace = () => {
    const categoryE = document.getElementById('catE')
    const categoryR = document.getElementById('catR')
    const category = categoryE.checked ? "entrance" : categoryR.checked ? "room" : "building"
    const newName = document.getElementById("newName");
    /*let newWidth;
    let newHeight;
    let newFocus;
    let newMinZoom;
    let newMaxZoom;
    if(categoryE.checked == true){
        newWidth = "10";
        newHeight = "10";
        newFocus = "20";
        newMinZoom = "1";
        newMaxZoom = "100";
    }
    else if(categoryR.checked == true){
        newWidth = "15";
        newHeight = "15";
        newFocus = "20";
        newMinZoom = "18";
        newMaxZoom = "100";
    }
    else {
        newWidth = "80";
        newHeight = "40";
        newFocus = "17";
        newMinZoom = "17";
        newMaxZoom = "100";
    }*/
   
    const newLocation = document.getElementById('newLocation');
    const newDescription = document.getElementById("newDescription");
    const newHours = document.getElementById("newHours");
    const newImg = document.getElementById('newImg');
    const newData = {
        "category" : category,
        "newName" : newName.value,
       /* "newWidth" : newWidth,
        "newHeight" : newHeight,
        "newFocus" : newFocus,
        "newMinZoom" : newMinZoom,
        "newMaxZoom" : newMaxZoom,*/
        "newLocation" : newLocation.value,
        "newDescription" : newDescription.value,
        "newHours" : newHours.value,
        "newImg" : newImg.value
    }
    fetch('http://127.0.0.1:8090/entities/add',{
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
        body: JSON.stringify(newData)
    })
    .then(response => {
        if (response.ok) {
            showModal();
        }
    })
    .catch(err => {
        console.log(err)
    })
}
const addPlaceBtn = document.getElementById("newPlaceBtn")
addPlaceBtn.addEventListener('click', (e) => {
    e.preventDefault();
    addPlace();
})

const showModal = () => {
    let myModal = new bootstrap.Modal(document.getElementById('myModal'))
    myModal.toggle();
}

// Search for id function
function findId (e) {
    e.preventDefault();
    let word = document.searchIdForm.placeName.value;
    console.log(word)
    word = word.replace(/[^\w]|_/g, '');
    if (word !== '') {
        fetch('http://127.0.0.1:8090/entities/search/' + word)
        .then(response => response.json())
        .then(function (body) {
            let html = "<p>";
            let result;
            for (let i = 0; i < body.length; i++) {
                result = body[i]
                
                html += result[0]+ "\'s id: " +result[1]+ "<br>"
            }
            html += "</p>"
            document.getElementById('sResults').innerHTML = html;
        })
        .catch((error) => {
            alert(error);
            console.log('Unable to get search results');
        });
    }
}

const editPlace = () => {
    const categoryE = document.getElementById("catE2");
    const categoryR = document.getElementById("catR2");
    const category = categoryE.checked ? "entrance" : categoryR.checked ? "room" : "building";
    const id = document.getElementById("IdOfEdit").value;
    let property;
    property = document.getElementById("editName").checked ? "name" : property;
    property = document.getElementById("editLocation").checked ? "location" : property;
    property = document.getElementById("editDescription").checked ? "description" : property;
    property = document.getElementById("editHours").checked ? "hours" : property;
    property = document.getElementById("editImg").checked ? "img" : property;
    const newValue = document.getElementById("editNewValue").value;
    const newData = {
        "IdOfEdit" : id,
        "category" : category,
        "property" : property,
        "editNewValue" : newValue
    }
    fetch("http://127.0.0.1:8090/entities/edit", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
        body: JSON.stringify(newData)
    })
    .then(response => {
        if (response.ok) {
            showModal();
        }
    })
    .catch(err => {
        console.log(err);
    })
}
const editPlaceBtn = document.getElementById("editPlaceBtn");
editPlaceBtn.addEventListener("click", (e) => {
    e.preventDefault();
    editPlace();
})
