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
  points: [ { x: 0, y: 0 } ],
  translate: { y: -20 },
  rotate: { y: 0.5 },
  lineWidth: 21,
  color: darkBlue,
  addTo: camera,
});

// helmet details
[ 1, 3, 4, 5, 6, 7, 8, 9 ].forEach( function( i ) {
  new Shape({
    points: [
      { x: -1.25, y: -1.5, z: -11.25 },
      { x:  1.25, y: -1.5, z: -11.25 },
      { x:  1.25, y:  1.5, z: -11.25 },
      { x: -1.25, y:  1.5, z: -11.25 },
    ],
    rotate: { x: -TAU/20 * (i) },
    lineWidth: 2,
    fill: true,
    color: lightBlue,
    addTo: head,
  });
});


// upper body

var upperBody = new Shape({
  points: [
    { x: -2, y: -1.25 },
    { x:  0, y: -1.5 },
    { x:  2, y: -1.25 },
    { x:  1.7, y: 0.5 },
    { x: -1.7, y: 0.5 },
  ],
  translate: { y: -4 },
  lineWidth: 11,
  color: lightBlue,
  fill: true,
  addTo: camera,
});

// undies

var undieX = 4.5;
var undieY0 = -1;
var undieY1 = 0;
var undieZ = 2.5;

var undiePoints = [
  { x: -undieX, y: undieY0 },
  { x:  undieX, y: undieY0 },
  { x:  undieX, y: undieY1 },
  { x:  0, y: 1.5 },
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
var shoulderX = 5;
var shoulderY = -7;

// right upper arm
var rightUpperArm = new Shape({
  points: [
    { x: 0 },
    { x: -7 },
  ],
  translate: { x: -shoulderX, y: shoulderY },
  rotate: { z: -0.8, y: 0.6 },
  lineWidth: 6,
  color: lightBlue,
  addTo: camera,
});

var rightForeArm = new Shape({
  points: [
    { x: -4 },
    { x: -8 },
  ],
  translate: rightUpperArm.points[1],
  rotate: { z: 1.4 },
  lineWidth: 10,
  color: darkBlue,
  addTo: rightUpperArm,
});

var rightHand = new Shape({
  points: [
    { x: -4 },
  ],
  translate: rightForeArm.points[1],
  rotate: { z: 0.3 },
  lineWidth: 11,
  color: darkBlue,
  addTo: rightForeArm,
});

// left arm, the gun arm
var leftUpperArm = new Shape({
  points: [
    { x: 0 },
    { x: 11 },
  ],
  translate: { x: shoulderX, y: shoulderY-0.5 },
  rotate: { z: -0.2, y: -0.3 },
  lineWidth: 6,
  color: lightBlue,
  addTo: camera,
});

var leftForeArm = new Shape({
  points: [
    { x: 5 },
    { x: 10 },
  ],
  translate: leftUpperArm.points[1],
  rotate: { z: -TAU/4 - leftUpperArm.rotate.z },
  lineWidth: 11,
  color: darkBlue,
  addTo: leftUpperArm,
});

var blasterNozzle = new Shape({
  points: [ { x: 4 } ],
  translate: leftForeArm.points[1],
  lineWidth: 7,
  color: darkBlue,
  addTo: leftForeArm,
});

[ -1, 1 ].forEach( function( xSide ) {
  // face panel
  new Shape({
    points: [
      { x: 6*xSide, y: -4, z: 4 },
      { x: 3*xSide, y: -4, z: 1 },
      { x: 0*xSide, y: -2, z: 0  },
      { x: 0*xSide, y: 1, z: -1  }, // nose
      { x: 0*xSide, y: 5, z: 1  }, // chin front
      { x: 5*xSide, y: 4, z: 5 },
      { x: 7*xSide, y: 0, z: 5 },
    ],
    translate: { y: 4, z: -8 },
    fill: true,
    lineWidth: 2,
    color: skin,
    addTo: head,
  });

  // eye whites
  var eyeWhite = new Shape({
    points: [
      { x: -1, y: -1.5 },
      { x:  1, y: -1.5 },
      { x:  1, y:  1.5 },
      { x: -1, y:  1.5 },
    ],
    translate: { x: 4*xSide, y: 3, z: -7 },
    rotate: { y: 0.5*xSide },
    lineWidth: 3,
    fill: true,
    color: 'white',
    addTo: head,
  });

  // pupils
  new Shape({
    points: [
      { x: -0.4, y: -1.9 },
      { x:  0.4, y: -1.9 },
      { x:  0.4, y:  1.9 },
      { x: -0.4, y:  1.9 },
    ],
    // translate: { x: 3.75*xSide, y: 3, z: -8 },
    translate: { x: -0.2*xSide + 0.2, y: -0.2, z: -0.5 },
    lineWidth: 1.5,
    fill: true,
    color: '#128',
    addTo: eyeWhite,
  });

  // ear cone outer
  var earSize = 2;
  var earCone = new Shape({
    points: [
      { z: -earSize, y: -earSize },
      { z: earSize, y: -earSize },
      { z: earSize, y: earSize },
      { z: -earSize, y: earSize },
    ],
    translate: { x: 9.5*xSide, y: 3, z: 1 },
    rotate: { z: 0.1*xSide },
    fill: true,
    lineWidth: 3,
    color: lightBlue,
    addTo: head,
  });

  // thigh
  var thigh = new Shape({
    points: [ { y: 0 }, { y: 3 } ],
    translate: { x: 4.5*xSide, y: 8 },
    rotate: { z: -0.35*xSide, x: 0.1 },
    lineWidth: 6,
    color: lightBlue,
    addTo: camera,
  });

  // shin
  var shin = new Shape({
    points: [
      { y: 5, z: 0 },
      { y: 14, z: -2 },
      { y: 14, z: 1 },
    ],
    translate: thigh.points[1],
    rotate: { y: 0.3*xSide },
    fill: true,
    lineWidth: 11,
    color: darkBlue,
    addTo: thigh,
  });

  // sole
  new Shape({
    points: [
      { y: 2.5, x: 3*xSide, z: 3 },
      { y: 2.5, x: -1*xSide, z: 3 },
      { y: 2.5, x: 1*xSide, z: -5 },
    ],
    translate: shin.points[1],
    rotate: { z: 0.4*xSide, x: 0 },
    fill: true,
    lineWidth: 7,
    color: darkBlue,
    addTo: shin,
  })

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
