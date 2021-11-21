document.getElementById('autofill1').addEventListener('click', function (e) {
    document.getElementById("newEName").value = "entrance";
    document.getElementById("newEWidth").value = "10";
    document.getElementById("newEHeight").value = "10";
    document.getElementById("newEFocus").value = "20";
    document.getElementById("newEMinZoom").value = "1";
    document.getElementById("newEMaxZoom").value = "100";
    e.preventDefault();
});

document.getElementById('autofill2').addEventListener('click', function (e) {
    document.getElementById("newRWidth").value = "80";
    document.getElementById("newRHeight").value = "40";
    document.getElementById("newRFocus").value = "20";
    document.getElementById("newRMinZoom").value = "18";
    document.getElementById("newRMaxZoom").value = "100";
    e.preventDefault();
});