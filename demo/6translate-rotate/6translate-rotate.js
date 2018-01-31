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

var cameraRotation = { x: 0, y: 0, z: 0 };

// collection of shapes
var shapes = [];

// -- illustration shapes --- //

new Shape({
  points: [
    { x: -6, y: -8 },
    { x:  6, y: -8 },
    { x:  6, y:  8 },
    { x: -6, y:  8 },
  ],
  translate: { z: -6 },
  rotate: { z: TAU/8 },
  lineWidth: 2,
  fill: true,
  color: '#08D',
  addTo: shapes,
});

new Shape({
  points: [
    { x: -6, y: 0, z: -4, },
    { x:  6, y: 0, z: -4, },
    { x:  6, y: 0, z:  4, },
    { x: -6, y: 0, z:  4, },
  ],
  lineWidth: 2,
  fill: true,
  color: '#E21',
  addTo: shapes,
});


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
  cameraRotation.z += rZSpeed;
  // perspective sort
  shapes.sort( function( a, b ) {
    return b.sortValue - a.sortValue;
  });
  // render shapes
  shapes.forEach( function( shape ) {
    shape.update( cameraRotation );
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
  dragStartAngleX = cameraRotation.x;
  dragStartAngleY = cameraRotation.y;

  window.addEventListener( 'mousemove', onMousemoveDrag );
  window.addEventListener( 'mouseup', onMouseupDrag );
});

function onMousemoveDrag( event ) {
  var dx = event.pageX - dragStartX;
  var dy = event.pageY - dragStartY;
  var angleXMove = dy * TAU/360;
  var angleYMove = dx * TAU/360;
  cameraRotation.x = dragStartAngleX + angleXMove;
  cameraRotation.y = dragStartAngleY + angleYMove;
}

function onMouseupDrag() {
  window.removeEventListener( 'mousemove', onMousemoveDrag );
  window.removeEventListener( 'mouseup', onMouseupDrag );
}
