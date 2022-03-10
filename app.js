const TESTING = false



const express = require('express')
const sqlite3 = require('sqlite3')
const path = require('path')
const bcrypt = require('bcrypt')
const session = require('express-session')
const Sqlitestore = require('connect-sqlite3')(session)
const app = express()
const cors = require('cors')
app.use(express.static('client'))
app.use(express.json())
app.use(cors())
app.use(express.static('body-parser'))
app.use(express.urlencoded({ extended: true })) // Parse URL-encoded bodies
!TESTING && app.use(session({
  secret: 'DRI hospital',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 },
  store: new Sqlitestore()
}))

let entrances = []
let corridorIndex = []
let buildings = []
let rooms = []
let unmarkedRooms = []

const db = new sqlite3.Database('./database/entities.db', sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error(err.message)
  }
  db.all('SELECT * FROM entrances', [], (err, rows) => {
    if (err) console.log(err)
    if (!rows) console.log('no entrances found')
    if (rows) entrances = rows
  })
  db.all('SELECT * FROM corridorIndex', [], (err, rows) => {
    if (err) console.log(err)
    if (!rows) console.log('no corridors found')
    if (rows) corridorIndex = rows
  })
  db.all('SELECT * FROM buildings', [], (err, rows) => {
    if (err) console.log(err)
    if (!rows) console.log('no buildings found')
    if (rows) buildings = rows
  })
  db.all('SELECT * FROM rooms', [], (err, rows) => {
    if (err) console.log(err)
    if (!rows) console.log('no rooms found')
    if (rows) rooms = rows
  })
  db.all('SELECT * FROM unmarkedRooms', [], (err, rows) => {
    if (err) console.log(err)
    if (!rows) console.log('no unmarked rooms found')
    if (rows) unmarkedRooms = rows
  })
})

const staffDB = require('./staffDB')

// Entities

const placesForSearch = [rooms, buildings]

function checkAuthorisation (req, res, next) {
  if (TESTING) {
    next()
    return
  }
  if (req.session.authorised) {
    staffDB.get('SELECT username FROM staff WHERE username=?', [req.session.username], (err, rows) => {
      if (err) res.status(500).redirect('/login')
      if (rows) next()
      if (!rows) res.status(401).redirect('/login')
    })
  } else {
    res.status(401).redirect('/login')
  }
}
// Functions used in routes
function getPlace (category, id) {
  let searchThrough
  if (category === 'entrance') {
    searchThrough = entrances
  } else if (category === 'building') {
    searchThrough = buildings
  } else if (category === 'room') {
    searchThrough = rooms
  } else {
    return undefined
  }
  for (let i = 0; i < searchThrough.length; i++) {
    if (searchThrough[i].id === id) {
      return searchThrough[i]
    }
  }
  return undefined
}
/**
 * @api {get} /login Request Login Page
 * @apiDescription Requests login page. If already authorised, redirects to data page.
 * @apiName GetLogin
 * @apiGroup Login
 *
 * @apiSuccess {File} Response HTML file for login or data page
 */
app.get('/login', (req, res) => {
  if (req.session.authorised) {
    res.redirect('/data')
  } else {
    res.sendFile(path.resolve(__dirname, './private_client/login.html'))
  }
})
app.get('/data', checkAuthorisation, (req, res) => {
  res.sendFile(path.resolve(__dirname, './private_client/data.html'))
})
app.get('/logout', (req, res) => {
  req.session.destroy()
  res.status(200).send()
})

// Routes
/**
 * @api {get} /info/:category/:id Request an Object
 * @apiDescription Given an id and catgeory, returns the object from the database.
 * @apiName GetInfo
 * @apiGroup Entities
 *
 * @apiParam {String="entrance","building","room","corridor"} category Category of object.
 * @apiParam {String} id Unique id of object (first letter of category followed by a number).
 *
 * @apiSuccess {Object[]} object The dictionary requested.
 */
app.get('/info/:category/:id', function (req, resp) {
  const id = req.params.id
  const category = req.params.category
  const info = getPlace(category, id)
  if (info === undefined) {
    resp.status(404).send('Sorry, this place was not found, check your id and category are correct!')
    return
  }
  resp.json(info)
})

/**
 * @api {get} /entrances Request All Entrances
 * @apiName GetEntrances
 * @apiGroup Entrances
 *
 * @apiSuccess {Object[]} entrances List of all entrance objects.
 */
app.get('/entrances', function (req, resp) {
  db.all('SELECT * FROM entrances', [], (err, rows) => {
    if (err) console.log(err)
    if (!rows) console.log('no entrances found')
    if (rows) resp.json(rows)
  })
})

/**
 * @api {get} /rooms Request All Rooms
 * @apiName GetRooms
 * @apiGroup Rooms
 *
 * @apiSuccess {Object[]} rooms List of all room objects.
 */
app.get('/rooms', function (req, resp) {
  resp.json(rooms)
})

/**
 * @api {get} /rooms/drawing Request Info for Drawing Rooms
 * @apiDescription Returns the id, name and location of each room.
 * @apiName GetRoomsDrawingInfo
 * @apiGroup Rooms
 *
 * @apiSuccess {Object[]} roomsdrawing List of dictionaries of the required info for drawing the rooms.
 */
app.get('/rooms/drawing', function (req, resp) {
  const result = []
  rooms.forEach(room => {
    const { id, name, location } = room
    result.push({ id: id, name: name, location: location })
  })
  resp.json(result)
})

/**
 * @api {get} /rooms/listinfo Request Info for Writing a List of Rooms
 * @apiDescription Returns the id, name, latitude, longitude, building and level of each room.
 * @apiName GetRoomsListInfo
 * @apiGroup Rooms
 *
 * @apiSuccess {Object[]} roomsinfo List of dictionaries of the required info for listing each room.
 */
app.get('/rooms/listinfo', function (req, resp) {
  const result = []
  rooms.forEach(room => {
    const { id, name, latitude, longitude, building, level } = room
    result.push({ id: id, name: name, latitude, longitude, building: building, level: level })
  })
  resp.json(result)
})

/**
 * @api {get} /rooms/popupinfo/:id Request Info for Creating a Popup of a Room
 * @apiDescription Given a room id, returns the id, name, description, weekday opening hours, weekend opening hours and image name for that room.
 * @apiName GetARoomsPopupInfo
 * @apiGroup Rooms
 *
 * @apiParam {String} id Unique id of room.
 *
 * @apiSuccess {Object[]} roompopup Dictionary of the required info for creating a popup of the room.
 */
app.get('/rooms/popupinfo/:id', function (req, resp) {
  const id = req.params.id
  const room = getPlace('room', id)
  if (!room) {
    resp.status(404).send()
    return
  }
  const { name, description, weekdayHours, weekendHours, image } = room
  const result = { id, name, description, weekdayHours, weekendHours, image }
  resp.json(result)
})

/**
 * @api {get} /buildings Request All Buildings
 * @apiName GetBuildings
 * @apiGroup Buildings
 *
 * @apiSuccess {Object[]} buildings List of all building objects.
 */
app.get('/buildings', function (req, resp) {
  resp.json(buildings)
})

/**
 * @api {get} /building/listInfo/:id Request Name and Room List Colour
 * @apiDescription Given a building id, returns the name and room list colour for that building.
 * @apiName GetBuildingListInfo
 * @apiGroup Buildings
 * 
 * @apiParam {String} id Unique id of building.
 *
 * @apiSuccess {Object[]} buildingListInfo Name and room list colour of building.
 */
app.get('/building/listInfo/:id', function (req, resp) {
  const id = req.params.id
  console.log(id)
  const building = getPlace('building', id)
  console.log(building)
  resp.json([building.name, building.listColours])
})

/**
 * @api {get} /corridors Request All Corridors
 * @apiName GetCorridors
 * @apiGroup Corridors
 *
 * @apiSuccess {Object[]} corridors List of all corridor objects.
 */
app.get('/corridors', function (req, resp) {
  resp.json(corridorIndex)
})

/**
 * @api {get} /unmarkedRooms Request All Rooms That are Not Marked on Map
 * @apiName GetUnmarkedRooms
 * @apiGroup UnmarkedRooms
 *
 * @apiSuccess {Object[]} unmarkedRooms List of all unmarked room objects.
 */
app.get('/unmarkedRooms', function (req, resp) {
  resp.json(unmarkedRooms)
})
/**
 * @api {post} /login send request to log in
 * @apiName PostLogin
 * @apiGroup Login
 *
 * @apiParam {String} username Username of user attempting to log in
 * @apiParam {String} password Password of user attempting to log in
 *
 */
app.post('/login', (req, res) => {
  console.log('login received')
  if (!req.body.username || !req.body.password) res.status(400).send()
  staffDB.all('SELECT username, password FROM staff WHERE username=?', [req.body.username], async (err, rows) => {
    if (err) {
      console.log(err)
      res.status(500).send()
    }
    if (!rows.length > 0) res.status(200).redirect('/login')
    if (rows.length > 0) {
      for (const user of rows) {
        const valid = await bcrypt.compare(req.body.password, user.password)
        if (valid) {
          req.session.authorised = true
          req.session.username = req.body.username
          res.status(200).redirect('/data')
          return
        }
      }
    }
  })
})
/**
 * @api {post} /signup send request to create a new staff account
 * @apiName PostSignup
 * @apiGroup Login
 *
 * @apiParam {String} username Username of new user
 * @apiParam {String} password Password of new user
 */
app.post('/signup', checkAuthorisation, (req, res) => {
  if (!req.body.username || !req.body.password) {
    res.status(400).send()
    return
  }
  staffDB.get('SELECT username FROM staff WHERE username = ?', [req.body.username], async (err, rows) => {
    if (err) res.status(500).send()
    if (rows) res.status(400).send('Username already exists')
    if (!rows) {
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(req.body.password, salt)
      staffDB.run('INSERT INTO staff (username, password) VALUES (?,?)', [req.body.username, hashedPassword], (err) => {
        if (err) {
          console.log(err)
          res.status(500).send()
        }
        if (!err) res.status(201).send()
      })
    }
  })
})
/**
 * @api {post} /remove_account send request to remove a staff account
 * @apiName PostRemoveAccount
 * @apiGroup Login
 *
 * @apiParam {String} username Username of account to be deleted
 */
app.post('/remove_account', checkAuthorisation, (req, res) => {
  if (!req.body.username) {
    res.status(400).send()
    return
  }
  staffDB.get('SELECT username FROM staff WHERE username=?', [req.body.username], (err, rows) => {
    if (err) res.status(500).send()
    if (!rows) res.status(404).send()
    if (rows) {
      staffDB.run('DELETE FROM staff WHERE username =?', [req.body.username], (err) => {
        if (err) {
          console.log(err)
          res.status(500).send()
        }
        if (!err) {
          console.log(req.session.username)
          if (req.session.username === req.body.username) {
            req.session.destroy(() => {
              res.status(201).send()
            })
          } else {
            res.status(201).send()
          }
        }
      })
    }
  })
})

/**
 * @api {post} /entities/add Add a New Entity
 * @apiName PostNewEntity
 * @apiGroup Entities
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
app.post('/entities/add', checkAuthorisation, function (req, res) {
  const name = req.body.name
  const category = req.body.category

  if (!name || !category) {
    res.status(400).send()
    return
  }
  let id
  switch (category) {
    case 'room': {
      id = 'r' + (Number(rooms[rooms.length - 1].id.slice(1)) + 1)
      const { level, building, description, latitude, longitude, weekdayHours, weekendHours, image, facilities, products } = req.body
      if (!level || !building || !description || !latitude || !longitude || !weekdayHours || !weekendHours || !image || !facilities || !products) {
        res.status(400).send()
        return
      }
      if (!Number(latitude) || !Number(longitude)) {
        res.status(400).send()
        return
      }
      db.run('INSERT INTO rooms VALUES (?,?,?,?,?,?,?,?,?,?,?,?)', [id, name, building, level, latitude, longitude, description, weekdayHours, weekendHours, image, facilities, products], (err) => {
        if (!err) rooms.push({ id, name, building, level, latitude, longitude, description, weekdayHours, weekendHours, image, facilities, products })
        if (err) res.status(500).send()
      })
      break
    }
    case 'entrance': {
      id = 'e' + (Number(entrances[entrances.length - 1].id.slice(1)) + 1)
      const { latitude, longitude } = req.body
      if (!Number(latitude) || !Number(longitude)) {
        res.status(400).send()
        return
      }
      db.run('INSERT INTO entrances VALUES (?,?,?,?)', [id, name, latitude, longitude], (err) => {
        if (!err) entrances.push({ id, name, latitude, longitude })
        if (err) res.status(500).send()
      })
      break
    }
    case 'building': {
      id = 'b' + (Number(buildings[buildings.length - 1].id.slice(1)) + 1)
      if (!Number(req.body.latitude) || !Number(req.body.longitude)) {
        res.status(400).send()
        return
      }
      const { latitude, longitude, listColours } = req.body
      if (!listColours) {
        res.status(400).send()
        return
      }
      db.run('INSERT INTO buildings VALUES (?,?,?,?,?)', [id, name, latitude, longitude, listColours], (err) => {
        if (!err) buildings.push({ id, name, latitude, longitude, listColours })
        if (err) res.status(500).send()
      })
      break
    }
    case 'unmarkedRoom': {
      id = 'u' + (Number(unmarkedRooms[unmarkedRooms.length - 1].id.slice(1)) + 1)
      const { building, level } = req.body
      if (!building || !level) {
        res.status(400).send()
        return
      }
      db.run('INSERT INTO unmarkedRooms VALUES (?,?,?,?)', [id, name, building, level], (err) => {
        if (!err) unmarkedRooms.push({ id, name, building, level })
        if (err) res.status(500).send()
      })
      break
    }
    case 'corridor': {
      id = 'c' + (Number(unmarkedRooms[unmarkedRooms.length - 1].id.slice(1)) + 1)
      const { latitudeStart, longitudeStart, latitudeEnd, longitudeEnd, neighbours } = req.body
      if (!neighbours) {
        res.status(400).send()
        return
      }
      if (!Number(latitudeStart) || !Number(latitudeEnd) || !Number(longitudeStart) || !Number(longitudeEnd)) {
        res.status(400).send()
        return
      }
      db.run('INSERT INTO corridorIndex VALUES (?,?,?,?,?,?,?)', [id, name, latitudeStart, longitudeStart, latitudeEnd, longitudeEnd], (err) => {
        if (!err) corridorIndex.push({ id, name, latitudeStart, longitudeStart, latitudeEnd, longitudeEnd, neighbours })
        if (err) res.status(500).send()
      })
      break
    }
    default:
      res.status(400).send()
      return
  }
  res.status(201).send(id)
})

/**
 * @api {post} /entities/edit Edit an Existing Entity
 * @apiDescription Updates a given property of an existing entity to a given value.
 * @apiName PostEditEntity
 * @apiGroup Entities
 *
 * @apiParam {String} id Unique id of object.
 * @apiParam {String="entrance","building","room","corridor","unmarkedRoom"} category Category of object.
 * @apiParam {String} property Property of object to edit
 * @apiParam {String} NewValue New value for the property.
 */
app.post('/entities/edit', checkAuthorisation, function (req, res) {
  const id = req.body.id
  const category = req.body.category
  if (!id || !category) {
    res.status(400).send()
    return
  }
  let table
  switch (category) {
    case 'room':
      table = 'rooms'
      break
    case 'building':
      table = 'buildings'
      break
    case 'entrance':
      table = 'entrances'
      break
    case 'unmarkedRoom':
      table = 'unmarkedRooms'
      break
    case 'corridor':
      table = 'corridorIndex'
      break
    default:
      res.status(400).send()
      return
  }
  const property = req.body.property
  const value = req.body.NewValue
  if (!property || !value) {
    res.status(400).send()
    return
  }
  if (property.includes('latitude') || property.includes('longitude')) {
    if (!Number(value)) {
      res.status(400).send()
      return
    }
  }
  db.run(`UPDATE ${table} SET ${property} = ? WHERE id=?`, [value, id], (err) => {
    if (err) {
      console.log(err)
      res.status(500).send()
    }
    if (!err) {
      let dataList
      switch (category) {
        case 'room':
          dataList = rooms
          break
        case 'building':
          dataList = buildings
          break
        case 'entrance':
          dataList = entrances
          break
        case 'unmarkedRoom':
          dataList = unmarkedRooms
          break
        case 'corridor':
          dataList = corridorIndex
          break
        default:
          break
      }
      for (const data of dataList) {
        if (data.id === id) {
          data[property] = value
        }
      }

      res.status(201).send()
    }
  })
})

/**
 * @api {post} /entities/delete Delete an Existing Entity
 * @apiName PostDeleteEntity
 * @apiGroup Entities
 *
 * @apiParam {String} id Unique id of object.
 */
app.post('/entities/delete', checkAuthorisation, function (req, res) {
  const id = req.body.id
  if (!id) {
    res.status(400).send()
    return
  }
  let searchThrough
  let searchTable
  switch (id[0]) {
    case 'b':
      searchThrough = buildings
      searchTable = 'buildings'
      break
    case 'r':
      searchThrough = rooms
      searchTable = 'rooms'
      break
    case 'e':
      searchThrough = entrances
      searchTable = 'entrances'
      break
    case 'c':
      searchThrough = corridorIndex
      searchTable = 'corridorIndex'
      break
    case 'u':
      searchThrough = unmarkedRooms
      searchTable = 'unmarkedRooms'
      break
    default:
      res.status(400).send()
      return
  }
  const query = `DELETE FROM ${searchTable} WHERE id = ?`
  db.run(query, [id], (err) => {
    if (err) {
      console.log(err)
      res.status(500).send()
    }
    if (!err) {
      let index = 0
      let found = false
      for (const data of searchThrough) {
        if (data.id === id) {
          found = true
          searchThrough.splice(index, 1)
          break
        }
        index += 1
      }
      if (!found) res.status(404).send()
      res.status(201).send()
    }
  })
})

/*app.get('/entities/search/:word', function (req, resp) {
  const word = req.params.word.toLowerCase().replace(/[^\w]|_/g, '')
  const matches = []
  let name
  for (let i = 0; i < placesForSearch.length; i++) {
    const category = placesForSearch[i]
    for (let j = 0; j < category.length; j++) {
      name = category[j].name.toLowerCase().replace(/[^\w]|_/g, '')
      if (name.includes(word)) {
        matches.push([category[j].name, category[j].id])
      }
    }
  }
  resp.json(matches)
})
*/

app.post('/info', (req, resp) => {
  const location = req.body.location
  const question = req.body.Question
  console.log(question)
  console.log(location)
  let response = ''
  if (question === 'time') {
    for (const room of rooms) {
      if (room.name.toLowerCase() === location.toLowerCase()) {
        response = [room.weekdayHours, room.weekendHours]
        const message = { weekDay: response[0], weekEnd: response[1] }
        resp.set('content-type', 'application/json')
        resp.send(JSON.stringify(message))
      }
    }
  } else if (question === 'facility') {
    for (const room of rooms) {
      if (room.name.toLowerCase() === location.toLowerCase()) {
        response = room.facilities
        const message = { facilities: response }
        resp.set('content-type', 'application/json')
        resp.send(JSON.stringify(message))
      }
    }
  } else if (question === 'products') {
    for (const room of rooms) {
      if (room.name.toLowerCase() === location.toLowerCase()) {
        response = room.products
        const message = { products: response }
        resp.set('content-type', 'application/json')
        resp.send(JSON.stringify(message))
      }
    }
  } else if (question === 'general') {
    for (const room of rooms) {
      if (room.name.toLowerCase() === location.toLowerCase()) {
        response = room.description
        const message = { description: response }
        resp.set('content-type', 'application/json')
        resp.send(JSON.stringify(message))
      }
    }
  }

  console.log(response)
})

module.exports = app
