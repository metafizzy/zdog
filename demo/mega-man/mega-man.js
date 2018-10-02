// -------------------------- demo -------------------------- //

var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
var w = 72;
var h = 72;
var minWindowSize = Math.min( window.innerWidth, window.innerHeight );
var zoom = Math.min( 7, Math.floor( minWindowSize / w ) );
var pixelRatio = window.devicePixelRatio || 1;
zoom *= pixelRatio;
var canvasWidth = canvas.width = w * zoom;
var canvasHeight = canvas.height = h * zoom;
// set canvas screen size
if ( pixelRatio > 1 ) {
  canvas.style.width = canvasWidth / pixelRatio + 'px';
  canvas.style.height = canvasHeight / pixelRatio + 'px';
}

var isRotating = true;

// colors
var lightBlue = '#7CF';
var darkBlue = '#25C';
var skin = '#FCA';

var camera = new Anchor();

// -- illustration shapes --- //

// keep track of pupils to change position
var pupils = {};

// head

var head = new Shape({
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
    rotate: { x: -TAU/20 * i },
    lineWidth: 2,
    fill: true,
    color: lightBlue,
    addTo: head,
  });
});


// upper body
new Shape({
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

new Shape({
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

new Shape({
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
  var pupil = new Ellipse({
    width: 1,
    height: 4,
    translate: { x: -0.4*xSide, y: -0.2, z: -1 },
    rotate: { y: -0.2*xSide },
    lineWidth: 1,
    fill: true,
    color: '#128',
    addTo: eyeWhite,
  });
  // add to hash
  pupils[ xSide ] = pupil;

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

// -- animate --- //

function animate() {
  update();
  render();
  requestAnimationFrame( animate );
}

animate();

// -- update -- //

function update() {
  camera.rotate.y += isRotating ? -TAU/150 : 0;
  camera.normalizeRotate();

  // change pupil position
  var isAngleXFlip = camera.rotate.x > TAU/4 && camera.rotate.x < TAU * 3/4;
  var angleXOffset = isAngleXFlip ? 0 : TAU/2;
  // angleXFlip *= 
  var headAngleY = modulo( camera.rotate.y + head.rotate.y + angleXOffset, TAU );
  var headAngleX = modulo( camera.rotate.x + angleXOffset, TAU );
  var stareX = (headAngleY / TAU * 2 - 1) * -8;
  var stareY = (headAngleX / TAU * 2 - 1) * -8;
  stareX = Math.max( -2, Math.min( 2, stareX ) );
  stareY = Math.max( -1, Math.min( 1, stareY ) );
  stareY = isAngleXFlip ? -stareY : stareY;
  // console.log( stareX );
  pupils[-1].translate.x = 0.4 + stareX;
  pupils[1].translate.x = -0.4 + stareX;
  pupils[-1].translate.y = -0.2 + stareY;
  pupils[1].translate.y = -0.2 + stareY;

  // rotate
  camera.updateGraph();
}

// -- render -- //

function render() {
  ctx.clearRect( 0, 0, canvasWidth, canvasHeight );
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  ctx.save();
  ctx.scale( zoom, zoom );
  ctx.translate( w/2, h/2 );

  camera.renderGraph( ctx );

  ctx.restore();
}

// ----- inputs ----- //

// click drag to rotate
var dragStartAngleX, dragStartAngleY;

new Dragger({
  startElement: canvas,
  onPointerDown: function() {
    isRotating = false;
    dragStartAngleX = camera.rotate.x;
    dragStartAngleY = camera.rotate.y;
  },
  onPointerMove: function( pointer, moveX, moveY ) {
    var angleXMove = moveY / canvasWidth * TAU;
    var angleYMove = moveX / canvasWidth * TAU;
    camera.rotate.x = dragStartAngleX + angleXMove;
    camera.rotate.y = dragStartAngleY + angleYMove;
  },
});
