// -------------------------- demo -------------------------- //

var canvas = document.querySelector('canvas');
var w = 96;
var h = 96;
var minWindowSize = Math.min( window.innerWidth, window.innerHeight );
var zoom = Math.min( 8, Math.floor( minWindowSize / w ) );
canvas.width = w * zoom;
canvas.height = h * zoom;
// colors
var orange = '#E62';
var eggplant = '#636';

Zdog.Shape.defaults.closed = false;
[ Zdog.Shape, Zdog.Ellipse ].forEach( function( ShapeClass ) {
  ShapeClass.defaults.stroke = 3;
  ShapeClass.defaults.color = orange;
});

var isRotating = true;
var TAU = Zdog.TAU;
var initialRotate = { y: -TAU/8 };

var illo = new Zdog.Illustration({
  canvas: canvas,
  zoom: zoom,
  rotate: initialRotate,
  dragRotate: true,
  onDragStart: function() {
    isRotating = false;
  }
});

// -- illustration shapes --- //

// cap top
[ 0, 1, 2, 3, 4 ].forEach( function( i ) {
  new Zdog.Shape({
    path: [
      { x: -20, y: 4 },
      { x: -20, y: 0 },
      { arc: [
        { x: -20, y: -20 },
        { x:   0, y: -20 },
      ]},
    ],
    rotate: { y: TAU/6 * i -TAU/12 },
    addTo: illo,
  });
});

// cap back
new Zdog.Ellipse({
  addTo: illo,
  diameter: 40,
  quarters: 2,
  translate: { y: 4 },
  rotate: { x: TAU/4, z: -TAU/4 },
});

// cap back to brim bottom connect
var brimConnector = new Zdog.Shape({
  path: [
    { x: -20, z: 0 },
    { arc: [
      { x: -20, z: 6 },
      { x: -16, z: 12 },
    ]},
  ],
  addTo: illo,
  translate: { y: 4 },
});

brimConnector.copy({
  scale: { x: -1 },
});

// brim back arch
new Zdog.Ellipse({
  addTo: illo,
  diameter: 32,
  quarters: 2,
  translate: { y: 4, z: 12 },
  rotate: { z: -TAU/4 },
});

var brimTip = new Zdog.Vector({ x: 0, y: -12, z: 34 });
var brimEdge = brimTip.copy();
brimEdge.x = -14;

// brim top line
new Zdog.Shape({
  addTo: illo,
  path: [
    { x: 0, y: -12, z: 12 },
    brimTip,
  ],
});

var brimBridge = new Zdog.Shape({
  addTo: illo,
  path: [
    { x: -16, y: 4, z: 12 },
    { x: -16, y: 4, z: 18 },
    { bezier: [
      { x: -16, y: 4, z: 30 },
      brimEdge,
      brimTip
    ]},
  ],
});
brimBridge.copy({
  scale: { x: - 1},
});

// glasses front top
var glassFront = new Zdog.Shape({
  addTo: illo,
  path: [
    { x: -16 },
    { x:  16 }
  ],
  translate: { y: 8, z: 12 },
  color: eggplant,
});

// glass lens
var glassLens = new Zdog.Shape({
  addTo: glassFront,
  path: [
    { x: -1, y: -1 },
    { x:  1, y: -1 },
    { x:  1, y:  0 },
    { arc: [
      { x: 1, y: 1 },
      { x: 0, y: 1 },
    ]},
    { arc: [
      { x: -1, y: 1 },
      { x: -1, y: 0 },
    ]},
  ],
  closed: true,
  scale: 5,
  translate: { x: -8, y: 5 },
  color: eggplant,
  fill: true,
});

glassLens.copy({
  translate: { x: 8, y: 5 },
});

// glasses arm
var glassesArm = new Zdog.Shape({
  addTo: illo,
  path: [
    { x: 12, y: 0 },
    { x: -1, y: 0 },
    { arc: [
      { x: -12, y: 0 },
      { x: -12, y: 8 },
    ]},
  ],
  rotate: { y: TAU/4 },
  translate: { x: -16, y: 8 },
  color: eggplant,
  // only see one arm at time
  backface: false,
});
glassesArm.copy({
  scale: { x: -1 },
  rotate: { y: -TAU/4 },
  translate: { x: 16, y: 8 },
});

// -- animate --- //

var t = 0;

function animate() {
  if ( isRotating ) {
    illo.rotate.y = Zdog.easeInOut( t, 4 ) * TAU + initialRotate.y;
    t += 1/150;
  }

  illo.updateGraph();
  illo.renderGraph();
  requestAnimationFrame( animate );
}

animate();
