require('express');
const express = require('express');
const fs = require('fs');
const sqlite3 = require('sqlite3');
const app = express();
const cors = require('cors');
app.use(express.static('client'));
app.use(express.json());
app.use(cors());
app.use(express.static('body-parser'));
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

let db = new sqlite3.Database('./database/entities.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error(err.message);
    }
})

// Entities
const entities = require('./entities.json');

const entrances = entities.entrances;
const corridorIndex = entities.corridorIndex;
const buildings = entities.buildings;
const rooms = entities.rooms;
const unmarkedRooms = entities.unmarkedRooms;
const archive = entities.archive;

const placesForSearch = [rooms, buildings, archive];

function updateEntities () {
    entities.entrances = entrances;
    entities.corridorIndex = corridorIndex;
    entities.buildings = buildings;
    entities.rooms = rooms;
    entities.archive = archive;
    fs.writeFile('entities.json', JSON.stringify(entities, null, '\t'), err => {
        if (err) {
            console.log(err);
        }
    });
}

// Functions used in routes
function getPlace (category, id) {
    let searchThrough;
    if (category === 'entrance') {
        searchThrough = entrances;
    } else if (category === 'building') {
        searchThrough = buildings;
    } else if (category === 'room') {
        searchThrough = rooms;
    } else if (category === 'archive') {
        searchThrough = archive;
    } else {
        return undefined;
    }
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

app.get('/rooms/drawing', function (req, resp) {
    const result = [];
    rooms.forEach(room => {
        const { id, name, location } = room;
        result.push({ id: id, name: name, location: location });
    });
    resp.json(result);
});

app.get('/rooms/listinfo', function (req, resp) {
    const result = [];
    rooms.forEach(room => {
        const { id, name, location, building, level } = room;
        result.push({ id: id, name: name, location: location, building: building, level: level });
    });
    resp.json(result);
});

app.get('/rooms/popupinfo/:id', function (req, resp) {
    const id = req.params.id;
    const room = getPlace('room', id);
    const { name, description, hours, image } = room;
    const result = { id: id, name: name, description: description, hours: hours, image: image };
    resp.json(result);
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

app.post('/entities/add', function (req, resp) {
    const name = req.body.newName;
    const category = req.body.category;
    const location = JSON.parse('[' + req.body.newLocation + ']');
    let id;
    if (category === 'entrance') {
        id = 'e' + entrances.length;
    } else if (category === 'room') {
        id = 'r' + rooms.length;
    } else if (category === 'building') {
        id = 'b' + rooms.length;
    } else {
        resp.status(400).send('No category defined');
    }
    const place = {
        id: id,
        name: name,
        location: location
    };
    if (category === 'entrance') {
        entrances.push(place);
    } else if (category === 'room') {
        const description = req.body.newDescription;
        const hoursWeek = req.body.newHoursWeekStart + '-' + req.body.newHoursWeekEnd;
        const hoursWeekend = req.body.newHoursWeekendStart + '-' + req.body.newHoursWeekendEnd;
        const hours = [hoursWeek, hoursWeekend];
        const img = req.body.newImg;
        place.description = description;
        place.hours = hours;
        place.image = img;
        rooms.push(place);
    } else if (category === 'building') {
        buildings.push(place);
    }
    updateEntities();
    // resp.set('Content-Type', 'text/html');
    // const htmltext = '<html> <head> <link rel="stylesheet" href="../styles.css"></head> <body> <h1> Thanks, the property has been updated! </h1> </body> </html>';
    resp.status(201).send();
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
    } else if (property === 'hours') {
        value = value.split(',');
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
    if (id[0] === 'e') {
        searchThrough = entrances;
    } else if (id[0] === 'b') {
        searchThrough = buildings;
    } else if (id[0] === 'r') {
        searchThrough = rooms;
    } else {
        resp.status(400).send('First letter of id should be a category.');
    }
    let place;
    let placeFound = false;
    for (let i = 0; i < searchThrough.length; i++) {
        place = searchThrough[i];
        if (place.id === id) {
            // If delete type is archive, add location to archive
            if (deleteType === 'archive') {
                const archiveId = 'a' + archive.length + id[0];
                place.id = archiveId;
                archive.push(place);
            }
            // Delete location from current array
            searchThrough.splice(i, 1);
            placeFound = true;
            // Move all the id's of other places in category up so there aren't gaps
            let currentId;
            for (let j = i; j < searchThrough.length; j++) {
                currentId = searchThrough[j].id;
                const newIdNumber = parseInt(currentId.substring(1)) - 1;
                searchThrough[j].id = currentId.charAt(0).concat(newIdNumber.toString());
            }
            break;
        }
    }
    if (placeFound === false) {
        resp.status(404).send('Place not found, check id is correct and matches category');
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
        place = archive[i];
        if (place.id === id) {
            // Remove place from archive
            archive.splice(i, 1);
            placeFound = true;
            // Move other archive id's up so there aren't gaps
            let currentId;
            for (let j = i; j < archive.length; j++) {
                currentId = archive[j].id;
                const newIdNumber = parseInt(currentId.substring(1)) - 1;
                archive[j].id = currentId.charAt(0).concat(newIdNumber.toString());
            }
            break;
        }
    }
    if (placeFound === false) {
        resp.status(404).send('Place not found, check id is correct!');
        return;
    }
    // Add location back to its category
    const category = id.slice(-1); ;

    if (category === 'e') {
        place.id = 'e' + entrances.length;
        entrances.push(place);
    } else if (category === 'r') {
        place.id = 'r' + rooms.length;
        rooms.push(place);
    } else if (category === 'b') {
        place.id = 'b' + buildings.length;
        buildings.push(place);
    } else {
        resp.status(404).send('Error finding category location belongs to.');
        return;
    }
    updateEntities();
    // resp.set('Content-Type', 'text/html');
    // const htmltext = '<html> <head> <link rel="stylesheet" href="../styles.css"></head> <body> <h1> Thanks, the property has been updated! </h1> </body> </html>';
    resp.status(201).send();
});

app.get('/entities/search/:word', function (req, resp) {
    const word = req.params.word.toLowerCase().replace(/[^\w]|_/g, '');
    const matches = [];
    let name;
    for (let i = 0; i < placesForSearch.length; i++) {
        const category = placesForSearch[i];
        for (let j = 0; j < category.length; j++) {
            name = category[j].name.toLowerCase().replace(/[^\w]|_/g, '');
            if (name.includes(word)) {
                matches.push([category[j].name, category[j].id]);
            }
        }
    }
    resp.json(matches);
});
app.post('/info', (req, resp) => {
    const location = req.body.location;
    const question = req.body.Question;
    let response = '';
    if (question === 'time') {
        for (const room of rooms) {
            if (room.name === location) {
                response = room.hours[0] + ' ' + room.hours[1];
            }
        }
    } else {
        response = 'this aspect has not been added to the database';
    }
    resp.json(response);
});

module.exports = app;
