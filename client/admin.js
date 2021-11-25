// Default category to entrance on load
window.addEventListener("load", function (e){
    document.getElementById("catE").checked = true;
    document.getElementById("catE2").checked = true;
    document.getElementById("catE3").checked = true;
})

// Autofill default options for new location
document.getElementById("autofill1").addEventListener("click", function (e) {
    if(document.getElementById("catE").checked == true){
        document.getElementById("newName").value = "entrance";
        document.getElementById("newWidth").value = "10";
        document.getElementById("newHeight").value = "10";
        document.getElementById("newFocus").value = "20";
        document.getElementById("newMinZoom").value = "1";
        document.getElementById("newMaxZoom").value = "100";
        document.getElementById("newLocation").value = "";
        document.getElementById("newDescription").value = "";
        document.getElementById("newHours").value = "";
        document.getElementById("newImg").value = "";
    }
    else if(document.getElementById("catR").checked == true){
        document.getElementById("newName").value = "";
        document.getElementById("newWidth").value = "15";
        document.getElementById("newHeight").value = "15";
        document.getElementById("newFocus").value = "20";
        document.getElementById("newMinZoom").value = "18";
        document.getElementById("newMaxZoom").value = "100";
        document.getElementById("newLocation").value = "";
        document.getElementById("newDescription").value = "";
        document.getElementById("newHours").value = "";
        document.getElementById("newImg").value = "default.jpeg";
    }
    else if(document.getElementById("catB").checked == true){
        document.getElementById("newName").value = "";
        document.getElementById("newWidth").value = "80";
        document.getElementById("newHeight").value = "40";
        document.getElementById("newFocus").value = "17";
        document.getElementById("newMinZoom").value = "17";
        document.getElementById("newMaxZoom").value = "100";
        document.getElementById("newLocation").value = "";
        document.getElementById("newDescription").value = "";
        document.getElementById("newHours").value = "";
        document.getElementById("newImg").value = "";
    }
    else(alert("Select a category first"))
    e.preventDefault();
});

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
    const newWidth = document.getElementById("newWidth");
    const newHeight = document.getElementById("newHeight");
    const newFocus = document.getElementById("newFocus");
    const newMinZoom = document.getElementById('newMinZoom');
    const newMaxZoom = document.getElementById('newMaxZoom');
    const newLocation = document.getElementById('newLocation');
    const newDescription = document.getElementById("newDescription");
    const newHours = document.getElementById("newHours");
    const newImg = document.getElementById('newImg');
    const newData = {
        "category" : category,
        "newName" : newName.value,
        "newWidth" : newWidth.value,
        "newHeight" : newHeight.value,
        "newFocus" : newFocus.value,
        "newMinZoom" : newMinZoom.value,
        "newMaxZoom" : newMaxZoom.value,
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
            // need to formating still
            document.getElementById('sResults').innerHTML = body;
        })
        .catch((error) => {
            alert(error);
            console.log('Unable to get search results');
        });
    }
}

