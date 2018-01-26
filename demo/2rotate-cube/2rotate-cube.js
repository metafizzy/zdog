/* jshint browser: true, devel: true, unused: true, undef: true */
/* globals Shape */

var TAU = Math.PI * 2;
var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
var w = 48;
var h = 64;
var zoom = 6;
var canvasWidth = canvas.width = w * zoom;
var canvasHeight = canvas.height = h * zoom;
// colors
var colors = {
  fur: '#EA0',
  eye: '#444',
  inner: '#FEE',
  cloak: '#F18',
  // cloak: 'hsla(0, 100%, 50%, 0.2)',
  armor: '#915',
};

var rZSpeed = 0;

var angleX = 0;
var angleY = 0;
var angleZ = 0;

// collection of shapes
var shapes = [];

// -- illustration shapes --- //

// front square
new Shape({
  points: [
    { x: -10, y: -10, z: -10 },
    { x: 10, y: -10, z: -10 },
    { x: 10, y: 10, z: -10 },
    { x: -10, y: 10, z: -10 },
  ],
  color: colors.cloak,
  lineWidth: 2,
})

// back triangle
new Shape({
  points: [
    { x: -10, y: -10, z: 10 },
    { x: 10, y: -10, z: 10 },
    { x: 10, y: 10, z: 10 },
  ],
  color: colors.fur,
  lineWidth: 2,
});

// side diamond

new Shape({
  points: [
    { x: -10, y: -8, z: 0 },
    { x: -10, y: 0, z: -8 },
    { x: -10, y: 8, z: 0 },
    { x: -10, y: 0, z: 8 },
  ],
  color: colors.armor,
  lineWidth: 1,
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
  angleZ += rZSpeed;
  // perspective sort
  shapes.sort( function( a, b ) {
    return ( b.sortValue ) - ( a.sortValue );
  });
  // render shapes
  shapes.forEach( function( shape ) {
    shape.update( angleX, angleY, angleZ );
  });
}

// -- render -- //

function render() {
  ctx.clearRect( 0, 0, canvasWidth, canvasHeight );
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  ctx.save();
  ctx.scale( zoom, zoom );
  ctx.translate( 24, 30 );

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
var dragStartAngleX, dragStartAngleX;

document.addEventListener( 'mousedown', function( event ) {
  dragStartX = event.pageX;
  dragStartY = event.pageY;
  dragStartAngleX = angleX;
  dragStartAngleY = angleY;

  window.addEventListener( 'mousemove', onMousemoveDrag );
  window.addEventListener( 'mouseup', onMouseupDrag );
});

function onMousemoveDrag( event ) {
  var dx = event.pageX - dragStartX;
  var dy = event.pageY - dragStartY;
  var angleXMove = dy * TAU/360;
  var angleYMove = dx * TAU/360;
  angleX = dragStartAngleX + angleXMove;
  angleY = dragStartAngleY + angleYMove;
}

function onMouseupDrag() {
  window.removeEventListener( 'mousemove', onMousemoveDrag );
  window.removeEventListener( 'mouseup', onMouseupDrag );
}
