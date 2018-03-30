// -------------------------- demo -------------------------- //

var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
var w = 104;
var h = 104;
var minWindowSize = Math.min( window.innerWidth, window.innerHeight );
var zoom = Math.min( 5, Math.floor( minWindowSize / w ) );
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

// ratio to make things look square when rotated a quarter
var antiTwist = 1 / Math.cos( TAU/8 );

// colors
var blue = '#19F';

var camera = new Anchor({
  scale: { x: antiTwist, z: antiTwist },
});

// -- illustration shapes --- //

// front right leg
var leg = new Shape({
  path: [
    { x: -8, y: 0 },
    { arc: [
      { x: 0, y: 0 },
      { x: 0, y: 8 }
    ]},
    { arc: [
      { z: 0, y: 0 },
      { z: 8, y: 0 }
    ]},
    { move: [ { y: -4 } ] },
    { line: [ { y: 12 } ] },
  ],
  addTo: camera,
  translate: { x: 16, y: 16, z: -8 },
  lineWidth: 8,
  color: blue,
  closed: false,
});
// front left leg
leg.copy({
  translate: { x: 16, y: 16, z: 8 },
  rotate: { y: TAU/4 },
});
// back right leg
leg.copy({
  translate: { x: -16, y: 16, z: -8 },
  rotate: { y: -TAU/4 },
});
// back left leg
leg.copy({
  translate: { x: -16, y: 16, z: 8 },
  rotate: { y: TAU/2 },
});


// leg connectors
var legConnector = new Shape({
  path: [ { x: -8 }, { x: 8 } ],
  addTo: camera,
  translate: { y: 16, z: -8 },
  lineWidth: 8,
  color: blue,
  closed: false,
});
legConnector.copy({
  translate: { y: 16, z: 8 },
});

// body
new Shape({
  path: [
    { x: -1, z: -1 },
    { x:  1, z: -1 },
    { x:  1, z:  1 },
    { x: -1, z:  1 },
  ],
  // fudge these numbers
  scale: { x: 14.25, z: 3.75 },
  addTo: camera,
  translate: { y: 10 },
  lineWidth: 20,
  color: blue,
});

// neck squiggle
new Shape({
  path: [
    { x: 16, y: 4 },
    { arc: [
      { x: 24, y: 4 },
      { x: 24, y: -4 }
    ]},
    { arc: [
      { x: 24, y: -12 },
      { x: 16, y: -12 }
    ]},
    { x: -16, y: -12 },
    { arc: [
      { x: -24, y: -12 },
      { x: -24, y: -20 }
    ]},
    { arc: [
      { x: -24, y: -28 },
      { x: -16, y: -28 }
    ]},
    { x: 24, y: -28 },
  ],
  addTo: camera,
  lineWidth: 8,
  color: blue,
  closed: false,
});

// neck 
new Shape({
  path: [
    { x: -16, y: -28 },
    { x: 24, y: -28 },
  ],
  addTo: camera,
  lineWidth: 8,
  color: blue,
  closed: false,
});

// head ball
var head = new Shape({
  translate: { x: 16, y: -31 },
  addTo: camera,
  lineWidth: 14,
  color: blue,
});

// eyes
var eye = new Shape({
  addTo: head,
  translate: { z: 1, x: 0 },
  color: 'white',
  lineWidth: 4,
  fill: true,
  closed: false,
});
eye.copy({
  translate: { z: -1, x: 0 },
});

// tail
new Shape({
  path: [
    { x: -16, z: 0 },
    { arc: [
      { x: -24, z: 0 },
      { x: -24, z: 8 },
    ]},
    { arc: [
      { x: -24, z: 16 },
      { x: -16, z: 16 },
    ]},
    { x: -12, z: 16 },
    { arc: [
      { x: -6, z: 16 },
      { x: -6, z: 22 },
    ]},
    { arc: [
      { x: -6, z: 28 },
      { x: -12, z: 28 },
    ]},
    { x: -18, z: 28 },
  ],
  addTo: camera,
  translate: { y: 4 },
  // rotate: { x: -0.25 },
  color: blue,
  lineWidth: 8,
  closed: false,
});

// -- animate --- //

var t = 0;

function animate() {
  update();
  render();
  requestAnimationFrame( animate );
}

animate();

// -- update -- //

// i, 0->1
function easeOut( i ) {
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
    t += TAU/210;
    var easeT = easeOut( ( t/TAU) % 1 );
    camera.rotate.y = easeT*TAU - TAU/8;
    camera.rotate.x = ( Math.cos( easeT * TAU ) * -0.5 + 0.5 ) * TAU/12;
  }

  camera.updateGraph();
}

// -- render -- //
ctx.lineCap = 'round';
ctx.lineJoin = 'round';

viewQuarterTwist();

function render() {
  ctx.clearRect( 0, 0, canvasWidth, canvasHeight );
  ctx.save();
  ctx.scale( zoom, zoom );
  ctx.translate( w/2, h/2 );

  camera.renderGraph( ctx );

  ctx.restore();
}



// ----- inputs ----- //

document.querySelector('.reset-button').onclick = function() {
  viewQuarterTwist();
  isRotating = false;
};

function viewQuarterTwist() {
  camera.rotate.set({ x: 0, y: -TAU/8, z: 0 });
}

document.querySelector('.rotate-button').onclick = function() {
  isRotating = true;
  t = 0;
};

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
