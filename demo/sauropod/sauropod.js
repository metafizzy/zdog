// -------------------------- demo -------------------------- //

var illoElem = document.querySelector('.illo');
var w = 104;
var h = 104;
var minWindowSize = Math.min( window.innerWidth, window.innerHeight );
var zoom = Math.min( 5, Math.floor( minWindowSize / w ) );
illoElem.setAttribute( 'width', w * zoom );
illoElem.setAttribute( 'height', h * zoom );
var isSpinning = true;
var TAU = Zdog.TAU;
// ratio to make things look square when rotated a quarter
var antiTwist = 1 / Math.cos( TAU/8 );
// colors
var blue = '#19F';

var initialRotate = { y: TAU/8 };

var illo = new Zdog.Illustration({
  element: illoElem,
  zoom: zoom,
  scale: { x: antiTwist, z: antiTwist },
  rotate: initialRotate,
  dragRotate: true,
  onDragStart: function() {
    isSpinning = false;
  },
});

// -- illustration shapes --- //

// front right leg
var leg = new Zdog.Shape({
  path: [
    { x: -8, y: 0 },
    { arc: [
      { x: 0, y: 0 },
      { x: 0, y: 8 }
    ]},
    { arc: [
      { z: 0, y: 0 },
      { z: -8, y: 0 }
    ]},
    { move: { y: -4 } },
    { line: { y: 12 } },
  ],
  addTo: illo,
  translate: { x: 16, y: 16, z: 8 },
  stroke: 8,
  color: blue,
  closed: false,
});
// front left leg
leg.copy({
  translate: { x: 16, y: 16, z: -8 },
  rotate: { y: -TAU/4 },
});
// back right leg
leg.copy({
  translate: { x: -16, y: 16, z: 8 },
  rotate: { y: TAU/4 },
});
// back left leg
leg.copy({
  translate: { x: -16, y: 16, z: -8 },
  rotate: { y: -TAU/2 },
});


// leg connectors
var legConnector = new Zdog.Shape({
  path: [ { x: -8 }, { x: 8 } ],
  addTo: illo,
  translate: { y: 16, z: 8 },
  stroke: 8,
  color: blue,
  closed: false,
});
legConnector.copy({
  translate: { y: 16, z: -8 },
});

// body
new Zdog.Shape({
  path: [
    { x: -1, z:  1 },
    { x:  1, z:  1 },
    { x:  1, z: -1 },
    { x: -1, z: -1 },
  ],
  // fudge these numbers
  scale: { x: 14.25, z: -3.75 },
  addTo: illo,
  translate: { y: 10 },
  stroke: 20,
  color: blue,
});

// neck squiggle
new Zdog.Shape({
  path: [
    { x: 16, y: 4 },
    { arc: [
      { x: 24, y: 4 },
      { x: 24, y: -4 }
    ]},
    { arc: [
      { x: 24, y: -12 },
      { x: 16, y: -12 }
    ]},
    { x: -16, y: -12 },
    { arc: [
      { x: -24, y: -12 },
      { x: -24, y: -20 }
    ]},
    { arc: [
      { x: -24, y: -28 },
      { x: -16, y: -28 }
    ]},
    { x: 24, y: -28 },
  ],
  addTo: illo,
  stroke: 8,
  color: blue,
  closed: false,
});

// neck 
new Zdog.Shape({
  path: [
    { x: -16, y: -28 },
    { x: 24, y: -28 },
  ],
  addTo: illo,
  stroke: 8,
  color: blue,
  closed: false,
});

// head ball
var head = new Zdog.Shape({
  translate: { x: 16, y: -31 },
  addTo: illo,
  stroke: 14,
  color: blue,
});

// eyes
var eye = new Zdog.Shape({
  addTo: head,
  translate: { z: -1, x: 0 },
  color: 'white',
  stroke: 4,
  fill: true,
  closed: false,
});
eye.copy({
  translate: { z: 1, x: 0 },
});

// tail
new Zdog.Shape({
  path: [
    { x: -16, z: 0 },
    { arc: [
      { x: -24, z: 0 },
      { x: -24, z: -8 },
    ]},
    { arc: [
      { x: -24, z: -16 },
      { x: -16, z: -16 },
    ]},
    { x: -12, z: -16 },
    { arc: [
      { x: -6, z: -16 },
      { x: -6, z: -22 },
    ]},
    { arc: [
      { x: -6, z: -28 },
      { x: -12, z: -28 },
    ]},
    { x: -18, z: -28 },
  ],
  addTo: illo,
  translate: { y: 4 },
  // rotate: { x: -0.25 },
  color: blue,
  stroke: 8,
  closed: false,
});

// -- animate --- //

var t = 0;

function animate() {
  // update
  if ( isSpinning ) {
    var easeT = Zdog.easeInOut( t % 1, 3 );
    illo.rotate.y = easeT*-TAU + TAU/8;
    illo.rotate.x = ( Math.cos( easeT * TAU ) * 0.5 + -0.5 ) * TAU/12;
    t += 1/210;
  }
  illo.updateRenderGraph();
  requestAnimationFrame( animate );
}

animate();

// ----- inputs ----- //

document.querySelector('.reset-button').onclick = function() {
  illo.rotate.set( initialRotate );
  isSpinning = false;
};

document.querySelector('.rotate-button').onclick = function() {
  isSpinning = true;
  t = 0;
};

