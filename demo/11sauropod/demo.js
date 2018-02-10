/* jshint browser: true, devel: true, unused: true, undef: true */
/* globals Shape */

var TAU = Math.PI * 2;
var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
var w = 104;
var h = 104;
var zoom = 4;
var canvasWidth = canvas.width =  w * zoom;
var canvasHeight = canvas.height = h * zoom;
// ratio to make things look square when rotated a quarter
var antiTwist = 1 / Math.cos( TAU/8 );
// var antiTwist = 1;

// colors
var blue = '#19F';

var camera = new Shape({
  rendering: false,
});

// -- illustration shapes --- //

// front right leg
var leg = new Shape({
  path: [
    { x: -8*antiTwist, y: 0 },
    { arc: [
      { x: 0, y: 0 },
      { x: 0, y: 8 }
    ]},
    { arc: [
      { z: 0, y: 0 },
      { z: 8*antiTwist, y: 0 }
    ]},
    { move: [ { y: -4 } ] },
    { line: [ { y: 12 } ] },
  ],
  addTo: camera,
  translate: { x: 16*antiTwist, y: 16, z: -8*antiTwist },
  lineWidth: 8,
  color: blue,
  closed: false,
});
// front left leg
leg.copy({
  translate: { x: 16*antiTwist, y: 16, z: 8*antiTwist },
  rotate: { y: TAU/4 },
});
// back right leg
leg.copy({
  translate: { x: -16*antiTwist, y: 16, z: -8*antiTwist },
  rotate: { y: -TAU/4 },
});
// back left leg
leg.copy({
  translate: { x: -16*antiTwist, y: 16, z: 8*antiTwist },
  rotate: { y: TAU/2 },
});


// leg connectors
var legConnector = new Shape({
  path: [ { x: -8*antiTwist }, { x: 8*antiTwist } ],
  addTo: camera,
  translate: { y: 16, z: -8*antiTwist },
  lineWidth: 8,
  color: blue,
  closed: false,
});
legConnector.copy({
  translate: { y: 16, z: 8*antiTwist },
});

// body
var bodyZ = ( ( 8*antiTwist + 4 ) - 10 );
// var bodyX = ( ( 16*antiTwist + 4 ) - 10 );
// fudge it
var bodyX = 20.5;
new Shape({
  path: [
    { x: -bodyX, z: -bodyZ },
    { x:  bodyX, z: -bodyZ },
    { x:  bodyX, z:  bodyZ },
    { x: -bodyX, z:  bodyZ },
  ],
  addTo: camera,
  translate: { y: 10 },
  lineWidth: 20,
  color: blue,
});

// neck squiggle
new Shape({
  path: [
    { x: 16*antiTwist, y: 4 },
    { arc: [
      { x: 24*antiTwist, y: 4 },
      { x: 24*antiTwist, y: -4 }
    ]},
    { arc: [
      { x: 24*antiTwist, y: -12 },
      { x: 16*antiTwist, y: -12 }
    ]},
    { x: -16*antiTwist, y: -12 },
    { arc: [
      { x: -24*antiTwist, y: -12 },
      { x: -24*antiTwist, y: -20 }
    ]},
    { arc: [
      { x: -24*antiTwist, y: -28 },
      { x: -16*antiTwist, y: -28 }
    ]},
    { x: 24*antiTwist, y: -28 },
  ],
  addTo: camera,
  lineWidth: 8,
  color: blue,
  closed: false,
});

// neck 
new Shape({
  path: [
    { x: -16*antiTwist, y: -28 },
    { x: 24*antiTwist, y: -28 },
  ],
  addTo: camera,
  lineWidth: 8,
  color: blue,
  closed: false,
});

// head ball
var head = new Shape({
  path: [ {} ],
  translate: { x: 16*antiTwist, y: -31 },
  addTo: camera,
  lineWidth: 14,
  color: blue,
});

// eyes
var eye = new Shape({
  addTo: head,
  translate: { z: 1, x: 0 },
  color: 'white',
  lineWidth: 4,
  fill: true,
  closed: false,
});
eye.copy({
  translate: { z: -1, x: 0 },
});

// tail
new Shape({
  path: [
    { x: -22, z: 0 },
    { arc: [
      { x: -34, z: 0 },
      { x: -34, z: 12 },
    ]},
    { arc: [
      { x: -34, z: 24 },
      { x: -22, z: 24 },
    ]},
    { x: -14, z: 24 },
    { arc: [
      { x: -6, z: 24 },
      { x: -6, z: 32 },
    ]},
    { arc: [
      { x: -6, z: 40 },
      { x: -14, z: 40 },
    ]},
    { x: -26, z: 40 },
  ],
  addTo: camera,
  translate: { y: 4 },
  // rotate: { x: -0.25 },
  color: blue,
  lineWidth: 8,
  closed: false,
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
  // normalize angle y
  camera.rotate.y = ( ( camera.rotate.y % TAU ) + TAU ) % TAU;

  // sort
  shapes.forEach( function updateEachSortValue( shape ) {
    shape.updateSortValue();
  });
  // perspective sort
  shapes.sort( function sortBySortValue( a, b ) {
    return b.sortValue - a.sortValue;
  });
}

// -- render -- //
ctx.lineCap = 'round';
ctx.lineJoin = 'round';

viewQuarterTwist();

function render() {
  ctx.clearRect( 0, 0, canvasWidth, canvasHeight );
  ctx.save();
  ctx.scale( zoom, zoom );
  ctx.translate( w/2, h/2 );

  shapes.forEach( eachShapeRender );

  ctx.restore();
}

function eachShapeRender( shape ) {
  shape.render( ctx );
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
  var angleXMove = dy / ( zoom * 100 ) * TAU;
  var angleYMove = dx / ( zoom * 100 ) * TAU;
  camera.rotate.x = dragStartAngleX + angleXMove;
  camera.rotate.y = dragStartAngleY + angleYMove;
}

function onMouseupDrag() {
  window.removeEventListener( 'mousemove', onMousemoveDrag );
  window.removeEventListener( 'mouseup', onMouseupDrag );
}

document.querySelector('.quarter-twist-button').onclick = viewQuarterTwist;


function viewQuarterTwist() {
  camera.rotate.x = 0;
  camera.rotate.z = 0;
  camera.rotate.y = -TAU/8;
}