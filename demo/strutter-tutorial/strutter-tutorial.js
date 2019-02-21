// -------------------------- demo -------------------------- //

var isRotating = true;
// colors
var gold = '#EA0';
var garnet = '#C25';
var eggplant = '#636';
var TAU = Zdog.TAU;

var illo = new Zdog.Illustration({
  element: '.illo',
  zoom: 5,
  rotate: { y: -TAU/8 },
  dragRotate: true,
  onDragStart: function() {
    isRotating = false;
  },
});

// ----- model ----- //

var hipX = 3;

var hips = new Zdog.Shape({
  addTo: illo,
  path: [ { x: -hipX }, { x: hipX } ],
  translate: { y: 2 },
  color: eggplant,
  stroke: 4,
});

var rightLeg = new Zdog.Shape({
  addTo: hips,
  path: [ { y: 0 }, { y: 12 } ],
  translate: { x: -hipX },
  rotate: { x: TAU/4 },
  color: eggplant,
  stroke: 4,
});
// foot
var foot = new Zdog.RoundedRect({
  addTo: rightLeg,
  width: 2,
  height: 4,
  cornerRadius: 1,
  translate: { y: 14, z: 2 },
  rotate: { x: TAU/4 },
  color: garnet,
  fill: true,
  stroke: 4,
});

var plantAngle = -TAU/8;
var leftLeg = rightLeg.copy({
  translate: { x: hipX },
  rotate: { x: plantAngle },
  color: eggplant,
});

foot.copy({
  addTo: leftLeg,
  rotate: { x: TAU/4 - plantAngle }
});

var spine = new Zdog.Anchor({
  addTo: hips,
  rotate: { x: TAU/8 },
});

// chest
var chest = new Zdog.Shape({
  addTo: spine,
  path: [ { x: -1.5 }, { x:  1.5 } ],
  translate: { y: -6.5 },
  color: garnet,
  stroke: 9,
});

var head = new Zdog.Shape({
  addTo: chest,
  stroke: 12,
  translate: { y: -9.5 },
  color: gold,
});

var eye = new Zdog.Ellipse({
  addTo: head,
  diameter: 2,
  quarters: 2,
  translate: { x: -2, y: 1, z: 4.5 },
  rotate: { z: -TAU/4 },
  color: eggplant,
  stroke: 0.5,
  backface: false,
});
eye.copy({
  translate: { x: 2, y: 1, z: 4.5 },
});
// smile
new Zdog.Ellipse({
  addTo: head,
  diameter: 3,
  quarters: 2,
  translate: { y: 2.5, z: 4.5 },
  rotate: { z: TAU/4 },
  closed: true,
  color: '#FED',
  stroke: 0.5,
  fill: true,
  backface: false,
});

var armSize = 6;

// right arm
var upperArm = new Zdog.Shape({
  addTo: chest,
  path: [ { y: 0 }, { y: armSize } ],
  translate: { x: -5, y: -2 },
  rotate: { x: -TAU/4 },
  color: eggplant,
  stroke: 4,
});

var forearm = new Zdog.Shape({
  addTo: upperArm,
  path: [ { y: 0 }, { y: armSize-2 } ],
  translate: { y: armSize },
  rotate: { x: TAU/8 },
  color: garnet,
  stroke: 4,
});

// hand
new Zdog.Shape({
  addTo: forearm,
  translate: { z: 1, y: armSize },
  stroke: 6,
  color: gold,
});

// left arm
upperArm.copyGraph({
  translate: { x: 5, y: -2 },
  rotate: { x: TAU/4 },
});

// -- animate --- //

var t = 0;

function animate() {
  if ( isRotating ) {
    illo.rotate.y = Zdog.easeInOut( t, 4 ) * TAU - TAU/8;
    t += 1/150;
  }
  illo.updateRenderGraph();
  requestAnimationFrame( animate );
}

animate();
