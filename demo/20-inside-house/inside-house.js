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

Shape.defaults.stroke = false;
Shape.defaults.backfaceHidden = true;
// Shape.defaults.front = { z: 1 };

var camera = new Shape({
  rendering: false,
  scale: { x: 10, y: 10, z: 10 },
});

// -- illustration shapes --- //

var nsWall = new Shape({
  path: [
    { x: -1, y: -1 },
    { x:  0, y: -2 },
    { x:  1, y: -1 },
    { x:  1, y:  1 },
    { x: -1, y:  1 },
  ],
  addTo: camera,
  translate: { z: -1 },
  fill: true,
  color: 'hsla(45, 100%, 50%, 0.8)',
});

nsWall.copy({
  translate: { z: 1 },
  rotate: { y: TAU/2 },
});

var ewWall = new Rect({
  width: 2,
  height: 2,
  addTo: camera,
  translate: { x: -1 },
  rotate: { y: -TAU/4 },
  fill: true,
  color: 'hsla(210, 100%, 50%, 0.8)',
});

ewWall.copy({
  translate: { x: 1 },
  rotate: { y: TAU/4 },
});

// floor
new Shape({
  path: [
    { x: -1, z: -1 },
    { x:  1, z: -1 },
    { x:  1, z:  1 },
    { x: -1, z:  1 },
  ],
  addTo: camera,
  translate: { y: 1 },
  front: { y: 1 },
  fill: true,
  color: 'hsla(120, 100%, 40%, 0.8)',
});

// roof
var roofLength = Math.sqrt(2);
var roof = new Shape({
  path: [
    { x: 0, y: -1 },
    { x: roofLength, y: -1 },
    { x: roofLength, y:  1 },
    { x: 0, y:  1 },
  ],
  addTo: camera,
  translate: { y: -2 },
  rotate: { x: -TAU/4, y: TAU/8 },
  fill: true,
  color: 'hsla(0, 100%, 60%, 0.8)',
});

roof.copy({
  scale: { x: -1 },
  rotate: { x: -TAU/4, y: -TAU/8 },
});

// -----  ----- //

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
  camera.rotate.y += isRotating ? +TAU/240 : 0;

  // rotate
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
