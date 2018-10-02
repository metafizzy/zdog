var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
var w = 48;
var h = 64;
var zoom = 6;
var canvasWidth = canvas.width = w * zoom;
var canvasHeight = canvas.height = h * zoom;
// colors
var colors = {
  fur: '#EA0',
  eye: '#444',
  inner: '#FEE',
  cloak: '#F18',
  // cloak: 'hsla(0, 100%, 50%, 0.2)',
  armor: '#915',
};

var rZSpeed = 0;

var scene = new Anchor();

// -- illustration shapes --- //

// front square
new Rect({
  width: 20,
  height: 20,
  addTo: scene,
  translate: { z: -10 },
  color: colors.cloak,
  lineWidth: 2,
});

// back triangle
new Shape({
  path: [
    { x: -1, y: -1 },
    { x: 1, y: -1 },
    { x: 1, y: 1 },
  ],
  addTo: scene,
  scale: 10,
  translate: { z: 10 },
  color: colors.fur,
  lineWidth: 2,
});

// side diamond
new Shape({
  path: [
    { x: -10, y: -8, z: 0 },
    { x: -10, y: 0, z: -8 },
    { x: -10, y: 8, z: 0 },
    { x: -10, y: 0, z: 8 },
  ],
  addTo: scene,
  color: colors.inner,
  fill: true,
  lineWidth: 1,
});

// side filled square
new Rect({
  width: 12,
  height: 12,
  addTo: scene,
  rotate: { y: TAU/4 },
  translate: { x: 10 },
  color: colors.inner,
  fill: true,
  lineWidth: 1,
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
  // rotate
  scene.rotate.z += rZSpeed;

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

document.querySelector('.toggle-z-rotation-button').onclick = function() {
  rZSpeed = rZSpeed ? 0 : TAU/360;
};

// click drag to rotate
var dragStartAngleX, dragStartAngleY;

new Dragger({
  startElement: canvas,
  onPointerDown: function() {
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
