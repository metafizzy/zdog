// -------------------------- demo -------------------------- //

var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
var w = 96;
var h = 96;
var minWindowSize = Math.min( window.innerWidth, window.innerHeight );
var zoom = Math.min( 6, Math.floor( minWindowSize / w ) );
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

var scene = new Anchor({
  scale: 2,
});

// -- illustration shapes --- //

new Rect({
  width: 10,
  height: 10,
  addTo: scene,
  translate: { z: -10 },
  lineWidth: 2,
  color: '#E21',
});

/*
new Ellipse({
  width: 16,
  height: 16,
  addTo: scene,
  translate: { z: 10 },
  lineWidth: 4,
  color: '#19F',
});

new Shape({
  path: [
    { x:  0, z:  1 },
    { x: -1, z: -1 },
    { x:  1, z: -1 },
  ],
  scale: { x: 5, z: 5 },
  addTo: scene,
  lineWidth: 2,
  fill: true,
  color: '#EA0',
});
*/

new Hemisphere({
  radius: 2,
  scale: 2,
  addTo: scene,
  translate: { x: 8 },
  color: '#EA0',
  baseColor: '#456',
  stroke: false,
});

new Cylinder({
  radius: 2,
  length: 4,
  scale: 2,
  addTo: scene,
  translate: { x: 0 },
  color: '#C25',
  baseColor: '#E62',
  stroke: false,
});

new Cone({
  radius: 2,
  height: 3,
  scale: 2,
  addTo: scene,
  translate: { x: -8 },
  color: '#456',
  baseColor: '#EA0',
  stroke: false,
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
  scene.rotate.y += isRotating ? +TAU/150 : 0;

  scene.updateGraph();
}

// -- render -- //

ctx.lineCap = 'round';
ctx.lineJoin = 'round';

function render() {
  ctx.clearRect( 0, 0, canvasWidth, canvasHeight );

  ctx.save();
  ctx.scale( zoom, zoom );
  ctx.translate( w/2, h/2 );

  scene.renderGraph( ctx );

  ctx.restore();
}

// ----- inputs ----- //

// click drag to rotate
var dragStartAngleX, dragStartAngleY;

new Dragger({
  startElement: canvas,
  onPointerDown: function() {
    isRotating = false;
    dragStartAngleX = scene.rotate.x;
    dragStartAngleY = scene.rotate.y;
  },
  onPointerMove: function( pointer, moveX, moveY ) {
    var angleXMove = moveY / canvasWidth * TAU;
    var angleYMove = moveX / canvasWidth * TAU;
    scene.rotate.x = dragStartAngleX + angleXMove;
    scene.rotate.y = dragStartAngleY + angleYMove;
  },
});
