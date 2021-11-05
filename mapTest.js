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

function setup() {
  canvas = createCanvas(1200, 700);

  // Create a tile map and overlay the canvas on top.
  myMap = mappa.tileMap(options);
  myMap.overlay(canvas);
  fill(200, 100, 100);
  myMap.onChange(drawCircle)
  // Load the data
  // Only redraw the meteorites when the map change and not every frame.
}
function drawCircle() {
  clear()
  const hospital = myMap.latLngToPixel(53.53094965890605,-1.1095832474735168)
  ellipse(hospital.x,hospital.y, 20,20)
}
// The draw loop is fully functional but we are not using it for now.
function draw() {
    cursor(CROSS)
}