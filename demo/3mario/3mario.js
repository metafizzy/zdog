/* jshint browser: true, devel: true, unused: true, undef: true */
/* globals Shape */

var TAU = Math.PI * 2;
var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
var w = 64;
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
  hair: '#521',
  overalls: '#24D',
  cloth: '#E11',
  skin: '#FCA',
  button: '#FE0',
};

var rZSpeed = 0;

var angleX = 0;
var angleY = 0;
var angleZ = 0;

// collection of shapes
var shapes = [];

// -- illustration shapes --- //

// head
new Shape({
  points: [
    { x: 0, y: -12, z: -1 },
  ],
  color: colors.skin,
  lineWidth: 24,
});

// nose
new Shape({
  points: [
    { x: 0, y: -7, z: -14 },
  ],
  color: colors.skin,
  lineWidth: 7,
});

// eyes
[ -1, 1 ].forEach( function( xSide ) {
  new Shape({
    points: [
      { x: 5*xSide, y: -10, z: -10 },
      { x: 5*xSide, y: -8, z: -10 },
    ],
    color: colors.eye,
    lineWidth: 3,
  });
});

// chin
var chinSide = { x: -5, y: -6, z: -3 };
var chinCenter = { x: 0, y: -5, z: -6 };
var chinWidth = 5;
new Shape({
  points: [
    chinSide,
    chinCenter
  ],
  color: colors.skin,
  lineWidth: 10,
});
// reverse
chinSide.x = -chinSide.x;
new Shape({
  points: [
    chinCenter,
    chinSide
  ],
  color: colors.skin,
  lineWidth: 10,
});

// hat front
var hatFrontA = { x: -8, y: -20, z: -8 };
var hatFrontB = { x: -4, y: -22, z: -10 };
var hatFrontC = { x: -hatFrontB.x, y: hatFrontB.y, z: hatFrontB.z };

new Shape({
  points: [
    hatFrontA,
    hatFrontB,
    { x: -hatFrontB.x, y: hatFrontB.y, z: hatFrontB.z },
    { x: -hatFrontA.x, y: hatFrontA.y, z: hatFrontA.z },
  ],
  color: colors.cloth,
  closed: false,
  fill: false,
  lineWidth: 11,
});
new Shape({
  points: [
    hatFrontB,
    hatFrontC,
  ],
  color: colors.cloth,
  closed: false,
  fill: false,
  lineWidth: 11,
});

hatFrontA.x = -hatFrontA.x;
new Shape({
  points: [
    hatFrontC,
    hatFrontA,
  ],
  color: colors.cloth,
  closed: false,
  fill: false,
  lineWidth: 11,
});

// brim
// brim has left & right side
[ -1, 1 ].forEach( function( xSide ) {
  new Shape({
    points: [
      { x: 10*xSide, y: -16, z: -6 },
      { x: 8*xSide, y: -16, z: -18 },
      { x: 0, y: -18, z: -20 },
      { x: 0, y: -19, z: -8 },
    ],
    color: colors.cloth,
    fill: true,
    lineWidth: 4,
  });
});




// shoulders & upper body
var shoulderY = 3;
var neckBottom = { x: 0, y: shoulderY, z: 1 };

new Shape({
  points: [
    { x: 4, y: shoulderY, z:  2 },
    neckBottom,
  ],
  color: colors.cloth,
  lineWidth: 10,
});
new Shape({
  points: [
    neckBottom,
    { x: -4, y: shoulderY, z:  2 },
  ],
  color: colors.cloth,
  lineWidth: 10,
});


// belly/butt

new Shape({
  points: [
    { x: 0, y: 10, z: 2 },
  ],
  color: colors.overalls,
  lineWidth: 20,
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
