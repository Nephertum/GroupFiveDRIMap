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

let canvas;
let meteorites;
// test coordinates for drawing route
const route = [[53.530108158877475, -1.1116822921464502],[53.530234070084155, -1.1117748128483629],[53.53041462429388, -1.1118995356003185],[53.53056927060675, -1.1120061534752541],[53.53082754453948, -1.112201954610279]]
function setup() {
  canvas = createCanvas(1200, 700);

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
  const entrance1 = myMap.latLngToPixel(53.53113813177042, -1.1093604649270854)
  const entrance2 = myMap.latLngToPixel(53.53137867565838, -1.1079222503739092)
  const entrance3 = myMap.latLngToPixel(53.530260252588455, -1.1112643503399173)
  const entrances = [entrance1, entrance2, entrance3]
  // draws a circle with a label on the map at teh corresponding x and y points on the screen
  entrances.forEach((element, index) => {
    strokeWeight(1);
    stroke(0);
    fill(200, 100, 100);
    ellipse(element.x, element.y, 10, 10)
    textSize(15)
    fill(0,0,0)
    let title = "entrance: "
    let number = index + 1
    text(title + number,element.x + 6, element.y - 6)
  })
  // test line for route navigation
  stroke(255,0,0);
  strokeWeight(5);
  noFill();
  beginShape();
  route.forEach(function (e) {
      var pos = myMap.latLngToPixel(e[0], e[1]);
      vertex(pos.x, pos.y);
  
  endShape()
  })
  
}
// The draw loop runs 60 times each second
function draw() {
    cursor(CROSS)
    
}

function mouseClicked() {
  const entrance1 = myMap.latLngToPixel(53.53113813177042, -1.1093604649270854)
  const entrance2 = myMap.latLngToPixel(53.53137867565838, -1.1079222503739092)
  const entrance3 = myMap.latLngToPixel(53.530260252588455, -1.1112643503399173)
  const entrances = [entrance1, entrance2, entrance3]
  entrances.forEach((element, index) => {
    distanceX = Math.abs(element.x - mouseX)
    distanceY = Math.abs(element.y - mouseY)
    if (distanceX <= 10 && distanceY <= 5) {
      console.log(index + 1)
    }
  })
}
