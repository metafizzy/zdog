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

var rXSpeed = 0;
var rYSpeed = TAU/360;
var rZSpeed = TAU/360;


var rotateSpeed = TAU/360;
var angleY = 0;
var rYCos, rYSin;

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
})

// back square
new Shape({
  points: [
    { x: -10, y: -10, z: 10 },
    { x: 10, y: -10, z: 10 },
    { x: 10, y: 10, z: 10 },
    { x: -10, y: 10, z: 10 },
  ],
  color: colors.fur,
})



// -- animate --- //


function animate() {
  update();
  render();
  requestAnimationFrame( animate );
}

animate();

// -- update -- //

var angleZ = 1;

function update() {
  // rotate
  angleY += rotateSpeed;
  angleZ += rotateSpeed/2;
  rYCos = Math.cos( angleY );
  rYSin = Math.sin( angleY );
  // perspective sort
  shapes.sort( function( a, b ) {
    return ( b.sortValue ) - ( a.sortValue );
  });
  // render shapes
  shapes.forEach( function( shape ) {
    shape.update( angleZ, angleY );
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


var rotateSlider= document.querySelector('.rotate-slider');
rotateSlider.addEventListener( 'input', function() {
  rotateSpeed = 0;
  angleY = parseInt( rotateSlider.value ) / 360 * TAU;
});

document.querySelector('.rotate-cw-button').onclick = function() {
  rotateSpeed = -TAU/180;
};

document.querySelector('.rotate-ccw-button').onclick = function() {
  rotateSpeed = TAU/180;
};
