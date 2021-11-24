const e = require('express');
const express = require('express');
const app = express();
const cors = require('cors')
app.use(express.static('client'));
app.use(express.json());

app.use(express.static('body-parser'));
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(cors())

// Entities
const entities = require('./entities.json');

const entrances = entities.entrances;
const corridorIndex =  entities.corridorIndex;
const buildings = entities.buildings;
const rooms = entities.rooms;
const archive = entities.archive;

// Functions used in routes
function getPlace(category, id) {
    let searchThrough;
    if (category === "entrance"){
        searchThrough = entrances;
    }
    else if (category === "building"){
        searchThrough = buildings;
    }
    else if (category === "room"){
        searchThrough = rooms;
    }
    else if (category === "room"){
        searchThrough = archive;
    }
    else{
        return undefined;
    }
    console.log(searchThrough)
    for (let i = 0; i < searchThrough.length; i++) {
        if (searchThrough[i].id === id) {
            return searchThrough[i];
        }
    }
    return undefined;
}


// Routes
app.get('/entities', function (req, resp) {
    resp.json([entrances, corridorIndex, buildings, rooms]);
});

app.post('/entities/add', function (req, resp) {
    const name = req.body.newName;
    const category = req.body.category;
    const width = parseInt(req.body.newWidth);
    const height = parseInt(req.body.newHeight);
    const focusZoom = parseInt(req.body.newFocus);
    const minZoom = parseInt(req.body.newMinZoom);
    const maxZoom = parseInt(req.body.newMaxZoom);
    const location = JSON.parse('[' + req.body.newLocation + ']');
    let id;
    if (category == "entrance"){
        id = 'e' + entrances.length;
    }
    else if (category == "room"){
        id = 'r' + rooms.length;
    }
    else if (category == "building"){
        id = 'b' + rooms.length;
    }
    else{
        resp.status(400).send('No category defined');
    }
    let place = {
        id: id,
        name: name,
        category: category,
        width: width,
        height: height,
        focusZoom: focusZoom,
        minZoom: minZoom,
        maxZoom: maxZoom,
        location: location
    };
    if (category == "entrance"){
        entrances.push(place);
    }
    else if (category == "room"){
        const description = req.body.newDescription;
        const hours = [["have not sorted this input out yet"], [""]]
        const img = req.body.newImg;
        const info = [description, hours, img];
        place["info"] = info;
        rooms.push(place);
    }
    else if (category == "building"){
        buildings.push(place);
    }

    resp.set('Content-Type', 'text/html');
    const htmltext = '<html> <head> <link rel="stylesheet" href="../styles.css"></head> <body> <h1> Thanks, the new place has been added! </h1> </body> </html>';
    resp.send(htmltext);
});

app.post('/entities/edit', function (req, resp) {
    const id = req.body.IdOfEdit;
    const category = req.body.category;
    const place = getPlace(category, id);
    if (place === undefined) {
        resp.status(404).send('Sorry, this place was not found, check your id and category are correct!');
        return;
    }
    const property = req.body.property;
    let value = req.body.editNewValue;
    if (property === 'location') {
        value = JSON.parse('[' + value + ']');
    } 
    else if (property === 'width' || property === 'height' || property === 'focus' || property === 'minzZoom' || property === 'maxZoom') {
        if (isNaN(value)) {
            resp.status(400).send("Sorry we couldn't update the property as it was not entered in the correct format.");
            return;
        }
        value = parseInt(value);
    }
    if (value === undefined) {
        resp.status(400).send("Sorry we couldn't update the property as it was not entered in the correct format.");
        return;
    }
    place[property] = value;
    resp.set('Content-Type', 'text/html');
    const htmltext = '<html> <head> <link rel="stylesheet" href="../styles.css"></head> <body> <h1> Thanks, the property has been updated! </h1> </body> </html>';
    resp.send(htmltext);
});

app.post('/entities/delete', function (req, resp) {
    const id = req.body.IdOfDelete;
    const category = req.body.category;
    const deleteType = req.body.deleteType

    let searchThrough;
    if (category === "entrance"){
        searchThrough = entrances;
    }
    else if (category === "building"){
        searchThrough = buildings;
    }
    else if (category === "room"){
        searchThrough = rooms;
    }
    else{
        resp.status(404).send("Category not found");
    }
    let place;
    let placeFound = false;
    for (let i = 0; i < searchThrough.length; i++) {
        place = searchThrough[i]
        if (place.id === id) {
            if(deleteType === "archive"){
                const archiveId = 'a' + archive.length;
                place.id = archiveId;
                archive.push(place)
            }
            searchThrough.splice(i, 1);
            placeFound = true;
            for(let j = i; j < searchThrough.length; j++){
                currentId = searchThrough[j].id
                let newIdNumber = parseInt(currentId.substring(1)) - 1
                searchThrough[j].id = currentId.charAt(0).concat(newIdNumber.toString())    
            }
            break;
        }
    }
    if(placeFound === false){
        resp.status(404).send("Place not found, check id is correct and matches category");
        return;
    }
    console.log(searchThrough)
    console.log(archive)
    resp.set('Content-Type', 'text/html');
    const htmltext = '<html> <head> <link rel="stylesheet" href="../styles.css"></head> <body> <h1>' + place.name + ' has been removed! The id\'s of locations in the same category may have been changed.</h1> </body> </html>';
    resp.send(htmltext);
});

app.post('/entities/restore', function (req, resp) {
    const id = req.body.IdOfRestore;
    let place;
    for (let i = 0; i < archive.length; i++) {
        if (archive[i].id === id) {
            place = archive[i];
            archive.splice(i, 1);
            break;
        }
    }
    if (place === undefined){
        resp.status(404).send('Place not found, check id is correct!')
        return;
    }
    const category = place.category;
    console.log(category)

    if (category === "entrance"){
        place.id = 'e' + entrances.length
        entrances.push(place);
    }
    else if (category === "room"){
        place.id = 'r' + rooms.length
        entrances.push(rooms);
    }
    else if (category === "building"){
        place.id = 'b' + buildings.length
        buildings.push(place);
    }
    else {
        resp.status(404).send("Error finding category location belongs to.");
        return;
    }

    console.log(archive)
    console.log(buildings)
    resp.set('Content-Type', 'text/html');
    const htmltext = '<html> <head> <link rel="stylesheet" href="../styles.css"></head> <body> <h1>' + place.name + ' has been restored! Its new id is ' + place.id + '.</h1> </body> </html>';
    resp.send(htmltext);
});

module.exports = app;
