
// -------------------------- demo -------------------------- //

var canvas = document.querySelector('canvas');
var w = 128;
var h = 128;
var minWindowSize = Math.min( window.innerWidth - 20 , window.innerHeight - 20 );
var zoom = Math.floor( (minWindowSize*2) / w ) / 2;
canvas.width = w * zoom;
canvas.height = h * zoom;
var isRotating = true;
var initRotate = { x: 20/360 * TAU, y: -50/360 * TAU };

var illo = new Illo({
  canvas: canvas,
  zoom: zoom,
  rotate: initRotate,
  dragRotate: true,
  onDragStart: function() {
    isRotating = false;
  },
});

var red = '#E21';
var gold = '#EA0';
var denim = '#345';

var depth = 20;
var lineWidth = 8;

// -- illustration shapes --- //

var bigGroup = new Group({
  addTo: illo,
});

var backGroup = new Group({
  addTo: bigGroup,
  updateSort: true,
});


// top
var topSide = new Rect({
  addTo: backGroup,
  width: 40,
  height: depth,
  translate: { y: -20 },
  rotate: { x: TAU/4 },
  fill: true,
  lineWidth: lineWidth,
  color: red,
});
topSide.copy({
  translate: { y: 20 },
  rotate: { x: -TAU/4 },
});

var endCap = new Rect({
  addTo: backGroup,
  width: depth,
  height: 8,
  translate: { x: -20, y: -16 },
  rotate: { y: TAU/4 },
  fill: true,
  color: red,
  lineWidth: lineWidth,
});
endCap.copy({
  translate: { x: -20,  y: 16 },
});
endCap.copy({
  translate: { x: 20,  y: -16 },
  rotate: { y: -TAU/4 },
});
endCap.copy({
  translate: { x: 20,  y: 16 },
  rotate: { y: -TAU/4 },
});

var underside = new Rect({
  addTo: backGroup,
  width: 30,
  height: depth,
  translate: { x: -5, y: -12 },
  rotate: { x: -TAU/4 },
  lineWidth: lineWidth,
  fill: true,
  color: red,
});
underside.copy({
  translate: { x: 5, y: 12 },
  rotate: { x: TAU/4 },
});

var slopeW = 30;
var slopeH = 22;
var slopeAngle = Math.atan( slopeH/slopeW );

var slope = new Rect({
  addTo: backGroup,
  width: Math.sqrt( slopeH*slopeH + slopeW*slopeW ),
  height: depth,
  translate: { x: -5 },
  rotate: { x: TAU/4, y: slopeAngle },
  lineWidth: lineWidth,
  fill: true,
  color: red,
});

slope.copy({
  translate: { x: 5, y: 0 },
  rotate: { x: -TAU/4, y: -slopeAngle },
});

// tail
new Shape({
  addTo: backGroup,
  path: [
    { x: 0, y: 0 },
    { arc: [
      { x: 1, y: 0 },
      { x: 1, y: -1 },
    ]},
  ],
  closed: false,
  scale: 16,
  translate: { x: 22, y: 12 },
  color: red,
  lineWidth: lineWidth,
});

// tongue

var tongueAnchor = new Anchor({
  addTo: backGroup,
  translate: { x: -6, y: -7 },
  rotate: {  y: TAU/4  },

});

var tongueH = 12;
var tongueS = 5;
var tongueTip  = tongueH + tongueS;

new Shape({
  addTo: tongueAnchor,
  path: [
    { x: -tongueS, y: 0 },
    { x:  tongueS, y: 0 },
    { x:  tongueS, y: tongueH },
    { arc: [
      { x: tongueS, y: tongueTip },
      { x: 0, y: tongueTip }
    ]},
    { arc: [
      { x: -tongueS, y: tongueTip },
      { x: -tongueS, y: tongueH }
    ]},
  ],
  rotate: { x: TAU/4 - Math.atan(16/22) },
  fill: true,
  stroke: true,
  lineWidth: 4,
  color: denim,

});

var foreGroup = new Group({
  addTo: bigGroup,
  updateSort: true,
});

var zFace = new Shape({
  addTo: foreGroup,
  path: [
    { x: -20, y: -20 },
    { x:  20, y: -20 },
    { x:  20, y: -10 },
    { x: -10, y:  12 },
    { x:  20, y:  12 },
    { x:  20, y:  20 },
    { x: -20, y:  20 },
    { x: -20, y:  10 },
    { x:  10, y: -12 },
    { x: -20, y: -12 },
  ],
  translate: { z: depth/2 },
  fill: true,
  color: gold,
  lineWidth: lineWidth,
  backface: false,
});

zFace.copy({
  scale: { x: -1 },
  translate: { z: -depth/2 },
  rotate: { y: TAU/2 },
});

// nose
var semicircle = new Shape({
  addTo: backGroup,
  path: [
    { x: -1, y: 0 },
    { arc: [
      { x: -1, y: 1 },
      { x:  0, y: 1 },
    ]},
    { arc: [
      { x:  1, y: 1 },
      { x:  1, y: 0 },
    ]},
  ],
  scale: 4,
  translate: { x: -26, y: -20 },
  rotate: { y: TAU/4 },
  fill: true,
  stroke: true,
  lineWidth: 5,
  color: denim,
  // backface: false,
});


// ears
// group & extra shape are hacks
var earGroup = new Group({
  addTo: illo,
});

var ear = semicircle.copy({
  addTo: earGroup,
  scale: 12,
  rotate: { z: -TAU * 5/16, x: TAU/16 },
  translate: { x: 10, y: -14, z: depth },
});

new Shape({
  rendering: false,
  addTo: ear,
  translate: { y: -1, z: 1 },
});

earGroup.copyGraph({
  scale: { z: -1 },
});

// -- animate --- //

var t = 0;
var tSpeed = 1/180;

function animate() {
  // update
  if ( isRotating ) {
    var turn = Math.floor( t % 2 );
    if ( turn == 0 ) {
      illo.rotate.y = easeInOut( t, 4 ) * TAU + initRotate.y;
    } else if ( turn == 1 ) {
      illo.rotate.z = easeInOut( t, 4 ) * TAU;
      // scene.rotate.x = easeInOut( t, 4 ) * TAU + initRotate.x;
    }
    t += tSpeed;
  }
  illo.updateGraph();
  // render
  illo.renderGraph();
  requestAnimationFrame( animate );
}

animate();

