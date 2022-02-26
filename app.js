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
    const { name, description, weekdayHours, weekendHours, image } = room;
    const result = { id, name, description, weekdayHours, weekendHours, image };
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
 * @apiParam {String} name Name of new object.
 * @apiParam {String="entrance","building","room","corridor","unmarkedRoom",} category Category of new object.
 * @apiParam {String} latitude Latitude of new object.
 * @apiParam {String} longitude Longitude of new object.
 * @apiParam {String} building Building where new object is located.
 * @apiParam {String} level Level new object is located on.
 * @apiParam {String} description Description of new object.
 * @apiParam {String} weekdayHours Start of the weekday opening hours of the new object if applicable.
 * @apiParam {String} weekendHours Start of the weekend opening hours of the new object if applicable.
 * @apiParam {String} latitudeStart Latitude of starting point for corridors.
 * @apiParam {String} latitudeend Latitude of ending point for corridors.
 * @apiParam {String} longitudeStart Longitude of starting point for corridors.
 * @apiParam {String} longitudeEnd Longitude of ending point for corridors.
 * @apiParam {String} [neighbours] Integer list representing all neighbouring corridors.
 * @apiParam {String} image Name of the image file for the new object if applicable.
 * 
 */
app.post('/entities/add', check_authorisation, function (req, res) {
    console.log(req.body)
    const name = req.body.name;
    const category = req.body.category;
    let id;
    switch (category) {
        case 'room':
            id = 'r' + (Number(rooms[rooms.length - 1].id.slice(1)) + 1)
            break;
        case 'entrance':
            id = 'e' + (Number(enrtances[entrances.length - 1].id.slice(1)) + 1)
            break;
        case 'building':
            id = 'b' + (Number(buildings[buildings.length - 1].id.slice(1)) + 1)
            break;
        case 'unmarkedRoom':
            id = 'u' + (Number(unmarkedRooms[unmarkedRooms.length - 1].id.slice(1)) + 1)
            break;
        case 'corridor':
            id = 'c' + (Number(unmarkedRooms[unmarkedRooms.length - 1].id.slice(1)) + 1)
            break;
        default:
            break;
    }
    switch (category) {
        case 'room': {
            let {level, building, description, latitude, longitude, weekdayHours, weekendHours, image, facilities, products} = req.body
            db.run("INSERT INTO rooms VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",[id,name,building, level,latitude,longitude,description,weekdayHours,weekendHours,image, facilities, products],(err) => {
                if (!err) rooms.push({id, name, building, level, latitude, longitude, description, weekdayHours, weekendHours,image,facilities,products})
                if (err) res.status(500).send()
            })
            break;
        }
        case 'entrance': {
            let {latitude, longitude} = req.body;
            db.run("INSERT INTO entrances VALUES (?,?,?,?)",[id,name,latitude, longitude],(err) => {
                if (!err) entrances.push({id, name, latitude, longitude})
                if (err) res.status(500).send()
            })
            break;
        }
        case 'building': {
            let {latitude, longitude} = req.body;
            db.run("INSERT INTO buildings VALUES (?,?,?,?)",[id,name,latitude, longitude],(err) => {
                if (!err) buildings.push({id, name, latitude, longitude})
                if (err) res.status(500).send()
            })
            break;
        }
        case 'unmarkedRoom': {
            let {building, level} = req.body;
            db.run("INSERT INTO unmarkedRooms VALUES (?,?,?,?)",[id, name, building, level],(err) => {
                if (!err) unmarkedRooms.push({id, name, building, level})
                if (err) res.status(500).send()
            })
            break;
        }
        case 'corridor': {
            let {latitudeStart, longitudeStart, latitudeEnd, longitudeEnd, neighbours} = req.body;
            db.run("INSERT INTO corridorIndex VALUES (?,?,?,?,?,?,?)",[id,name,latitudeStart, longitudeStart, latitudeEnd, longitudeEnd],(err) => {
                if (!err) corridorIndex.push({id,name,latitudeStart,longitudeStart,latitudeEnd,longitudeEnd,neighbours})
                if (err) res.status(500).send()
            })
            break;
        }
        default:
            break;
    }
    res.status(201).send(id)
});

/**
 * @api {post} /entities/edit Edit an Existing Entity
 * @apiName PostEditEntity
 * @apiGroup entities
 *
 * @apiParam {String} id Unique id of object.
 * @apiParam {String="entrance","building","room","corridor","unmarkedRoom"} category Category of object.
 * @apiParam {String} property Property of object to edit
 * @apiParam {String} NewValue New value for the property.
 */
app.post('/entities/edit', check_authorisation, function (req, res) {
    const id = req.body.id;
    const category = req.body.category;
    console.log(req.body)
    let table;
    switch (category) {
        case 'room':
            table = 'rooms';
            break;
        case 'building':
            table = 'buildings';
            break;
        case 'entrance':
            table = 'entrances';
            break;
        case 'unmarkedRoom':
            table = 'unmarkedRooms';
        case 'corridor':
            table = 'corridorIndex'
        default:
            break;
    }
    const property = req.body.property;
    let value = req.body.NewValue;
    let query = `UPDATE ${table} SET ${property} = ? WHERE id=?`
    db.run(query,[value,id],(err) => {
        if (err) {
            console.log(err);
            res.status(500).send();
        }
        if (!err) {
            let data_list;
            switch (category) {
                case 'room':
                    data_list = rooms;
                    break;
                case 'building':
                    data_list = buildings
                    break;
                case 'entrance':
                    data_list = entrances
                    break;
                case 'unmarkedRoom':
                    data_list = unmarkedRooms
                case 'corridor':
                    data_list = corridorIndex
                default:
                    break;
            
            }
            for (let data of data_list) {
                if(data.id === id) {
                    data[property] = value;
                }
            }

            res.status(201).send()
        }
    })
});

/**
 * @api {post} /entities/delete Delete an Existing Entity
 * @apiName PostDeleteEntity
 * @apiGroup entities
 *
 * @apiParam {String} id Unique id of object.
 * @apiParam {String="archive","permanent"} deleteType Type of deletion.
 */
app.post('/entities/delete', check_authorisation, function (req, res) {
    const id = req.body.id;
    const deleteType = req.body.deleteType;
    let searchThrough;
    let searchTable;
    switch (id[0]) {
        case 'b':
            searchThrough = buildings;
            searchTable = 'buildings';
            break;
        case 'r':
            searchThrough = rooms;
            searchTable = 'rooms';
            break;
        case 'e':
            searchThrough = entrances;
            searchTable = 'entrances';
            break;
        case 'c':
            searchThrough = corridorIndex;
            searchTable = 'corridorIndex';
            break;
        case 'u':
            searchThrough = unmarkedRooms;
            searchTable = 'unmarkedRooms'
        default:
            res.status(400).send()
            break;
    }
    if (deleteType === 'archive') {
        // archive needs implementing

    } else {
        
        let query = `DELETE FROM ${searchTable} WHERE id = ?`
        db.run(query,[id],(err) => {
            if (err) {
                console.log(err);
                res.status(500).send()
            }
            if (!err) {
                let index = 0
                for (let data of searchThrough) {
                    if (data.id === id) {
                        searchThrough.splice(index,1)
                        break;
                    }
                    index += 1
                }
                res.status(201).send()
            }
        })
    }
    
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
        for (let room of rooms) {
            if (room.name.toLowerCase() === location.toLowerCase()) {
                response = [room.weekdayHours,room.weekendHours];
                const message = {weekDay: response[0],weekEnd: response[1]};
                resp.set('content-type','application/json');
                resp.send(JSON.stringify(message));
            }
        }
    } else {
        response = 'this aspect has not been added to the database';
    }
    console.log(response);
    
});

module.exports = app;
