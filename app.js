const express = require('express');
const app = express();

app.use(express.static('client'));
app.use(express.json());

app.use(express.static('body-parser'));
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

//entities
const entities = require('./entities.json');

const entrances = entities.entrances;
const corridorIndex =  entities.corridorIndex;
const buildings = entities.buildings;
const rooms = entities.rooms;

//routes
app.get('/entities', function (req, resp) {
    resp.json([entrances, buildings, rooms, corridorIndex]);
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

app.post('/entrances/add', function (req, resp) {
    const name = req.body.newEName;
    const category = "entrance";
    const width = parseInt(req.body.newEWidth);
    const height = parseInt(req.body.newEHeight);
    const focusZoom = parseInt(req.body.newEFocus);
    const minZoom = parseInt(req.body.newEMinZoom);
    const maxZoom = parseInt(req.body.newEMaxZoom);
    const location = JSON.parse('[' + req.body.newELocation + ']');
    //const id = 'e' + entrances.length;
    const newE = {
        // id: id,
        name: name,
        category: category,
        width: width,
        height: height,
        focusZoom: focusZoom,
        minZoom: minZoom,
        maxZoom: maxZoom,
        location: location
    };
    entrances.push(newE);
    resp.set('Content-Type', 'text/html');
    const htmltext = '<html> <head> <link rel="stylesheet" href="../styles.css"></head> <body> <h1> Thanks, the new entrance has been added! </h1> </body> </html>';
    resp.send(htmltext);
    console.log(entrances)
});

app.post('/rooms/add', function (req, resp) {
    const name = req.body.newRName;
    const category = "room";
    const width = parseInt(req.body.newRWidth);
    const height = parseInt(req.body.newRHeight);
    const focusZoom = parseInt(req.body.newRFocus);
    const minZoom = parseInt(req.body.newRMinZoom);
    const maxZoom = parseInt(req.body.newRMaxZoom);
    const location = JSON.parse('[' + req.body.newRLocation + ']');
    const id = 'r' + rooms.length;
    const newR = {
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
    rooms.push(newR);
    resp.set('Content-Type', 'text/html');
    const htmltext = '<html> <head> <link rel="stylesheet" href="../styles.css"></head> <body> <h1> Thanks, the new room has been added! </h1> </body> </html>';
    resp.send(htmltext);
});

module.exports = app;
