// -------------------------- demo -------------------------- //

var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
var w = 96;
var h = 96;
var minWindowSize = Math.min( window.innerWidth, window.innerHeight );
var zoom = Math.min( 8, Math.floor( minWindowSize / w ) );
var pixelRatio = window.devicePixelRatio || 1;
zoom *= pixelRatio;
var canvasWidth = canvas.width = w * zoom;
var canvasHeight = canvas.height = h * zoom;
// set canvas screen size
if ( pixelRatio > 1 ) {
  canvas.style.width = canvasWidth / pixelRatio + 'px';
  canvas.style.height = canvasHeight / pixelRatio + 'px';
}

Shape.defaults.closed = false;
Shape.defaults.lineWidth = 3;

var isRotating = true;
var quarterView = 1/Math.sin(TAU/8);
var isRotateXFlat;

var scene = new Anchor();

var cameraX = new Anchor({
  addTo: scene,
});

var cameraY = new Anchor({
  addTo: cameraX,
  rotate: { y: TAU/8 },
});

// -- illustration shapes --- //

// cap top
var capTop = new Shape({
  path: [
    { x: -20, y: 0 },
    { arc: [
      { x: -20, y: -20 },
      { x:   0, y: -20 },
    ]},
    { arc: [
      { x:  20, y: -20 },
      { x:  20, y:  0 },
    ]},
  ],
  addTo: scene,
  scale: { y: -1},
});

// cap arc connectors
new Shape({
  path: [
    { x: -20, y: 4 },
    { x: -20, y: 0 },
    { move: [ { x: 20, y: 4 } ]},
    { x: 20, y: 0 },
  ],
  addTo: cameraX,
});


// cap back
new Shape({
  path: [
    { x: -20, z: 0 },
    { arc: [
      { x: -20, z: 20 },
      { x:   0, z: 20 },
    ]},
    { arc: [
      { x:  20, z: 20 },
      { x:  20, z:  0 },
    ]},
  ],
  addTo: cameraY,
  translate: { y: 4 },
});

// brim back arch
new Shape({
  path: [
    { x: -1, y: 0 },
    { arc: [
      { x: -1, y: -1 },
      { x:  0, y: -1 },
    ]},
    { arc: [
      { x: 1, y: -1 },
      { x: 1, y:  0 },
    ]},

  ],
  addTo: cameraY,
  scale: { x: 16, y: 16 },
  translate: { y: 4, z: -12 },
});

// cap back to brim bottom connect
var brimConnector = new Shape({
  path: [
    { x: -20, z: 0 },
    { arc: [
      { x: -20, z: -6 },
      { x: -16, z: -12 },
    ]},
  ],
  addTo: cameraY,
  translate: { y: 4 },
});

brimConnector.copy({
  scale: { x: -1 },
});

var brimTip = { x: 0, y: -12, z: -38 };

new Shape({
  path: [
    { x: 0, y: -12, z: -12 },
    brimTip,
  ],
  addTo: cameraY,
});

var brimBridge = new Shape({
  path: [
    { x: -16, y: 4, z: -12 },
    { x: -16, y: 4, z: -22 },
    { bezier: [
      { x: -16, y: 4, z: -34 },
      { x: -14, y: -12, z: -38 },
      brimTip
    ]},
  ],
  addTo: cameraY,
});
brimBridge.copy({
  scale: { x: - 1},
});

// glasses front top

new Shape({
  path: [
    { x: -1 },
    { x: 1 },
  ],
  addTo: cameraY,
  translate: { y: 8, z: -12 },
  scale: { x: 16 },
});

// glass lens
var lensScale = (quarterView - 1) * 0.75 + 1;
var glassLens = new Shape({
  path: [
    { x: 0, y: -3 },
    { x: 0, y: 0 },
    { arc: [
      { x: 0, y: 5 },
      { x:  5, y: 5 },
    ]},
    { arc: [
      { x:  10, y: 5 },
      { x:  10, y: 0 },
    ]},
    { x: 10, y: -3 },
  ],
  addTo: cameraY,
  translate: { x: -16, y: 11, z: -12 },
  scale: { x: lensScale },
});

glassLens.copy({
  translate: { x: 16, y: 11, z: -12 },
  scale: { x: -lensScale },
});

// glasses arm
var glassesArmA = new Shape({
  path: [
    { z: -12, y: 0 },
    { z: 1, y: 0 },
    { arc: [
      { z: 1 + 8*quarterView, y: 0 },
      { z: 1 + 8*quarterView, y: 8 },
    ]},
  ],
  addTo: cameraY,
  translate: { x: -16, y: 8 },
});
var glassesArmB = glassesArmA.copy({
  translate: { x: 16, y: 8 },
});

// do not display glassesArm if behind lenses
glassesArmA.render = function() {
  var ry = cameraY.rotate.y;
  var isRotateYBlocking = ry > TAU*3/4 && ry < TAU;
  if ( isRotateXFlat && isRotateYBlocking ) {
    return;
  }
  Shape.prototype.render.apply( this, arguments );
};

glassesArmB.render = function() {
  var ry = cameraY.rotate.y;
  var isRotateYBlocking = ry > 0 && ry < TAU/4;
  if ( isRotateXFlat && isRotateYBlocking ) {
    return;
  }
  Shape.prototype.render.apply( this, arguments );
};

// -- animate --- //


var t = 0;
var cycleFrame = 240;

function animate() {
  update();
  render();
  requestAnimationFrame( animate );
}

animate();

// -- update -- //

// i, 0->1
function easeInOut( i ) {
  var isFirstHalf = i < 0.5;
  var i1 = isFirstHalf ? i : 1 - i;
  i1 = i1 / 0.5;
  // make easing steeper with more multiples
  var i2 = i1 * i1 * i1;
  i2 = i2 / 2;
  return isFirstHalf ? i2 : i2*-1 + 1;
}


function update() {
  if ( isRotating ) {
    t += 1/cycleFrame;
    t = t % 1;
    var isFirstHalf = t < 0.5;
    var halfT = isFirstHalf ? t : 1 - t;
    halfT /= 0.5;
    var easeT = easeInOut( halfT );
    cameraY.rotate.y = easeT*-TAU/4 + TAU/8;
    var rxDirection = isFirstHalf ? 1 : 0;
    cameraX.rotate.x = (Math.cos( halfT * TAU ) * -0.5 + 0.5 ) * TAU/16 * rxDirection;
  }

  // normalize camera angle
  cameraX.normalizeRotate();
  cameraY.normalizeRotate();

  var rx = cameraX.rotate.x;
  isRotateXFlat = rx < TAU/16 || rx > TAU * 15/16;
  // flip cap top
  var isRotateXTopSide = rx < TAU/4 || rx > TAU * 3/4;
  capTop.scale.y = isRotateXTopSide ? 1 : -1;

  scene.updateGraph();
}

// -- render -- //
ctx.lineCap = 'round';
ctx.lineJoin = 'round';

function render() {
  ctx.clearRect( 0, 0, canvasWidth, canvasHeight );
  ctx.globalCompositeOperation = 'source-over';

  ctx.save();
  ctx.scale( zoom, zoom );
  ctx.translate( w/2, h/2 );

  scene.renderGraph( ctx );

  ctx.restore();

  ctx.globalCompositeOperation = 'source-in';
  renderGradient();

}

function renderGradient() {
  var gradient = ctx.createLinearGradient( 0, 0, 0, canvasHeight );
  gradient.addColorStop( 0.2, '#F00' );
  gradient.addColorStop( 0.75, '#19F' );
  ctx.fillStyle = gradient;
  ctx.fillRect( 0, 0, canvasWidth, canvasHeight );
}

// ----- inputs ----- //

// click drag to rotate
var dragStartAngleX, dragStartAngleY;

new Dragger({
  startElement: canvas,
  onPointerDown: function() {
    isRotating = false;
    dragStartAngleX = cameraX.rotate.x;
    dragStartAngleY = cameraY.rotate.y;
  },
  onPointerMove: function( pointer, moveX, moveY ) {
    var angleXMove = moveY / canvasWidth * TAU;
    var angleYMove = moveX / canvasWidth * TAU;
    cameraX.rotate.x = dragStartAngleX + angleXMove;
    cameraY.rotate.y = dragStartAngleY + angleYMove;
  },
});

document.querySelector('.reset-button').onclick = function() {
  cameraX.rotate.x = 0;
  cameraY.rotate.y = TAU/8;
};
