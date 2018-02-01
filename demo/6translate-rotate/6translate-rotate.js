/* jshint browser: true, devel: true, unused: true, undef: true */
/* globals Shape */

var TAU = Math.PI * 2;
var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
var w = 72;
var h = 72;
var zoom = 6;
var canvasWidth = canvas.width = w * zoom;
var canvasHeight = canvas.height = h * zoom;

var rZSpeed = 0;

var camera = new Shape();

// -- illustration shapes --- //

var rect1 = new Shape({
  points: [
    { x: -6, y: -8 },
    { x:  6, y: -8 },
    { x:  6, y:  8 },
    { x: -6, y:  8 },
  ],
  translate: { z: -6 },
  // rotate: { z: 1 },
  lineWidth: 2,
  // fill: true,
  color: '#08D',
  addTo: camera,
});

var moon1 = new Shape({
  points: [
    { y: -11, z: 0 },
    { y: -11, z: 6 }
  ],
  lineWidth: 3,
  color: 'white',
  addTo: rect1,
});

var rect2 = new Shape({
  points: [
    { x: -6, z: -4, },
    { x:  6, z: -4, },
    { x:  6, z:  4, },
    { x: -6, z:  4, },
  ],
  translate: { y: 8 },
  // rotate: { y: 1 },
  lineWidth: 2,
  fill: true,
  color: '#E21',
  addTo: camera,
});

new Shape({
  points: [
    { y: -6, z: 4 },
    { y:  6, z: 4 },
    { y:  6, z: 0 },
    { y: -6, z: 0 },
  ],
  lineWidth: 1,
  fill: true,
  color: '#F80',
  addTo: camera,
});

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
  // rotate
  moon1.rotate.y += 0.03;
  rect1.rotate.z -= 0.02;
  camera.rotate.z += rZSpeed;
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

document.querySelector('.toggle-z-rotation-button').onclick = function() {
  rZSpeed = rZSpeed ? 0 : TAU/360;
};

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
  var angleXMove = dy * TAU/360;
  var angleYMove = dx * TAU/360;
  camera.rotate.x = dragStartAngleX + angleXMove;
  camera.rotate.y = dragStartAngleY + angleYMove;
}

function onMouseupDrag() {
  window.removeEventListener( 'mousemove', onMousemoveDrag );
  window.removeEventListener( 'mouseup', onMouseupDrag );
}
