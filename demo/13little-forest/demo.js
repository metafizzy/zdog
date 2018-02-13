/* jshint browser: true, devel: true, unused: true, undef: true */
/* globals Shape, Ellipse, Rect, Group, extend, TAU */

var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
var w = 360;
var h = 360;
var zoom = 2;
var canvasWidth = canvas.width =  w * zoom;
var canvasHeight = canvas.height = h * zoom;

// colors
var midnight = '#313';
var eggplant = '#525';
var magenta = '#936';
var amber = '#D65';
var gold = '#FA6';
var white = '#FFF';

var camera = new Shape({
  rendering: false,
});

var layerSpace = 56;

// -- illustration shapes --- //

// background
var background = new Shape({
  translate: { z: layerSpace*2 },
  rendering: false,
  addTo: camera,
});

var bgStripe = new Rect({
  width: 192,
  height: 44,
  addTo: background,
  translate: { y: -40, z: 24 },
  color: magenta,
  lineWidth: 12,
  fill: true,
});
// magenta circle
var bgCircle = new Ellipse({
  width: 96,
  height: 96,
  addTo: background,
  translate: { y: -16, z: 24 },
  color: magenta,
  lineWidth: 24,
  fill: true,
});

// amber stripe
bgStripe.copy({
  translate: { y: -8 },
  color: amber,
});
// amber circle
bgCircle.copy({
  width: 64,
  height: 64,
  translate: { y: -16, },
  color: amber,
});

// gold bg stripe
new Rect({
  width: 192,
  height: 60,
  addTo: background,
  translate: { y: 32, z: -24 },
  color: gold,
  lineWidth: 12,
  fill: true,
});
// gold circle
bgCircle.copy({
  width: 32,
  height: 32,
  translate: { y: -16, z: -24 },
  color: gold,
});

// sun
new Shape({
  addTo: background,
  translate: { y: -16, z: -48 },
  lineWidth: 24,
  color: white,
});

// ----- midBackground ----- //

var midBackground = new Group({
  addTo: camera,
  translate: { z: layerSpace*1 },
});

var midBGDot = new Shape({
  addTo: midBackground,
  translate: { x: -36, y: 16 },
  lineWidth: 24,
  color: amber,
});
midBGDot.copy({
  translate: { x: -6, y: 26 },
});
midBGDot.copy({
  translate: { x: 12, y: 16 },
});
midBGDot.copy({
  translate: { x: 28, y: 12 },
});
midBGDot.copy({
  translate: { x: 48, y: 20 },
});

var midBGBigDot = midBGDot.copy({
  lineWidth: 48,
  translate: { x: -52, y: 40 },
});
midBGBigDot.copy({
  translate: { x: 20, y: 40 },
});
midBGBigDot.copy({
  lineWidth: 40,
  translate: { x: 56, y: 40 },
});
midBGBigDot.copy({
  lineWidth: 40,
  translate: { x: -16, y: 48 },
});

// ----- midground ----- //

var midground = new Shape({
  rendering: false,
  addTo: camera,
});

var midgroundGroundA = new Shape({
  path: [
    { x: -96, y: 10 },
    { x: -86, y: 10 },
    { arc: [
      { x: -60, y: 42 },
      { x: -26, y: 42 },
    ]},
    { x: -26, y: 74 },
    { x: -96, y: 74 },
  ],
  addTo: midground,
  color: magenta,
  lineWidth: 48,
  fill: true,
});
midgroundGroundA.copy({
  path: [
    { x: -26, y: 42 },
    { arc: [
      { x: -8, y: 74 },
      { x: 36, y: 74 },
    ]},
    { x: 96, y: 74 },
    { x: -26, y: 74 },
  ],
});

function tree( groupOptions, options ) {
  options = extend( options, groupOptions );
  var treeW = options.width/2;
  var treeH = options.height/2;

  var pointA = { x: 0, y: -treeH };
  var pointB = { x: treeW, y: treeH };
  var pointC = { x: -treeW, y: treeH };

  var treeOptions = extend({
    path: [
      pointA,
      { bezier: [
        pointA,
        { x: treeW, y: treeH*1/3 },
        pointB,
      ]},
      pointC,
      { bezier: [
        { x: -treeW, y: treeH*1/3 },
        pointA,
        pointA,
      ]},
    ],
    fill: true,
  }, options );

  var treePlane = new Shape( treeOptions );
  treePlane.copy({
    rotate: { y: TAU/4 },
  });

}

var midgroundTree = {
  addTo: midground,
  color: magenta,
  lineWidth: 2,
};

tree( midgroundTree, {
  width: 10,
  height: 24,
  translate: { x: -86, y: -14, z: 8 },
});

tree( midgroundTree, {
  width: 16,
  height: 36,
  translate: { x: -70, y: -12, z: -14 },
});

tree( midgroundTree, {
  width: 10,
  height: 24,
  translate: { x: -60, y: -4 },
});

tree( midgroundTree, {
  width: 10,
  height: 24,
  translate: { x: -26, y: 12, z: 8 },
});

tree( midgroundTree, {
  width: 10,
  height: 24,
  translate: { x: -18, y: 18, z: -2 },
});

var lonelyTranslate = { x: 32, y: 24 };

tree( midgroundTree, {
  width: 16,
  height: 36,
  translate: lonelyTranslate,
});
// lonely tree stump
new Shape({
  path: [
    { y: 18 },
    { y: 28 },
  ],
  addTo: midground,
  translate: lonelyTranslate,
  color: magenta,
  lineWidth: 4,
});


tree( midgroundTree, {
  width: 10,
  height: 24,
  translate: { x: 64, y: 40, z: -6 },
});
tree( midgroundTree, {
  width: 10,
  height: 24,
  translate: { x: 72, y: 44, z: 2 },
});

// ----- midForeground ----- //

var midForeground = new Shape({
  rendering: false,
  addTo: camera,
  translate: { z: -layerSpace },
});

// midForeground ground part A
var midForegroundGround = new Shape({
  path: [
    { x: 96, y: 26 },
    { x: 72, y: 26 },
    { arc: [
      { x: 56, y: 50 },
      { x: 18, y: 50 },
    ]},
    { x: 18, y: 90 },
    { x: 96, y: 90 },
  ],
  addTo: midForeground,
  color: eggplant,
  lineWidth: 48,
  fill: true,
});
midForegroundGround.copy({
  path: [
    { x: 18, y: 50 },
    { arc: [
      { x: -16, y: 90 },
      { x: -48, y: 90 },
    ]},
    { x: -64, y: 90 },
    { x: -96, y: 64 },
    { x: -96, y: 90 },
    { x: 18, y: 90 },
  ],
});

var midForeBall = new Shape({
  addTo: midForeground,
  translate: { x: -96, y: 16 },
  lineWidth: 18,
  color: eggplant,
});
midForeBall.copy({
  translate: { x: -84, y: 22 },
});
midForeBall.copy({
  translate: { x: -74, y: 20 },
});
midForeBall.copy({
  translate: { x: -60, y: 28 },
});
midForeBall.copy({
  translate: { x: -50, y: 36 },
});
midForeBall.copy({
  translate: { x: -42, y: 46 },
});

var midForeTree = {
  addTo: midForeground,
  color: eggplant,
  lineWidth: 2,
};

tree( midForeTree, {
  width: 10,
  height: 24,
  translate: { x: -12, y: 42 },
});
tree( midForeTree, {
  width: 10,
  height: 24,
  translate: { x: 10, y: 22, z: -2 },
});
tree( midForeTree, {
  width: 16,
  height: 36,
  translate: { x: 22, y: 18, z: 6 },
});

tree( midForeTree, {
  width: 16,
  height: 36,
  translate: { x: 76, y: -6, z: -12 },
});
tree( midForeTree, {
  width: 10,
  height: 24,
  translate: { x: 86, y: -4, z: 10 },
});

// ----- foregroundA ----- //

var foregroundA = new Shape({
  path: [
    { x: -96, y: 52 },
    { x: -84, y: 52 },
    { arc: [
      { x: -72, y: 72 },
      { x: -44, y: 72 },
    ]},
    { arc: [
      { x: -32, y: 90 },
      { x: 0, y: 90 },
    ]},
    { x: -96, y: 90 },
  ],
  addTo: camera,
  translate: { z: -layerSpace*1.9 },
  color: midnight,
  lineWidth: 48,
  fill: true,
});

var foregroundTree = {
  color: midnight,
  lineWidth: 2,
};

tree( foregroundTree, {
  addTo: foregroundA,
  width: 18,
  height: 44,
  translate: { x: -80, y: 18 },
});

var foreTree1Translate = { x: -44, y: 14 };
tree( foregroundTree, {
  addTo: foregroundA,
  width: 18,
  height: 44,
  translate: { x: -44, y: 14 },
});
// trunk
new Shape({
  path: [
    { y: 22 },
    { y: 38 },
  ],
  addTo: foregroundA,
  translate: foreTree1Translate,
  lineWidth: 6,
  color: midnight,
});

tree( foregroundTree, {
  addTo: foregroundA,
  width: 16,
  height: 36,
  translate: { x: -2, y: 64 },
});

// ----- foregroundB ----- //

var foregroundB = new Shape({
  path: [
    { x: 96, y: 52 },
    { arc: [
      { x: 80, y: 72 },
      { x: 56, y: 72 },
    ]},
    { arc: [
      { x: 40, y: 90 },
      { x: 8, y: 90 },
    ]},
    { x: 0, y: 90 },
    { x: 96, y: 90 },
  ],
  addTo: camera,
  translate: { z: -layerSpace*2.2 },
  color: midnight,
  lineWidth: 48,
  fill: true,
});

tree( foregroundTree, {
  addTo: foregroundB,
  width: 16,
  height: 36,
  translate: { x: 10, y: 54 },
});

// big tree
var bigTreeTranslate = { x: 58, y: 2 };
tree( foregroundTree, {
  addTo: foregroundB,
  width: 20,
  height: 64,
  translate: bigTreeTranslate,
});
// big tree trunk
new Shape({
  path: [
    { y: 32 },
    { y: 48 },
  ],
  addTo: foregroundB,
  translate: bigTreeTranslate,
  lineWidth: 6,
  color: midnight,
});

tree( foregroundTree, {
  addTo: foregroundB,
  width: 16,
  height: 36,
  translate: { x: 86, y: 26 },
});

// ----- particles ----- //

var particle = new Shape({
  addTo: camera,
  translate: { x: -70, y: -50, z: layerSpace*0.25 },
  lineWidth: 4,
  color: gold,
});
particle.copy({
  translate: { x: 68, y: -28, z: layerSpace*-0.5 },
});
particle.copy({
  translate: { x: -70, y: 2, z: layerSpace*-0.75 },
  color: amber,
});
particle.copy({
  translate: { x: 74, y: 14, z: layerSpace*-1.5 },
});
particle.copy({
  translate: { x: -24, y: 34, z: layerSpace*-1.75 },
});
particle.copy({
  translate: { x: 34, y: 34, z: layerSpace*-1.9 },
  color: amber,
});
particle.copy({
  translate: { x: 22, y: 40, z: layerSpace*-2.2 },
});

// ----- clouds ----- //

var twoCloud = new Shape({
  path: [
    { x: -20, y: 0 },
    { bezier: [
      { x: -13, y: 0 },
      { x: -12, y: -4 },
      { x: -10, y: -4 },
    ]},
    { bezier: [
      { x: -8, y: -4 },
      { x: -8, y: -2 },
      { x: -4, y: -2 },
    ]},
    { bezier: [
      { x: 0, y: -2 },
      { x: 1, y: -6 },
      { x: 4, y: -6 },
    ]},
    { bezier: [
      { x: 7, y: -6 },
      { x: 6, y: 0 },
      { x: 20, y: 0 },
    ]},
  ],
  addTo: camera,
  translate: { x: -84, y: -38, z: layerSpace*1 },
  rotate: { y: TAU*1/16 },
  scale: { x: 1/Math.cos(TAU*1/16) },
  lineWidth: 4,
  color: white,
  fill: true,
});

twoCloud.copy({
  translate: { x: -38, y: -22, z: layerSpace*0.5 },
  rotate: { y: TAU*1/8 },
  scale: { x: 1/Math.cos(TAU*1/8) * -1 },
});

// triple cloud
new Shape({
  path: [
    { x: -32, y: 0 },
    { x: -28, y: 0 },
    { bezier: [
      { x: -22, y: 0 },
      { x: -20, y: -6 },
      { x: -16, y: -6 },
    ]},
    { bezier: [
      { x: -12, y: -6 },
      { x: -12, y: -2 },
      { x: -8, y: -2 },
    ]},
    { bezier: [
      { x: -4, y: -2 },
      { x: -4, y: -6 },
      { x: 0, y: -6 },
    ]},
    { bezier: [
      { x: 4, y: -6 },
      { x: 4, y: -2 },
      { x: 8, y: -2 },
    ]},
    { bezier: [
      { x: 12, y: -2 },
      { x: 12, y: -6 },
      { x: 16, y: -6 },
    ]},
    { bezier: [
      { x: 20, y: -6 },
      { x: 22, y: 0 },
      { x: 28, y: 0 },
    ]},
    { x: 32, y: 0 },
  ],
  addTo: camera,
  translate: { x: 72, y: -52, z: layerSpace*1 },
  rotate: { y: TAU * -1/16 },
  scale: { x: 1/Math.cos(TAU * -1/16) },
  lineWidth: 4,
  color: white,
  fill: true,
});

// ----- stars ----- //

var starA = new Shape({
  path: [
    { x: 0, y: -4 },
    { arc: [
      { x: 0, y: 0 },
      { x: 4, y: 0 },
    ]},
    { arc: [
      { x: 0, y: 0 },
      { x: 0, y: 4 },
    ]},
    { arc: [
      { x: 0, y: 0 },
      { x: -4, y: 0 },
    ]},
    { arc: [
      { x: 0, y: 0 },
      { x: 0, y: -4 },
    ]},
  ],
  addTo: camera,
  translate: { x: -50, y: -50, z: layerSpace*1.5 },
  color: gold,
  lineWidth: 2,
  fill: true,
});
starA.copy({
  rotate: { y: TAU/4 },
});

var starB = starA.copy({
  translate: { x: 42, y: -20, z: layerSpace*0.5 },
});
starB.copy({
  rotate: { y: TAU/4 },
});

// ----- bird ----- //

var bird = new Shape({
  path: [
    { x: -6, y: -4 },
    { x: -4, y: -4 },
    { arc: [
      { x: 0, y: -4 },
      { x: 0, y: 0 },
    ]},
    { arc: [
      { x: 0, y: -4 },
      { x: 4, y: -4 },
    ]},
    { x: 6, y: -4 },
    { move: [{ z: -2, y: 0 }] },
    { z: 3, y: 0 },
  ],
  addTo: camera,
  translate: { x: 18, y: -30, z: layerSpace*1 },
  lineWidth: 3,
  color: midnight,
  closed: false,
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
  camera.update();
  // normalize angle y
  // camera.rotate.y = ( ( camera.rotate.y % TAU ) + TAU ) % TAU;

  // sort
  shapes.forEach( function( shape ) {
    shape.updateSortValue();
  });
  // perspective sort
  shapes.sort( function( a, b ) {
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
  var angleXMove = dy / canvasWidth * TAU;
  var angleYMove = dx / canvasHeight * TAU;
  camera.rotate.x = dragStartAngleX + angleXMove;
  camera.rotate.y = dragStartAngleY + angleYMove;
}

function onMouseupDrag() {
  window.removeEventListener( 'mousemove', onMousemoveDrag );
  window.removeEventListener( 'mouseup', onMouseupDrag );
}

