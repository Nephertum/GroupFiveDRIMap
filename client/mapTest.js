const key = 'pk.eyJ1Ijoid29yZHlzdW1vIiwiYSI6ImNrdmw4M2tuaDBqMmQyb281YWVrNTd4cjEifQ.K9oZUZYiwAd2sJs2_KTAug';
// Options for map
const options = {
  container: 'map',
  lat: 53.53094965890605,  
  lng: -1.1095832474735168,
  zoom: 16,
  maxBounds: [
  [-1.116291656055779, 53.5274202302019,], // Southwest coordinates
  [-1.103938727347374, 53.533850335887024] // NorthEast coordinates

  ],
  bearing: -22,
  style: 'mapbox://styles/mapbox/streets-v10',
};
// Create an instance of MapboxGL
const mappa = new Mappa('MapboxGL', key);
let myMap;
// creates the event listener for when the user holds down the mouse to place the pin
var mouseIsDown = false;
let start = 0;
let dest = 0;
let pin = {
  name: "pin",
  location: 0
}
let graph;
window.addEventListener('mousedown', function() {
  mouseIsDown = true;
  setTimeout(function() {
    if(mouseIsDown) {
      // mouse was held down for > 3 seconds
      console.log("hold");
      updatePinLocation();
    }
  }, 2000);
});
window.addEventListener('mouseup', function() {
  mouseIsDown = false;
});

// locations section:
// order of locations returned is [entrances, corridorIndex, buildings, rooms]
/*let locations;
fetch('http://127.0.0.1:8090/entities')
.then(response => response.json())
.then(function(body){
  locations = body;
})*/

let entrances;
fetch('http://127.0.0.1:8090/entrances')
.then(response => response.json())
.then(function(body){
  entrances = body;
})

let corridors;
fetch('http://127.0.0.1:8090/corridors')
.then(response => response.json())
.then(function(body){
  corridors = body;
})

let buildings;
fetch('http://127.0.0.1:8090/buildings')
.then(response => response.json())
.then(function(body){
  buildings = body;
})

let rooms;
fetch('http://127.0.0.1:8090/rooms')
.then(response => response.json())
.then(function(body){
  rooms = body;
})

const drawFunctions = {
  "building" : drawBuildings,
  "room" : drawRooms,
  "route" : drawRoute,
  "entrance" : drawEntrances
}
let loaded = false;
function setup() {
  const canvas = createCanvas(window.innerWidth, 700);
  // Create a tile map and overlay the canvas on top.
  myMap = mappa.tileMap(options);
  myMap.overlay(canvas);
  // anytime the map is panned or zoomed this function will execute
  myMap.onChange(updateMap)
  setupButton();
  popupExists = false; // global variable
}
function setupButton() {
  const Searchbutton = document.getElementById('SearchBtn')
  const Searchinput = document.getElementById('roomSearch')
  Searchbutton.addEventListener('click',() => {
    let room = Searchinput.value;
    Searchinput.value = "";
    let element = getNodeByName(room);
    zoomOnLocation(element, 20);
    placePopup(element, 15, 15);
  })

  const navigateButton = document.getElementById("navigateBtn");
  const input1 = document.getElementById("path1");
  const input2 = document.getElementById("path2");
  navigateButton.addEventListener("click", () => {
    setNavigation(input1.value, input2.value)
    input1.value = ""
    input2.value = ""
    updateMap();
  })
  const usePinBtn = document.getElementById('usePinToggle');
  usePinBtn.addEventListener('click', () => {
    input1.value = "pin"
  })
  const clearButton = document.getElementById('clearNavBtn')
  clearButton.addEventListener('click', () => {
    clearHighlight()
  })
}
function updateMap() {
  if (!loaded) {
    myMap.map.addControl(new mapboxgl.FullscreenControl());
    myMap.map.addControl(new mapboxgl.NavigationControl());
    graph = generateGraph()
    loaded = true;
  }
  
  // clears anything currently drawn on the map
  clear()
  drawNodes();
  placePin();
  if (start != 0 && dest != 0) {
    highlight_path(navigate(graph,calculateNearestCorridor(start),calculateNearestCorridor(dest)));
  }
}
// changes the start and dest values for the next map update
function setNavigation(source, destination) {
  let newStart = 0;
  let newDest = 0;
  if (source.toLowerCase() == "pin") {
    if (pin.location !== 0) {
      newStart = pin;
    }
  } else {
    newStart = getNodeByName(source)
  }
  newDest = getNodeByName(destination)
  if (newStart === 0 || newDest === 0) {
    alert('invalid locations')
  } else {
    start = newStart;
    dest = newDest;
  }
}
function getNodeByName(name) {
  console.log(name)
  let result = 0;
  rooms.forEach(element => {
    if (element.name.toLowerCase() == name.toLowerCase()) {
      result = element
    }
  });
  return result;
}
function drawNodes(){
  const entrance_min_zoom = 1;
  const entrance_max_zoom = 100;
  const building_min_zoom = 1;
  const building_max_zoom = 17;
  const room_min_zoom = 18;
  const room_max_zoom = 100;
  const corridor_min_zoom = 18;
  const corridor_max_zoom = 100;

  entrances.forEach(entrance => {
    if (checkValidZoom(entrance_min_zoom, entrance_max_zoom)) {
      drawEntrances(entrance);
    }
  })
  buildings.forEach(building => {
      if (checkValidZoom(building_min_zoom, building_max_zoom)) {
        drawBuildings(building);
      }
    })
  rooms.forEach(room => {
    if (checkValidZoom(room_min_zoom, room_max_zoom)) {
      drawRooms(room);
    }
  })
  corridors.forEach(corridor => {
    if (checkValidZoom(corridor_min_zoom, corridor_max_zoom)) {
      drawRoute(corridor);
    }
  })
}
// draws the internal cooridoors on the map after a certain zoom threshold
function drawRoute(node) {
    noFill();
    stroke(0,0,0);
    strokeWeight(2);
    beginShape();
    const routeStart = myMap.latLngToPixel(node.location[0][0],node.location[0][1])
    const routeEnd = myMap.latLngToPixel(node.location[1][0],node.location[1][1])
    vertex(routeStart.x,routeStart.y);
    vertex(routeEnd.x,routeEnd.y);
    endShape();
  }
  
  // text(node.name,(start.x + end.x) / 2,(start.y + end.y) / 2)
  
function updatePinLocation() {
  let newlocation = myMap.pixelToLatLng(mouseX,mouseY);
  pin.location = [newlocation.lat, newlocation.lng]
  console.log(pin.location)
  updateMap();
}
function placePin() {
  fill(255,0,0);
  strokeWeight(1);
  if (pin.location !== 0) {
      let center = myMap.latLngToPixel(pin.location[0],pin.location[1]);
      beginShape()
      vertex(center.x, center.y)
      vertex(center.x + 8, center.y - 16)
      vertex(center.x + 8, center.y - 32)
      vertex(center.x-8,center.y - 32)
      vertex(center.x-8,center.y - 16)
      vertex(center.x, center.y)
      endShape()
  }
}
function drawEntrances(node) {
  let width = 10;
  let height = 10;
  textAlign(LEFT, BOTTOM);
  strokeWeight(1);
  stroke(100,100,100);
  textSize(15);
  const zoom = myMap.zoom();
  const point = myMap.latLngToPixel(node.location[0], node.location[1])
  fill(200, 100, 100);
  ellipse(point.x, point.y, width, height)
  fill(0,0,0)
  if (zoom > 18) {
    text(node.name,point.x + 6, point.y - 6)
  }
}
function drawBuildings(node) {
  let width = 80;
  let height = 40;
  strokeWeight(1)
  rectMode(CENTER)
  textAlign(CENTER, CENTER);
  pos = myMap.latLngToPixel(node.location[0], node.location[1])
  fill(0,0,0)
  text(node.name,pos.x,pos.y,width,height)
}
function drawRooms(node) {
  //let width = 15;
  //let height = 10;
  strokeWeight(1)
  rectMode(CENTER)
  textAlign(CENTER,CENTER);
  pos = myMap.latLngToPixel(node.location[0], node.location[1])
  fill(2, 117, 216)

  ellipse(pos.x, pos.y,15,15)
  fill(0,0,0)
  text(node.name,pos.x,pos.y + 15)
}
function generateGraph() {
  let graph = []
  // loops through each cooridoor node
  for (let i = 0; i< corridors.length; i++) {
    let current = [];
    
    let nodes = corridors[i].neighbours;
    // loops through every other cooridoor
    for (let j = 0; j< corridors.length; j++) {
      // if the jth cooridoor is a neighbour of the ith cooridoor then store a one
      if (nodes.includes(j+1)) {
        current.push(1);
      } else {
        // otherwise store a zero to signal no connection between nodes
        current.push(0);
      }
    }
    graph.push(current)
  }

  return graph;
}
function calculateNearestCorridor(location) {
    const room = myMap.latLngToPixel(location.location[0],location.location[1]);
    let minDistance = Infinity;
    let result = 0;
    corridors.forEach((corridor, index) => {
      corridorStart = myMap.latLngToPixel(corridor.location[0][0],corridor.location[0][1])
      corridorEnd = myMap.latLngToPixel(corridor.location[1][0],corridor.location[1][1])
      center = { x: (corridorStart.x + corridorEnd.x) / 2, y: (corridorStart.y + corridorEnd.y) / 2}
      let distance = Math.sqrt(((center.x - room.x) ** 2) + ((center.y - room.y) ** 2))
      if (distance < minDistance) {
        minDistance = distance;
        result = index + 1 
      }
    })
    return result
}
// highlights a cooridoor red, to be used for navigation
function highlight_path(cooridoor_list) {
  cooridoor_list.forEach((path, index) => {
    switch (index) {
      case 0:
        highlightEndpoint(path,cooridoor_list[1],start);
        break;
      case cooridoor_list.length - 1:
        highlightEndpoint(path,cooridoor_list[cooridoor_list.length - 2],dest);
      break;
      default:
        highlight_cooridoor(path);
        break;
    }
  });
}
function highlight_cooridoor(index) {
  noFill();
  stroke(0,123,255);
  strokeWeight(3);
  let highlight = corridors[index-1];
  let highlight_start = myMap.latLngToPixel(highlight.location[0][0], highlight.location[0][1]);
  let highlight_end = myMap.latLngToPixel(highlight.location[1][0], highlight.location[1][1]);
  beginShape();
  vertex(highlight_start.x, highlight_start.y);
  vertex(highlight_end.x, highlight_end.y);    
  endShape();
}
function calculate_intersect(x_1,y_1,x_2,y_2,x_3,y_3) {
  let u = (((x_3 - x_1) * (x_2 - x_1)) + ((y_3 - y_1) * (y_2 - y_1))) / (((x_2 - x_1) * (x_2 - x_1)) + ((y_2 - y_1) * (y_2 - y_1)))
  let x = x_1 + (u * (x_2 - x_1));
  let y = y_1 + (u * (y_2 - y_1));
  return [x,y]
}
// highlights the end of the route by only partially highlighting a cooridoor and connecting it to a room
function highlightEndpoint(cooridoor,adj_cooridoor, node) {
  noFill();
  stroke(0,123,255);
  strokeWeight(3);
  let cooridoorData = corridors[cooridoor - 1];
  let prevCooridoorData = corridors[adj_cooridoor - 1];
  let current_start = myMap.latLngToPixel(cooridoorData.location[0][0], cooridoorData.location[0][1]);
  let current_end = myMap.latLngToPixel(cooridoorData.location[1][0], cooridoorData.location[1][1]);
  let prev_end = myMap.latLngToPixel(prevCooridoorData.location[1][0], prevCooridoorData.location[1][1]);
  let diff_start = Math.abs(current_start.x - prev_end.x) + Math.abs(current_start.y - prev_end.y)
  let diff_end = Math.abs(current_end.x - prev_end.x) + Math.abs(current_end.y - prev_end.y)
  let highlight_start;
  if (diff_start > diff_end) {
    highlight_start = current_end;
  } else {
    highlight_start = current_start;
  }

  let point = myMap.latLngToPixel(node.location[0],node.location[1])
  let highlight_middle = calculate_intersect(current_start.x, current_start.y, current_end.x, current_end.y, point.x, point.y)





  beginShape();
  vertex(highlight_start.x, highlight_start.y);
  vertex(highlight_middle[0],highlight_middle[1])
  vertex(point.x, point.y);    
  endShape();
}
// clears any nav routes drawn on the map
function clearHighlight() {
  start = 0;
  dest = 0;
  updateMap();
}
function checkValidZoom(minZoom, maxZoom) {
  const zoom = myMap.zoom();
  if (minZoom <= zoom && zoom <= maxZoom) {
    return true;
  } else {
    return false;
  }
}
// The draw loop runs 60 times each second
function draw() {
  // sets the mouse cursor to a cross symbol while hovering over the map
  cursor(CROSS)
}
function zoomOnLocation(location, focusZoom) {
  myMap.map.flyTo({
    center: [location.location[1], location.location[0]],
    zoom: focusZoom
  });
}
// checks location of mouse click to see if a location node was clicked and then calls zoomOnLocation on this node
function checkMouseClickForLocation(mouseX,mouseY) {
  const room_width = 15;
  const room_height = 15;
  const room_focus = 20;
  const building_width = 80;
  const building_height = 40;
  const building_focus = 17;
  const entrances_width = 10;
  const entrances_height = 10;
  const entrances_focus = 20;

  rooms.forEach((location) => {
     setZoomAndPopup(mouseX, mouseY, location, room_width, room_height, room_focus)
    })
  buildings.forEach((location) => {
    setZoomAndPopup(mouseX, mouseY, location, building_width, building_height, building_focus)
  })
  entrances.forEach((location) => {
    setZoomAndPopup(mouseX, mouseY, location, entrances_width, entrances_height, entrances_focus)
  })
  return false;
}

function setZoomAndPopup(mouseX, mouseY, location, width, height, focusZoom){
  let element = myMap.latLngToPixel(location.location[0], location.location[1])
        // calculates x and y distances between location node center and mouse coordinate
        distanceX = Math.abs(element.x - mouseX)
        distanceY = Math.abs(element.y - mouseY)
        // if the distance between the mouse click and the center of the node is within the node's radius then zoom in on it
        if (distanceX <= width / 2 && distanceY <= height / 2) {
          zoomOnLocation(location, focusZoom);
          placePopup(location, width, height);
        }
}

function getpopupOptions(width, height) {
    return {
      'bottom' : [0,-1 * (height / 2)],
      'bottom-right' : [-1 * (width / 2),-1 * (height / 2)],
      'bottom-left' : [(width / 2),-1 * (height / 2)],
      'right' : [-1 * (width / 2),0],
      'left' : [(width / 2),0],
      'top' : [0,(height / 2)],
      'top-right' : [-1 * (width / 2),(height / 2)],
      'top-left' : [0
        -1 * (width / 2),(height / 2)],
    }
}
function placePopup(location, width, height) {
  if (typeof location.info !== 'undefined') {
    if (popupExists == true){
      popup.remove() // remove any existing popups
    }
    popup = new mapboxgl.Popup({offset: getpopupOptions(width, height),closeOnClick: false})
    .setLngLat([location.location[1],location.location[0]])
    .setHTML(popupHTML(location.id, location.name, location.info))
    .addTo(myMap.map)
    popupBtnFunc(location.id, location.name)
    popupExists = true
  }
}
function mouseClicked() {
  console.log(myMap.pixelToLatLng(mouseX, mouseY).lat + ", " + myMap.pixelToLatLng(mouseX, mouseY).lng)
  checkMouseClickForLocation(mouseX,mouseY);
  // checks if mouse was clicked over any of the location nodes and zooms in on them
}
function mouseDragged() {
  mouseIsDown = false;
}

// function renders HTML for popup
function popupHTML(id, name, info){
  const description = info[0]
  const openhours = info[1]
  const img = info[2]
  let openhourshtml = ''
  for (let i = 0; i < openhours.length; i++) {
    openhourshtml += openhours[i][0] + ": " + openhours[i][1] + "<br>";
  }

  const html = '<h5 style="text-align:center;"><b>'
    +name+
  '</b></h5><p style="text-align:center;"><i>'
  +description+
  '</i></p><div class="row"><div class="col-sm d-flex justify-content-center"><p><b>Opening Hours:</b><br>'
  +openhourshtml+
  '</p></div><div class="col-sm"><img src="'
  +img+
  '" alt="Picture of Building" class="img-responsive fit-image"></div></div><div class="popupBtn-wrapper"><button id="navHere'+id+'" class="btn btn-primary" data-bs-toggle="offcanvas" href="#offcanvasExample" role="button" aria-controls="offcanvasExample">Get Directions</button></div>'
  return(html)
}

// function gives the 'get directions' buttons in the popups their functionality
function popupBtnFunc(id, name){
  newNavBtn = document.getElementById("navHere"+id)
  
  newNavBtn.addEventListener("click", () => {
    document.getElementById("path2").value = name // Just autofills destination for now
  })
}

// work in progress for now


// pathfinding algorithm copied from website
// A Javascript program for Dijkstra's
// single source shortest path
// algorithm. The program is for
// adjacency matrix representation
// of the graph.
let NO_PARENT = -1;

function navigate(adjacencyMatrix,startVertex,destination)
{
  startVertex = startVertex - 1;
	let nVertices = adjacencyMatrix[0].length;

		// shortestDistances[i] will hold the
		// shortest distance from src to i
		let shortestDistances = new Array(nVertices);

		// added[i] will true if vertex i is
		// included / in shortest path tree
		// or shortest distance from src to
		// i is finalized
		let added = new Array(nVertices);

		// Initialize all distances as
		// INFINITE and added[] as false
		for (let vertexIndex = 0; vertexIndex < nVertices;
											vertexIndex++)
		{
			shortestDistances[vertexIndex] = Number.MAX_VALUE;
			added[vertexIndex] = false;
		}
		
		// Distance of source vertex from
		// itself is always 0
		shortestDistances[startVertex] = 0;

		// Parent array to store shortest
		// path tree
		let parents = new Array(nVertices);

		// The starting vertex does not
		// have a parent
		parents[startVertex] = NO_PARENT;

		// Find shortest path for all
		// vertices
		for (let i = 1; i < nVertices; i++)
		{

			// Pick the minimum distance vertex
			// from the set of vertices not yet
			// processed. nearestVertex is
			// always equal to startNode in
			// first iteration.
			let nearestVertex = -1;
			let shortestDistance = Number.MAX_VALUE;
			for (let vertexIndex = 0;
					vertexIndex < nVertices;
					vertexIndex++)
			{
				if (!added[vertexIndex] &&
					shortestDistances[vertexIndex] <
					shortestDistance)
				{
					nearestVertex = vertexIndex;
					shortestDistance = shortestDistances[vertexIndex];
				}
			}

			// Mark the picked vertex as
			// processed
			added[nearestVertex] = true;

			// Update dist value of the
			// adjacent vertices of the
      // picked vertex.
			for (let vertexIndex = 0;
					vertexIndex < nVertices;
					vertexIndex++)
			{
				let edgeDistance = adjacencyMatrix[nearestVertex][vertexIndex];
				
				if (edgeDistance > 0
					&& ((shortestDistance + edgeDistance) <
						shortestDistances[vertexIndex]))
				{
					parents[vertexIndex] = nearestVertex;
					shortestDistances[vertexIndex] = shortestDistance +
													edgeDistance;
				}
			}
		}

		return printPath(destination-1, parents);
}


function printPath(currentVertex,parents)
{
	// Base case : Source node has
    // been processed
    let result = []
		while (currentVertex != NO_PARENT) {
        result.push(currentVertex + 1);
        currentVertex = parents[currentVertex]
    }
    return result.reverse();
}




// This code is contributed by rag2127.


// Rooms list
fetch('http://127.0.0.1:8090/rooms')
.then(response => response.json())
.then(function(body){
  let block;
  let div;
  const room_width = 15;
  const room_height = 15;
  const room_focus = 20;
    body.forEach(room => {
  if (room.building === "Women's and Children's Hospital"){
    block = "wch";
  }
  else if (room.building === "West Block"){
    block = "wb";
  }
  else if (room.building === "South Block"){
    block = "sb";
  }
  else if (room.building === "East Block"){
    block = "eb";
  }
  else{
    return;
  }
  if (!isNaN(room.level)){
    div = document.getElementById(block.concat(room.level))
    let newItem;
    newItem = document.createElement("BUTTON");
    newItem.classList.add("room-link");
    newItem.id = room.id;
    newItem.innerHTML = room.name;
    newItem.addEventListener("click", function(){
      zoomOnLocation(room, room_focus);
      placePopup(room, room_width, room_height);
    });
    div.appendChild(newItem);
    
    newItem = document.createElement("br");
    div.appendChild(newItem);

    console.log(document.getElementById(room.id));
  }
  else{
    return;
  }
    })
})

fetch('http://127.0.0.1:8090/unmarkedRooms')
.then(response => response.json())
.then(function(body){
  let block;
  let div;
    body.forEach(room => {
  if (room.building === "Women's and Children's Hospital"){
    block = "wch";
  }
  else if (room.building === "West Block"){
    block = "wb";
  }
  else if (room.building === "South Block"){
    block = "sb";
  }
  else if (room.building === "East Block"){
    block = "eb";
  }
  else{
    return;
  }
  if (!isNaN(room.level)){
    div = document.getElementById(block.concat(room.level))
    div.innerHTML += '<a>'+ room.name + '</a><br>'
  }
  else{
    return;
  }
    })
})
