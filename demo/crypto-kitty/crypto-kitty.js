// -------------------------- demo -------------------------- //

var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
var w = 64;
var h = 64;
var minWindowSize = Math.min( window.innerWidth, window.innerHeight );
var zoom = Math.min( 10, Math.floor( minWindowSize / w ) );
var pixelRatio = window.devicePixelRatio || 1;
zoom *= pixelRatio;
var canvasWidth = canvas.width = w * zoom;
var canvasHeight = canvas.height = h * zoom;
// set canvas screen size
if ( pixelRatio > 1 ) {
  canvas.style.width = canvasWidth / pixelRatio + 'px';
  canvas.style.height = canvasHeight / pixelRatio + 'px';
}

var isRotating = true;
// colors
var magenta = '#F49';
var midnight = '#103';
var white = 'white';


// -- illustration shapes --- //

var scene = new Anchor({
  rotate: { x: -TAU/32 },
});

var cat = new Group({
  addTo: scene,
  updateSort: true,
});

// body
new Shape({
  path: [ { y: -1 }, { y: 1} ],
  scale: { y: 3 },
  addTo: cat, 
  lineWidth: 14,
  color: magenta,
});

var face = new Anchor({
  addTo: cat,
  translate: { y: -4, z: 6.5 },
});

// nose
new Shape({
  path: [
    { x: -1 },
    { x: 1 },
    { y: 1 },
  ],
  scale: { x: 0.25, y: 0.25 },
  addTo: face,
  translate: { z: 1.5 },
  lineWidth: 1,
  color: midnight,
});

// tummy
new RoundedRect({
  width: 5,
  height: 7,
  radius: 2.5,
  addTo: cat,
  translate: { y: 3.5, z: 5 },
  // rotate: { x: TAU/64 },
  color: white,
  lineWidth: 3,
  fill: true,
});

// chin
new Shape({
  path: [ { x: -1 }, { x: 1 } ],
  scale: { x: 2 },
  addTo: cat,
  translate: { y: -3, z: 4 },
  lineWidth: 4,
  color: magenta,
});

// tail
new Shape({
  path: [ { y: 0 }, { y: 8 } ],
  addTo: cat,
  translate: { y: 7, z: -4 },
  rotate: { x: -TAU/32 },
  lineWidth: 1,
  color: magenta,
});

var backLine = new Shape({
  path: [ { x: -1 }, { x: 1 } ],
  scale: { x: 3 },
  addTo: cat,
  translate: { y: 0, z: -6.5 },
  lineWidth: 0.5,
  color: '#F7A',
});
backLine.copy({
  translate: { y: -3, z: -6.5 },
});
backLine.copy({
  translate: { y: 3, z: -6.5 },
});

[ -1, 1 ].forEach( function( xSide ) {
  // eye
  new Shape({
    path: [ { y: -1 }, { y: 1} ],
    scale: { y: 0.3 },
    addTo: face,
    translate: { x: 0.75*xSide, y: -1.5 },
    lineWidth: 0.8,
    color: midnight,
  });

  // maw
  new Shape({
    path: [ { x: -1 }, { x: 1} ],
    scale: { x: 0.4 },
    addTo: face,
    translate: { x: 1*xSide, y: 0.5, z: 0.5 },
    lineWidth: 1.5,
    color: white,
  });

  // whisker
  var whisker = new Shape({
    path: [
      { x: 0, y: 0 },
      { x: 1, y: 1 },
    ],
    scale: { x: xSide*3, y: 0.75 },
    addTo: face,
    translate: { x: 2.5*xSide, y: 0.5 },
    color: white,
    lineWidth: 0.25,
  });
  whisker.copy({
    scale: { x: xSide*3, y: -0.75 },
  });

  // ear
  new Shape({
    path: [
      { x: 0, y:  0 },
      { x: 1, y:  1 },
      { x: 1, y: -1 },
    ],
    scale: { x: 2*xSide, y: 1.5 },
    addTo: cat,
    translate: { x: 2*xSide, y: -8 },
    color: magenta,
    lineWidth: 3,
    fill: true,
  });

  // arm
  var arm = new Shape({
    path: [ { y: 0 }, { y: 3.5 } ],
    addTo: cat,
    translate: { x: 3.5*xSide, y: -1, z: 5.5 },
    rotate: { x: TAU/16 },
    lineWidth: 3,
    color: magenta,
  });

  // leg
  arm.copy({
    translate: { x: 3.5*xSide, y: 8, z: 2 },
    rotate: {},
  });
});

var diamondPanel = new Shape({
  path: [
    { x: 0, y: 1, z: -0 },
    { x: -1, y: 0, z: 1 },
    { x:  1, y: 0, z: 1 },
  ],
  scale: { x: 12, y: 30, z: -12 },
  addTo: scene,
  stroke: false,
  fill: true,
  color: 'hsla(60, 100%, 50%, 0.1)',
});
diamondPanel.copy({
  rotate: { y: TAU/4*1 },
  color: 'hsla(60, 100%, 50%, 0.2)',
});
diamondPanel.copy({
  rotate: { y: TAU/4*2 },
  color: 'hsla(60, 100%, 50%, 0.3)',
});
diamondPanel.copy({
  rotate: { y: TAU/4*3 },
  color: 'hsla(60, 100%, 50%, 0.4)',
});
diamondPanel.copy({
  scale: { x: 12, y: -30, z: -12 },
  rotate: { y: TAU/4*0 },
  color: 'hsla(60, 100%, 50%, 0.4)',
});
diamondPanel.copy({
  scale: { x: 12, y: -30, z: -12 },
  rotate: { y: TAU/4*1 },
  color: 'hsla(60, 100%, 50%, 0.3)',
});
diamondPanel.copy({
  scale: { x: 12, y: -30, z: -12 },
  rotate: { y: TAU/4*2 },
  color: 'hsla(60, 100%, 50%, 0.2)',
});
diamondPanel.copy({
  scale: { x: 12, y: -30, z: -12 },
  rotate: { y: TAU/4*3 },
  color: 'hsla(60, 100%, 50%, 0.1)',
});

// cat.copyGraph({
//   translate: { x: 10, y: -10 },
// });

// -- animate --- //

function animate() {
  update();
  render();
  requestAnimationFrame( animate );
}

animate();

// -- update -- //

function update() {
  scene.rotate.y += isRotating ? -TAU/150 : 0;

  scene.updateGraph();
}

// -- render -- //

ctx.lineCap = 'round';
ctx.lineJoin = 'round';

function render() {
  ctx.clearRect( 0, 0, canvasWidth, canvasHeight );

  ctx.save();
  ctx.scale( zoom, zoom );
  ctx.translate( w/2, h/2 );

  scene.renderGraph( ctx );

  ctx.restore();
}

// ----- inputs ----- //

// click drag to rotate
var dragStartAngleX, dragStartAngleY;

new Dragger({
  startElement: canvas,
  onPointerDown: function() {
    isRotating = false;
    dragStartAngleX = scene.rotate.x;
    dragStartAngleY = scene.rotate.y;
  },
  onPointerMove: function( pointer, moveX, moveY ) {
    var angleXMove = moveY / canvasWidth * TAU;
    var angleYMove = moveX / canvasWidth * TAU;
    scene.rotate.x = dragStartAngleX + angleXMove;
    scene.rotate.y = dragStartAngleY + angleYMove;
  },
});
