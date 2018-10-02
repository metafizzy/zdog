// -------------------------- demo -------------------------- //

var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
var w = 88;
var h = 88;
var zoom = 5;
var canvasWidth = canvas.width =  w * zoom;
var canvasHeight = canvas.height = h * zoom;

// colors
var light = '#EA0';
var dark = '#246';

var camera = new Anchor();

var darkStroke = {
  addTo: camera,
  color: dark,
  stroke: true,
  fill: false,
  lineWidth: 2,
};

var lightFill = {
  addTo: camera,
  color: light,
  stroke: false,
  fill: true,
};

var allDark = {
  addTo: camera,
  color: dark,
  fill: true,
  lineWidth: 2,
};

// -- illustration shapes --- //

var bedSidePath = [
  { x: -32, y: -4 },
  { x:  -8, y: -4 },
  { x:  -8, y:  8 },
  { x: -32, y:  8 },
];

var darkStrokeSide = extend( {translate: { z: -12 }}, darkStroke );
var lightFillSide = extend( {translate: { z: -12 }}, lightFill );
var allDarkSide = extend( {translate: { z: 12 }}, allDark );

// sides, outer
[ lightFillSide, darkStrokeSide, allDarkSide ].forEach( function( sideOptions ) {

  // door
  new Shape( extend( {
    path: [
      { x:  -8, y: -14 },
      { x:  10, y: -14 },
      { x:  20, y:  -4 },
      { x:  20, y:   8 },
      { x:  -8, y:   8 },
    ],
  }, sideOptions ) );

  // bed side
  new Shape( extend( {
    path: bedSidePath,
  }, sideOptions ) );

  // front side
  new Shape( extend( {
    path: [
      { x: 20, y: -4 },
      { x: 32, y: -4 },
      { x: 32, y:  8 },
      { x: 20, y:  8 },
    ],
  }, sideOptions ) );

});

// inside bed
// side, dark
new Shape( extend( { 
  path: bedSidePath,
  translate: { z: -11 }
}, allDark ));
// side light
new Shape( extend( { 
  path: bedSidePath,
  translate: { z: 11 }
}, lightFill ));
new Shape( extend( { 
  path: bedSidePath,
  translate: { z: 11 }
}, darkStroke ));

// underside

// back underside
new Shape( extend( {
  path: [
    { x: -32, z: -12 },
    { x:  -8, z: -12 },
    { x:  -8, z:  12 },
    { x: -32, z:  12 },
  ],
  translate: { y: 8 },
}, allDark ) );
// door underside
new Shape( extend( {
  path: [
    { x: -8, z: -12 },
    { x: 20, z: -12 },
    { x: 20, z:  12 },
    { x: -8, z:  12 },
  ],
  translate: { y: 8 },
}, allDark ) );
// front underside
new Shape( extend( {
  path: [
    { x: 20, z: -12 },
    { x: 32, z: -12 },
    { x: 32, z:  12 },
    { x: 20, z:  12 },
  ],
  translate: { y: 8 },
}, allDark ) );

// roof
var roof = new Shape( extend( {
  path: [
    { x:  -8, z: -12 },
    { x:  10, z: -12 },
    { x:  10, z:  12 },
    { x:  -8, z:  12 },
  ],
  translate: { y: -14 },
}, lightFill ) );
roof.copy( darkStroke );

// windshield
new Shape( extend( {
  path: [
    { x: 10, y: -14, z: -12 },
    { x: 10, y: -14, z:  12 },
    { x: 20, y:  -4, z:  12 },
    { x: 20, y:  -4, z: -12 },
  ],
}, allDark ) );

// hood
var hood = new Shape( extend( {
  path: [
    { x: 20, z: -12 },
    { x: 32, z: -12 },
    { x: 32, z:  12 },
    { x: 20, z:  12 },
  ],
  translate: { y: -4 },
}, lightFill ) );
hood.copy( darkStroke );

// front
var front = new Rect( extend( {
  width: 24,
  height: 12,
  translate: { x: 32, y: 2 },
  rotate: { y: TAU/4 },
}, allDark ) );

var frontGroup = new Group({
  addTo: front,
  translate: { z: -1 }
});

// front details
var headlight = new Rect({
  width: 2,
  height: 2,
  addTo: frontGroup,
  translate: { x: -9, y: -3 },
  color: light,
  lineWidth: 2,
});
headlight.copy({
  translate: { x: 9, y: -3 },
});

// top line
var grillLine = new Shape({
  path: [
    { x: -4 },
    { x: 4 },
    // hack, add move point to fix z-sort
    { move: [ { z: -48 } ] },
  ],
  addTo: frontGroup,
  translate: { y: -4 },
  color: light,
  closed: false,
  lineWidth: 2,
});
grillLine.copy({
  translate: { y: 0 },
});
grillLine.copy({
  path: [
    { x: -10 },
    { x: 10 },
  ],
  translate: { y: 4 },
});

// tail
var tail = new Rect( extend({
  width: 24,
  height: 12,
  addTo: camera,
  translate: { x: -32, y: 2 },
  rotate: { y: -TAU/4 },
}, lightFill ));
tail.copy( darkStroke );
// tail inside
tail.copy({
  color: dark,
  translate: { x: -31, y: 2 },
});

var tailGroup = new Group({
  addTo: tail,
  translate: { z: 0 },
});

// back details
var backlight = new Rect({
  width: 4,
  height: 4,
  addTo: tailGroup,
  translate: { x: -10, y: -4 },
  color: dark,
  lineWidth: 2, 
  fill: true,
});
backlight.copy({
  translate: { x: 10, y: -4 },
});
// back bumper
new Shape({
  path: [
    { x: -11 },
    { x: 11 },
    { move: [{ z: -64 }] }, // 'nother hack
  ],
  addTo: tailGroup,
  translate: { y: 5, z: -1 },
  color: dark,
  lineWidth: 4,
  closed: false,
});

// cab back
var cabBackTop = new Shape({
  path: [
    { y: -14, z: -12 },
    { y:  -4, z: -12 },
    { y:  -4, z:  12 },
    { y: -14, z:  12 },
  ],
  addTo: camera,
  translate: { x: -8 },
  color: light,
  stroke: false,
  fill: true,
});
cabBackTop.copy({
  color: dark,
  fill: false,
  stroke: true,
  lineWidth: 2,
});

var cabBackBottom = new Shape({
  path: [
    { y: -4, z: -12 },
    { y:  8, z: -12 },
    { y:  8, z:  12 },
    { y: -4, z:  12 },
  ],
  addTo: camera,
  translate: { x: -8 },
  color: light,
  stroke: false,
  fill: true,
});
cabBackBottom.copy({
  color: dark,
  fill: false,
  stroke: true,
  lineWidth: 2,
});

// WHEELS

// front light
var lightFillWheel = new Shape( extend({
  path: [
    { x: 0, y: -6 },
    { arc: [ // top rig6t
      { x: 6, y: -6 },
      { x: 6, y: 0 },
    ]},
    { arc: [ // bottom rig6t
      { x: 6, y: 6 },
      { x: 0, y: 6 },
    ]},
    { arc: [ // bottom left
      { x: -6, y: 6 },
      { x: -6, y: 0 },
    ]},
    { arc: [ // bottom left
      { x: -6, y: -6 },
      { x: 0, y: -6 },
    ]},
    // hack, add a big move up to fix z-sort bug
    { move: [ { x: 0, y: -64, z: -64 } ] },
  ],
  closed: false,
  translate: { x: 18, y: 8, z: -14 },
}, lightFill ));
var darkStrokeWheel = lightFillWheel.copy({
  fill: false,
  stroke: true,
  lineWidth: 4,
  color: dark,
});
var darkWheel = new Ellipse({
  width: 12,
  height: 12,
  addTo: camera,
  translate: { x: 18, y: 8, z: -10 },
  color: dark,
  lineWidth: 4,
  fill: true,
});


// back light
lightFillWheel.copy({
  translate: { x: -18, y: 8, z: -14 }
});
darkStrokeWheel.copy({
  translate: { x: -18, y: 8, z: -14 }
});
darkWheel.copy({
  translate: { x: -18, y: 8, z: -10 },
});

// front dark
darkWheel.copy({
  translate: { x: 18, y: 8, z: 14 }
});
darkWheel.copy({
  translate: { x: 18, y: 8, z: 10 }
});

// back dark
darkWheel.copy({
  translate: { x: -18, y: 8, z: 14 }
});
darkWheel.copy({
  translate: { x: -18, y: 8, z: 10 }
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
  // normalize angle y
  camera.rotate.y = ( ( camera.rotate.y % TAU ) + TAU ) % TAU;

  camera.updateGraph();
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

  camera.renderGraph( ctx );

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
  camera.rotate.set({ x: -TAU/16, y: -TAU/8, z: 0 });
}
