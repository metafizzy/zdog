// ------------------------- demo ------------------------- //

var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
var illoSize = 48;
var zoom = 8;
var canvasSize = canvas.width = canvas.height = illoSize * zoom;
var isRotating = true;
var TAU = Zdog.TAU;

var scene = new Zdog.Anchor();

// ----- model ----- //

new Zdog.Rect({
  width: 20,
  height: 20,
  addTo: scene,
  translate: { z: -10 },
  stroke: 2,
  color: '#E21',
});

new Zdog.Ellipse({
  diameter: 16,
  addTo: scene,
  translate: { z: 10 },
  stroke: 4,
  color: '#19F',
});

new Zdog.Shape({
  path: [
    { x:  0, z:  1 },
    { x: -1, z: -1 },
    { x:  1, z: -1 },
  ],
  scale: { x: 5, z: 5 },
  addTo: scene,
  stroke: 2,
  fill: true,
  color: '#EA0',
});

// ----- animate ----- //

ctx.lineJoin = 'round';
ctx.lineCap = 'round';

function animate() {
  scene.rotate.y += isRotating ? +TAU/150 : 0;
  scene.updateGraph();
  render();
  requestAnimationFrame( animate );
}

function render() {
  ctx.clearRect( 0, 0, canvasSize, canvasSize );
  ctx.save();
  ctx.translate( canvasSize/2, canvasSize/2 );
  ctx.scale( zoom, zoom );
  scene.renderGraph( ctx );
  ctx.restore();
}

animate();

// ----- drag ----- //

// click drag to rotate
var dragStartAngleX, dragStartAngleY;

new Zdog.Dragger({
  startElement: canvas,
  onDragStart: function() {
    isRotating = false;
    dragStartRX = scene.rotate.x;
    dragStartRY = scene.rotate.y;
  },
  onDragMove: function( pointer, moveX, moveY ) {
    scene.rotate.x = moveY / canvasSize * TAU + dragStartRX;
    scene.rotate.y = moveX / canvasSize * TAU + dragStartRY;
  },
});
