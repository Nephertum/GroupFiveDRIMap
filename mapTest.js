const key = 'pk.eyJ1Ijoid29yZHlzdW1vIiwiYSI6ImNrdmw4M2tuaDBqMmQyb281YWVrNTd4cjEifQ.K9oZUZYiwAd2sJs2_KTAug';
// Options for map
const options = {
  lat: 53.53094965890605,  
  lng: -1.1095832474735168,
  zoom: 16,
  maxBounds: [
  [-1.1188504070898965, 53.52834728777112], // Southwest coordinates
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
let pin = 0;
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
const entrances = [
  {
    name: "entrance",
    category: "entrance",
    width: 10,
    height: 10,
    focusZoom: 20,
    minZoom: 1,
    maxZoom: 100,
    location: [53.53036036284166,-1.1127345482058217]
  },
  {
    name: "entrance",
    category: "entrance",
    width: 10,
    height: 10,
    focusZoom: 20,
    minZoom: 1,
    maxZoom: 100,
    location: [53.5303831882261,-1.112592117062519]
  },
  {
    name: "entrance",
    category: "entrance",
    width: 10,
    height: 10,
    focusZoom: 20,
    minZoom: 1,
    maxZoom: 100,
    location: [53.531014559830766,-1.1112614815930613]
  },
  {
    name: "entrance",
    category: "entrance",
    width: 10,
    height: 10,
    focusZoom: 20,
    minZoom: 1,
    maxZoom: 100,
    location: [53.530551957905885,-1.1118969982503586]
  },
  {
    name: "entrance",
    category: "entrance",
    width: 10,
    height: 10,
    focusZoom: 20,
    minZoom: 1,
    maxZoom: 100,
    location: [53.530318240535735,-1.1118095562219992]
  },
  {
    name: "entrance",
    category: "entrance",
    width: 10,
    height: 10,
    focusZoom: 20,
    minZoom: 1,
    maxZoom: 100,
    location: [53.53021785062762,-1.1113278884448619]
  },
  {
    name: "entrance",
    category: "entrance",
    width: 10,
    height: 10,
    focusZoom: 20,
    minZoom: 1,
    maxZoom: 100,
    location: [53.530261424202536,-1.1111640508775338]
  },
  {
    name: "entrance",
    category: "entrance",
    width: 10,
    height: 10,
    focusZoom: 20,
    minZoom: 1,
    maxZoom: 100,
    location: [53.53056741491483,-1.1110975044741451]
  },
  {
    name: "entrance",
    category: "entrance",
    width: 10,
    height: 10,
    focusZoom: 20,
    minZoom: 1,
    maxZoom: 100,
    location: [53.53034296374247,-1.1080162367318849]
  },
  {
    name: "entrance",
    category: "entrance",
    width: 10,
    height: 10,
    focusZoom: 20,
    minZoom: 1,
    maxZoom: 100,
    location: [53.531005202607304,-1.11035050174317]
  },
  {
    name: "entrance",
    category: "entrance",
    width: 10,
    height: 10,
    focusZoom: 20,
    minZoom: 1,
    maxZoom: 100,
    location: [53.53097779311196,-1.1098367562255191]
  },
  {
    name: "entrance",
    category: "entrance",
    width: 10,
    height: 10,
    focusZoom: 20,
    minZoom: 1,
    maxZoom: 100,
    location: [53.53108993209284,-1.1093741287448893]
  },
  {
    name: "entrance",
    category: "entrance",
    width: 10,
    height: 10,
    focusZoom: 20,
    minZoom: 1,
    maxZoom: 100,
    location: [53.53145588038254,-1.1080159843762658]
  }
]
const cooridoorIndex = [
  {
    name: "cooridoor 1",
    category: "route",
    minZoom: 18,
    maxZoom: 100,
    location: [
      [53.5305514012573,-1.1118940672101587],
      [53.530844581102656,-1.110673662452001]
    ],
    neighbors : [2,4]
  },
  {
    name: "cooridoor 2",
    category: "route",
    minZoom: 18,
    maxZoom: 100,
    location: [
      [53.530844581102656,-1.110673662452001],
      [53.53093383871246,-1.1103016334823792]
    ],
    neighbors : [1,4,3]
  },
  {
    name: "cooridoor 3",
    category: "route",
    minZoom: 18,
    maxZoom: 100,
    location: [
      [53.53093383871246,-1.1103016334823792],
      [53.5310023141906, -1.1103480914643171]
    ],
    neighbors : [2]
  },
  {
    name: "cooridoor 4",
    category: "route",
    minZoom: 18,
    maxZoom: 100,
    location: [
      [53.530844581102656,-1.110673662452001],
      [53.53030522393195, -1.1103072358442603]
    ],
    neighbors : [1,2,5]
  },
  {
    name: "cooridoor 5",
    category: "route",
    minZoom: 18,
    maxZoom: 100,
    location: [
      [53.53030522393195, -1.1103072358442603],
      [53.53039400049377, -1.1099370219646403]
    ],
    neighbors : [4,8,6]
  },
  {
    name: "cooridoor 6",
    category: "route",
    minZoom: 18,
    maxZoom: 100,
    location: [
      [53.53039400049377, -1.1099370219646403],
      [53.53060891868219, -1.110083061694354]
    ],
    neighbors : [5,8,7,21]
  },
  {
    name: 'cooridoor 7',
    category: "route",
    minZoom: 18,
    maxZoom: 100,
    location: [
      [53.53060893652449, -1.110083044087105],
      [53.53053843928916, -1.110376648442866]
    ],
    neighbors : [6,21]
  },
  {
    name: 'cooridoor 8',
    category: "route",
    minZoom: 18,
    maxZoom: 100,
    location: [
      [53.53039403642282, -1.1099370313955035],
      [53.53041848322417, -1.1098353526766118]
    ],
    neighbors : [9,5,6,10]
  },
  {
    name: 'cooridoor 9',
    category: "route",
    minZoom: 18,
    maxZoom: 100,
    location: [
      [53.53041848322417, -1.1098353526766118],
      [53.530391970828475, -1.1098172912050757]
    ],
    neighbors : [8,10]
  },
  {
    name: 'cooridoor 10',
    category: "route",
    minZoom: 18,
    maxZoom: 100,
    location: [
      [53.53041848322417, -1.1098353526766118],
      [53.53063570704225, -1.1089304746676873]
    ],
    neighbors : [11,8,9,13]
  },
  {
    name: 'cooridoor 11',
    category: "route",
    minZoom: 18,
    maxZoom: 100,
    location: [
      [53.53063570704225, -1.1089304746676873],
      [53.530650692728756, -1.10886852098605]
    ],
    neighbors : [10,13,12,22]
  },
  {
    name: 'cooridoor 12',
    category: "route",
    minZoom: 18,
    maxZoom: 100,
    location: [
      [53.530650692728756, -1.10886852098605],
      [53.53061571749669, -1.1088446010584505]
    ],
    neighbors : [11,22]
  },
  {
    name: 'cooridoor 13',
    category: "route",
    minZoom: 18,
    maxZoom: 100,
    location: [
      [53.53063570704225, -1.1089304746676873],
      [53.530857366483815, -1.1090810697784548]
    ],
    neighbors : [10,11,14,26]
  },
  {
    name: 'cooridoor 14',
    category: "route",
    minZoom: 18,
    maxZoom: 100,
    location: [
      [53.530857366483815, -1.1090810697784548],
      [53.53094916600901, -1.1091436162841717]
    ],
    neighbors : [13,15,26]
  },
  {
    name: 'cooridoor 15',
    category: "route",
    minZoom: 18,
    maxZoom: 100,
    location: [
      [53.53094916600901, -1.1091436162841717],
      [53.53092072004907, -1.1092620749969342]
    ],
    neighbors : [14,16,17]
  },
  {
    name: 'cooridoor 16',
    category: "route",
    minZoom: 18,
    maxZoom: 100,
    location: [
      [53.53092072004907, -1.1092620749969342],
      [53.531089605795756, -1.1093769525469668]
    ],
    neighbors : [15,17]
  },
  {
    name: 'cooridoor 17',
    category: "route",
    minZoom: 18,
    maxZoom: 100,
    location: [
      [53.53092072004907, -1.1092620749969342],
      [53.53080932681644, -1.1097271692692914]
    ],
    neighbors : [15,16,18,19]
  },
  {
    name: 'cooridoor 18',
    category: "route",
    minZoom: 18,
    maxZoom: 100,
    location: [
      [53.53080932681644, -1.1097271692692914],
      [53.53097630217428, -1.109840744583039]
    ],
    neighbors : [17,19]
  },
  {
    name: 'cooridoor 19',
    category: "route",
    minZoom: 18,
    maxZoom: 100,
    location: [
      [53.53080932681644, -1.1097271692692914],
      [53.530795275366444, -1.1097865216131595]
    ],
    neighbors : [17,18,20]
  },
  {
    name: 'cooridoor 20',
    category: "route",
    minZoom: 18,
    maxZoom: 100,
    location: [
      [53.530795275366444, -1.1097865216131595],
      [53.53069629314572, -1.1097192543872438]
    ],
    neighbors : [19,21]
  },
  {
    name: 'cooridoor 21',
    category: "route",
    minZoom: 18,
    maxZoom: 100,
    location: [
      [53.53069629314572, -1.1097192543872438],
      [53.5306089545719, -1.1100829973646285]
    ],
    neighbors : [20,6,7]
  },
  {
    name: "cooridoor 22",
    category: "route",
    minZoom: 18,
    maxZoom: 100,
    location: [
      [53.530650735402304, -1.1088684885899056],
      [53.530820419733885, -1.108162104422263]
    ],
    neighbors : [11,12,23,27]
  },
  {
    name: "cooridoor 23",
    category: "route",
    minZoom: 18,
    maxZoom: 100,
    location: [
      [53.530820419733885, -1.108162104422263],
      [53.530935661881955, -1.1082405960221422]
    ],
    neighbors : [22,24,27]
  },
  {
    name: "cooridoor 24",
    category: "route",
    minZoom: 18,
    maxZoom: 100,
    location: [
      [53.530935661881955, -1.1082405960221422],
      [53.53096533568163, -1.1081170287382918]
    ],
    neighbors : [23,25]
  },
  {
    name: "cooridoor 25",
    category: "route",
    minZoom: 18,
    maxZoom: 100,
    location: [
      [53.53096533568163, -1.1081170287382918],
      [53.53107142873114, -1.1081891855639014]
    ],
    neighbors : [24,26,33]
  },
  {
    name: "cooridoor 26",
    category: "route",
    minZoom: 18,
    maxZoom: 100,
    location: [
      [53.53107142873114, -1.1081891855639014],
      [53.53085729646716, -1.1090809724322241]
    ],
    neighbors : [33,25,14,13]
  },
  {
    name: "cooridoor 27",
    category: "route",
    minZoom: 18,
    maxZoom: 100,
    location: [
      [53.530820419733885, -1.108162104422263],
      [53.53103806694804, -1.1072551110367215]
    ],
    neighbors : [22,23,28,29]
  },
  {
    name: "cooridoor 28",
    category: "route",
    minZoom: 18,
    maxZoom: 100,
    location: [
      [53.53103806694804, -1.1072551110367215],
      [53.53113752911736, -1.1068410904123596]
    ],
    neighbors : [27,29]
  },
  {
    name: "cooridoor 29",
    category: "route",
    minZoom: 18,
    maxZoom: 100,
    location: [
      [53.53103806694804, -1.1072551110367215],
      [53.53125956330538, -1.1074051972444465]
    ],
    neighbors : [27,28,30,31]
  },
  {
    name: "cooridoor 30",
    category: "route",
    minZoom: 18,
    maxZoom: 100,
    location: [
      [53.53125956330538, -1.1074051972444465],
      [53.53133228754169, -1.1071023645346543]
    ],
    neighbors : [29,31]
  },
  {
    name: "cooridoor 31",
    category: "route",
    minZoom: 18,
    maxZoom: 100,
    location: [
      [53.53125956330538, -1.1074051972444465],
      [53.53116008744527, -1.1078179644715362]
    ],
    neighbors : [29,30,32,33]
  },
  {
    name: "cooridoor 32",
    category: "route",
    minZoom: 18,
    maxZoom: 100,
    location: [
      [53.53116008744527, -1.1078179644715362],
      [53.53145368710386, -1.1080184334131218]
    ],
    neighbors : [31,33]
  },
  {
    name: "cooridoor 33",
    category: "route",
    minZoom: 18,
    maxZoom: 100,
    location: [
      [53.53116008744527, -1.1078179644715362],
      [53.53107139817712, -1.1081892912078217]
    ],
    neighbors : [31,32,25,26]
  },

]
// first array element is latitude
const buildings = [
  {
    name: "Women + Children",
    category: "building",
    width: 80,
    height: 40,
    focusZoom: 17,
    maxZoom: 17,
    minZoom: 1,
    location: [53.53024455226753, -1.1126034005113183]
  },
  {
    name: "West Block",
    category: "building",
    width: 80,
    height: 40,
    focusZoom: 17,
    maxZoom: 17,
    minZoom: 1,
    location: [53.53069179653954,  -1.1105351374701513]
  },
  {
    name: "South Block",
    category: "building",
    width: 80,
    height: 40,
    focusZoom: 17,
    maxZoom: 17,
    minZoom: 1,
    location: [53.53055885767401, -1.1084207985776686]
  },
  {
    name: "East Block",
    category: "building",
    width: 80,
    height: 40,
    focusZoom: 17,
    maxZoom: 17,
    minZoom: 1,
    location: [53.53115754402981, -1.1075016917824883]
  },
  {
    name: "Carousel",
    category: "building",
    width: 80,
    height: 40,
    focusZoom: 19,
    maxZoom: 100,
    minZoom: 17,
    location: [53.52967385366341, -1.1120872592508988]
  },
  {
    name: "A Block",
    category: "building",
    width: 80,
    height: 40,
    focusZoom: 19,
    maxZoom: 100,
    minZoom: 17,
    location: [53.52960223948364,-1.1135195943024314]
  },
  {
    name: "B Block",
    category: "building",
    width: 80,
    height: 40,
    focusZoom: 19,
    maxZoom: 100,
    minZoom: 17,
    location: [53.52970020366635,-1.112693291174395]
  },
  {
    name: "C Block",
    category: "building",
    width: 80,
    height: 40,
    focusZoom: 19,
    maxZoom: 100,
    minZoom: 17,
    location: [53.52946105272787,-1.113025788083064]
  },
  {
    name: "D Block",
    category: "building",
    width: 80,
    height: 40,
    focusZoom: 19,
    maxZoom: 100,
    minZoom: 17,
    location: [53.53008930660272,-1.1139106344718073]
  }
]

// room template
/*
name: [room name],
category: "room",
width: 80-100,
height: 40 - 60,
focusZoom: 20,
maxZoom: 100,
minZoom: 18,
location: [latitude, longitude]
*/
const rooms = [
  {
    id: "r0",
    name: "MRI",
    category: "room",
    width: 80,
    height: 40,
    focusZoom: 20,
    maxZoom: 100,
    minZoom: 18,
    location: [53.53036640939672,-1.111265543620732],
    info: [
      "Doncaster Royal Infirmary's MRI room", // description
      [[["Monday-Friday"], ["08:30-17:00"]], [["Saturday-Sunday"], ["Closed"]]], // opening hours
      "default.jpeg" // image
]
  },
  {
    id: "r1",
    name: "Fracture Clinic",
    category: "room",
    width: 80,
    height: 40,
    focusZoom: 20,
    maxZoom: 100,
    minZoom: 18,
    location: [53.53080208149055,-1.1111481473436413],
    info: [
      "Doncaster Royal Infirmary's fracture clinic",
      [[["Monday-Friday"], ["08:30-17:00"]], [["Saturday-Sunday"], ["Closed"]]],
      "default.jpeg"
]
  },
  {
    id: "r2",
    name: "X-Ray",
    category: "room",
    width: 80,
    height: 35,
    focusZoom: 20,
    maxZoom: 100,
    minZoom: 18,
    location: [53.53036425859261,-1.1099108784393081],
    info: [
      "Doncaster Royal Infirmary's X-ray room",
      [[["Monday-Friday"], ["08:30-17:00"]], [["Saturday-Sunday"], ["Closed"]]],
      "default.jpeg"
]
  },
  {
    id: "r3",
    name: "East Dining Room",
    category: "room",
    width: 100,
    height: 60,
    focusZoom: 20,
    maxZoom: 100,
    minZoom: 18,
    location: [53.53142886029542, -1.1068973618855011],
    info: [
      "Doncaster Royal Infirmary's east dining room",
      [[["Monday-Friday"], ["08:30-17:00"]], [["Saturday-Sunday"], ["Closed"]]],
      "default.jpeg"
]
  },
  {
    id: "r4",
    name: "Eye Clinic",
    category: "room",
    width: 80,
    height: 35,
    focusZoom: 20,
    maxZoom: 100,
    minZoom: 18,
    location: [53.53082831322658,-1.109475816718657],
    info: [
          "Doncaster Royal Infirmary's eye clinic",
          [[["Monday-Friday"], ["08:30-17:00"]], [["Saturday-Sunday"], ["Closed"]]],
          "default.jpeg"
  ]
  }
]
const locations = [entrances, buildings, rooms, cooridoorIndex]

const drawFunctions = {
  "building" : drawBuildings,
  "room" : drawBuildings,
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
    rooms.forEach(element => {
      if (element.name == room) {
        myMap.accessMapBox().flyTo({
          center: [element.location[1], element.location[0]],
          zoom: element.focusZoom
        });
        document.getElementById("locationDisplay").innerText = "Selected node: " + element.name; 
      }
    })
  })
  const navigateButton = document.getElementById("navigateBtn");
  const input1 = document.getElementById("path1");
  const input2 = document.getElementById("path2");
  navigateButton.addEventListener("click", () => {
    start = parseInt(input1.value);
    dest = parseInt(input2.value)
    updateMap();
  })
}
function updateMap() {
  if (!loaded) {
    myMap.accessMapBox().addControl(new mapboxgl.FullscreenControl());
    loaded = true;
  }
  
  // clears anything currently drawn on the map
  clear()
  drawNodes();
  placePin();
  if (start != 0 && dest != 0) {
    highlight_path(navigate(generateGraph(),start,dest));
  }
  
}

function drawNodes(){
  locations.forEach(locationType => {
    locationType.forEach(location => {
      if (checkValidZoom(location.minZoom, location.maxZoom)) {
        const drawFunction = drawFunctions[location.category];
        drawFunction(location);
      }
    })
  })
}
// draws the internal cooridoors on the map after a certain zoom threshold
function drawRoute(node) {
  noFill();
  stroke(0,0,0);
  strokeWeight(2);
  beginShape();
  const start = myMap.latLngToPixel(node.location[0][0],node.location[0][1])
  const end = myMap.latLngToPixel(node.location[1][0],node.location[1][1])
  vertex(start.x,start.y);
  vertex(end.x,end.y);
  endShape();
  fill(255,255,255);
  text(node.name,(start.x + end.x) / 2,(start.y + end.y) / 2)
  
}
function updatePinLocation() {
  pin = myMap.pixelToLatLng(mouseX,mouseY);
  updateMap();
}
function placePin() {
  fill(255,0,0);
  strokeWeight(1);
  if (pin !== 0) {
      let center = myMap.latLngToPixel(pin.lat,pin.lng);
      triangle(center.x-8,center.y - 8,center.x + 8, center.y - 8, center.x, center.y + 8)
  }
}
function drawEntrances(node) {
  textAlign(LEFT, BOTTOM);
  strokeWeight(1);
  stroke(100,100,100);
  textSize(15);
  const zoom = myMap.zoom();
  const point = myMap.latLngToPixel(node.location[0], node.location[1])
  fill(200, 100, 100);
  ellipse(point.x, point.y, node.width, node.height)
  fill(0,0,0)
  if (zoom > 18) {
    text(node.name,point.x + 6, point.y - 6)
  }
}
function drawBuildings(node) {
  noFill();
  strokeWeight(1)
  rectMode(CENTER)
  textAlign(CENTER, CENTER);
  pos = myMap.latLngToPixel(node.location[0], node.location[1])
  rect(pos.x, pos.y,node.width,node.height, 15)
  text(node.name,pos.x,pos.y,node.width,node.height)
}
function generateGraph() {
  let graph = []
  // loops through each cooridoor node
  for (let i = 0; i< 33; i++) {
    let current = [];
    let nodes = cooridoorIndex[i].neighbors;
    // loops through every other cooridoor
    for (let j = 0; j< 33; j++) {
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
// highlights a cooridoor red, to be used for navigation
function highlight_path(cooridoor_list) {
  cooridoor_list.forEach(path => {
    highlight_cooridoor(path);
  });
}
function highlight_cooridoor(index) {
  noFill();
  stroke(255,0,0);
  strokeWeight(3);
  let highlight = cooridoorIndex[index-1];
  let highlight_start = myMap.latLngToPixel(highlight.location[0][0], highlight.location[0][1]);
  let highlight_end = myMap.latLngToPixel(highlight.location[1][0], highlight.location[1][1]);
  beginShape();
  vertex(highlight_start.x, highlight_start.y);
  vertex(highlight_end.x, highlight_end.y);    
  endShape();
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
function zoomOnLocation(location) {
  myMap.accessMapBox().flyTo({
    center: [location.location[1], location.location[0]],
    zoom: location.focusZoom
  });
  document.getElementById("locationDisplay").innerText = "Selected node: " + location.name; 
}
// checks location of mouse click to see if a location node was clicked and then calls zoomOnLocation on this node
function checkMouseClickForLocation(mouseX,mouseY) {
  locations.forEach(locationType => {
    locationType.forEach((location) => {
      if (location.category != "route") {
        let element = myMap.latLngToPixel(location.location[0], location.location[1])
        // calculates x and y distances between location node center and mouse coordinate
        distanceX = Math.abs(element.x - mouseX)
        distanceY = Math.abs(element.y - mouseY)
        // if the distance between the mouse click and the center of the node is within the node's radius then zoom in one it
        if (distanceX <= location.width / 2 && distanceY <= location.height / 2) {
          zoomOnLocation(location);
          if (typeof location.info !== 'undefined') {
            if (popupExists == true){
              popup.remove() // remove any existing popups
            }
            popup = new mapboxgl.Popup({closeOnClick: false})
            .setLngLat([location.location[1],location.location[0]])
            .setHTML(popupHTML(location.id, location.name, location.info))
            .addTo(myMap.accessMapBox();
            popupBtnFunc(location.id, location.name)
            // myMap.addPopup(location.location, description);
            popupExists = true
            console.log(myMap.map === myMap.accessMapBox())
          }
        }
      }
    })
  })
  return false;
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
  '" alt="Picture of Building" class="img-responsive fit-image"></div></div><div class="popupBtn-wrapper"><button id="navHere'+id+'" class="popupBtn">Get Directions</button></div>'
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



// console.log(dijkstra(generateGraph(),0));

// This code is contributed by rag2127.

