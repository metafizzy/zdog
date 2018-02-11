/* jshint browser: true, devel: true, unused: true, undef: true */
/* globals Shape */

var TAU = Math.PI * 2;
var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
var w = 72;
var h = 72;
var zoom = 5;
var canvasWidth = canvas.width =  w * zoom;
var canvasHeight = canvas.height = h * zoom;

// colors
var light = '#EEE';
var dark = '#333';

var camera = new Shape({
  rendering: false,
});

// -- illustration shapes --- //

var truckSide = new Shape({
  path: [
    { x:  -8, y: -14 },
    { x:  10, y: -14 },
    { x:  20, y:  -4 },
    { x:  32, y:  -4 },
    { x:  32, y:   8 },
    { x: -32, y:   8 },
    { x: -32, y:  -4 },
    { x:  -8, y:  -4 },
  ],
  addTo: camera,
  translate: { z: -12 },
  color: light,
  fill: true,
  stroke: false,
});
truckSide.copy({
  color: dark,
  fill: false,
  lineWidth: 2,
  stroke: true,
});
// panel to fix overlap bug
// new Shape({
//   path: [
//     { x: 21, y: -3 },
//     { x: 31, y: -3 },
//     { x: 31, y:  7 },
//     { x: 21, y:  7 },
//   ],
//   addTo: camera,
//   translate: { z: -12 },
//   color: light,
//   fill: true,
//   stroke: false,
// });


truckSide.copy({
  translate: { z: 12 },
  color: dark,
  lineWidth: 2,
  stroke: true,
});

// underside
new Shape({
  path: [
    { x: -32, z: -12 },
    { x:  32, z: -12 },
    { x:  32, z:  12 },
    { x: -32, z:  12 },
  ],
  addTo: camera,
  translate: { y: 8 },
  color: dark,
  lineWidth: 2,
  fill: true,
});

// roof
var roof = new Shape({
  path: [
    { x:  -8, z: -12 },
    { x:  10, z: -12 },
    { x:  10, z:  12 },
    { x:  -8, z:  12 },
  ],
  addTo: camera,
  translate: { y: -14 },
  color: light,
  fill: true,
  stroke: false,
});
roof.copy({
  color: dark,
  lineWidth: 2,
  stroke: true,
  fill: false,
});

// windshield
new Shape({
  path: [
    { x: 10, y: -14, z: -12 },
    { x: 10, y: -14, z:  12 },
    { x: 20, y:  -4, z:  12 },
    { x: 20, y:  -4, z: -12 },
  ],
  addTo: camera,
  color: dark,
  lineWidth: 2,
  fill: true,
});

// hood
var hood = new Shape({
  path: [
    { x: 20, z: -12 },
    { x: 32, z: -12 },
    { x: 32, z:  12 },
    { x: 20, z:  12 },
  ],
  addTo: camera,
  translate: { y: -4 },
  color: light,
  stroke: false,
  fill: true,
});
hood.copy({
  color: dark,
  stroke: true,
  fill: false,
  lineWidth: 2,
});

// front 
var front = new Shape({
  path: [
    { y: -4, z: -12 },
    { y:  8, z: -12 },
    { y:  8, z:  12 },
    { y: -4, z:  12 },
  ],
  addTo: camera,
  translate: { x: 32 },
  color: dark,
  fill: true,
  lineWidth: 2,
});

// tail
var tail = front.copy({
  translate: { x: -32 },
  color: light,
  fill: true,
  stroke: false,
});
tail.copy({
  color: dark,
  stroke: true,
  lineWidth: 2,
  fill: false,
});
// tail inside
tail.copy({
  color: dark,
  translate: { x: -31 },
});

// var bedSide = new Shape({
//   path: [
//     { x: -32, y: -4 },
//     { x:  -8, y: -4 },
//     { x:  -8, y:  8 },
//     { x: -32, y:  8 },
//   ],
//   addTo: camera,
//   translate: { z: -11 },
//   color: dark,
//   fill: true,
// });
// bedSide.copy({
//   translate: { z: -12 },
//   color: light,
//   stroke: false,
// });

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
  camera.update();
  // normalize angle y
  camera.rotate.y = ( ( camera.rotate.y % TAU ) + TAU ) % TAU;

  // sort
  shapes.forEach( function updateEachSortValue( shape ) {
    shape.updateSortValue();
  });
  // perspective sort
  shapes.sort( function sortBySortValue( a, b ) {
    return b.sortValue - a.sortValue;
  });
}

// -- render -- //
ctx.lineCap = 'round';
ctx.lineJoin = 'round';

viewQuarterTwist();

function render() {
  ctx.clearRect( 0, 0, canvasWidth, canvasHeight );
  ctx.save();
  ctx.scale( zoom, zoom );
  ctx.translate( w/2, h/2 );

  shapes.forEach( eachShapeRender );

  ctx.restore();
}

function eachShapeRender( shape ) {
  shape.render( ctx );
}

// ----- inputs ----- //

// click drag to rotate

var dragStartX, dragStartY;
var dragStartAngleX, dragStartAngleY;

document.addEventListener( 'mousedown', function( event ) {
  dragStartX = event.pageX;
  dragStartY = event.pageY;
  dragStartAngleX = camera.rotate.x;
  dragStartAngleY = camera.rotate.y;

  window.addEventListener( 'mousemove', onMousemoveDrag );
  window.addEventListener( 'mouseup', onMouseupDrag );
});

function onMousemoveDrag( event ) {
  var dx = event.pageX - dragStartX;
  var dy = event.pageY - dragStartY;
  var angleXMove = dy / ( zoom * 100 ) * TAU;
  var angleYMove = dx / ( zoom * 100 ) * TAU;
  camera.rotate.x = dragStartAngleX + angleXMove;
  camera.rotate.y = dragStartAngleY + angleYMove;
}

function onMouseupDrag() {
  window.removeEventListener( 'mousemove', onMousemoveDrag );
  window.removeEventListener( 'mouseup', onMouseupDrag );
}

document.querySelector('.quarter-twist-button').onclick = viewQuarterTwist;


function viewQuarterTwist() {
  camera.rotate.x = 0;
  camera.rotate.z = 0;
  camera.rotate.y = -TAU/8;
}