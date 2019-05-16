
// -------------------------- demo -------------------------- //

var illoElem = document.querySelector('.illo');
var w = 128;
var h = 128;
var minWindowSize = Math.min( window.innerWidth - 20 , window.innerHeight - 20 );
var zoom = Math.floor( (minWindowSize*2) / w ) / 2;
illoElem.setAttribute( 'width', w * zoom );
illoElem.setAttribute( 'height', h * zoom );
var isSpinning = true;
var TAU = Zdog.TAU;
var initRotate = { x: 20/360 * TAU, y: -50/360 * TAU };

var illo = new Zdog.Illustration({
  element: illoElem,
  zoom: zoom,
  rotate: initRotate,
  dragRotate: true,
  onDragStart: function() {
    isSpinning = false;
  },
});

var red = '#E62';
var gold = '#EA0';
var denim = '#636';

var depth = 20;
var lineWidth = 8;

// -- illustration shapes --- //

var bigGroup = new Zdog.Group({
  addTo: illo,
});

var backGroup = new Zdog.Group({
  addTo: bigGroup,
  updateSort: true,
});


// top
var topSide = new Zdog.Rect({
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

var endCap = new Zdog.Rect({
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

var underside = new Zdog.Rect({
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

var slope = new Zdog.Rect({
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
new Zdog.Ellipse({
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

var tongueAnchor = new Zdog.Anchor({
  addTo: backGroup,
  translate: { x: -6, y: -7 },
  rotate: {  y: TAU/4  },

});

var tongueH = 12;
var tongueS = 5;
var tongueTip  = tongueH + tongueS;

new Zdog.Shape({
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

var foreGroup = new Zdog.Group({
  addTo: bigGroup,
  updateSort: true,
});

var zFace = new Zdog.Shape({
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
var semiCircle = new Zdog.Ellipse({
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
var earGroup = new Zdog.Group({
  addTo: illo,
});

var ear = semiCircle.copy({
  addTo: earGroup,
  quarters: 2,
  scale: 24,
  rotate: { z: -TAU/16, x: TAU/16 },
  translate: { x: 10, y: -14, z: depth },
});

new Zdog.Shape({
  visible: false,
  addTo: ear,
  translate: { z: 0.5, x: -0.5 },
});

earGroup.copyGraph({
  scale: { z: -1 },
});

// -- animate --- //

var keyframes = [
  { y:   0 + initRotate.y, z:   0 },
  { y: TAU + initRotate.y, z:   0 },
  { y: TAU + initRotate.y, z: TAU },
];

var ticker = 0;
var cycleCount = 180;
var turnLimit = keyframes.length - 1;

function animate() {
  spin();
  illo.updateRenderGraph();
  requestAnimationFrame( animate );
}

function spin() {
  if ( !isSpinning ) {
    return;
  }
  var progress = ticker / cycleCount;
  var tween = Zdog.easeInOut( progress % 1, 4 );
  var turn = Math.floor( progress % turnLimit );
  var keyA = keyframes[ turn ];
  var keyB = keyframes[ turn + 1 ];
  illo.rotate.y = Zdog.lerp( keyA.y, keyB.y, tween );
  illo.rotate.z = Zdog.lerp( keyA.z, keyB.z, tween );
  ticker++;
}

animate();

