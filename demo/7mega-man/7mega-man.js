/* jshint browser: true, devel: true, unused: true, undef: true */
/* globals Shape, Ellipse, TAU */

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
  path: [ {} ],
  translate: { y: -20 },
  rotate: { y: 0.5 },
  lineWidth: 21,
  color: darkBlue,
  addTo: camera,
});

// helmet details
[ 1, 3, 4, 5, 6, 7, 8, 9 ].forEach( function( i ) {
  new Shape({
    path: [
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
  path: [
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

// front undie panel
var undiePanel = new Shape({
  path: [
    { x: -undieX, y: undieY0 },
    { x:  undieX, y: undieY0 },
    { x:  undieX, y: undieY1 },
    { x:  0, y: 1.5 },
    { x: -undieX, y: undieY1 },
  ],
  translate: { y: 4, z: -undieZ },
  lineWidth: 5,
  color: darkBlue,
  fill: true,
  addTo: camera,
});

undiePanel.copy({
  translate: { y: 4, z: undieZ },
});

// right undie panel
var sideUndiePanel = new Shape({
  path: [
    { y: undieY0, z: -undieZ },
    { y: undieY0, z:  undieZ },
    { y: undieY1, z:  undieZ },
    { y: undieY1, z: -undieZ },
  ],
  translate: { x: -undieX, y: 4, },
  lineWidth: 5,
  color: darkBlue,
  fill: true,
  addTo: camera,
});
// left
sideUndiePanel.copy({
  translate: { x: undieX, y: 4, },
});

//
var shoulderX = 5;
var shoulderY = -7;

// right upper arm
var rightUpperArm = new Shape({
  path: [
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
  path: [
    { x: -4 },
    { x: -8 },
  ],
  translate: rightUpperArm.path[1],
  rotate: { z: 1.4 },
  lineWidth: 10,
  color: darkBlue,
  addTo: rightUpperArm,
});

var rightHand = new Shape({
  path: [
    { x: -4 },
  ],
  translate: rightForeArm.path[1],
  rotate: { z: 0.3 },
  lineWidth: 11,
  color: darkBlue,
  addTo: rightForeArm,
});

// left arm, the gun arm
var leftUpperArm = new Shape({
  path: [
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
  path: [
    { x: 5 },
    { x: 10 },
  ],
  translate: leftUpperArm.path[1],
  rotate: { z: -TAU/4 - leftUpperArm.rotate.z },
  lineWidth: 11,
  color: darkBlue,
  addTo: leftUpperArm,
});

var blasterNozzle = new Shape({
  path: [ { x: 4 } ],
  translate: leftForeArm.path[1],
  lineWidth: 7,
  color: darkBlue,
  addTo: leftForeArm,
});

[ -1, 1 ].forEach( function( xSide ) {
  // face panel
  var facePanel = new Shape({
    path: [
      { x: 4*xSide, y: -4, z: 1 }, // top inside brow
      { arc: [
        { x: 0*xSide, y: -4, z: -0.5 },
        { x: 0*xSide, y: 1, z: -1  }, // widows peak
      ]},
      { x: 0*xSide, y: 1, z: -1  }, // nose
      { x: 0*xSide, y: 5.5, z: 1  }, // chin front
      { arc: [
        { x: 7*xSide, y: 5.5, z: 4 }, // jaw
        { x: 7*xSide, y: 0, z: 4 }, // far side
      ]},
      { arc: [
        { x: 7*xSide, y: -4, z: 4 }, // top back brow
        { x: 4*xSide, y: -4, z: 1 }, // top inside brow
      ]},
    ],
    translate: { y: 4, z: -8.5 },
    fill: true,
    lineWidth: 1,
    // stroke: false,
    color: skin,
    addTo: head,
  });

  // eye whites
  var eyeWhite = new Ellipse({
    width: 4,
    height: 5,
    addTo: facePanel,
    translate: { x: 3.75*xSide, y: -0.5, z: -0.5 },
    rotate: { y: 0.2*xSide },
    lineWidth: 1,
    fill: true,
    color: 'white',
  });

  // pupils
  new Ellipse({
    width: 1,
    height: 4,
    translate: { x: -0.4*xSide, y: -0.2, z: -1 },
    rotate: { y: -0.2*xSide },
    lineWidth: 1,
    fill: true,
    color: '#128',
    addTo: eyeWhite,
  });

  // ear cone outer
  var earCone = new Ellipse({
    width:  5.5,
    height: 5.5,
    translate: { x: 10*xSide, y: 3, z: 1 },
    rotate: { y: (TAU/4-0.2)*xSide, x: TAU/4, z: 1 },
    fill: false,
    lineWidth: 2.5,
    color: lightBlue,
    addTo: head,
  });
  
  // ear cone inner inner
  new Ellipse({
    width: 5,
    height: 5,
    addTo: earCone,
    translate: { z: 1 },
    color: '#C11',
    stroke: false,
    fill: true,
  });

  // thigh
  var thigh = new Shape({
    path: [ { y: 0 }, { y: 3 } ],
    translate: { x: 4.5*xSide, y: 8 },
    rotate: { z: -0.35*xSide, x: 0.1 },
    lineWidth: 6,
    color: lightBlue,
    addTo: camera,
  });

  // shin
  var shin = new Shape({
    path: [
      { y: 5, z: 0 },
      { y: 14, z: -2 },
      { y: 14, z: 1 },
    ],
    translate: thigh.path[1],
    rotate: { y: 0.5*xSide },
    fill: true,
    lineWidth: 11,
    color: darkBlue,
    addTo: thigh,
  });

  // sole
  new Shape({
    path: [
      { y: 2.5, x: (0.5 + 2)*xSide, z: 3 },
      { y: 2.5, x: (0.5 + -2)*xSide, z: 3 },
      { y: 2.5, x: (0.5 + -1)*xSide, z: -5 },
      { y: 2.5, x: (0.5 + 1)*xSide, z: -5 },
    ],
    translate: shin.path[1],
    rotate: { z: 0.4*xSide, x: 0.1 },
    fill: true,
    lineWidth: 7,
    color: darkBlue,
    addTo: shin,
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
