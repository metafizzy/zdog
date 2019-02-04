// -------------------------- demo -------------------------- //

var canvas = document.querySelector('canvas');
var w = 48;
var h = 48;
var minWindowSize = Math.min( window.innerWidth - 20 , window.innerHeight - 20 );
var zoom = Math.floor( minWindowSize / w );
// zoom = Math.min( zoom, 8 );
canvas.width = w * zoom;
canvas.height = h * zoom;
var isRotating = true;
// colors
var gold = '#EA0';
var orange = '#C25';
var eggplant = '#636';
var midnight = '#424';
var TAU = Zdog.TAU;

var illo = new Zdog.Illo({
  canvas: canvas,
  zoom: zoom,
  rotate: { y: -TAU/8 },
  translate: { y: 4 },
  dragRotate: true,
  onDragStart: function() {
    isRotating = false;
  },
});

// -- illustration shapes --- //

var hipX = 3;

new Zdog.Shape({
  addTo: illo,
  path: [ { x: -1 }, { x: 1 } ],
  scale: hipX,
  color: eggplant,
  stroke: 4,
});

var rightLeg = new Zdog.Shape({
  addTo: illo,
  path: [ { y: 0 }, { y: 12 } ],
  translate: { x: -hipX },
  rotate: { x: TAU/4 },
  color: eggplant,
  stroke: 4,
});
// foot
new Zdog.RoundedRect({
  addTo: rightLeg,
  width: 2,
  height: 4,
  radius: 1,
  translate: { y: 14, z: 2 },
  rotate: { x: TAU/4 },
  color: orange,
  fill: true,
  stroke: 4,
});

var plantAngle = -TAU/32 * 3;
var leftLeg = rightLeg.copyGraph({
  translate: { x: hipX },
  rotate: { x: plantAngle },
  color: midnight,
});

leftLeg.children[0].rotate.set({ x: TAU/4 - plantAngle });

// chest
new Zdog.Shape({
  addTo: illo,
  path: [ { x: -1 }, { x:  1 } ],
  scale: 1.5,
  translate: { y: -5.5, z: -3 },
  color: orange,
  stroke: 9,
  fill: true,
});

var armSize = 6;

[ true, false ].forEach( function( isRight ) {
  var xSide = isRight ? -1 : 1;

  var upperArm = new Zdog.Shape({
    addTo: illo,
    path: [ { x: 0 }, { x: armSize } ],
    scale: { x: xSide },
    translate: { x: 4.5 * xSide, y: -8, z: -4 },
    rotate: isRight ? { y: TAU/8, z: -TAU/16 } : { y: TAU/8  },
    color: eggplant,
    stroke: 4,
  });

  var forearm = new Zdog.Shape({
    addTo: upperArm,
    path: [ { x: 0 }, { x: armSize-2 } ],
    translate: { x: armSize },
    rotate: isRight ? { z: TAU/16 * 3, y: TAU/4 } : { z: -TAU/4, x: -TAU/32 * 2, y: TAU/8 },
    color: orange,
    stroke: 4,
  });
  // hand
  new Zdog.Shape({
    addTo: forearm,
    translate: { x: armSize, z: 1 },
    stroke: 6,
    color: gold,
  });

});

var head = new Zdog.Anchor({
  addTo: illo,
  translate: { y: -12, z: -10 },
  rotate: { x: TAU/8 },
});

// face
new Zdog.Hemisphere({
  addTo: head,
  diameter: 12,
  color: gold,
  baseColor: orange,
  rotate: { x: -TAU/4 },
  stroke: false,
});

var eye = new Zdog.Ellipse({
  addTo: head,
  diameter: 2,
  quarters: 2,
  translate: { x: -2, y: 1.5, z: 5 },
  rotate: { z: -TAU/4 },
  color: eggplant,
  stroke: 0.5,
  backface: false,
});
eye.copy({
  translate: { x: 2, y: 1.5, z: 5 },
  rotate: { z: -TAU/4 },
});
// smile
new Zdog.Ellipse({
  addTo: head,
  diameter: 3,
  quarters: 2,
  translate: { y: 3, z: 4.5 },
  rotate: { z: TAU/4 },
  closed: true,
  color: '#FED',
  stroke: 0.5,
  fill: true,
  backface: false,
});

new Zdog.Hemisphere({
  addTo: head,
  diameter: 12,
  color: orange,
  baseColor: gold,
  rotate: { x: TAU/4 },
  stroke: false,
});

var brim = new Zdog.Anchor({
  addTo: head,
  scale: 5.5,
  translate: { y: -0.5, z: 6 },
});

new Zdog.Shape({
  addTo: brim,
  path: [
    { x:  0, z: 0 },
    { arc: [
      { x: -1, z:  0 },
      { x: -1, z: -1 },
    ]},
    { x:  -1, z: 0 },
  ],
  color: eggplant,
  fill: true,
});

new Zdog.Shape({
  addTo: brim,
  path: [
    { x: -1, z:  0 },
    { arc: [
      { x: -1, z: 1 },
      { x:  0, z: 1 },
    ]},
    { x: 0, z:  0 },
  ],
  color: eggplant,
  fill: true,
});

brim.copyGraph({
  scale: brim.scale.copy().multiply({ x: -1 }),
});


// -- animate --- //

var t = 0;

function animate() {
  if ( isRotating ) {
    illo.rotate.y = Zdog.easeInOut( t, 4 ) * TAU - TAU/8;
    t += 1/150;
  }
  illo.updateGraph();
  illo.renderGraph();
  requestAnimationFrame( animate );
}

animate();

