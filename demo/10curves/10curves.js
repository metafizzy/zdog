var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
var w = 72;
var h = 72;
var zoom = 6;
var canvasWidth = canvas.width =  w * zoom;
var canvasHeight = canvas.height = h * zoom;
// colors


var camera = new Anchor();

// -- illustration shapes --- //

// rectangle with curve
new Shape({
  path: [
    { x: -6, y: -8 },
    { bezier: [
      { x:  0, y: -12, z: -5 },
      { x:  0, y: -4 },
      { x:  6, y: -8 },
    ]},
    { x:  6, y:  8 },
    { bezier: [
      { x:  0, y: 8, z: -5 },
      { x:  0, y: 8, z: 5 },
      { x:  -6, y: 8 },
    ]},
    { x: -6, y:  8 },
  ],
  addTo: camera,
  lineWidth: 2,
  color: '#19F',
});

// quarter circle
new Shape({
  path: [
    { x: 10, y: 0 },
    { arc: [
      { x: 20, y: 0 },
      { x: 20, y: 10 }
    ]},
    { x: 10, y: 10 }
  ],
  addTo: camera,
  lineWidth: 2,
  color: '#A00',
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
