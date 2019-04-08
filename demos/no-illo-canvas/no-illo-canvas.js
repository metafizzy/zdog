// ----- setup ----- //

// get canvas element and its context
var canvas = document.querySelector('.zdog-canvas');
var ctx = canvas.getContext('2d');
// get canvas size
var canvasWidth = canvas.width;
var canvasHeight = canvas.height;
// illustration variables
var zoom = 5;
var isSpinning = true;
var TAU = Zdog.TAU;

// ----- model ----- //

var scene = new Zdog.Anchor();

// circle
new Zdog.Ellipse({
  addTo: scene,
  diameter: 20,
  translate: { z: 10 },
  stroke: 5,
  color: '#636',
});

// square
new Zdog.Rect({
  addTo: scene,
  width: 20,
  height: 20,
  translate: { z: -10 },
  stroke: 3,
  color: '#E62',
  fill: true,
});

// ----- animate ----- //

function animate() {
  scene.rotate.y += isSpinning ? 0.03 : 0;
  scene.updateGraph();
  render();
  requestAnimationFrame( animate );
}

function render() {
  // clear canvas
  ctx.clearRect( 0, 0, canvasWidth, canvasHeight );
  ctx.save();
  // center canvas & zoom
  ctx.translate( canvasWidth/2, canvasHeight/2 );
  ctx.scale( zoom, zoom );
  // set lineJoin and lineCap to round
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  // render scene graph
  scene.renderGraphCanvas( ctx );
  ctx.restore();
}

animate();


// ----- drag ----- //

var dragStartRX, dragStartRY;
var minSize = Math.min( canvasWidth, canvasHeight );

// add drag-rotatation with Dragger
new Zdog.Dragger({
  startElement: canvas,
  onDragStart: function() {
    isSpinning = false;
    dragStartRX = scene.rotate.x;
    dragStartRY = scene.rotate.y;
  },
  onDragMove: function( pointer, moveX, moveY ) {
    scene.rotate.x = dragStartRX - ( moveY / minSize * TAU );
    scene.rotate.y = dragStartRY - ( moveX / minSize * TAU );
  },
});
