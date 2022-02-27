const key = 'pk.eyJ1Ijoid29yZHlzdW1vIiwiYSI6ImNrdmw4M2tuaDBqMmQyb281YWVrNTd4cjEifQ.K9oZUZYiwAd2sJs2_KTAug';
const server = "18.132.20.100"
const local = "127.0.0.1"
// Options for map
const options = {
  container: 'map',
  lat: 53.53094965890605,  
  lng: -1.1095832474735168,
  zoom: 17,
  maxBounds: [
  [ -1.1147841887079721,53.52933045167083], // Southwest coordinates
  [-1.1063333233140895,53.532293206606084] // NorthEast coordinates

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
let navigation_loaded = false
let route;
let pin = {
  name: "pin",
  latitude: 0,
  longitude: 0
}
let graph;
window.addEventListener('mousedown', function() {
  mouseIsDown = true;
  setTimeout(function() {
    if(mouseIsDown) {
      // mouse was held down for > 3 seconds
      updatePinLocation();
    }
  }, 2000);
});
window.addEventListener('mouseup', function() {
  mouseIsDown = false;
});
window.addEventListener('load', async () => {
  let room_list;
  let res = await fetch('/rooms/listinfo')
  let result = await res.json()
  room_list = result;

  let unmarked_room_list;
  res = await fetch('/unmarkedrooms')
  result = await res.json()
  unmarked_room_list = result
  populate_list(room_list, unmarked_room_list);
})


// locations section:
// order of locations returned is [entrances, corridorIndex, buildings, rooms]
/*let locations;
fetch('http://127.0.0.1:8090/entities')
.then(response => response.json())
.then(function(body){
  locations = body;
})*/

// Fetch drawing properties so they do not have to be reloaded each time
let entrances;
fetch('/entrances')
.then(response => response.json())
.then(function(body){
  entrances = body;
})

let corridors;
fetch('/corridors')
.then(response => response.json())
.then(function(body){
  corridors = body;
})

let buildings;
fetch('/buildings')
.then(response => response.json())
.then(function(body){
  buildings = body;
})

let rooms;
fetch('/rooms') // Rooms have extra info so only store drawing info globally
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
    // when empty input
    if (room.length !== 0) {
      document.getElementById('searchError').style.display="none"
      Searchinput.value = "";
      let element = getNodeByName(room);
      // when invalid input
      if (element !== 0) {
        zoomOnLocation([element.latitude, element.longitude], 20);
        placePopup(element.id,[element.latitude, element.longitude], 15, 15);
      } else {
        document.getElementById('searchError').innerText = "No room found"
        document.getElementById('searchError').style.display="block"
      }
      
    } else {
      document.getElementById('searchError').innerText = "Field can't be blank"
      document.getElementById('searchError').style.display="block"
    }
    
  })

  const navigateButton = document.getElementById("navigateBtn");
  const input1 = document.getElementById("path1");
  const input2 = document.getElementById("path2");
  navigateButton.addEventListener("click", () => {
    document.querySelectorAll(".routeStep").forEach(element => {
      element.remove();
    })
    setNavigation(input1.value, input2.value)
    input1.value = ""
    input2.value = ""
    updateMap();
  })
  const usePinBtn = document.getElementById('usePinToggle');
  usePinBtn.addEventListener('click', () => {
    if (pin.location != 0) {
      input1.value = "pin"
    } else {
      alert('pin not placed')
    }
    
  })
  const clearButton = document.getElementById('clearNavBtn')
  clearButton.addEventListener('click', () => {
    clearHighlight()
  })
  

}
function AI_navigate() {
  let previous_length = 0
  let latest_message = ""
  setInterval(() => {
    const messages = document.querySelectorAll(".WACWidget__MarkdownP") 
    let navigation_messages_count = 0
    for (let message of messages) {
      let text = message.innerText;
      if (text.includes(":") && text.slice(0,5) === "Route") {
        navigation_messages_count += 1
        latest_message = text
      }
    }
    if (navigation_messages_count !== previous_length) {
      let data = latest_message.split(":")
      let locations = data[1].split(",")
      previous_length = navigation_messages_count
      document.querySelectorAll(".routeStep").forEach(element => {
        element.remove();
      })
      console.log(locations[0])
      console.log(locations[1])
      const directionMenu = document.getElementById("offcanvasDirections");
      var canvas = new bootstrap.Offcanvas(directionMenu)
      canvas.show()
      if (locations[1] === 'pin') {
        setNavigation(locations[1],locations[0])
      } else {
        setNavigation(locations[0],locations[1])
      }
      updateMap();
      
    }
    
  },1000)
}
function updateMap() {
  if (!loaded) {
    myMap.map.addControl(new mapboxgl.FullscreenControl());
    myMap.map.addControl(new mapboxgl.NavigationControl());
    graph = generateGraph()
    loaded = true;
    AI_navigate();
  }
  
  // clears anything currently drawn on the map
  clear()
  drawNodes();
  placePin();
  if (start != 0 && dest != 0) {
    
    route = calculate_route();
    
    highlight_path(route)
  }
}
// changes the start and dest values for the next map update
function setNavigation(source, destination) {
  clearHighlight
  let newStart = 0;
  let newDest = 0;
  if (source.toLowerCase() == "pin") {
    if (pin.latitude !== 0 && pin.longitude !== 0) {
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
    navigation_loaded = false
  }
}
function getNodeByName(name) {
  let result = 0;
  rooms.forEach(element => {
    if (element.name.toLowerCase() == name.toLowerCase()) {
      result = element
    }
  });
  buildings.forEach(element => {
    if (element.name.toLowerCase() == name.toLowerCase()) {
      result = element
    }
  });
  return result;
}
function populate_list(room_list, unmarked_room_list) {
  
  
    let block;
    let div;
    let building;
    const room_width = 15;
    const room_height = 15;
    const room_focus = 20;
    room_list.forEach(room => {
      building = room.building
      if (building === "Women's and Children's Hospital"){
        block = "wch";
      }
      else if (building === "West Block"){
        block = "wb";
      }
      else if (building === "South Block"){
        block = "sb";
      }
      else if (building === "East Block"){
        block = "eb";
      }
      else{
        return;
      }
      if (!isNaN(room.level)){
        div = document.getElementById(block.concat(room.level))
        let newItem;
        newItem = document.createElement("a");
        newItem.classList.add("room-link");
        newItem.id = room.id;
        newItem.innerHTML = room.name;
        newItem.setAttribute('onclick',`javascript:room_list_click("${room.name}");`)
        div.appendChild(newItem);
      
        newItem = document.createElement("br");
        div.appendChild(newItem);
  
      }
      else{
        return;
      }
    })
    unmarked_room_list.forEach(room => {
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
      }
  


  
function room_list_click(name) {
  const room_width = 15;
  const room_height = 15;
  const room_focus = 20;
  const node = getNodeByName(name);
  zoomOnLocation([node.latitude, node.longitude],room_focus)
  placePopup(node.id,[node.latitude, node.longitude],room_width,room_height)
  window.scrollTo(0,300)
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
    const routeStart = myMap.latLngToPixel(node.latitudeStart,node.longitudeStart)
    const routeEnd = myMap.latLngToPixel(node.latitudeEnd,node.longitudeEnd)
    vertex(routeStart.x,routeStart.y);
    vertex(routeEnd.x,routeEnd.y);
    endShape();
  }
  
  // text(node.name,(start.x + end.x) / 2,(start.y + end.y) / 2)
  
function updatePinLocation() {
  let newlocation = myMap.pixelToLatLng(mouseX,mouseY);
  pin.latitude = newlocation.lat;
  pin.longitude = newlocation.lng
  updateMap();
}
function placePin() {
  fill(255,0,0);
  strokeWeight(1);
  if (pin.latitude !== 0 && pin.longitude !== 0) {
      let center = myMap.latLngToPixel(pin.latitude,pin.longitude);
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
  const point = myMap.latLngToPixel(node.latitude, node.longitude)
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
  pos = myMap.latLngToPixel(node.latitude, node.longitude)
  fill(0,0,0)
  text(node.name,pos.x,pos.y,width,height)
}
function drawRooms(node) {
  //let width = 15;
  //let height = 10;
  strokeWeight(1)
  rectMode(CENTER)
  textAlign(CENTER,CENTER);
  pos = myMap.latLngToPixel(node.latitude, node.longitude)
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
    
    let nodes = Array.from(corridors[i].neighbours.split(', '),Number);
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
    const room = myMap.latLngToPixel(location.latitude,location.longitude);
    let minDistance = Infinity;
    let result = 0;
    corridors.forEach((corridor, index) => {
      corridorStart = myMap.latLngToPixel(corridor.latitudeStart,corridor.longitudeStart)
      corridorEnd = myMap.latLngToPixel(corridor.latitudeEnd,corridor.longitudeEnd)
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
  console.log(cooridoor_list)
  // !navigation_loaded && addRouteStep(start.name,-1)
  cooridoor_list.forEach((path, index) => {
    if (!navigation_loaded) {
      if (index > 0) {
        addRouteStep(path,cooridoor_list[index - 1])
      } else {
        addRouteStep(path,start.name)
      }
    }
    switch (index) {
      case 0:
        if (Number.isInteger(start)) {
          highlight_cooridoor(path);
        } else {
          highlightEndpoint(path,cooridoor_list[1],start);
        }
        break;
      case cooridoor_list.length - 1:
        highlightEndpoint(path,cooridoor_list[cooridoor_list.length - 2],dest);
      break;
      default:
        highlight_cooridoor(path);
        break;
    }
  });
  !navigation_loaded && addRouteStep(dest.name,-1)
  !navigation_loaded && speak_next_step();
  navigation_loaded = true;
  
}
function highlight_cooridoor(index) {
  noFill();
  stroke(0,123,255);
  strokeWeight(3);
  let highlight = corridors[index-1];
  let highlight_start = myMap.latLngToPixel(highlight.latitudeStart, highlight.longitudeStart);
  let highlight_end = myMap.latLngToPixel(highlight.latitudeEnd, highlight.longitudeEnd);
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
  let current_start = myMap.latLngToPixel(cooridoorData.latitudeStart, cooridoorData.longitudeStart);
  let current_end = myMap.latLngToPixel(cooridoorData.latitudeEnd, cooridoorData.longitudeEnd);
  let prev_end = myMap.latLngToPixel(prevCooridoorData.latitudeEnd, prevCooridoorData.longitudeEnd);
  let diff_start = Math.abs(current_start.x - prev_end.x) + Math.abs(current_start.y - prev_end.y)
  let diff_end = Math.abs(current_end.x - prev_end.x) + Math.abs(current_end.y - prev_end.y)
  let highlight_start;
  if (diff_start > diff_end) {
    highlight_start = current_end;
  } else {
    highlight_start = current_start;
  }

  let point = myMap.latLngToPixel(node.latitude,node.longitude)
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
  document.querySelectorAll(".routeStep").forEach(element => {
    element.remove();
  })
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
    center: [location[1], location[0]],
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
     setZoomAndPopup(mouseX, mouseY, location, room_width, room_height, room_focus, "Y")
    })
  buildings.forEach((location) => {
    setZoomAndPopup(mouseX, mouseY, location, building_width, building_height, building_focus, "N")
  })
  entrances.forEach((location) => {
    setZoomAndPopup(mouseX, mouseY, location, entrances_width, entrances_height, entrances_focus, "N")
  })
  return false;
}

function setZoomAndPopup(mouseX, mouseY, location, width, height, focusZoom, makepopup){
  let element = myMap.latLngToPixel(location.latitude, location.longitude)
        // calculates x and y distances between location node center and mouse coordinate
        distanceX = Math.abs(element.x - mouseX)
        distanceY = Math.abs(element.y - mouseY)
        // if the distance between the mouse click and the center of the node is within the node's radius then zoom in on it
        if (distanceX <= width / 2 && distanceY <= height / 2) {
          zoomOnLocation([location.latitude, location.longitude], focusZoom);
          if (makepopup == "Y"){
            placePopup(location.id, [location.latitude, location.longitude], width, height);
          }
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
function placePopup(id, location, width, height) {
  fetch('/rooms/popupinfo/'+id)
  .then(response => response.json())
  .then(function(room){
    if (typeof room.description !== 'undefined') {
      if (popupExists == true){
        popup.remove() // remove any existing popups
      }
      console.log(room)
      popup = new mapboxgl.Popup({offset: getpopupOptions(width, height),closeOnClick: false})
      .setLngLat([location[1],location[0]])
      .setHTML(popupHTML(room.id, room.name, room.description, [room.weekdayHours, room.weekendHours], room.image))
      .addTo(myMap.map)
      popupBtnFunc(id, room.name)
      popupExists = true
    }
  })
}
function mouseClicked() {
  checkMouseClickForLocation(mouseX,mouseY);
  // checks if mouse was clicked over any of the location nodes and zooms in on them
}
function mouseDragged() {
  mouseIsDown = false;
}

// function renders HTML for popup
function popupHTML(id, name, description, hours, image){
  console.log(hours)
  let openhourshtml = ''
  openhourshtml += "Monday - Friday" + ": " + hours[0] + "<br>";
  openhourshtml += "Saturday - Sunday" + ": " + hours[1] + "<br>";
  

  const html = '<h5 style="text-align:center;"><b>'
    +name+
  '</b></h5><p style="text-align:center;"><i>'
  +description+
  '</i></p><div class="row"><div class="col-sm d-flex justify-content-center"><p><b>Opening Hours:</b><br>'
  +openhourshtml+
  '</p></div><div class="col-sm"><img src="'
  +image+
  '" alt="Picture of Building" class="img-responsive fit-image"></div></div><div class="popupBtn-wrapper"><button id="navHere'+id+'" class="btn btn-primary" data-bs-toggle="offcanvas" href="#offcanvasNavigation" role="button" aria-controls="offcanvasNavigation">Get Directions</button></div>'
  return(html)
}

// function gives the 'get directions' buttons in the popups their functionality
function popupBtnFunc(id, name){
  newNavBtn = document.getElementById("navHere"+id)
  
  newNavBtn.addEventListener("click", () => {
    console.log(document.getElementById("path2"))
    document.getElementById("path2").value = name // Just autofills destination for now
  })
}
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
function check_parallel(corridor_1,corridor_2) {
  const corridor_1_location = [[corridors[corridor_1 - 1].latitudeStart, corridors[corridor_1 - 1].longitudeStart], [corridors[corridor_1 - 1].latitudeEnd, corridors[corridor_1 - 1].longitudeEnd]]
  const corridor_2_location = [[corridors[corridor_2 - 1].latitudeStart, corridors[corridor_2 - 1].longitudeStart], [corridors[corridor_2 - 1].latitudeEnd, corridors[corridor_2 - 1].longitudeEnd]]
  const direction_1 = [corridor_1_location[1][0] - corridor_1_location[0][0],corridor_1_location[1][1] - corridor_1_location[0][1]]
  const direction_2 = [corridor_2_location[1][0] - corridor_2_location[0][0],corridor_2_location[1][1] - corridor_2_location[0][1]]
  const direction_1_length = Math.sqrt(Math.pow(direction_1[0],2)+Math.pow(direction_1[1],2))
  const direction_2_length = Math.sqrt(Math.pow(direction_2[0],2)+Math.pow(direction_2[1],2))
  let direction_1_normalised = [direction_1[0] / direction_1_length,direction_1[1] / direction_1_length]
  let direction_2_normalised = [direction_2[0] / direction_2_length,direction_2[1] / direction_2_length]
  direction_1_normalised = [Number(direction_1_normalised[0].toFixed(2)),Number(direction_1_normalised[1].toFixed(2))]
  direction_2_normalised = [Number(direction_2_normalised[0].toFixed(2)),Number(direction_2_normalised[1].toFixed(2))]
  if (Math.abs(direction_1_normalised[0] - direction_2_normalised[0]) < 0.03 && Math.abs(direction_1_normalised[1] - direction_2_normalised[1]) < 0.03) {
    return true;
  } else {
    return false;
  }
}
function get_turn_type(corridor, previous) {
  if (check_parallel(corridor,previous)) {
    return "carry straight on"
  } else {
    return 'turn'
  }
}
function addRouteStep(direction, previous) {
  const container = document.getElementById("routeStepList")
  const element = document.createElement('div')
  element.className = "routeStep"
  if (container.childNodes.length == 3) {
    element.className += " top"
  }
  var label = document.createElement("p")
  if (Number(direction)) {
    if (Number(previous)) {
      label.innerText = get_turn_type(direction, previous)
    }
    else {
      label.innerText = " turn onto corridor outside of " + (previous !== 'pin' ? previous : "Your location")
    }
  } else {
    label.innerText = direction
  }
  

  var soundButton = document.createElement('i')
  soundButton.classList = "fa fa-volume-up soundBtn"

  soundButton.addEventListener("click", () => {
    // Set the text property with the value of the textarea
    speech.text = label.innerText;
  
    // Start Speaking
    window.speechSynthesis.speak(speech);
  });

  element.appendChild(label)
  element.appendChild(soundButton)

  const closeButton = document.createElement('p')
  closeButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-lg" viewBox="0 0 16 16">
  <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"/>
</svg>`
  element.appendChild(closeButton)
  closeButton.onclick = () => {
    element.remove()
    if (container.childNodes.length == 4) {
      speech.text = "You have arrived at " + dest.name;
      window.speechSynthesis.speak(speech) 
      clearHighlight()
    } else {
      container.childNodes[3].className += " top"
      reduce_route()
      speak_next_step()
    }
    
  }
  
  container.appendChild(element)
}
function speak_next_step() {
  const container = document.getElementById("routeStepList")
  const top_label = container.childNodes[3];
  console.log(top_label)
  speech.text = top_label.innerText;
  window.speechSynthesis.speak(speech);
}
function reduce_route() {
  console.log('reducing route')
  let route = calculate_route()
  console.log(start)
  if (Number.isInteger(start)) {
    start = route[1]
  } else {
    start = route[0]
  }
  console.log(start)
  updateMap()

}

function calculate_route() {
  if (Number.isInteger(start)) {
    return navigate(graph,start,calculateNearestCorridor(dest));
  } else {
    return navigate(graph,calculateNearestCorridor(start),calculateNearestCorridor(dest));
  }
}

// This code is contributed by rag2127.


// TEXT TO SPEECH
// https://www.section.io/engineering-education/text-to-speech-in-javascript/
// Initialize new SpeechSynthesisUtterance object
let speech = new SpeechSynthesisUtterance();

// Set Speech Language
speech.lang = "en";

// Get List of Voices
voices = window.speechSynthesis.getVoices();

// Initially set the First Voice in the Array.
speech.voice = voices[0];
//speech.pitch = 1;
//speech.rate = 1;
speech.volume = 1
