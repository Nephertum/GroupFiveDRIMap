/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable camelcase */
const key = 'pk.eyJ1Ijoid29yZHlzdW1vIiwiYSI6ImNrdmw4M2tuaDBqMmQyb281YWVrNTd4cjEifQ.K9oZUZYiwAd2sJs2_KTAug'
// Options for map
const options = {
  container: 'map',
  lat: 53.53094965890605,
  lng: -1.1095832474735168,
  zoom: 17,
  maxBounds: [
    [-1.1147841887079721, 53.52933045167083], // Southwest coordinates
    [-1.1063333233140895, 53.532293206606084] // NorthEast coordinates

  ],
  bearing: -22,
  style: 'mapbox://styles/mapbox/streets-v10'
}
// GLOBAL VARIABLES
// Create an instance of MapboxGL
const mappa = new Mappa('MapboxGL', key)
let myMap
// creates the event listener for when the user holds down the mouse to place the pin
let mouseIsDown = false
let start = 0
let dest = 0
let count = 0
let navigation_loaded = false
let route
let interval
const pin = {
  name: 'pin',
  latitude: 0,
  longitude: 0
}
let graph

const direction_list = document.getElementById('offcanvasDirections')
const direction_canvas = new bootstrap.Offcanvas(direction_list)

const navigation_menu = document.getElementById('offcanvasNavigation')
const navigation_canvas = new bootstrap.Offcanvas(navigation_menu)
// pin handling
window.addEventListener('mousedown', function () {
  mouseIsDown = true
  interval = setInterval(() => {
    if (mouseIsDown) {
      count += 1
      if (count === 3) {
        updatePinLocation()
      }
    }
  }, 1000)
})
window.addEventListener('mouseup', function () {
  mouseIsDown = false
  count = 0
  clearInterval(interval)
})
window.addEventListener('touchstart', function () {
  mouseIsDown = true
  interval = setInterval(() => {
    if (mouseIsDown) {
      count += 1
      if (count === 3) {
        updatePinLocation()
      }
    }
  }, 1000)
})
window.addEventListener('touchend', function () {
  mouseIsDown = false
  count = 0
  clearInterval(interval)
})

// fetch on load
window.addEventListener('load', async () => {
  try {
    let res = await fetch('/rooms/listinfo')
    let result = await res.json()
    const room_list = result

    res = await fetch('/unmarkedrooms')
    result = await res.json()
    const unmarked_room_list = result
    populate_list(room_list, unmarked_room_list)
    // tutorial setup
    if (!localStorage.visited) {
      document.getElementById('tutorial_container').style.display = 'block'
      document.getElementById('end_tutorial').addEventListener('click', () => {
        document.getElementById('tutorial_container').style.display = 'none'
      })
      document.getElementById('startStep2').addEventListener('click', () => {
        document.getElementById('tutorialStep2').style.display = 'block'
        document.getElementById('tutorialStep1').style.display = 'none'
      })
      document.getElementById('startStep3').addEventListener('click', () => {
        document.getElementById('tutorialStep3').style.display = 'block'
        document.getElementById('tutorialStep2').style.display = 'none'
      })
      document.getElementById('startStep4').addEventListener('click', () => {
        document.getElementById('tutorialStep4').style.display = 'block'
        document.getElementById('tutorialStep3').style.display = 'none'
      })
      document.getElementById('startStep5').addEventListener('click', () => {
        document.getElementById('tutorialStep5').style.display = 'block'
        document.getElementById('tutorialStep4').style.display = 'none'
      })
      document.getElementById('completeTutorial').addEventListener('click', () => {
        document.getElementById('tutorial_container').style.display = 'none'
      })
    }
    localStorage.visited = true
  } catch (error) {
    displayServerErrorMessage()
  }
})

// locations section:
// order of locations returned is [entrances, corridorIndex, buildings, rooms]
/* let locations;
fetch('http://127.0.0.1:8090/entities')
.then(response => response.json())
.then(function(body){
  locations = body;
}) */

// Fetch drawing properties so they do not have to be reloaded each time
let entrances
fetch('/entrances')
  .then(response => response.json())
  .then(function (body) {
    entrances = body
  })
  .catch(() => {
    displayServerErrorMessage()
  })

let corridors
fetch('/corridors')
  .then(response => response.json())
  .then(function (body) {
    corridors = body
  })
  .catch(() => {
    displayServerErrorMessage()
  })

let buildings
fetch('/buildings')
  .then(response => response.json())
  .then(function (body) {
    buildings = body
  })
  .catch(() => {
    displayServerErrorMessage()
  })

let rooms
fetch('/rooms')
  .then(response => response.json())
  .then(function (body) {
    rooms = body
  })
  .catch(() => {
    displayServerErrorMessage()
  })

let loaded = false
function setup () {
  const canvas = createCanvas(window.innerWidth, 700)
  // Create a tile map and overlay the canvas on top.
  myMap = mappa.tileMap(options)
  myMap.overlay(canvas)
  // anytime the map is panned or zoomed this function will execute
  myMap.onChange(updateMap)
  setupButton()
  popupExists = false // global variable
}
function setupButton () {
  const Searchbutton = document.getElementById('SearchBtn')
  const Searchinput = document.getElementById('roomSearch')
  Searchbutton.addEventListener('click', () => {
    const room = Searchinput.value
    // when empty input
    if (room.length !== 0) {
      document.getElementById('searchError').style.display = 'none'
      Searchinput.value = ''
      const element = getNodeByName(room)
      // when invalid input
      if (element !== 0) {
        zoomOnLocation([element.latitude, element.longitude], 20)
        placePopup(element.id, [element.latitude, element.longitude], 15, 15)
      } else {
        document.getElementById('searchError').innerText = 'No room found'
        document.getElementById('searchError').style.display = 'block'
      }
    } else {
      document.getElementById('searchError').innerText = "Field can't be blank"
      document.getElementById('searchError').style.display = 'block'
    }
  })
  const open_navigate_button = document.getElementById('openNavigateBtn')
  open_navigate_button.addEventListener('click', () => {
    navigation_canvas.show()
  })
  const navigateButton = document.getElementById('navigateBtn')
  const input1 = document.getElementById('path1')
  const input2 = document.getElementById('path2')
  navigateButton.addEventListener('click', () => {
    document.querySelectorAll('.routeStep').forEach(element => {
      element.remove()
    })
    if (setNavigation(input1.value, input2.value)) {
      document.getElementById('roomError').style.display = 'none'
      input1.value = ''
      input2.value = ''
      direction_canvas.show()
      navigation_canvas.hide()
      updateMap()
    } else {
      document.getElementById('roomError').style.display = 'block'
    }
  })
  const usePinBtn = document.getElementById('usePinToggle')
  usePinBtn.addEventListener('click', () => {
    if (pin.latitude !== 0) {
      document.getElementById('pinError').style.display = 'none'
      input1.value = 'pin'
    } else {
      document.getElementById('pinError').style.display = 'block'
    }
  })
  const clearButton = document.getElementById('clearNavBtn')
  clearButton.addEventListener('click', () => {
    clearHighlight()
  })
}
function AI_navigate () {
  let previous_length = 0
  let latest_message = ''
  // every second the DOM is checked to see if new chatbot conversation nodes have appeared
  setInterval(() => {
    // gets all messages form chatbot
    const messages = document.querySelectorAll('.WACWidget__MarkdownP')
    let navigation_messages_count = 0
    for (const message of messages) {
      const text = message.innerText
      // checks if any messages relate to navigation
      if (text.includes(':') && text.slice(0, 5) === 'Route') {
        navigation_messages_count += 1
        latest_message = text
      }
    }
    // if there are new messages
    if (navigation_messages_count !== previous_length) {
      const sent_messages = document.querySelectorAll('.WAC__sent')
      const last_sent = sent_messages[sent_messages.length - 1].childNodes[1].childNodes[0].innerText.split(' ')
      let indexFrom = -1
      let indexTo = -1
      let swap = false
      last_sent.forEach((element, index) => {
        if (element.toLowerCase() === 'from') {
          indexFrom = index
        }
        if (element.toLowerCase() === 'to') {
          indexTo = index
        }
      })
      if (indexFrom < indexTo) {
        swap = true
      }
      const data = latest_message.split(':')
      const locations = data[1].split(',')
      previous_length = navigation_messages_count
      document.querySelectorAll('.routeStep').forEach(element => {
        element.remove()
      })
      // displays directions list
      const directionMenu = document.getElementById('offcanvasDirections')
      const canvas = new bootstrap.Offcanvas(directionMenu)
      canvas.show()
      // realistically, a user will want to navigate from the pin as opposed to towards it
      if (locations[1] === 'pin' || swap) {
        setNavigation(locations[1], locations[0])
      } else {
        setNavigation(locations[0], locations[1])
      }
      updateMap()
    }
  }, 1000)
}

// main update loop for the map, this is where any additional drawing functionality should be added
function updateMap () {
  // disables pitch change
  // myMap.map.setPitch(0)
  if (myMap.map.getPitch() > 25) {
    myMap.map.setPitch(25)
  }
  // on initial load, add interaction controls to map
  if (!loaded) {
    myMap.map.addControl(new mapboxgl.FullscreenControl())
    myMap.map.addControl(new mapboxgl.NavigationControl())
    graph = generateGraph()
    loaded = true
    AI_navigate()
  }

  // clears anything currently drawn on the map
  clear()
  drawNodes()
  placePin()
  if (start !== 0 && dest !== 0) {
    route = calculate_route()

    highlight_path(route)
  }
  console.log(check_left(1, 4))
}
// changes the start and dest values for the next map update
function setNavigation (source, destination) {
  clearHighlight()
  let newStart = 0
  let newDest = 0
  if (source.toLowerCase() === 'pin') {
    if (pin.latitude !== 0 && pin.longitude !== 0) {
      newStart = pin
    }
  } else {
    newStart = getNodeByName(source)
  }
  if (destination.toLowerCase() === 'pin') {
    return false
  }
  newDest = getNodeByName(destination)
  if (newStart === 0 || newDest === 0) {
    return false
  } else {
    if (newStart.name === newDest.name) {
      return false
    }
    start = newStart
    dest = newDest
    navigation_loaded = false
    return true
  }
}
function getNodeByName (name) {
  let result = 0
  // looks at all room nodes
  rooms.forEach(element => {
    if (element.name.toLowerCase() === name.toLowerCase()) {
      result = element
    }
  })
  // looks at all building
  buildings.forEach(element => {
    if (element.name.toLowerCase() === name.toLowerCase()) {
      result = element
    }
  })
  return result
}

function populate_list (room_list, unmarked_room_list) {
  buildingsFound = [] // Global store of buildings added to the list
  levelsFound = [] // Global store of levels added to the list
  listColours = ['rgba(76, 197, 96, 0.664)', 'rgba(220, 144, 223, 0.548)', 'rgba(85, 190, 194, 0.692)', 'rgba(233, 132, 203, 0.582)'] // Global store of colours for the list boxes
  room_list.forEach(room => addRoomToList(room))
  unmarked_room_list.forEach(room => addRoomToList(room, 'no'))
}

function addRoomToList (room, marked = 'yes') {
  let div
  const building = room.building
  const level = room.level
  const thisLevel = building + '-' + level
  let newColumn
  let innerColumn
  let heading
  let newLevel
  // Check level not unknown
  if (!isNaN(level)) {
    // If building list has not already been made, make it
    if (!buildingsFound.includes(building)) {
      buildingsFound.push(building)
      newColumn = document.createElement('div')
      newColumn.classList += 'col-md-3'
      innerColumn = document.createElement('div')
      innerColumn.classList += 'col-sm listCol'
      innerColumn.id = building
      newColumn.appendChild(innerColumn)
      document.getElementById('roomlist').appendChild(newColumn)
      fetch('/building/listInfo/' + building)
        .then(response => {
          removeServerErrorMessage()
          if (!response.ok) throw Error
          return response.json()
        })
        .then(function (bInfo) {
          heading = document.createElement('h2')
          heading.innerHTML = bInfo[0]
          document.getElementById(building).prepend(heading)
          if (bInfo[1]) {
            document.getElementById(building).style.backgroundColor = bInfo[1]
          }
        })
        .catch(() => {
          displayServerErrorMessage()
        })
    }
    // If this level has not been added to the list before, add it
    if (!levelsFound.includes(thisLevel)) {
      levelsFound.push(thisLevel)
      newLevel = document.createElement('div')
      newLevel.id = thisLevel
      newLevelHeading = document.createElement('h2')
      newLevelHeading.innerHTML += '<hr>'
      if (level === 2) {
        newLevelHeading.innerHTML += 'Ground Floor (Level 2)'
      } else {
        newLevelHeading.innerHTML += 'Level ' + level
      }
      newLevelHeading.innerHTML += '<hr>'
      newLevel.appendChild(newLevelHeading)
      document.getElementById(building).appendChild(newLevel)
    }
    // Add the room to the list in the right place
    div = document.getElementById(thisLevel)
    let newItem

    if (marked === 'yes') {
      // If it is a marked room, make the name clickable
      newItem = document.createElement('a')
      newItem.setAttribute('onclick', `javascript:room_list_click("${room.name}");`)
    } else {
      newItem = document.createElement('p')
      newItem.classList.add('unmarked')
    }
    newItem.classList.add('room-link')
    newItem.id = room.id
    newItem.innerHTML = room.name
    div.appendChild(newItem)
    if (marked === 'yes') {
      newItem = document.createElement('br')
      div.appendChild(newItem)
    }
  }
}

function room_list_click (name) {
  const room_width = 15
  const room_height = 15
  const room_focus = 20
  const node = getNodeByName(name)
  zoomOnLocation([node.latitude, node.longitude], room_focus)
  placePopup(node.id, [node.latitude, node.longitude], room_width, room_height)
  window.scrollTo(0, 100)
}
function drawNodes () {
  const entrance_min_zoom = 1
  const entrance_max_zoom = 100
  const building_min_zoom = 1
  const building_max_zoom = 17
  const room_min_zoom = 18
  const room_max_zoom = 100
  const corridor_min_zoom = 18
  const corridor_max_zoom = 100

  entrances.forEach(entrance => {
    if (checkValidZoom(entrance_min_zoom, entrance_max_zoom)) {
      drawEntrances(entrance)
    }
  })
  buildings.forEach(building => {
    if (checkValidZoom(building_min_zoom, building_max_zoom)) {
      drawBuildings(building)
    }
  })
  rooms.forEach(room => {
    if (checkValidZoom(room_min_zoom, room_max_zoom)) {
      drawRooms(room)
    }
  })
  corridors.forEach(corridor => {
    if (checkValidZoom(corridor_min_zoom, corridor_max_zoom)) {
      drawRoute(corridor)
    }
  })
}
// draws the internal cooridoors on the map after a certain zoom threshold
function drawRoute (node) {
  noFill()
  stroke(0, 0, 0)
  strokeWeight(2)
  beginShape()
  const routeStart = myMap.latLngToPixel(node.latitudeStart, node.longitudeStart)
  const routeEnd = myMap.latLngToPixel(node.latitudeEnd, node.longitudeEnd)
  vertex(routeStart.x, routeStart.y)
  vertex(routeEnd.x, routeEnd.y)
  endShape()
}

function updatePinLocation () {
  const newlocation = myMap.pixelToLatLng(mouseX, mouseY)
  pin.latitude = newlocation.lat
  pin.longitude = newlocation.lng
  navigation_loaded = false
  clearDirections()
  updateMap()
}
function placePin () {
  fill(255, 0, 0)
  strokeWeight(1)
  if (pin.latitude !== 0 && pin.longitude !== 0) {
    const center = myMap.latLngToPixel(pin.latitude, pin.longitude)
    beginShape()
    vertex(center.x, center.y)
    vertex(center.x + 8, center.y - 16)
    vertex(center.x + 8, center.y - 32)
    vertex(center.x - 8, center.y - 32)
    vertex(center.x - 8, center.y - 16)
    vertex(center.x, center.y)
    endShape()
  }
}
function drawEntrances (node) {
  const width = 10
  const height = 10
  textAlign(LEFT, BOTTOM)
  strokeWeight(1)
  stroke(100, 100, 100)
  textSize(15)
  const zoom = myMap.zoom()
  const point = myMap.latLngToPixel(node.latitude, node.longitude)
  fill(200, 100, 100)
  ellipse(point.x, point.y, width, height)
  fill(0, 0, 0)
  if (zoom > 18) {
    text(node.name, point.x + 6, point.y - 6)
  }
}
function drawBuildings (node) {
  const width = 80
  const height = 40
  strokeWeight(1)
  rectMode(CENTER)
  textAlign(CENTER, CENTER)
  pos = myMap.latLngToPixel(node.latitude, node.longitude)
  fill(0, 0, 0)
  text(node.name, pos.x, pos.y, width, height)
}
function drawRooms (node) {
  // let width = 15;
  // let height = 10;
  strokeWeight(1)
  rectMode(CENTER)
  textAlign(CENTER, CENTER)
  pos = myMap.latLngToPixel(node.latitude, node.longitude)
  fill(2, 117, 216)

  ellipse(pos.x, pos.y, 15, 15)
  fill(0, 0, 0)
  text(node.name, pos.x, pos.y + 15)
}
function generateGraph () {
  const graph = []
  // loops through each cooridoor node
  for (let i = 0; i < corridors.length; i++) {
    const current = []

    const nodes = Array.from(corridors[i].neighbours.split(', '), Number)
    // loops through every other cooridoor
    for (let j = 0; j < corridors.length; j++) {
      // if the jth cooridoor is a neighbour of the ith cooridoor then store a one
      if (nodes.includes(j + 1)) {
        current.push(1)
      } else {
        // otherwise store a zero to signal no connection between nodes
        current.push(0)
      }
    }
    graph.push(current)
  }

  return graph
}
// calculates nearest corridor to a location node
function calculateNearestCorridor (location) {
  const room = myMap.latLngToPixel(location.latitude, location.longitude)
  let minDistance = Infinity
  let result = 0
  // calculates distance for each corridor
  corridors.forEach((corridor, index) => {
    corridorStart = myMap.latLngToPixel(corridor.latitudeStart, corridor.longitudeStart)
    corridorEnd = myMap.latLngToPixel(corridor.latitudeEnd, corridor.longitudeEnd)
    center = { x: (corridorStart.x + corridorEnd.x) / 2, y: (corridorStart.y + corridorEnd.y) / 2 }
    const distance = Math.sqrt(((center.x - room.x) ** 2) + ((center.y - room.y) ** 2))
    if (distance < minDistance) {
      minDistance = distance
      result = index + 1
    }
  })
  return result
}
function displayServerErrorMessage () {
  document.getElementById('serverError').style.display = 'block'
}
function removeServerErrorMessage () {
  document.getElementById('serverError').style.display = 'none'
}
// highlights a cooridoor red, to be used for navigation
function highlight_path (cooridoor_list) {
  console.log(cooridoor_list)
  // when the route is only over one corridor
  if (cooridoor_list.length === 1) {
    highlight_small_route(cooridoor_list[0], start, dest)
  }
  cooridoor_list.length > 1 && cooridoor_list.forEach((path, index) => {
    // when route is first drawn, add all steps to direction list
    if (!navigation_loaded) {
      if (index > 0) {
        addRouteStep(path, cooridoor_list[index - 1])
      } else {
        addRouteStep(path, start.name)
      }
    }
    switch (index) {
      // for the first part of the route, either highlight corridor or link corridor to node
      case 0:
        if (Number.isInteger(start)) {
          highlight_cooridoor(path)
        } else {
          highlightEndpoint(path, cooridoor_list[1], start)
        }
        break
      // for the last part of the route, link corridor to destination node
      case cooridoor_list.length - 1:
        highlightEndpoint(path, cooridoor_list[cooridoor_list.length - 2], dest)
        break
      default:
        highlight_cooridoor(path)
        break
    }
  })
  // add destination to direction list
  !navigation_loaded && addRouteStep(dest.name, -1)
  // speak first step of route
  !navigation_loaded && speak_next_step()
  navigation_loaded = true
}
function highlight_cooridoor (index) {
  noFill()
  stroke(0, 123, 255)
  strokeWeight(3)
  const highlight = corridors[index - 1]
  const highlight_start = myMap.latLngToPixel(highlight.latitudeStart, highlight.longitudeStart)
  const highlight_end = myMap.latLngToPixel(highlight.latitudeEnd, highlight.longitudeEnd)
  beginShape()
  vertex(highlight_start.x, highlight_start.y)
  vertex(highlight_end.x, highlight_end.y)
  endShape()
}
// calculate intersect between line containing points (x_1,y_1) and (x_2,y_2) and the point (x_3,y_3)
function calculate_intersect (x_1, y_1, x_2, y_2, x_3, y_3) {
  const u = (((x_3 - x_1) * (x_2 - x_1)) + ((y_3 - y_1) * (y_2 - y_1))) / (((x_2 - x_1) * (x_2 - x_1)) + ((y_2 - y_1) * (y_2 - y_1)))
  const x = x_1 + (u * (x_2 - x_1))
  const y = y_1 + (u * (y_2 - y_1))
  return [x, y]
}
// highlights the end of the route by only partially highlighting a cooridoor and connecting it to a room
function highlightEndpoint (cooridoor, adj_cooridoor, node) {
  noFill()
  stroke(0, 123, 255)
  strokeWeight(3)
  // calculates which direction a route goes along a corridor
  const cooridoorData = corridors[cooridoor - 1]
  const prevCooridoorData = corridors[adj_cooridoor - 1]
  const current_start = myMap.latLngToPixel(cooridoorData.latitudeStart, cooridoorData.longitudeStart)
  const current_end = myMap.latLngToPixel(cooridoorData.latitudeEnd, cooridoorData.longitudeEnd)
  const prev_end = myMap.latLngToPixel(prevCooridoorData.latitudeEnd, prevCooridoorData.longitudeEnd)
  // end points of adjacent corridor is used in this case, but the start point could also be used
  const diff_start = Math.abs(current_start.x - prev_end.x) + Math.abs(current_start.y - prev_end.y)
  const diff_end = Math.abs(current_end.x - prev_end.x) + Math.abs(current_end.y - prev_end.y)
  // chooses point closest to the adjacent corridor on the route
  let highlight_start
  if (diff_start > diff_end) {
    highlight_start = current_end
  } else {
    highlight_start = current_start
  }

  const point = myMap.latLngToPixel(node.latitude, node.longitude)
  // calculates intersect point between room and corridor
  const highlight_middle = calculate_intersect(current_start.x, current_start.y, current_end.x, current_end.y, point.x, point.y)

  beginShape()
  vertex(highlight_start.x, highlight_start.y)
  vertex(highlight_middle[0], highlight_middle[1])
  vertex(point.x, point.y)
  endShape()
}
// for when both navigation nodes are on the same corridor
function highlight_small_route (corridor, node_1, node_2) {
  noFill()
  stroke(0, 123, 255)
  strokeWeight(3)
  // calcualtes intersect for both nodes and draws lines between them
  const cooridoorData = corridors[corridor - 1]
  const current_start = myMap.latLngToPixel(cooridoorData.latitudeStart, cooridoorData.longitudeStart)
  const current_end = myMap.latLngToPixel(cooridoorData.latitudeEnd, cooridoorData.longitudeEnd)
  const point_1 = myMap.latLngToPixel(node_1.latitude, node_1.longitude)
  const point_2 = myMap.latLngToPixel(node_2.latitude, node_2.longitude)
  const intersect_1 = calculate_intersect(current_start.x, current_start.y, current_end.x, current_end.y, point_1.x, point_1.y)
  const intersect_2 = calculate_intersect(current_start.x, current_start.y, current_end.x, current_end.y, point_2.x, point_2.y)
  beginShape()
  vertex(point_1.x, point_1.y)
  vertex(intersect_1[0], intersect_1[1])
  vertex(intersect_2[0], intersect_2[1])
  vertex(point_2.x, point_2.y)
  endShape()
}
// clears any nav routes drawn on the map
function clearHighlight () {
  start = 0
  dest = 0
  updateMap()
  clearDirections()
}
function clearDirections () {
  document.querySelectorAll('.routeStep').forEach(element => {
    element.remove()
  })
}
function checkValidZoom (minZoom, maxZoom) {
  const zoom = myMap.zoom()
  if (minZoom <= zoom && zoom <= maxZoom) {
    return true
  } else {
    return false
  }
}
// The draw loop runs 60 times each second
function draw () {
  // sets the mouse cursor to a cross symbol while hovering over the map
  cursor(CROSS)
}
function zoomOnLocation (location, focusZoom) {
  myMap.map.flyTo({
    center: [location[1], location[0]],
    zoom: focusZoom
  })
}
// checks location of mouse click to see if a location node was clicked and then calls zoomOnLocation on this node
function checkMouseClickForLocation (mouseX, mouseY) {
  const room_width = 15
  const room_height = 15
  const room_focus = 20
  const building_width = 80
  const building_height = 40
  const building_focus = 17
  const entrances_width = 10
  const entrances_height = 10
  const entrances_focus = 20

  rooms.forEach((location) => {
    setZoomAndPopup(mouseX, mouseY, location, room_width, room_height, room_focus, 'Y')
  })
  buildings.forEach((location) => {
    setZoomAndPopup(mouseX, mouseY, location, building_width, building_height, building_focus, 'N')
  })
  entrances.forEach((location) => {
    setZoomAndPopup(mouseX, mouseY, location, entrances_width, entrances_height, entrances_focus, 'N')
  })
  return false
}

function setZoomAndPopup (mouseX, mouseY, location, width, height, focusZoom, makepopup) {
  const element = myMap.latLngToPixel(location.latitude, location.longitude)
  // calculates x and y distances between location node center and mouse coordinate
  distanceX = Math.abs(element.x - mouseX)
  distanceY = Math.abs(element.y - mouseY)
  // if the distance between the mouse click and the center of the node is within the node's radius then zoom in on it
  if (distanceX <= width / 2 && distanceY <= height / 2) {
    zoomOnLocation([location.latitude, location.longitude], focusZoom)
    if (makepopup === 'Y') {
      placePopup(location.id, [location.latitude, location.longitude], width, height)
    }
  }
}

function getpopupOptions (width, height) {
  return {
    bottom: [0, -1 * (height / 2)],
    'bottom-right': [-1 * (width / 2), -1 * (height / 2)],
    'bottom-left': [(width / 2), -1 * (height / 2)],
    right: [-1 * (width / 2), 0],
    left: [(width / 2), 0],
    top: [0, (height / 2)],
    'top-right': [-1 * (width / 2), (height / 2)],
    'top-left': [0 -
        1 * (width / 2), (height / 2)]
  }
}
function placePopup (id, location, width, height) {
  if (id.slice(0, 1) !== 'r') return
  fetch('/rooms/popupinfo/' + id)
    .then(response => {
      removeServerErrorMessage()
      if (!response.ok) throw Error
      return response.json()
    })
    .then(function (room) {
      if (typeof room.description !== 'undefined') {
        if (popupExists === true) {
          popup.remove() // remove any existing popups
        }
        console.log(room)
        popup = new mapboxgl.Popup({ offset: getpopupOptions(width, height), closeOnClick: false })
          .setLngLat([location[1], location[0]])
          .setHTML(popupHTML(room.id, room.name, room.description, [room.weekdayHours, room.weekendHours], room.image))
          .addTo(myMap.map)
        popupBtnFunc(id, room.name)
        popupExists = true
      }
    })
    .catch(() => {
      displayServerErrorMessage()
    })
}
function mouseClicked () {
  checkMouseClickForLocation(mouseX, mouseY)
  // checks if mouse was clicked over any of the location nodes and zooms in on them
}

// function renders HTML for popup
function popupHTML (id, name, description, hours, image) {
  console.log(hours)
  let openhourshtml = ''
  openhourshtml += 'Monday - Friday' + ': ' + hours[0] + '<br>'
  openhourshtml += 'Saturday - Sunday' + ': ' + hours[1] + '<br>'

  const html = '<h5 style="text-align:center;"><b>' +
    name +
  '</b></h5><p style="text-align:center;"><i>' +
  description +
  '</i></p><div class="row"><div class="col-sm d-flex justify-content-center"><p><b>Opening Hours:</b><br>' +
  openhourshtml +
  '</p></div><div class="col-sm"><img src="imgs/' +
  image +
  '" alt="Picture of Building" class="img-responsive fit-image"></div></div><div class="popupBtn-wrapper"><button id="navHere' + id + '" class="btn btn-primary" data-bs-toggle="offcanvas" href="#offcanvasNavigation" role="button" aria-controls="offcanvasNavigation">Get Directions</button></div>'
  return (html)
}

// function gives the 'get directions' buttons in the popups their functionality
function popupBtnFunc (id, name) {
  newNavBtn = document.getElementById('navHere' + id)

  newNavBtn.addEventListener('click', () => {
    console.log(document.getElementById('path2'))
    document.getElementById('path2').value = name // Just autofills destination for now
  })
}
// pathfinding algorithm sourced from https://www.geeksforgeeks.org/dijkstras-shortest-path-algorithm-greedy-algo-7/
// A Javascript program for Dijkstra's
// single source shortest path
// algorithm. The program is for
// adjacency matrix representation
// of the graph.
const NO_PARENT = -1

function navigate (adjacencyMatrix, startVertex, destination) {
  startVertex = startVertex - 1
  const nVertices = adjacencyMatrix[0].length

  // shortestDistances[i] will hold the
  // shortest distance from src to i
  const shortestDistances = new Array(nVertices)

  // added[i] will true if vertex i is
  // included / in shortest path tree
  // or shortest distance from src to
  // i is finalized
  const added = new Array(nVertices)

  // Initialize all distances as
  // INFINITE and added[] as false
  for (let vertexIndex = 0; vertexIndex < nVertices;
    vertexIndex++) {
    shortestDistances[vertexIndex] = Number.MAX_VALUE
    added[vertexIndex] = false
  }

  // Distance of source vertex from
  // itself is always 0
  shortestDistances[startVertex] = 0

  // Parent array to store shortest
  // path tree
  const parents = new Array(nVertices)

  // The starting vertex does not
  // have a parent
  parents[startVertex] = NO_PARENT

  // Find shortest path for all
  // vertices
  for (let i = 1; i < nVertices; i++) {
    // Pick the minimum distance vertex
    // from the set of vertices not yet
    // processed. nearestVertex is
    // always equal to startNode in
    // first iteration.
    let nearestVertex = -1
    let shortestDistance = Number.MAX_VALUE
    for (let vertexIndex = 0;
      vertexIndex < nVertices;
      vertexIndex++) {
      if (!added[vertexIndex] && shortestDistances[vertexIndex] < shortestDistance) {
        nearestVertex = vertexIndex
        shortestDistance = shortestDistances[vertexIndex]
      }
    }

    // Mark the picked vertex as
    // processed
    added[nearestVertex] = true

    // Update dist value of the
    // adjacent vertices of the
    // picked vertex.
    for (let vertexIndex = 0;
      vertexIndex < nVertices;
      vertexIndex++) {
      const edgeDistance = adjacencyMatrix[nearestVertex][vertexIndex]

      if (edgeDistance > 0 && ((shortestDistance + edgeDistance) < shortestDistances[vertexIndex])) {
        parents[vertexIndex] = nearestVertex
        shortestDistances[vertexIndex] = shortestDistance + edgeDistance
      }
    }
  }

  return printPath(destination - 1, parents)
}

function printPath (currentVertex, parents) {
  // Base case : Source node has
  // been processed
  const result = []
  while (currentVertex !== NO_PARENT) {
    result.push(currentVertex + 1)
    currentVertex = parents[currentVertex]
  }
  return result.reverse()
}
function check_parallel (corridor_1, corridor_2) {
  const corridor_1_location = [[corridors[corridor_1 - 1].latitudeStart, corridors[corridor_1 - 1].longitudeStart], [corridors[corridor_1 - 1].latitudeEnd, corridors[corridor_1 - 1].longitudeEnd]]
  const corridor_2_location = [[corridors[corridor_2 - 1].latitudeStart, corridors[corridor_2 - 1].longitudeStart], [corridors[corridor_2 - 1].latitudeEnd, corridors[corridor_2 - 1].longitudeEnd]]
  // calculates direction vector of each corridor
  const direction_1 = [corridor_1_location[1][0] - corridor_1_location[0][0], corridor_1_location[1][1] - corridor_1_location[0][1]]
  const direction_2 = [corridor_2_location[1][0] - corridor_2_location[0][0], corridor_2_location[1][1] - corridor_2_location[0][1]]
  // calculates magnitude of direction vectors
  const direction_1_length = Math.sqrt(Math.pow(direction_1[0], 2) + Math.pow(direction_1[1], 2))
  const direction_2_length = Math.sqrt(Math.pow(direction_2[0], 2) + Math.pow(direction_2[1], 2))
  // threshold value to allow flexibility on determining if corridors are parallel
  const errorThreshold = 0.03
  // normalises both direction vectors so length of corridor doesn't affect calculation
  let direction_1_normalised = [direction_1[0] / direction_1_length, direction_1[1] / direction_1_length]
  let direction_2_normalised = [direction_2[0] / direction_2_length, direction_2[1] / direction_2_length]
  // rounds values to 2 d.p
  direction_1_normalised = [Number(direction_1_normalised[0].toFixed(2)), Number(direction_1_normalised[1].toFixed(2))]
  direction_2_normalised = [Number(direction_2_normalised[0].toFixed(2)), Number(direction_2_normalised[1].toFixed(2))]
  if (Math.abs(direction_1_normalised[0] - direction_2_normalised[0]) < errorThreshold && Math.abs(direction_1_normalised[1] - direction_2_normalised[1]) < errorThreshold) {
    return true
  } else {
    return false
  }
}
function check_left (corridor, prev_corridor) {
  const corridor_location = [[corridors[corridor - 1].latitudeStart, corridors[corridor - 1].longitudeStart], [corridors[corridor - 1].latitudeEnd, corridors[corridor - 1].longitudeEnd]]
  const prev_corridor_location = [[corridors[prev_corridor - 1].latitudeStart, corridors[prev_corridor - 1].longitudeStart], [corridors[prev_corridor - 1].latitudeEnd, corridors[prev_corridor - 1].longitudeEnd]]
  // calculates the distances between corridor 1 and corridor 2 for corridor 2's start and ending points
  const mid = [((corridor_location[0][0] + corridor_location[1][0]) / 2), ((corridor_location[0][1] + corridor_location[1][1]) / 2)]
  const start = myMap.latLngToPixel(prev_corridor_location[0][0], prev_corridor_location[0][1])
  const end = myMap.latLngToPixel(prev_corridor_location[1][0], prev_corridor_location[1][1])
  const midpoint = myMap.latLngToPixel(mid[0], mid[1])

  const distance_start = Math.sqrt(Math.pow((midpoint.x - start.x), 2) + Math.pow((midpoint.y - start.y), 2))
  const distance_end = Math.sqrt(Math.pow((midpoint.x - end.x), 2) + Math.pow((midpoint.y - end.y), 2))
  // choosing the closest end

  const point_2 = distance_start < distance_end ? 0 : 1
  // chooses the opposite end for point 3
  const point_3 = point_2 === 1 ? 0 : 1
  // these are the distances between point 2 and (corridor 1 start and corridor 2 end)
  const far_distance_start = Math.sqrt(Math.pow((corridor_location[0][0] - prev_corridor_location[point_2][0]), 2) + Math.pow((corridor_location[0][1] - prev_corridor_location[point_2][1]), 2))
  const far_distance_end = Math.sqrt(Math.pow((corridor_location[1][0] - prev_corridor_location[point_2][0]), 2) + Math.pow((corridor_location[1][1] - prev_corridor_location[point_2][1]), 2))
  // calculates the furthest part of corriodor 1 which will be point_1
  const point_1 = far_distance_start > far_distance_end ? 0 : 1
  // calculates direction vector between point 1 and point 2
  const direction_vector = [prev_corridor_location[point_2][1] - prev_corridor_location[point_3][1], prev_corridor_location[point_2][0] - prev_corridor_location[point_3][0]]
  // calculates gradient of the line (point1) -> (point2)
  const gradient = (prev_corridor_location[point_2][0] - prev_corridor_location[point_3][0]) / (prev_corridor_location[point_2][1] - prev_corridor_location[point_3][1])
  // creates equation of the form y - y_1 = m(x-x_1)
  // this rearranges to y = m(x-x_1) + y_1
  const equation = (gradient * (corridor_location[point_3][1] - prev_corridor_location[point_1][1])) + prev_corridor_location[point_1][0]
  // if horizontal vector is negative then any point above the line would be right turn
  console.log(direction_vector)
  if (direction_vector[0] < 0) {
    if (corridor_location[point_1][0] > equation) {
      return false
    }
    if (corridor_location[point_1][0] < equation) {
      return true
    }
  } else {
    // if horizontal vector is positive then any points above the line would be a left turn
    if (corridor_location[point_1][0] > equation) {
      return true
    }
    if (corridor_location[point_1][0] < equation) {
      return false
    }
  }
}
function get_turn_type (corridor, previous) {
  if (check_parallel(corridor, previous)) {
    return 'Carry straight on'
  } else {
    const result = check_left(corridor, previous)
    if (result === 2) return 'turn'
    if (result) {
      return 'Turn left'
    } else {
      return 'Turn right'
    }
  }
}
function addRouteStep (direction, previous) {
  const container = document.getElementById('routeStepList')
  const element = document.createElement('div')
  element.className = 'routeStep'
  if (container.childNodes.length === 3) {
    element.className += ' top'
  }
  const label = document.createElement('p')
  if (Number(direction)) {
    if (Number(previous)) {
      // for all intermediate route steps output value of this function
      label.innerText = get_turn_type(direction, previous)
    } else {
      // for the first direction output this value
      label.innerText = ' Turn onto corridor outside of ' + (previous !== 'pin' ? previous : 'Your location')
    }
  } else {
    // for start and end of route, output room anmes
    label.innerText = direction
  }

  const soundButton = document.createElement('i')
  soundButton.classList = 'fa fa-volume-up soundBtn'

  soundButton.addEventListener('click', () => {
    // Set the text property with the value of the textarea
    speech.text = label.innerText

    // Start Speaking
    window.speechSynthesis.speak(speech)
  })

  element.appendChild(label)
  element.appendChild(soundButton)

  const closeButton = document.createElement('p')
  closeButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-lg" viewBox="0 0 16 16">
  <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"/>
</svg>`
  element.appendChild(closeButton)
  closeButton.onclick = () => {
    element.remove()
    if (container.childNodes.length <= 4) {
      speech.text = 'You have arrived at ' + dest.name
      window.speechSynthesis.speak(speech)
      clearHighlight()
      direction_canvas.hide()
    } else {
      container.childNodes[3].className += ' top'
      reduce_route()
      speak_next_step()
    }
  }

  container.appendChild(element)
}
function speak_next_step () {
  const container = document.getElementById('routeStepList')
  const top_label = container.childNodes[3]
  console.log(top_label)
  speech.text = top_label.innerText
  window.speechSynthesis.speak(speech)
}
function reduce_route () {
  console.log('reducing route')
  const route = calculate_route()
  console.log(start)
  if (Number.isInteger(start)) {
    start = route[1]
  } else {
    // don't shorten the route for the first step since the first step is for the starting room node
    start = route[0]
  }
  console.log(start)
  updateMap()
}

function calculate_route () {
  // if the starting point is a corridor
  if (Number.isInteger(start)) {
    return navigate(graph, start, calculateNearestCorridor(dest))
  } else {
    // if route is over one corridor then navigation function isn't necessary
    if (calculateNearestCorridor(start) === calculateNearestCorridor(dest)) {
      return [calculateNearestCorridor(start)]
    }
    // if the starting point is a room
    return navigate(graph, calculateNearestCorridor(start), calculateNearestCorridor(dest))
  }
}

// This code is contributed by rag2127.

// TEXT TO SPEECH
// https://www.section.io/engineering-education/text-to-speech-in-javascript/
// Initialize new SpeechSynthesisUtterance object
const speech = new SpeechSynthesisUtterance()

// Set Speech Language
speech.lang = 'en'

// Get List of Voices
voices = window.speechSynthesis.getVoices()

// Initially set the First Voice in the Array.
speech.voice = voices[0]
// speech.pitch = 1;
// speech.rate = 1;
speech.volume = 1
