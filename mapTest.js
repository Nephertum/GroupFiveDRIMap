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
let canvas;
const entrances = [
  {
    name: "entrance",
    width: 10,
    height: 10,
    focusZoom: 20,
    location: [53.53036036284166,-1.1127345482058217]
  },
  {
    name: "entrance",
    width: 10,
    height: 10,
    focusZoom: 20,
    location: [53.5303831882261,-1.112592117062519]
  },
  {
    name: "entrance",
    width: 10,
    height: 10,
    focusZoom: 20,
    location: [53.531014559830766,-1.1112614815930613]
  },
  {
    name: "entrance",
    width: 10,
    height: 10,
    focusZoom: 20,
    location: [53.530551957905885,-1.1118969982503586]
  },
  {
    name: "entrance",
    width: 10,
    height: 10,
    focusZoom: 20,
    location: [53.530318240535735,-1.1118095562219992]
  },
  {
    name: "entrance",
    width: 10,
    height: 10,
    focusZoom: 20,
    location: [53.53021785062762,-1.1113278884448619]
  },
  {
    name: "entrance",
    width: 10,
    height: 10,
    focusZoom: 20,
    location: [53.530261424202536,-1.1111640508775338]
  },
  {
    name: "entrance",
    width: 10,
    height: 10,
    focusZoom: 20,
    location: [53.53056741491483,-1.1110975044741451]
  },
  {
    name: "entrance",
    width: 10,
    height: 10,
    focusZoom: 20,
    location: [53.53034296374247,-1.1080162367318849]
  },
  {
    name: "entrance",
    width: 10,
    height: 10,
    focusZoom: 20,
    location: [53.531005202607304,-1.11035050174317]
  },
  {
    name: "entrance",
    width: 10,
    height: 10,
    focusZoom: 20,
    location: [53.53097779311196,-1.1098367562255191]
  },
  {
    name: "entrance",
    width: 10,
    height: 10,
    focusZoom: 20,
    location: [53.53108993209284,-1.1093741287448893]
  },
  {
    name: "entrance",
    width: 10,
    height: 10,
    focusZoom: 20,
    location: [53.53145588038254,-1.1080159843762658]
  }
]
const cooridoors = [[-1.1103482583224604,53.53100228817058],[-1.110301698664756,53.53093379136328],[-1.111894923765334,53.530551178826244],[-1.110673800502326,53.530844431537986],[-1.11030721970792,53.5303051266431],[-1.1068410149687509,53.531137535117665],[-1.1072552297266895,53.53103806238272],[-1.1074054603099341,53.53125907505736],[-1.1071030882403647,53.53133168867572],[-1.1078186260388918,53.53115985453226],[-1.1080181955802573,53.53145345142616],[-1.1078189315904012,53.531160304104986],[-1.1082239519315067,53.53106303944213],[-1.109081313920342,53.530857145275604],[-1.1091438191482723,53.53094910078636],[-1.1092621391884734,53.53092068639498],[-1.1093769246693341,53.531089554354764],[-1.1092622584503715,53.53092086188397],[-1.1097271743515762,53.530809212794026],[-1.1098413942244463,53.530977249094235],[-1.1097269353784611,53.53080886127606],[-1.1097862223649884,53.530794623546996],[-1.1097193503901224,53.53069624350394],[-1.1103770116611997,53.5305383058807],[-1.1100832171978539,53.53060886081974],[-1.109937514490781,53.530394506127266],[-1.108930930661245,53.530636238240504],[-1.1090811651882007,53.530857258828064],[-1.1081892219514486,53.53107145761791],[-1.1081170375377383,53.530965262767495],[-1.1082406413785861,53.53093557949097],[-1.1081626056591745,53.53082077606166],[-1.108868823355749,53.53065117806739],[-1.1088561233506198,53.53063249416968],[-1.1088446029684462,53.53061554571585],[-1.1088684677166043,53.53065065495505],[-1.1098353166755146,53.530418465322356],[-1.1098171704258846,53.530391768904934]]
// first array element is latitude
const buildings = [
  {
    name: "Women + Children",
    width: 80,
    height: 40,
    focusZoom: 17,
    maxZoom: 17,
    minZoom: 1,
    location: [53.53024455226753, -1.1126034005113183]
  },
  {
    name: "West Block",
    width: 80,
    height: 40,
    focusZoom: 17,
    maxZoom: 17,
    minZoom: 1,
    location: [53.53069179653954,  -1.1105351374701513]
  },
  {
    name: "South Block",
    width: 80,
    height: 40,
    focusZoom: 17,
    maxZoom: 17,
    minZoom: 1,
    location: [53.53055885767401, -1.1084207985776686]
  },
  {
    name: "East Block",
    width: 80,
    height: 40,
    focusZoom: 17,
    maxZoom: 17,
    minZoom: 1,
    location: [53.53115754402981, -1.1075016917824883]
  },
  {
    name: "Carousel",
    width: 80,
    height: 40,
    focusZoom: 19,
    maxZoom: 100,
    minZoom: 17,
    location: [53.52967385366341, -1.1120872592508988]
  },
  {
    name: "A Block",
    width: 80,
    height: 40,
    focusZoom: 19,
    maxZoom: 100,
    minZoom: 17,
    location: [53.52960223948364,-1.1135195943024314]
  },
  {
    name: "B Block",
    width: 80,
    height: 40,
    focusZoom: 19,
    maxZoom: 100,
    minZoom: 17,
    location: [53.52970020366635,-1.112693291174395]
  },
  {
    name: "C Block",
    width: 80,
    height: 40,
    focusZoom: 19,
    maxZoom: 100,
    minZoom: 17,
    location: [53.52946105272787,-1.113025788083064]
  },
  {
    name: "D Block",
    width: 80,
    height: 40,
    focusZoom: 19,
    maxZoom: 100,
    minZoom: 17,
    location: [53.53008930660272,-1.1139106344718073]
  }
]
const rooms = [
  {
    name: "MRI",
    width: 80,
    height: 40,
    focusZoom: 20,
    maxZoom: 100,
    minZoom: 18,
    location: [53.53036640939672,-1.111265543620732]
  },
  {
    name: "Fracture Clinic",
    width: 80,
    height: 40,
    focusZoom: 20,
    maxZoom: 100,
    minZoom: 18,
    location: [53.53080208149055,-1.1111481473436413]
  },
  {
    name: "X-Ray",
    width: 80,
    height: 35,
    focusZoom: 20,
    maxZoom: 100,
    minZoom: 18,
    location: [53.53036425859261,-1.1099108784393081]
  },
  {
    name: "East Dining Room",
    width: 100,
    height: 60,
    focusZoom: 20,
    maxZoom: 100,
    minZoom: 18,
    location: [53.53142886029542, -1.1068973618855011]
  },
  {
    name: "Eye Clinic",
    width: 80,
    height: 35,
    focusZoom: 20,
    maxZoom: 100,
    minZoom: 18,
    location: [53.53082831322658,-1.109475816718657]
  }
]
const locations = [entrances, buildings, rooms]
// test coordinates for drawing route
const route = []
function setup() {
  canvas = createCanvas(window.innerWidth, 700);
  // Create a tile map and overlay the canvas on top.
  myMap = mappa.tileMap(options);
  myMap.overlay(canvas);
  
  // anytime the map is panned or zoomed this function will execute
  myMap.onChange(updateMap)
  setupButton();
}
function setupButton() {
  const Searchbutton = document.getElementById('SearchBtn')
  const Searchinput = document.getElementById('roomSearch')
  console.log(Searchbutton);
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
}
function updateMap() {
  // clears anything currently drawn on the map
  clear()
  // coordinates found using the online map
  // draws a circle with a label on the map at teh corresponding x and y points on the screen
  
  drawEntrances();
  drawBuildings();
  drawRoute();
}
// draws the internal cooridoors on the map after a certain zoom threshold
function drawRoute() {
  const zoom = myMap.zoom();
  if (zoom > 17) {
    stroke(0,0,0);
    strokeWeight(2);
    if(cooridoors.length > 1){
      noFill();
      beginShape();
      cooridoors.forEach(function (e, i) {
          var pos = myMap.latLngToPixel(e[1], e[0]);
          vertex(pos.x, pos.y);
    })
    const string = JSON.stringify(route)
    
    endShape()
  }
  }
}
function drawEntrances() {
  textAlign(LEFT, BOTTOM);
  strokeWeight(1);
  stroke(100,100,100);
  textSize(15);
  const zoom = myMap.zoom();
  entrances.forEach((element) => {
    const point = myMap.latLngToPixel(element.location[0], element.location[1])
    fill(200, 100, 100);
    ellipse(point.x, point.y, element.width, element.height)
    fill(0,0,0)
    if (zoom > 18) {
      text(element.name,point.x + 6, point.y - 6)
    }
  })
}

function drawBuildings() {
  const zoom = myMap.zoom();
  noFill();
  strokeWeight(1)
  rectMode(CENTER)
  textAlign(CENTER, CENTER);
  buildings.forEach(element => {
    if (element.minZoom <= zoom && element.maxZoom >= zoom) {
    pos = myMap.latLngToPixel(element.location[0], element.location[1])
    rect(pos.x, pos.y,element.width,element.height, 15)
    text(element.name,pos.x,pos.y,element.width,element.height)
    }
  })
  rooms.forEach(element => {
    if (element.minZoom <= zoom && element.maxZoom >= zoom) {
    pos = myMap.latLngToPixel(element.location[0], element.location[1])
    rect(pos.x, pos.y,element.width,element.height, 15)
    text(element.name,pos.x,pos.y,element.width,element.height)
    }
  })
  
}
// The draw loop runs 60 times each second
function draw() {
  cursor(CROSS)
}
function mouseClicked() {
  console.log(myMap.pixelToLatLng(mouseX, mouseY))
  locations.forEach(location => {
    location.forEach((item) => {
      let element = myMap.latLngToPixel(item.location[0], item.location[1])
      distanceX = Math.abs(element.x - mouseX)
      distanceY = Math.abs(element.y - mouseY)
      if (distanceX <= item.width / 2 && distanceY <= item.height / 2) {
        console.log(item.location[1]);
        console.log(item.location[0])
        myMap.accessMapBox().flyTo({
          center: [item.location[1], item.location[0]],
          zoom: item.focusZoom
        });
        
        document.getElementById("locationDisplay").innerText = "Selected node: " + item.name; 
      }
    })
  })
  // checks if mouse was clicked over any of the location nodes and zooms in on them
}
