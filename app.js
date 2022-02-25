require('express');
const express = require('express');
const fs = require('fs');
const sqlite3 = require('sqlite3');
const path = require('path');
const session = require('express-session');
const sqlitestore = require('connect-sqlite3')(session);
const app = express();
const cors = require('cors');
app.use(express.static('client'));
app.use(express.json());
app.use(cors());
app.use(express.static('body-parser'));
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(session({
    secret: 'hospitals are cool',
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 },
    store: new sqlitestore()
}));
let entrances;
let corridorIndex;
let buildings;
let rooms;
let unmarkedRooms;
let archive;

const db = new sqlite3.Database('./database/entities.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error(err.message);
    }
    db.all('SELECT * FROM entrances', [], (err, rows) => {
        if (err) console.log(err);
        if (!rows) console.log('no entrances found');
        if (rows) entrances = rows;
    });
    db.all('SELECT * FROM corridorIndex', [], (err, rows) => {
        if (err) console.log(err);
        if (!rows) console.log('no entrances found');
        if (rows) corridorIndex = rows;
    });
    db.all('SELECT * FROM buildings', [], (err, rows) => {
        if (err) console.log(err);
        if (!rows) console.log('no entrances found');
        if (rows) buildings = rows;
    });
    db.all('SELECT * FROM rooms', [], (err, rows) => {
        if (err) console.log(err);
        if (!rows) console.log('no entrances found');
        if (rows) rooms = rows;
    });
    db.all('SELECT * FROM unmarkedRooms', [], (err, rows) => {
        if (err) console.log(err);
        if (!rows) console.log('no entrances found');
        if (rows) unmarkedRooms = rows;
    });
    db.all('SELECT * FROM archive', [], (err, rows) => {
        if (err) console.log(err);
        if (!rows) console.log('no entrances found');
        if (rows) archive = rows;
    });
});
const staff_db = require('./staffDB');

// Entities
const entities = require('./entities.json');

const placesForSearch = [rooms, buildings, archive];

function check_authorisation (req, res, next) {
    if (req.session.authorised) {
        next();
    } else {
        res.status(401).redirect('/login');
    }
}

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
app.get('/login', (req, res) => {
    if (req.session.authorised) {
        res.redirect('/data');
    } else {
        res.sendFile(path.resolve(__dirname, './private_client/login.html'));
    }
});
app.get('/data', check_authorisation, (req, res) => {
    res.sendFile(path.resolve(__dirname, './private_client/data.html'));
});
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.status(200).send();
});

// Routes
/**
 * @api {get} /info/:category/:id Request an Object by its id and Category
 * @apiName GetInfo
 * @apiGroup entities
 *
 * @apiParam {String="entrance","building","room","corridor"} category Category of object.
 * @apiParam {String} id Unique id of object (first letter of category followed by a number).
 *
 * @apiSuccess {Object[]} object The dictionary requested.
 */
app.get('/info/:category/:id', function (req, resp) {
    const id = req.params.id;
    const category = req.params.category;
    const info = getPlace(category, id);
    if (info == undefined){
        resp.status(404).send('Sorry, this place was not found, check your id and category are correct!');
        return;
    }
    resp.json(info);
});

/**
 * @api {get} /entrances Request All Entrances
 * @apiName GetEntrances
 * @apiGroup Entrances
 *
 * @apiSuccess {Object[]} entrances List of all entrance objects.
 */
app.get('/entrances', function (req, resp) {
    resp.json(entrances);
});

/**
 * @api {get} /rooms Request All Rooms
 * @apiName GetRooms
 * @apiGroup Rooms
 *
 * @apiSuccess {Object[]} rooms List of all room objects.
 */
app.get('/rooms', function (req, resp) {
    resp.json(rooms);
});

/**
 * @api {get} /rooms/drawing Request Info for Drawing Rooms
 * @apiName GetRoomsDrawingInfo
 * @apiGroup Rooms
 *
 * @apiSuccess {Object[]} roomsdrawing List of dictionaries of the required info for drawing each room.
 */
app.get('/rooms/drawing', function (req, resp) {
    const result = [];
    rooms.forEach(room => {
        const { id, name, location } = room;
        result.push({ id: id, name: name, location: location });
    });
    resp.json(result);
});

/**
 * @api {get} /rooms/listinfo Request Info for Writing a List of Rooms
 * @apiName GetRoomsListInfo
 * @apiGroup Rooms
 *
 * @apiSuccess {Object[]} roomsinfo List of dictionaries of the required info for listing each room.
 */
app.get('/rooms/listinfo', function (req, resp) {
    const result = [];
    rooms.forEach(room => {
        const { id, name, location, building, level } = room;
        result.push({ id: id, name: name, location: location, building: building, level: level });
    });
    resp.json(result);
});

/**
 * @api {get} /rooms/popupinfo/:id Request Info for Creating a Popup of a Room
 * @apiName GetARoomsPopupInfo
 * @apiGroup Rooms
 * 
 * @apiParam {String} id Unique id of room.
 *
 * @apiSuccess {Object[]} roompopup Dictionary of the required info for creating a popup of the room.
 */
app.get('/rooms/popupinfo/:id', function (req, resp) {
    const id = req.params.id;
    const room = getPlace('room', id);
    const { name, description, hours, image } = room;
    const result = { id: id, name: name, description: description, hours: hours, image: image };
    resp.json(result);
});

/**
 * @api {get} /buildings Request All Buildings
 * @apiName GetBuildings
 * @apiGroup Buildings
 *
 * @apiSuccess {Object[]} buildings List of all building objects.
 */
app.get('/buildings', function (req, resp) {
    resp.json(buildings);
});

/**
 * @api {get} /corridors Request All Corridors
 * @apiName GetCorridors
 * @apiGroup Corridors
 *
 * @apiSuccess {Object[]} corridors List of all corridor objects.
 */
app.get('/corridors', function (req, resp) {
    resp.json(corridorIndex);
});

/**
 * @api {get} /unmarkedRooms Request All Rooms That are Not Marked on Map
 * @apiName GetUnmarkedRooms
 * @apiGroup UnmarkedRooms
 *
 * @apiSuccess {Object[]} unmarkedRooms List of all unmarked room objects.
 */
app.get('/unmarkedRooms', function (req, resp) {
    resp.json(unmarkedRooms);
});

/**
 * @api {get} /archive Request All Objects in Archive
 * @apiName GetArchive
 * @apiGroup Archive
 *
 * @apiSuccess {Object[]} archive List of all archived objects.
 */
app.get('/archive', function (req, resp) {
    resp.json(archive);
});

app.post('/login', (req, res) => {
    console.log('login received');
    staff_db.get('SELECT username, password FROM staff WHERE username=? AND password=?', [req.body.username, req.body.password], (err, rows) => {
        if (err) {
            console.log(err);
            res.status(500).send();
        }
        if (!rows) res.status(401).send();
        if (rows) {
            req.session.authorised = true;
            res.status(200).send();
        }
    });
});
app.post('/signup', check_authorisation, (req,res) => {
    staff_db.run('INSERT INTO staff (username, password) VALUES (?,?)',[req.body.username,req.body.password],(err) => {
        if (err) {
            console.log(err)
            res.status(500).send()
        }
        if (!err) res.status(201).send()
    })
})

/**
 * @api {post} /entities/add Add a New Entity
 * @apiName PostNewEntity
 * @apiGroup entities
 *
 * @apiParam {String} newName Name of new object.
 * @apiParam {String="entrance","building","room","corridor"} category Category of new object.
 * @apiParam {String} newLocation Map location of new object
 * @apiParam {String} [newDescription] Description of new object.
 * @apiParam {String} [newHoursWeekStart] Start of the weekday opening hours of the new object if applicable.
 * @apiParam {String} [newHoursWeekEnd] End of the weekday opening hours of the new object if applicable.
 * @apiParam {String} [newHoursWeekendStart] Start of the weekend opening hours of the new object if applicable.
 * @apiParam {String} [newHoursWeekendEnd] End of the weekend opening hours of the new object if applicable.
 * @apiParam {String} [newImg] Name of the image file for the new object if applicable.
 */
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

/**
 * @api {post} /entities/edit Edit an Existing Entity
 * @apiName PostEditEntity
 * @apiGroup entities
 *
 * @apiParam {String} IdOfEdit Unique id of object.
 * @apiParam {String="entrance","building","room","corridor"} category Category of object.
 * @apiParam {String} property Property of object to edit
 * @apiParam {String} editNewValue New value for the property.
 */
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

/**
 * @api {post} /entities/delete Delete an Existing Entity
 * @apiName PostDeleteEntity
 * @apiGroup entities
 *
 * @apiParam {String} IdOfDelete Unique id of object.
 * @apiParam {String="archive","permanent"} deleteType Type of deletion.
 */
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

/**
 * @api {post} /entities/restore Restore an Entity From Archive
 * @apiName PostRestoreEntity
 * @apiGroup entities
 *
 * @apiParam {String} IdOfRestore Unique id of object.
 */
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
    console.log(question)
    console.log(location)
    let response = '';
    if (question === 'time') {
        for (const room of rooms) {
            if (room.name === location) {
                response = room.weekdayHours + ' ' + room.weekendHours;
            }
        }
    } else {
        response = 'this aspect has not been added to the database';
    }
    resp.json(response);
});

module.exports = app;
