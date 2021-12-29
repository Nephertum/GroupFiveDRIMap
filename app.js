const e = require('express');
const express = require('express');
const fs = require('fs')
const app = express();
const cors = require('cors')
app.use(express.static('client'));
app.use(express.json());
app.use(cors())
app.use(express.static('body-parser'));
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Entities
const entities = require('./entities.json');

let entrances = entities.entrances;
let corridorIndex =  entities.corridorIndex;
let buildings = entities.buildings;
let rooms = entities.rooms;
let unmarkedRooms = entities.unmarkedRooms;
let archive = entities.archive;

let placesForSearch = [rooms, buildings, archive];

function updateEntities() {
    entities.entrances = entrances;
    entities.corridorIndex = corridorIndex;
    entities.buildings = buildings;
    entities.rooms = rooms;
    entities.archive = archive;
    fs.writeFile('entities.json', JSON.stringify(entities,null,"\t"), err => {
        if (err) {
            console.log(err);
        }
    })
}

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
    else if (category === "archive"){
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
app.get('/entrances', function (req, resp) {
    resp.json(entrances);
});

app.get('/rooms', function (req, resp) {
    resp.json(rooms);
});

app.get('/buildings', function (req, resp) {
    resp.json(buildings);
});

app.get('/corridors', function (req, resp) {
    resp.json(corridorIndex);
});

app.get('/unmarkedRooms', function (req, resp) {
    resp.json(unmarkedRooms);
});

/*app.get('/entities', function (req, resp) {
    resp.json([entrances, corridorIndex, buildings, rooms]);
});*/

app.post('/entities/add', function (req, resp) {
    const name = req.body.newName;
    const category = req.body.category;
    /*const width = parseInt(req.body.newWidth);
    const height = parseInt(req.body.newHeight);
    const focusZoom = parseInt(req.body.newFocus);
    const minZoom = parseInt(req.body.newMinZoom);
    const maxZoom = parseInt(req.body.newMaxZoom);*/
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
        /*category: category,
        width: width,
        height: height,
        focusZoom: focusZoom,
        minZoom: minZoom,
        maxZoom: maxZoom,*/
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
    updateEntities();
    // resp.set('Content-Type', 'text/html');
    // const htmltext = '<html> <head> <link rel="stylesheet" href="../styles.css"></head> <body> <h1> Thanks, the property has been updated! </h1> </body> </html>';
    resp.status(201).send();
});

app.post('/entities/edit', function (req, resp) {
    const id = req.body.IdOfEdit;
    console.log(id)
    const category = req.body.category;
    console.log(category)
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
    updateEntities();
    // resp.set('Content-Type', 'text/html');
    // const htmltext = '<html> <head> <link rel="stylesheet" href="../styles.css"></head> <body> <h1> Thanks, the property has been updated! </h1> </body> </html>';
    resp.status(201).send();
});

app.post('/entities/delete', function (req, resp) {
    const id = req.body.IdOfDelete;
    const deleteType = req.body.deleteType;
    let searchThrough;
    if (id[0] === 'e'){
        searchThrough = entrances;
    }
    else if (id[0] === 'b'){
        searchThrough = buildings;
    }
    else if (id[0] === 'r'){
        searchThrough = rooms;
    }
    else{
        resp.status(400).send("First letter of id should be a category.");
    }
    let place;
    let placeFound = false;
    for (let i = 0; i < searchThrough.length; i++) {
        place = searchThrough[i]
        if (place.id === id) {
            // If delete type is archive, add location to archive
            if(deleteType === "archive"){
                const archiveId = 'a' + archive.length + id[0];
                place.id = archiveId;
                archive.push(place)
            }
            // Delete location from current array
            searchThrough.splice(i, 1);
            placeFound = true;
            // Move all the id's of other places in category up so there aren't gaps
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
    updateEntities();
    // resp.set('Content-Type', 'text/html');
    // const htmltext = '<html> <head> <link rel="stylesheet" href="../styles.css"></head> <body> <h1> Thanks, the property has been updated! </h1> </body> </html>';
    resp.status(201).send();
});

app.post('/entities/restore', function (req, resp) {
    const id = req.body.IdOfRestore;
    let place;
    let placeFound = false;
    for (let i = 0; i < archive.length; i++) {
        place = archive[i]
        if (place.id === id) {
            // Remove place from archive
            archive.splice(i, 1);
            placeFound = true;
            // Move other archive id's up so there aren't gaps
            for(let j = i; j < archive.length; j++){
                currentId = archive[j].id
                let newIdNumber = parseInt(currentId.substring(1)) - 1
                archive[j].id = currentId.charAt(0).concat(newIdNumber.toString())    
            }
            break;
        }
    }
    if (placeFound === false){
        resp.status(404).send('Place not found, check id is correct!')
        return;
    }
    // Add location back to its category
    const category = id.slice(-1);;

    if (category === "e"){
        place.id = 'e' + entrances.length
        entrances.push(place);
    }
    else if (category === "r"){
        place.id = 'r' + rooms.length
        rooms.push(place);
    }
    else if (category === "b"){
        place.id = 'b' + buildings.length
        buildings.push(place);
    }
    else {
        resp.status(404).send("Error finding category location belongs to.");
        return;
    }
    updateEntities();
    // resp.set('Content-Type', 'text/html');
    // const htmltext = '<html> <head> <link rel="stylesheet" href="../styles.css"></head> <body> <h1> Thanks, the property has been updated! </h1> </body> </html>';
    resp.status(201).send();
});

app.get('/entities/search/:word', function (req, resp) {
    console.log(req.params.word)
    const word = req.params.word.toLowerCase().replace(/[^\w]|_/g, '');
    const matches = [];
    let name;
    for (let i = 0; i < placesForSearch.length; i++){
        let category = placesForSearch[i]
        for (let j = 0; j < category.length; j++) {
            console.log(category[j])
            name = category[j].name.toLowerCase().replace(/[^\w]|_/g, '');
            if (name.includes(word)) {
                matches.push([category[j].name, category[j].id]);
            }
        }
    }
    resp.json(matches);
});
app.post('/info/:place', (req, resp) => {
    if (req.params.place == "x-ray") {
        resp.send("x-ray are cool");
    }
    if (req.params.place == 'fracture clinic') {
        resp.send("fractures are cool")
    }
    resp.send("rooms are cool")
})

module.exports = app;
