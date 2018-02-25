/* globals makeBuilding */

// -------------------------- demo -------------------------- //

var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
var w = 128;
var h = 128;
var minWindowSize = Math.min( window.innerWidth, window.innerHeight );
var zoom = Math.min( 7, Math.floor( minWindowSize / w ) );
// var zoom = 5;
var pixelRatio = window.devicePixelRatio || 1;
zoom *= pixelRatio;
var canvasWidth = canvas.width = w * zoom;
var canvasHeight = canvas.height = h * zoom;
// set canvas screen size
if ( pixelRatio > 1 ) {
  canvas.style.width = canvasWidth / pixelRatio + 'px';
  canvas.style.height = canvasHeight / pixelRatio + 'px';
}

var isRotating = true;

// colors
// var white = 'white';
// var southWall = white;
// var westWall = '#CDE';
// var eastWall = '#8AD';
// var roof = '#06B';
// var northWall = roof;
// var navy = '#037';
// var midnight = '#024';

var camera = new Shape({
  rendering: false,
});

Shape.defaults.fill = true;
Shape.defaults.stroke = false;
// Shape.defaults.lineWidth = 1/zoom;

// -- illustration shapes --- //

var buildAnchor0 = new Shape({
  rendering: false,
  addTo: camera,
  translate: { x: 17, z: -29 },
});

makeBuilding({
  width: 8,
  height: 8,
  depth: 10,
  gable: 'ns',
  addTo: buildAnchor0,
  nsWindows: [
    { x: 0 },
  ],
  ewWindows: [
    { x: -2 },
    { x: 2 },
  ],
});

// -----  ----- //

var buildAnchor1 = new Shape({
  rendering: false,
  addTo: camera,
  translate: { x: 39, z: -29 },
});

makeBuilding({
  width: 8,
  height: 8,
  depth: 10,
  gable: 'ns',
  addTo: buildAnchor1,
  nsWindows: [
    { x: 0 },
  ],
  ewWindows: [
    { x: -2 },
    { x: 2 },
  ],
});

// -----  ----- //

var buildAnchor2 = new Shape({
  rendering: false,
  addTo: camera,
  translate: { x: 55, z: -17 },
});

makeBuilding({
  width: 8,
  height: 14,
  depth: 10,
  gable: 'ns',
  addTo: buildAnchor2,
  nsWindows: [
    { x: 0, y: -5 },
    { x: 0, y: -11 },
  ],
  ewWindows: [
    { x: -2, y: -5 },
    { x: 2, y: -5 },
    { x: -2, y: -11 },
    { x: 2, y: -11 },
  ],
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
