/* globals Shifter */

// -------------------------- demo -------------------------- //

var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
var w = 10;
var h = 10;
var minWindowSize = Math.min( window.innerWidth, window.innerHeight - 40 );
var zoom = Math.floor( minWindowSize / w );
var pixelRatio = window.devicePixelRatio || 1;
zoom *= pixelRatio;
var canvasWidth = canvas.width = w * zoom;
var canvasHeight = canvas.height = h * zoom;
// set canvas screen size
if ( pixelRatio > 1 ) {
  canvas.style.width = canvasWidth / pixelRatio + 'px';
  canvas.style.height = canvasHeight / pixelRatio + 'px';
}

var scene = new Anchor();

// -- illustration shapes --- //


var shifterA = new Shifter({
  addTo: scene,
  translate: { x: -3 },
});
var shifterB = new Shifter({
  addTo: scene,
});
var shifterC = new Shifter({
  addTo: scene,
  translate: { x: 3 },
});

// -- animate --- //

var t = 0;
var tSpeed = 1/80;

function animate() {
  update();
  render();
  requestAnimationFrame( animate );
}

animate();

// -- update -- //

function update() {

  shifterA.update( t + 4 );
  shifterB.update( t + 2 );
  shifterC.update( t + 0 );

  t += tSpeed;

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
    // isRotating = false;
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
