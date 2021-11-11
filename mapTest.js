const key = 'pk.eyJ1Ijoid29yZHlzdW1vIiwiYSI6ImNrdmw4M2tuaDBqMmQyb281YWVrNTd4cjEifQ.K9oZUZYiwAd2sJs2_KTAug';
// Options for map
const options = {
  lat: 53.53094965890605,  
  lng: -1.1095832474735168,
  zoom: 16,
  maxBounds: [
  [-1.1158504070898965, 53.52834728777112], // Southwest coordinates
  [-1.103938727347374, 53.533850335887024] // Southwest coordinates

  ],
  bearing: -22,
  style: 'mapbox://styles/mapbox/streets-v10',
};

// Create an instance of MapboxGL
const mappa = new Mappa('MapboxGL', key);
let myMap;
let locations = [
  {
    "Name": "entrance",
    "priority": 1,
    "latLng": [-1.1127345482058217,53.53036036284166]
  },
]
let canvas;
let entrances = [
  [-1.1127345482058217,53.53036036284166],
  [-1.112592117062519,53.5303831882261],
  [-1.1112614815930613,53.531014559830766],
  [-1.1118969982503586,53.530551957905885],
  [-1.1118095562219992,53.530318240535735],
  [-1.1113278884448619,53.53021785062762],
  [-1.1111640508775338,53.530261424202536],
  [-1.1110975044741451,53.53056741491483],
  [-1.1080162367318849,53.53034296374247],
  [-1.11035050174317,53.531005202607304],
  [-1.1098367562255191,53.53097779311196],
  [-1.1093741287448893,53.53108993209284],
  [-1.1080159843762658,53.53145588038254]
]
const cooridoors = [[-1.1103482583224604,53.53100228817058],[-1.110301698664756,53.53093379136328],[-1.111894923765334,53.530551178826244],[-1.110673800502326,53.530844431537986],[-1.11030721970792,53.5303051266431],[-1.1068410149687509,53.531137535117665],[-1.1072552297266895,53.53103806238272],[-1.1074054603099341,53.53125907505736],[-1.1071030882403647,53.53133168867572],[-1.1078186260388918,53.53115985453226],[-1.1080181955802573,53.53145345142616],[-1.1078189315904012,53.531160304104986],[-1.1082239519315067,53.53106303944213],[-1.109081313920342,53.530857145275604],[-1.1091438191482723,53.53094910078636],[-1.1092621391884734,53.53092068639498],[-1.1093769246693341,53.531089554354764],[-1.1092622584503715,53.53092086188397],[-1.1097271743515762,53.530809212794026],[-1.1098413942244463,53.530977249094235],[-1.1097269353784611,53.53080886127606],[-1.1097862223649884,53.530794623546996],[-1.1097193503901224,53.53069624350394],[-1.1103770116611997,53.5305383058807],[-1.1100832171978539,53.53060886081974],[-1.109937514490781,53.530394506127266],[-1.108930930661245,53.530636238240504],[-1.1090811651882007,53.530857258828064],[-1.1081892219514486,53.53107145761791],[-1.1081170375377383,53.530965262767495],[-1.1082406413785861,53.53093557949097],[-1.1081626056591745,53.53082077606166],[-1.108868823355749,53.53065117806739],[-1.1088561233506198,53.53063249416968],[-1.1088446029684462,53.53061554571585],[-1.1088684677166043,53.53065065495505],[-1.1098353166755146,53.530418465322356],[-1.1098171704258846,53.530391768904934]]
// test coordinates for drawing route
const route = []

let finishedRoute = []
function setup() {
  canvas = createCanvas(1400, 700);
  // Create a tile map and overlay the canvas on top.
  myMap = mappa.tileMap(options);
  myMap.overlay(canvas);
  
  // anytime the map is panned or zoomed this function will execute
  myMap.onChange(drawCircle)
}
function drawCircle() {
  // clears anything currently drawn on the map
  clear()
  // coordinates found using the online map
  // const entrance1 = myMap.latLngToPixel(53.53113813177042, -1.1093604649270854)
  // const entrance2 = myMap.latLngToPixel(53.53137867565838, -1.1079222503739092)
  // const entrance3 = myMap.latLngToPixel(53.530260252588455, -1.1112643503399173)
  // const entrances = [entrance1, entrance2, entrance3]
  // draws a circle with a label on the map at teh corresponding x and y points on the screen
  entrances.forEach((element) => {
    const point = myMap.latLngToPixel(element[1], element[0])
    strokeWeight(1);
    stroke(100,100,100);
    fill(200, 100, 100);
    ellipse(point.x, point.y, 10, 10)
    textSize(15)
    fill(0,0,0)
    let title = "entrance"
    text(title,point.x + 6, point.y - 6)
  })
  drawRoute();
}
function drawRoute() {
  finishedRoute = []
  stroke(0,0,0);
  strokeWeight(2);
  if(cooridoors.length > 1){
    noFill();
    beginShape();
    cooridoors.forEach(function (e, i) {
        var pos = myMap.latLngToPixel(e[1], e[0]);
        // console.log(i)
        // if (i > 0) {
        //   var prev = myMap.latLngToPixel(route[i-1][1], route[i-1][0])
        
        //   if (Math.abs(pos.x-prev.x) > Math.abs(pos.y - prev.y)) {
        //     pos.y = prev.y
        //   } else {
        //     pos.x = prev.x
        //   }
        // }
        // let newPoint = myMap.pixelToLatLng(pos.x,pos.y)
        // route[i] = [newPoint.lng,newPoint.lat]
        vertex(pos.x, pos.y);
        finishedRoute.push([pos.x,pos.y])
        
    })
    const string = JSON.stringify(route)
    
    endShape()
  }
}
// The draw loop runs 60 times each second
function draw() {
  cursor(CROSS)
}

function mouseClicked() {
  const position = myMap.pixelToLatLng(mouseX, mouseY);
  route.push([position.lng,position.lat])
  console.log(myMap.accessMapBox());
  entrances.forEach((item) => {
    let element = myMap.latLngToPixel(item[1], item[0])
    distanceX = Math.abs(element.x - mouseX)
    distanceY = Math.abs(element.y - mouseY)
    if (distanceX <= 10 && distanceY <= 5) {
      myMap.accessMapBox().flyTo({
        center: [item[0], item[1]],
        zoom: 20
        });
    }
  })
}
function keyPressed() {
  console.log(keyCode);
  if (keyCode === 82) {
    
  }
}
