// -------------------------- demo -------------------------- //

var canvas = document.querySelector('canvas');
var w = 360;
var h = 360;
var minWindowSize = Math.min( window.innerWidth, window.innerHeight - 40 );
var zoom = Math.min( 3, Math.floor( minWindowSize / (w/2) ) / 2 );
canvas.width = w * zoom;
canvas.height = h * zoom;

var illo = new Illo({
  canvas: canvas,
  scale: zoom,
});

// colors
var midnight = '#313';
var eggplant = '#525';
var magenta = '#936';
var amber = '#D65';
var gold = '#FA6';
var white = '#FFF';

var camera = new Anchor();

var layerSpace = 56;

// -- illustration shapes --- //

// background
var background = new Shape({
  translate: { z: layerSpace*-2 },
  rendering: false,
  addTo: camera,
});

var bgStripe = new Rect({
  width: 180,
  height: 44,
  addTo: background,
  translate: { y: -40, z: -24 },
  color: magenta,
  lineWidth: 12,
  fill: true,
});
// magenta circle
var bgCircle = new Ellipse({
  width: 96,
  height: 96,
  addTo: background,
  translate: { y: -16, z: -24 },
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
bgStripe.copy({
  height: 60,
  addTo: background,
  translate: { y: 32, z: 24 },
  color: gold,
});
// gold circle
bgCircle.copy({
  width: 32,
  height: 32,
  translate: { y: -16, z: 24 },
  color: gold,
});

// sun
new Shape({
  addTo: background,
  translate: { y: -16, z: 48 },
  lineWidth: 24,
  color: white,
});

// ----- midBackground ----- //

var midBackground = new Group({
  addTo: camera,
  translate: { z: layerSpace*-1 },
});

var midBGDot = new Shape({
  addTo: midBackground,
  translate: { x: -36, y: 18 },
  lineWidth: 24,
  color: amber,
});
midBGDot.copy({
  translate: { x: -24, y: 24 },
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

var midground = new Anchor({
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
  translate: { x: -86, y: -14, z: -8 },
});

tree( midgroundTree, {
  width: 16,
  height: 36,
  translate: { x: -70, y: -12, z: 14 },
});

tree( midgroundTree, {
  width: 10,
  height: 24,
  translate: { x: -60, y: -4 },
});

tree( midgroundTree, {
  width: 10,
  height: 24,
  translate: { x: -26, y: 12, z: -8 },
});

tree( midgroundTree, {
  width: 10,
  height: 24,
  translate: { x: -18, y: 18, z: 2 },
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
  translate: { x: 64, y: 40, z: 6 },
});
tree( midgroundTree, {
  width: 10,
  height: 24,
  translate: { x: 72, y: 44, z: -2 },
});

// ----- midForeground ----- //

var midForeground = new Anchor({
  addTo: camera,
  translate: { z: layerSpace },
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
      { x: -48, y: 72 },
    ]},
    { x: -64, y: 56 },
    { x: -96, y: 48 },
    { x: -96, y: 90 },
    { x: 18, y: 90 },
  ],
});

var midForeBall = new Shape({
  addTo: midForeground,
  translate: { x: -92, y: 18 },
  lineWidth: 20,
  color: eggplant,
});
midForeBall.copy({
  translate: { x: -104, y: 28 },
});
midForeBall.copy({
  translate: { x: -84, y: 28 },
  lineWidth: 24,
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
  translate: { x: -44, y: 46 },
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
  translate: { x: 10, y: 22, z: 2 },
});
tree( midForeTree, {
  width: 16,
  height: 36,
  translate: { x: 22, y: 18, z: -6 },
});

tree( midForeTree, {
  width: 16,
  height: 36,
  translate: { x: 76, y: -6, z: 12 },
});
tree( midForeTree, {
  width: 10,
  height: 24,
  translate: { x: 86, y: -4, z: -10 },
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
  translate: { z: layerSpace*2 },
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

var grassBlade = new Shape({
  path: [
    // semi-circle outside on left
    { x: 0, y: 1 },
    { arc: [
      { x: -1, y: 1 },
      { x: -1, y: 0 },
    ]},
    { arc: [
      { x: -1, y: -1 },
      { x:  0, y: -1 },
    ]},
    // shallow semi-circle back
    { arc: [
      { x: -0.5, y: -0.7 },
      { x: -0.5, y: 0 },
    ]},
    { arc: [
      { x: -0.5, y: 0.7 },
      { x: 0, y: 1 },
    ]},
  ],
  addTo: foregroundA,
  translate: { x: -20, y: 56 },
  scale: 8,
  rotate: { z: 0.6 },
  color: midnight,
  lineWidth: 1,
  fill: true,
  closed: false,
});
grassBlade.copy({
  translate: { x: -33, y: 50 },
  rotate: { z: TAU/2 + 0.2 },
});

grassBlade.copy({
  translate: { x: -62, y: 40 },
  rotate: { z: 0.8 },
  scale: 7,
});

grassBlade.copy({
  translate: { x: -64, y: 35 },
  rotate: { z: 0.4 },
  scale: 7,
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
  translate: { z: layerSpace*2 },
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

grassBlade.copy({
  addTo: foregroundB,
  scale: 12,
  translate: { x: 46, y: 54 },
  rotate: { z: 0 },
});
grassBlade.copy({
  addTo: foregroundB,
  scale: 10,
  translate: { x: 28, y: 58 },
  rotate: { z: TAU/2 - 0.4 },
});

// ----- particles ----- //

var particle = new Shape({
  addTo: camera,
  translate: { x: -70, y: -50, z: layerSpace*-0.25 },
  lineWidth: 4,
  color: gold,
});
particle.copy({
  translate: { x: 68, y: -28, z: layerSpace*0.5 },
});
particle.copy({
  translate: { x: -70, y: 2, z: layerSpace*0.75 },
  color: amber,
});
particle.copy({
  translate: { x: 74, y: 14, z: layerSpace*1.5 },
});
particle.copy({
  translate: { x: -24, y: 34, z: layerSpace*1.75 },
});
particle.copy({
  translate: { x: 34, y: 34, z: layerSpace*1.9 },
  color: amber,
});
particle.copy({
  translate: { x: 22, y: 40, z: layerSpace*2.2 },
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
  translate: { x: -84, y: -38, z: layerSpace*-1 },
  rotate: { y: -TAU*1/16 },
  scale: { x: 1/Math.cos(TAU*1/16) },
  lineWidth: 4,
  color: white,
  fill: true,
});

twoCloud.copy({
  translate: { x: -38, y: -22, z: layerSpace*-0.5 },
  rotate: { y: -TAU*1/8 },
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
  translate: { x: 72, y: -52, z: layerSpace*-1 },
  rotate: { y: TAU * 1/16 },
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
  translate: { x: -50, y: -50, z: layerSpace*-1.5 },
  color: gold,
  lineWidth: 2,
  fill: true,
});
starA.copy({
  rotate: { y: TAU/4 },
});

var starB = starA.copy({
  translate: { x: 42, y: -20, z: -layerSpace*0.5 },
});
starB.copy({
  rotate: { y: TAU/4 },
});

// ----- bird ----- //

new Shape({
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
  translate: { x: 18, y: -30, z: layerSpace*-1 },
  lineWidth: 3,
  color: midnight,
  closed: false,
});


// -- animate --- //

var isRotating = true;
var t = 0;
var tSpeed = 1/240;

illo.enableDragRotate( camera, function() {
  isRotating = false;
});

function animate() {
  // update
  if ( isRotating ) {
    t += tSpeed;
    var theta = easeInOut( t ) * TAU;
    var delta = TAU * -3/64;
    camera.rotate.y = Math.sin( theta ) * delta;
    camera.rotate.x = ( Math.cos( theta ) * -0.5 + 0.5 ) * delta;
  }

  camera.updateGraph();

  illo.render( camera );
  requestAnimationFrame( animate );
}

animate();


// ----- inputs ----- //

document.querySelector('.reset-button').onclick = function() {
  isRotating = false;
  camera.rotate.set({ x: 0, y: 0 });
};
