/* jshint browser: true, devel: true, unused: true, undef: true */
/* globals Shape */

var TAU = Math.PI * 2;
var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
var w = 72;
var h = 72;
var zoom = 6;
var canvasWidth = canvas.width =  w * zoom;
var canvasHeight = canvas.height = h * zoom;
// colors


var camera = new Shape({
  rendering: false,
});

// -- illustration shapes --- //

var rect = new Shape({
  path: [
    { x: -6, y: -8 },
    {
      action: 'bezier',
      points: [
        { x:  0, y: -12, z: -5 },
        { x:  0, y: -4 },
        { x:  6, y: -8 },
      ]
    },
    { x:  6, y:  8 },
    {
      action: 'bezier',
      points: [
        { x:  0, y: 8, z: -5 },
        { x:  0, y: 8, z: 5 },
        { x:  -6, y: 8 },
      ]
    },
    { x: -6, y:  8 },
  ],
  addTo: camera,
  lineWidth: 2,
  color: '#19F',
});

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
  camera.update();
  shapes.forEach( function( shape ) {
    shape.updateSortValue();
  });
  shapes.sort( function sortBySortValue( a, b ) {
    return b.sortValue - a.sortValue;
  });
}

// -- render -- //
ctx.lineCap = 'round';
ctx.lineJoin = 'round';

function render() {
  ctx.clearRect( 0, 0, canvasWidth, canvasHeight );
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

var dragStartX, dragStartY;
var dragStartAngleX, dragStartAngleY;

document.addEventListener( 'mousedown', function( event ) {
  dragStartX = event.pageX;
  dragStartY = event.pageY;
  dragStartAngleX = camera.rotate.x;
  dragStartAngleY = camera.rotate.y;

  window.addEventListener( 'mousemove', onMousemoveDrag );
  window.addEventListener( 'mouseup', onMouseupDrag );
});

function onMousemoveDrag( event ) {
  var dx = event.pageX - dragStartX;
  var dy = event.pageY - dragStartY;
  var angleXMove = dy / ( zoom * 50 ) * TAU;
  var angleYMove = dx / ( zoom * 50 ) * TAU;
  camera.rotate.x = dragStartAngleX + angleXMove;
  camera.rotate.y = dragStartAngleY + angleYMove;
}

function onMouseupDrag() {
  window.removeEventListener( 'mousemove', onMousemoveDrag );
  window.removeEventListener( 'mouseup', onMouseupDrag );
}

