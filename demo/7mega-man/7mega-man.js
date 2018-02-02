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

// colors
var lightBlue = '#7CF';
var darkBlue = '#25C';
var skin = '#FCA';

var rZSpeed = 0;

var camera = new Shape({
  rendering: false,
});

// -- illustration shapes --- //

// head

var head = new Shape({
  points: [ { x:0, y:0 } ],
  translate: { y: -20 },
  lineWidth: 20,
  color: darkBlue,
  addTo: camera,
});

// helmet details
[ 1, 3, 4, 5, 6, 7 ].forEach( function( i ) {
  new Shape({
    points: [
      { x: -1.25, y: -1.4, z: -10.5 },
      { x:  1.25, y: -1.4, z: -10.5 },
      { x:  1.25, y:  1.4, z: -10.5 },
      { x: -1.25, y:  1.4, z: -10.5 },
    ],
    rotate: { x: -TAU/18 * (i+0.5) },
    lineWidth: 2.5,
    fill: true,
    color: lightBlue,
    addTo: head,
  });
});


// upper body

var upperBody = new Shape({
  points: [
    { x: -2, y: -1 },
    { x:  0, y: -1.25 },
    { x:  2, y: -1 },
    { x:  1, y: 0.5 },
    { x: -1, y: 0.5 },
  ],
  translate: { y: -4 },
  lineWidth: 11,
  color: lightBlue,
  fill: true,
  addTo: camera,
});

// undies

var undieX = 4;
var undieY0 = -1;
var undieY1 = 0;
var undieZ = 3;

var undiePoints = [
  { x: -undieX, y: undieY0 },
  { x:  undieX, y: undieY0 },
  { x:  undieX, y: undieY1 },
  { x:  0, y: 1 },
  { x: -undieX, y: undieY1 },
];

var frontUndiePanel = new Shape({
  points: undiePoints,
  translate: { y: 4, z: -undieZ },
  lineWidth: 5,
  color: darkBlue,
  fill: true,
  addTo: camera,
});

var backUndiePanel = new Shape({
  points: undiePoints,
  translate: { y: 4, z: undieZ },
  lineWidth: 5,
  color: darkBlue,
  fill: true,
  addTo: camera,
});


var sideUndiePoints = [
  { y: undieY0, z: -undieZ },
  { y: undieY0, z:  undieZ },
  { y: undieY1, z:  undieZ },
  { y: undieY1, z: -undieZ },
];

// right undie panel
new Shape({
  points: sideUndiePoints,
  translate: { x: -undieX, y: 4, },
  lineWidth: 5,
  color: darkBlue,
  fill: true,
  addTo: camera,
});
// left
new Shape({
  points: sideUndiePoints,
  translate: { x: undieX, y: 4, },
  lineWidth: 5,
  color: darkBlue,
  fill: true,
  addTo: camera,
});

//
var shoulderX = 4;
var shoulderY = -7;

// right upper arm
var rightArmP1 = { x: -5, y: 4, z: -2 };
var rightUpperArm = new Shape({
  points: [
    { x: 0, y: 0 },
    rightArmP1,
  ],
  translate: { x: -shoulderX, y: shoulderY },
  lineWidth: 6,
  color: lightBlue,
  addTo: camera,
});

var rightForeArm = new Shape({
  points: [
    { x: -2, y: -1, z: -3 },
    { x: -4, y: -4, z: -4 },
  ],
  translate: rightArmP1,
  lineWidth: 9,
  color: darkBlue,
  addTo: rightUpperArm,
});

[ -1, 1 ].forEach( function( xSide ) {
  // face panel
  new Shape({
    points: [
      { x: 6*xSide, y: -5, z: 2 },
      { x: 3*xSide, y: -5, z: 1 },
      { x: 0*xSide, y: -3, z: 0  },
      { x: 0*xSide, y: 1, z: -1  }, // nose
      { x: 0*xSide, y: 5, z: 2  }, // chin front
      // { x: 0*xSide, y: 5, z: 5  }, // chin back
      { x: 5*xSide, y: 4, z: 5 },
      { x: 7*xSide, y: 0, z: 5 },
    ],
    translate: { y: 4, z: -8 },
    fill: true,
    lineWidth: 2,
    color: skin,
    addTo: head,
  });
  // eye white
  // var eyeWhite = new Shape({
  //   points: [
  //     { x:  1.7*xSide, y: -1.5 },
  //     { x:  1.2*xSide, y: -2.5 },
  //     { x: -1.2*xSide, y: -2.5 },
  //     { x: -1.7*xSide, y: -1.5 },
  //     { x: -1.7*xSide, y:  1.5 },
  //     { x: -1.2*xSide, y:  2.5 },
  //     { x:  1.7*xSide, y:  2.5 },
  //   ],
  //   translate: { x: -4*xSide, y: 2.0, z: -7 },
  //   lineWidth: 1.5,
  //   fill: true,
  //   color: 'white',
  //   addTo: head,
  // });
  //
  // new Shape({
  //   points: [
  //     { x: 0, y: -1.3 },
  //     { x: 0, y:  1.3 },
  //   ],
  //   translate: { x: 0.5*xSide, y: -0.2, z: -1 },
  //   lineWidth: 2.5,
  //   color: '#127',
  //   addTo: eyeWhite,
  // });

  new Shape({
    points: [
      { x: 0, y: -1.3 },
      { x: 0, y:  1.3 },
    ],
    translate: { x: 4*xSide, y: 2, z: -8 },
    lineWidth: 2.5,
    color: '#127',
    addTo: head,
  });

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
