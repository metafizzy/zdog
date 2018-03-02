/* globals makeBuilding, makeDome, oneStoryBuilding, twoStoryBuilding, oneStorySlanter, makeRock */

// -------------------------- demo -------------------------- //

var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
var w = 192;
var h = 164;
var minWindowSize = Math.min( window.innerWidth, window.innerHeight );
var zoom = Math.min( 7, Math.floor( minWindowSize / w ) );
var zoom = 5;
var pixelRatio = window.devicePixelRatio || 1;
zoom *= pixelRatio;
var canvasWidth = canvas.width = w * zoom;
var canvasHeight = canvas.height = h * zoom;
// set canvas screen size
if ( pixelRatio > 1 ) {
  canvas.style.width = canvasWidth / pixelRatio + 'px';
  canvas.style.height = canvasHeight / pixelRatio + 'px';
}

var isRotating = false;

// colors
// var white = 'white';
// var southWall = white;
// var westWall = '#CDE';
// var eastWall = '#8AD';
// var roof = '#06B';
// var northWall = roof;
// var navy = '#037';
// var midnight = '#024';

Shape.defaults.fill = true;
Shape.defaults.stroke = false;

var camera = new Shape({
  rendering: false,
  rotate: {
    y: -TAU/8,
  },
});

var island = new Shape({
  rendering: false,
  addTo: camera,
  scale: { x: 1/Math.sin(TAU/8), z: 1/Math.sin(TAU/8) }
});

// Shape.defaults.lineWidth = 1/zoom;

// -- illustration shapes --- //


// lil house in front, center
oneStoryBuilding({
  addTo: island,
  translate: { x: 17, z: -24 },
  gable: 'ns'
});

// lil house to the east
oneStoryBuilding({
  addTo: island,
  translate: { x: 47, z: -16 },
  gable: 'ns'
});

// 2 story gable, east end
twoStoryBuilding({
  addTo: island,
  translate: { x: 55, z: -4 },
  gable: 'ns'
});

// 2 story gable, center west
twoStoryBuilding({
  addTo: island,
  translate: { x: 14, y: -2, z: -13 },
  gable: 'ew',
});


// 2 story gable, west end
twoStoryBuilding({
  addTo: island,
  translate: { x: -14, z: -25 },
  gable: 'ew',
});


// 1 story slantS, west
oneStorySlanter({
  addTo: island,
  translate: { x: 0, z: -26 },
  gable: 'slantS',
});



// -----  ----- //

// 2.5 story slantS, east
var buildAnchor4 = new Shape({
  rendering: false,
  addTo: island,
  translate: { x: 42, z: -6 },
});

makeBuilding({
  width: 14,
  height: 20,
  depth: 6,
  gable: 'slantS',
  addTo: buildAnchor4,
  nsWindows: [
    { x: -4, y: -17 },
    { x:  0, y: -17 },
    { x:  4, y: -17 },
  ],
  ewWindows: [
    { x: 0, y: -17 }
  ],
});

// ----- cathedral ----- //

var cathBaseAnchor = new Shape({
  rendering: false,
  addTo: island,
  translate: { x: 28, z: -12 },
});

// cathedral base
makeBuilding({
  width: 10,
  height: 12,
  depth: 18,
  gable: 'cap',
  addTo: cathBaseAnchor,
  nsWindows: [
    { x: -2, y: -3 },
    { x:  2, y: -3 },
    { x: -2, y: -9 },
    { x:  2, y: -9 },
  ],
  ewWindows: [
    { style: 'circle', x: -6, y: -9 },
    { style: 'circle', x: -2, y: -9 },
    { style: 'circle', x: 2, y: -9 },
    { style: 'circle', x: 6, y: -9 },
    { height: 6, x: -6, y: -5 },
    { height: 6, x: -2, y: -5 },
    { height: 6, x: 2, y: -5 },
    { height: 6, x: 6, y: -5 },
  ],
});

// cathedral 2nd story
var cath2ndAnchor = new Shape({
  rendering: false,
  addTo: cathBaseAnchor,
  translate: { y: -14 },
});

makeBuilding({
  width: 8,
  height: 8,
  depth: 8,
  gable: 'cap',
  addTo: cath2ndAnchor,
  nsWindows: [
    { x: 0, y: -5 },
  ],
  ewWindows: [
    { x: 0, y: -5 },
  ],
});

// cathedral 3rd story

var cath3rdAnchor = new Shape({
  rendering: false,
  addTo: cathBaseAnchor,
  translate: { y: -24 },
});

makeBuilding({
  width: 6,
  height: 6,
  depth: 6,
  addTo: cath3rdAnchor,
  gable: 'flat',
  nsWindows: [
    { x: 0, y: -3 },
  ],
  ewWindows: [
    { x: 0, y: -3 },
  ],
});

// cathedral dome

makeDome({
  size: 6,
  addTo: cathBaseAnchor,
  translate: { y: -30 },
});

// -----  ----- //

// 2 story gable, east, behind cathdral on hill
var anchor6 = new Shape({
  rendering: false,
  addTo: island,
  translate: { x: 27, z: 6, y: -14 },
});

makeBuilding({
  width: 8,
  height: 16,
  depth: 10,
  gable: 'ns',
  addTo: anchor6,
  nsWindows: [
    { style: 'circle', x: 0, y: -13 },
  ],
  ewWindows: [
    { style: 'circle', x: -2, y: -7 },
    { style: 'circle', x:  2, y: -7 },
    { x: -2, y: -13 },
    { x: 2, y: -13 },
  ],
});

// ----- west side ----- //


// shack, west end
var anchor9 = new Shape({
  rendering: false,
  addTo: island,
  translate: { x: -13, z: -34 },
});

makeBuilding({
  width: 8,
  height: 8,
  depth: 6,
  gable: 'ns',
  addTo: anchor9,
  nsWindows: [
    { x: 0, y: -5 },
  ],
  ewWindows: [
    { style: 'circle' },
  ],
});

// 2 story, west center, 1st hill
var anchor10 = new Shape({
  rendering: false,
  addTo: island,
  translate: { x: 3, z: -10, y: -8 },
});

makeBuilding({
  width: 8,
  height: 16,
  depth: 10,
  gable: 'ns',
  addTo: anchor10,
  nsWindows: [
    { x: 0, y: -13 },
  ],
  ewWindows: [
    { x: -2, y: -13 },
    { x:  2, y: -13 },
    { x: -2, y: -5 },
    { x:  2, y: -5 },
  ],
});

// west mansion
var mansionAnchor = new Shape({
  rendering: false,
  addTo: island,
  translate: { x: -14, z: -14, y: -8 },
});

makeBuilding({
  width: 14,
  height: 18,
  depth: 10,
  gable: 'cap',
  addTo: mansionAnchor,
  nsWindows: [
    { x: -4, y: -15, style: 'circle' },
    { x:  0, y: -15, style: 'circle' },
    { x:  4, y: -15, style: 'circle' },
    { x: -4, y: -11, height: 10 },
    { x:  0, y: -11, height: 10 },
    { x:  4, y: -11, height: 10 },
  ],
  ewWindows: [
    { x: -2, y: -15 },
    { x:  2, y: -15 },
    { x: -2, y: -9, height: 8 },
    { x:  2, y: -9, height: 8 },
  ],
});

// mansion rock
makeRock({
  width: 19,
  depth: 14,
  height: 8,
  addTo: island,
  translate: { x: -13, z: -14, y: 1 },
  southOffset: -2,
});

// ----- central tower ----- //

var centralTowerAnchor = new Shape({
  rendering: false,
  addTo: island,
  translate: { y: -14 },
});

makeBuilding({
  width: 6,
  depth: 6,
  height: 18,
  addTo: centralTowerAnchor,
  gable: 'cap',
  nsWindows: [
    { x: 0, y: -7, style: 'circle' }
  ],
  ewWindows: [
    { x: 0, y: -13, style: 'circle' }
  ],
});

// central tower 2nd story
var centralTower2ndAnchor = new Shape({
  rendering: false,
  addTo: centralTowerAnchor,
  translate: { y: -20 },
});

makeBuilding({
  width: 6,
  depth: 6,
  height: 8,
  addTo: centralTower2ndAnchor,
  gable: 'flat',
  nsWindows: [
    { x: 0, y: -5 }
  ],
  ewWindows: [
    { x: 0, y: -5 }
  ],
});

makeDome({
  size: 4,
  addTo: centralTower2ndAnchor,
  translate: { y: -8 },
});

// ----- temple ----- //

var templeAnchor = new Shape({
  rendering: false,
  addTo: island,
  translate: { x: -20, y: -14, z: 1 },
});

makeBuilding({
  width: 12,
  depth: 12,
  height: 8,
  gable: 'cap',
  addTo: templeAnchor,
  nsWindows:[
    { x: -2, height: 6 },
    { x:  2, height: 6 },
  ],
  ewWindows:[
    { x: -2, height: 6 },
    { x:  2, height: 6 },
  ],
});

var temple2ndFloor = new Shape({
  rendering: false,
  addTo: templeAnchor,
  translate: { y: -10 },
});

makeBuilding({
  width: 8,
  depth: 8,
  height: 8,
  gable: 'cap',
  addTo: temple2ndFloor,
  nsWindows:[
    { height: 6 },
  ],
  ewWindows:[
    { height: 6 },
  ],
});

var temple3rdFloor = new Shape({
  rendering: false,
  addTo: temple2ndFloor,
  translate: { y: -10 },
});

makeBuilding({
  width: 6,
  depth: 6,
  height: 6,
  gable: 'flat',
  addTo: temple3rdFloor,
  nsWindows:[
    { y: -3 },
  ],
  ewWindows:[
    { y: -3 },
  ],
});

makeDome({
  size: 4,
  addTo: temple3rdFloor,
  translate: { y: -6 },
});

// ----- west perch ----- //

var westPerchAnchor = new Shape({
  rendering: false,
  addTo: island,
  translate: { x: -39, z: 11, y: -44 }
});

makeBuilding({
  width: 6,
  depth: 6,
  height: 6,
  gable: 'flat',
  addTo: westPerchAnchor,
  nsWindows:[
    { y: -3, style: 'circle', },
  ],
  ewWindows:[
    { y: -3, style: 'circle', },
  ],
});

makeDome({
  size: 6,
  addTo: westPerchAnchor,
  translate: { y: -6 },
});

// perch rock
makeRock({
  width: 19,
  depth: 9,
  height: 10,
  addTo: island,
  translate: { x: -36, z: 13, y: -33 },
  westOffset: -1,
  eastOffset: -7,
  northOffset: -3,
  southOffset: 0,
});

// beneath perch rock & 2 story

makeRock({
  width: 24,
  depth: 22,
  height: 8,
  addTo: island,
  translate: { x: -35, z: 19, y: -25 },
  westOffset: -1.5,
  eastOffset: -3,
  northOffset: -2,
  // southOffset: 0,
});

// perch staircase

var staircaseAnchor = new Shape({
  addTo: island,
  rendering: false,
  translate: { x: -35, y: -14, z: 5 },
});

makeBuilding({
  width: 6,
  depth: 4,
  height: 22,
  gable: 'slantS',
  addTo: staircaseAnchor,
  nsWindows: [
    { y: -19 },
    { y: -12 },
    { y: -5 },
  ]
});

// ----- hill buildings ----- //

// center behind cathedral
oneStorySlanter({
  addTo: island,
  translate: { x: -14, y: -26, z: 18 },
  gable: 'slantS',
});

// behind west perch
twoStoryBuilding({
  addTo: island,
  translate: { x: -38, y: -34, z: 23 },
  gable: 'ns',
});

oneStoryBuilding({
  addTo: island,
  translate: { x: 9, y: -32, z: 24 },
  gable: 'ew',
});

// ----- back tower ----- //

var backTowerAnchor = new Shape({
  rendering: false,
  addTo: island,
  translate: { x: -15, y: -18, z: 35 }
});

makeBuilding({
  width: 6,
  height: 30,
  depth: 6,
  gable: 'flat',
  addTo: backTowerAnchor,
  nsWindows: [ { y: -27 } ],
  ewWindows: [ { y: -27 } ],
});

makeDome({
  addTo: backTowerAnchor,
  translate: { y: -30 },
  size: 4,
});

// -----  ----- //

var shapes = camera.getShapes();

// -- animate --- //

function animate() {
  update();
  render();
  requestAnimationFrame( animate );
}

animate();

// -- update -- //

function update() {
  camera.rotate.y += isRotating ? +TAU/150 : 0;

  // rotate
  camera.update();
  shapes.forEach( function( shape ) {
    shape.updateSortValue();
  });
  // perspective sort
  shapes.sort( function( a, b ) {
    return b.sortValue - a.sortValue;
  });
}

// -- render -- //

function render() {
  ctx.clearRect( 0, 0, canvasWidth, canvasHeight );
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  ctx.save();
  ctx.scale( zoom, zoom );
  ctx.translate( w/2, h/2 );

  shapes.forEach( function( shape ) {
    shape.render( ctx );
  });

  ctx.restore();
}

// ----- inputs ----- //

// click drag to rotate
var dragStartAngleX, dragStartAngleY;

new Dragger({
  startElement: canvas,
  onPointerDown: function() {
    isRotating = false;
    dragStartAngleX = camera.rotate.x;
    dragStartAngleY = camera.rotate.y;
  },
  onPointerMove: function( pointer, moveX, moveY ) {
    var angleXMove = moveY / canvasWidth * TAU;
    var angleYMove = moveX / canvasWidth * TAU;
    camera.rotate.x = dragStartAngleX + angleXMove;
    camera.rotate.y = dragStartAngleY + angleYMove;
  },
});


document.querySelector('.reset-button').onclick = function() {
  camera.rotate.set({ x: 0, y: -TAU/8 });
};
