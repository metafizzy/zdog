// -------------------------- demo -------------------------- //

var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
var w = 48;
var h = 48;
var minWindowSize = Math.min( window.innerWidth, window.innerHeight );
var zoom = Math.min( 10, Math.floor( minWindowSize / w ) );
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
var yellow = '#ED0';
var gold = '#EA0';
var orange = '#E62';
var magenta = '#C25';
var navy = '#249';
var brown = '#C25';
var blue = '#EA0';

[ Shape, Rect, Ellipse ].forEach( function( ShapeClass ) {
  ShapeClass.defaults.stroke = false;
  ShapeClass.defaults.fill = true;
});

// -- illustration shapes --- //

var scene = new Anchor({
  rotate: { z: TAU/8 }
});

// -----  ----- //

var radius = 12;

hemisphere({
  size: 16,
  addTo: scene,
  translate: { x: radius },
  rotate: { y: TAU/4 },
  insideColor: gold,
  outsideColor: navy,
  stroke: false,
  fill: true,
});

hemisphere({
  size: 16,
  addTo: scene,
  translate: { x: -radius },
  rotate: { y: -TAU/4 },
  insideColor: gold,
  outsideColor: navy,
  stroke: false,
  fill: true,
});

hemisphere({
  size: 16,
  addTo: scene,
  translate: { y: -radius },
  rotate: { x: -TAU/4 },
  insideColor: magenta,
  outsideColor: yellow,
  stroke: false,
  fill: true,
});

hemisphere({
  size: 16,
  addTo: scene,
  translate: { y: radius },
  rotate: { x: TAU/4 },
  insideColor: magenta,
  outsideColor: yellow,
  stroke: false,
  fill: true,
});

hemisphere({
  size: 16,
  addTo: scene,
  translate: { z: -radius },
  // rotate: { x: -TAU/4 },
  insideColor: yellow,
  outsideColor: gold,
  stroke: false,
  fill: true,
});

hemisphere({
  size: 16,
  addTo: scene,
  translate: { z: radius },
  rotate: { y: TAU/2 },
  insideColor: yellow,
  outsideColor: gold,
  stroke: false,
  fill: true,
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

  // ctx.fillStyle = '#EEE';
  // ctx.beginPath();
  // ctx.arc( 0, 0, 16, 0, TAU );
  // ctx.fill();



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
