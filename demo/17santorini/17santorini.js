/* globals makeWindow */

// -------------------------- demo -------------------------- //

var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
var w = 128;
var h = 128;
var minWindowSize = Math.min( window.innerWidth, window.innerHeight );
var zoom = Math.min( 7, Math.floor( minWindowSize / w ) );
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
var white = 'white';
var southWall = white;
var westWall = '#CDE';
var eastWall = '#8AD';
var northWall = '#58D';
var navy = '#037';
var midnight = '#024';
var roof = '#06B';

var camera = new Shape({
  rendering: false,
});

// -- illustration shapes --- //


[ true, false ].forEach( function( isSouth ) {
  var wallZ = isSouth ? -5 : 5;
  var wallGroup = new Group({
    addTo: camera,
    translate: { z: wallZ },
  });

  // wall
  new Shape({
    path: [
      { x: 0, y: -12 },
      { x: 4, y: -8 },
      { x: 4, y: 0 },
      { x: -4, y: 0 },
      { x: -4, y: -8 }
    ],
    addTo: wallGroup,
    color: isSouth ? southWall : northWall,
    fill: true,
    lineWidth: 1/zoom/2,
    stroke: false,
  });

  // window
  makeWindow( 2, {
    addTo: wallGroup,
    translate: { y: -5 },
    color: isSouth ? navy : midnight,
    lineWidth: 1/zoom/2,
  });

});

[ true, false ].forEach( function( isWest ) {
  var wallGroup = new Group({
    addTo: camera,
    translate: { x: isWest ? -4 : 4 },
    rotate: { y: TAU/4 },
  });

  // wall
  new Rect({
    width: 10,
    height: 8,
    addTo: wallGroup,
    color: isWest ? westWall : eastWall,
    translate: { y: -4 },
    fill: true,
    lineWidth: 1/zoom/2,
    stroke: false,
  });

  // window
  makeWindow( 2, {
    addTo: wallGroup,
    translate: { x: -2, y: -5 },
    color: isWest ? navy : midnight,
    lineWidth: 1/zoom/2,
  });

  makeWindow( 2, {
    addTo: wallGroup,
    translate: { x: 2, y: -5 },
    color: isWest ? navy : midnight,
    lineWidth: 1/zoom/2,
  });

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
  camera.rotate.y += isRotating ? +TAU/150 : 0;

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
