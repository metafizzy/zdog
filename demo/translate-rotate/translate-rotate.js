var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
var w = 72;
var h = 72;
var zoom = 6;
var canvasWidth = canvas.width = w * zoom;
var canvasHeight = canvas.height = h * zoom;

var rZSpeed = 0;

var camera = new Anchor();

// -- illustration shapes --- //

var rect1 = new Rect({
  width: 12,
  height: 16,
  translate: { z: -6 },
  // rotate: { z: 1 },
  stroke: 2,
  // fill: true,
  color: '#08D',
  addTo: camera,
});

var moon1 = new Shape({
  path: [
    { z: 0 },
    { z: 6 }
  ],
  translate: { y: -11 },
  stroke: 3,
  color: 'white',
  addTo: rect1,
});

new Rect({
  width: 12,
  height: 8,
  translate: { y: 8 },
  rotate: { x: TAU/4 },
  stroke: 2,
  fill: true,
  color: '#E21',
  addTo: camera,
});

new Shape({
  path: [
    { y: -6, z: 4 },
    { y:  6, z: 4 },
    { y:  6, z: 0 },
    { y: -6, z: 0 },
  ],
  stroke: 1,
  fill: true,
  color: '#F80',
  addTo: camera,
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
  moon1.rotate.y += 0.03;
  rect1.rotate.z -= 0.02;
  camera.rotate.z += rZSpeed;
  
  camera.updateGraph();
}

// -- render -- //

ctx.lineCap = 'round';
ctx.lineJoin = 'round';

function render() {
  ctx.clearRect( 0, 0, canvasWidth, canvasHeight );

  ctx.save();
  ctx.scale( zoom, zoom );
  ctx.translate( w/2, h/2 );

  camera.renderGraph( ctx );

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
