window.addEventListener("load", function (e){
    document.getElementById("catE").checked = true;
})

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
        document.getElementById("newWidth").value = "80";
        document.getElementById("newHeight").value = "40";
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
