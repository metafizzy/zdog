/* jshint browser: true, devel: true, unused: true, undef: true */
/* globals Shape */

var TAU = Math.PI * 2;
var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
var w = 88;
var h = 88;
var zoom = 6;
var canvasWidth = canvas.width = w * zoom;
var canvasHeight = canvas.height = h * zoom;

// colors
var magenta = '#C25';
var black = '#333';

var camera = new Shape({
  rendering: false,
});

// -- illustration shapes --- //

// unibody
var unibody = new Shape({
  points: [
    { x: -3, y: -8 },
    { x:  3, y: -8 },
    { x:  3, y:  6 },
    { x: -3, y:  6 },
  ],
  addTo: camera,
  color: magenta,
  lineWidth: 28,
  fill: true,
});

// right ear
new Shape({
  points: [ { x: -14, y: -20, z: 2 } ],
  addTo: unibody,
  color: magenta,
  lineWidth: 12,
});
// left ear
new Shape({
  points: [ { x: 14, y: -20, z: 2 } ],
  addTo: unibody,
  color: magenta,
  lineWidth: 12,
});


// face container
var face = new Shape({
  rendering: false,
  translate: { y: -3, z: -14 },
  addTo: unibody,
});

// snout
new Shape({
  points: [
    { x: -2, y: -2 },
    { x: 2, y: -2 },
    { x: 4, y: 0 },
    { x: 2, y: 2 },
    { x: -2, y: 2 },
    { x: -4, y: 0 },
  ],
  addTo: face,
  translate: { y: 4, z: -1 },
  color: 'white',
  lineWidth: 6,
  fill: true,
});

// nose
new Shape({
  points: [
    { x: -1.5, y: 0 },
    { x: 1.5, y: 0 },
    { x: 0, y: 0.5 },
  ],
  addTo: face,
  translate: { y: 1.5, z: -4 },
  color: black,
  lineWidth: 3,
  fill: true,
});

// eyes
var eyePoints = [
  { x: -2.5, y: 1, },
  { x: -1, y: -0.5 },
  { x: 1, y: -0.5 },
  { x: 2.5, y: 1, },
];

// right eye
new Shape({
  points: eyePoints,
  addTo: face,
  translate: { y: -5, x: -7.5, z: 0 },
  // rotate: { y: -0.3 },
  color: black,
  lineWidth: 3,
  closed: false,
});
// left eye
new Shape({
  points: eyePoints,
  addTo: face,
  translate: { y: -5, x: 7.5, z: 0 },
  // rotate: { y: 0.3 },
  color: black,
  lineWidth: 3,
  closed: false,
});

// right arm
var rightArm = new Shape({
  points: [
    { x: 0 },
    { x: -8 },
  ],
  addTo: unibody,
  translate: { x: -17, y: 4 },
  color: magenta,
  lineWidth: 12,
});
var leftArm = new Shape({
  points: [
    { x: 0 },
    { x: 8 },
  ],
  addTo: unibody,
  translate: { x: 17, y: 4 },
  color: magenta,
  lineWidth: 12,
});

// right leg
var rightLeg = new Shape({
  points: [
    { y: 0 },
    { y: 14 },
  ],
  addTo: unibody,
  translate: { x: -10, y: 12 },
  color: magenta,
  lineWidth: 12,
});
var leftLeg = new Shape({
  points: [
    { y: 0 },
    { y: 14 },
  ],
  addTo: unibody,
  translate: { x: 10, y: 12 },
  color: magenta,
  lineWidth: 12,
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
