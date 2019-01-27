
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

var red = '#E62';
var gold = '#EA0';
var denim = '#636';

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
  stroke: lineWidth,
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
  stroke: lineWidth,
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
  stroke: lineWidth,
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
  stroke: lineWidth,
  fill: true,
  color: red,
});

slope.copy({
  translate: { x: 5, y: 0 },
  rotate: { x: -TAU/4, y: -slopeAngle },
});

// tail
new Ellipse({
  addTo: backGroup,
  diameter: 32,
  quarters: 1,
  closed: false,
  translate: { x: 22, y: -4 },
  rotate: { z: TAU/4 },
  color: red,
  stroke: lineWidth,
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
  stroke: 4,
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
  stroke: lineWidth,
  backface: false,
});

zFace.copy({
  scale: { x: -1 },
  translate: { z: -depth/2 },
  rotate: { y: TAU/2 },
});

// nose
var semiCircle = new Ellipse({
  addTo: backGroup,
  quarters: 2,
  scale: 8,
  translate: { x: -26, y: -20 },
  rotate: { y: TAU/4, z: TAU/4 },
  fill: true,
  stroke: 5,
  color: denim,
  closed: true,
  // backface: false,
});

// ears
// group & extra shape are hacks
var earGroup = new Group({
  addTo: illo,
});

var ear = semiCircle.copy({
  addTo: earGroup,
  quarters: 2,
  scale: 24,
  rotate: { z: -TAU/16, x: TAU/16 },
  translate: { x: 10, y: -14, z: depth },
});

new Shape({
  visible: false,
  addTo: ear,
  translate: { z: 0.5, x: -0.5 },
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

