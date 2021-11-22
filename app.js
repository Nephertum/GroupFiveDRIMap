const e = require('express');
const express = require('express');
const app = express();
const cors = require('cors')
app.use(express.static('client'));
app.use(express.json());

app.use(express.static('body-parser'));
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(cors())
//entities
const entities = require('./entities.json');

const entrances = entities.entrances;
const corridorIndex =  entities.corridorIndex;
const buildings = entities.buildings;
const rooms = entities.rooms;

//routes
app.get('/entities', function (req, resp) {
    resp.json([entrances, corridorIndex, buildings, rooms]);
});

app.get('/entrances', function (req, resp) {
    resp.json(entrances);
});

app.get('/corridorIndex', function (req, resp) {
    resp.json(corridorIndex);
});

app.get('/buildings', function (req, resp) {
    resp.json(buildings);
});

app.get('/rooms', function (req, resp) {
    resp.json(rooms);
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
        resp.status(404).send('No category defined');
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

module.exports = app;
