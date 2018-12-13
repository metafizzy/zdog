// -------------------------- demo -------------------------- //

var canvas = document.querySelector('canvas');
var w = 96;
var h = 96;
var minWindowSize = Math.min( window.innerWidth, window.innerHeight );
var zoom = Math.min( 8, Math.floor( minWindowSize / w ) );
canvas.width = w * zoom;
canvas.height = h * zoom;

var illo = new Illo({
  canvas: canvas,
  prerender: function( ctx ) {
    ctx.scale( zoom, zoom );
  },
});

Shape.defaults.closed = false;
Shape.defaults.lineWidth = 3;


var quarterView = 1/Math.sin(TAU/8);
var isRotateXFlat;

var scene = new Anchor();

var initialHatRotate = { y: -TAU/8 };

var hat = new Anchor({
  addTo: scene,
  rotate: initialHatRotate,
});

// -- illustration shapes --- //

// cap top
var capTop = new Shape({
  path: [
    { x: -20, y: 4 },
    { x: -20, y: 0 },
    { arc: [
      { x: -20, y: -20 },
      { x:   0, y: -20 },
    ]},
    { arc: [
      { x:  20, y: -20 },
      { x:  20, y:  0 },
    ]},
    { x: 20, y: 4 },
  ],
  addTo: scene,
});

// cap back
new Shape({
  path: [
    { x: -20, z: 0 },
    { arc: [
      { x: -20, z: -20 },
      { x:   0, z: -20 },
    ]},
    { arc: [
      { x:  20, z: -20 },
      { x:  20, z:  0 },
    ]},
  ],
  addTo: hat,
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
  addTo: hat,
  scale: 16,
  translate: { y: 4, z: 12 },
});

// cap back to brim bottom connect
var brimConnector = new Shape({
  path: [
    { x: -20, z: 0 },
    { arc: [
      { x: -20, z: 6 },
      { x: -16, z: 12 },
    ]},
  ],
  addTo: hat,
  translate: { y: 4 },
});

brimConnector.copy({
  scale: { x: -1 },
});

var brimTip = { x: 0, y: -12, z: 38 };

new Shape({
  path: [
    { x: 0, y: -12, z: 12 },
    brimTip,
  ],
  addTo: hat,
});

var brimBridge = new Shape({
  path: [
    { x: -16, y: 4, z: 12 },
    { x: -16, y: 4, z: 22 },
    { bezier: [
      { x: -16, y: 4, z: 34 },
      { x: -14, y: -12, z: 38 },
      brimTip
    ]},
  ],
  addTo: hat,
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
  addTo: hat,
  translate: { y: 8, z: 12 },
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
  addTo: hat,
  translate: { x: -16, y: 11, z: 12 },
  scale: { x: lensScale },
});

glassLens.copy({
  translate: { x: 16, y: 11, z: 12 },
  scale: { x: -lensScale },
});

// glasses arm
var glassesArmA = new Shape({
  path: [
    { z: 12, y: 0 },
    { z: -1, y: 0 },
    { arc: [
      { z: -1 - 8*quarterView, y: 0 },
      { z: -1 - 8*quarterView, y: 8 },
    ]},
  ],
  addTo: hat,
  translate: { x: -16, y: 8 },
});
var glassesArmB = glassesArmA.copy({
  translate: { x: 16, y: 8 },
});

// do not display glassesArm if behind lenses
glassesArmA.render = function() {
  var ry = hat.rotate.y;
  var isRotateYBlocking = ry > 0 && ry < TAU/4;
  if ( isRotateXFlat && isRotateYBlocking ) {
    return;
  }
  Shape.prototype.render.apply( this, arguments );
};

glassesArmB.render = function() {
  var ry = hat.rotate.y;
  var isRotateYBlocking = ry > TAU*3/4 && ry < TAU;
  if ( isRotateXFlat && isRotateYBlocking ) {
    return;
  }
  Shape.prototype.render.apply( this, arguments );
};

// -- animate --- //

var isRotating = true;
var t = 0;
var cycleFrame = 240;

function animate() {
  update();
  render();
  requestAnimationFrame( animate );
}

animate();

// -- update -- //


function update() {


  if ( isRotating ) {
    t += 1/cycleFrame;
    t = t % 1;
    var isFirstHalf = t < 0.5;
    var halfT = isFirstHalf ? t : 1 - t;
    halfT /= 0.5;
    var easeT = easeInOut( halfT, 3 );
    hat.rotate.y = easeT*TAU/4 - TAU/8;
    var rxDirection = isFirstHalf ? 1 : 0;
    hat.rotate.x = (Math.cos( halfT * TAU ) * -0.5 + 0.5 ) * -TAU/16 * rxDirection;
  }

  // normalize camera angle
  hat.normalizeRotate();

  var rx = hat.rotate.x;
  isRotateXFlat = rx < TAU/16 || rx > TAU * 15/16;
  // flip cap top
  var isRotateXTopSide = rx < TAU/4 || rx > TAU * 3/4;
  capTop.scale.y = isRotateXTopSide ? 1 : -1;

  scene.updateGraph();
}

// -- render -- //

function render() {
  var ctx = illo.ctx;
  ctx.globalCompositeOperation = 'source-over';
  illo.render( scene );

  // render gradient
  ctx.globalCompositeOperation = 'source-in';
  var gradient = ctx.createLinearGradient( 0, 0, 0, illo.height );
  gradient.addColorStop( 0.2, '#F00' );
  gradient.addColorStop( 0.75, '#19F' );
  ctx.fillStyle = gradient;
  ctx.fillRect( 0, 0, illo.width, illo.height );
}

// ----- inputs ----- //

illo.enableDragRotate( hat, function() {
  isRotating = false;
});

document.querySelector('.reset-button').onclick = function() {
  hat.rotate.set( initialHatRotate );
};
