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

[ Shape, Rect, Ellipse ].forEach( function( ShapeClass ) {
  ShapeClass.defaults.stroke = false;
  ShapeClass.defaults.fill = true;
});

// -- illustration shapes --- //

var scene = new Anchor();

var quarterCircle = new Shape({
  rendering: false,
  path: [
    { x: 0, y: -1 },
    { arc: [
      { x: 1, y: -1 },
      { x: 1, y: 0 },
    ]},
    { x: 0, y: 0 },
  ],
  addTo: scene,
  color: 'transparent',
});


quarterCircle.copy({
  color: navy,
  scale: { x: 16, y: 16 },
});
quarterCircle.copy({
  color: orange,
  scale: { x: 16, y: -16 },
});
quarterCircle.copy({
  color: gold,
  scale: { x: -16, y: -16 },
});
quarterCircle.copy({
  color: yellow,
  scale: { x: -16, y: 16 },
});

quarterCircle.copy({
  color: magenta,
  scale: { x: 16, y: 16 },
  rotate: { x: TAU/4 },
});
quarterCircle.copy({
  color: orange,
  scale: { x: 16, y: 16 },
  rotate: { y: -TAU/4 },
});
quarterCircle.copy({
  color: yellow,
  scale: { x: 16, y: -16 },
  rotate: { y: -TAU/4 },
});

var circle = new Ellipse({
  width: 32,
  height: 32,
  addTo: scene,
  color: gold,
  backfaceHidden: true,
});
circle.copy({
  rotate: { y: TAU/2 },
  color: magenta,
});

var faceDot = new Shape({
  path: [{ z: -16 }],
  addTo: scene,
});

var faceRenderPoint = faceDot.pathActions[0].endRenderPoint;

// -- animate --- //

function animate() {
  update();
  render();
  requestAnimationFrame( animate );
}

animate();

// -- update -- //

var faceTheta = 0;

function update() {
  scene.rotate.y += isRotating ? +TAU/150 : 0;
  faceTheta = Math.atan2( faceRenderPoint.y, faceRenderPoint.x );

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

  ctx.fillStyle = '#EEE';
  ctx.beginPath();
  ctx.arc( 0, 0, 16, 0, TAU );
  ctx.fill();


  ctx.save();
  ctx.rotate( faceTheta );

  ctx.lineWidth = 0.5;
  ctx.strokeStyle = '#333';
  ctx.beginPath();
  ctx.moveTo(0,0);
  ctx.lineTo(16,0);
  ctx.stroke();

  ctx.fillStyle = magenta;
  ctx.beginPath();
  ctx.arc( 0, 0, 16, TAU/4, -TAU/4 );
  ctx.closePath();
  ctx.fill();

  ctx.restore();

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
