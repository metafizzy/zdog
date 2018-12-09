// -------------------------- demo -------------------------- //

var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
var w = 8;
var h = 8;
var minWindowSize = Math.min( window.innerWidth - 20, window.innerHeight - 40 );
var zoom = Math.floor( minWindowSize / w );
var pixelRatio = window.devicePixelRatio || 1;
zoom *= pixelRatio;
var canvasWidth = canvas.width = w * zoom;
var canvasHeight = canvas.height = h * zoom;
// set canvas screen size
if ( pixelRatio > 1 ) {
  canvas.style.width = canvasWidth / pixelRatio + 'px';
  canvas.style.height = canvasHeight / pixelRatio + 'px';
}

var isRotating = false;



var navy = '#456';
var green = '#296';
var egg = '#FED';
var red = '#E21';
var ochre = '#F90';
var yellow = '#EC0';

document.body.style.backgroundColor = egg;

var scene = new Anchor({
  rotate: { x: -35/360 * TAU, y: 45/360 * TAU },
});

// -- illustration shapes --- //

function makePrism( options ) {
  var prism = new Anchor({
    addTo: scene,
    rotate: options.rotate,
  });

  var rotor = new Anchor({
    addTo: prism,
  });

  var positioner = new Anchor({
    addTo: rotor,
    translate: { z: 1, y: -1 },
  });

  var triangle = new Shape({
    addTo: positioner,
    path: [
      { z:  1, y:  1 },
      { z: -1, y: -1 },
      { z: -1, y:  1 },
    ],
    color: red,
    fill: true,
    stroke: false,
  });
  triangle.copy({
    translate: { x: -2 },
    color: green,
  });

  // slope
  new Shape({
    addTo: positioner,
    path: [
      { x: -2, y: 1, z: 1 },
      { x: -2, y: -1, z: -1 },
      { x:  0, y: -1, z: -1 },
      { x:  0, y:  1, z:  1 },
    ],
    color: yellow,
    fill: true,
    stroke: false,
  });

  var base = new Rect({
    addTo: positioner,
    width: 2,
    height: 2,
    translate: { x: -1, z: -1 },
    rotate: { y: TAU/2 },
    color: navy,
    fill: true,
    stroke: false,
    backfaceVisible: false,
  });
  base.copy({
    translate: { x: -1, y: 1 },
    rotate: { x: -TAU/4 },
    color: ochre,
  });

  return prism;
}

var prismA = makePrism({

});

var prismB = makePrism({
  rotate: { x: TAU/4, z: TAU/4 },
});

var prismC = makePrism({
  rotate: { y: -TAU/4, z: -TAU/4 },
});

// -- animate --- //

var t = 0;
var tSpeed = 1/80;

// -- update -- //

var transforms = {
  0: function( prism, easeT ) {
    prism.children[0].rotate.y = 0;
    prism.children[0].rotate.z = 0;
    prism.children[0].rotate.x = easeT;
  },
  1: function( prism, easeT ) {
    prism.children[0].rotate.y = -easeT;
  },
  2: function( prism, easeT ) {
    prism.children[0].rotate.y = -easeT - TAU/4;
  },
  3: function( prism, easeT ) {
    prism.children[0].rotate.z = -easeT;
  },
  4: function( prism, easeT ) {
    prism.children[0].rotate.z = -easeT - TAU/4;
  },
  5: function( prism, easeT ) {
    prism.children[0].rotate.x = easeT + TAU/4;
  },

};

function update() {
  var easeT = easeInOut( t ) * TAU/4;

  var turn = Math.floor( t % 6 );
  var transform = transforms[ turn ];

  transform( prismA, easeT );
  transform( prismB, easeT );
  transform( prismC, easeT );

  t += tSpeed;

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

function animate() {
  update();
  render();
  requestAnimationFrame( animate );
}

animate();

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

function easeInOut( i ) {
  i = i % 1;
  var isFirstHalf = i < 0.5;
  var i1 = isFirstHalf ? i : 1 - i;
  i1 = i1 / 0.5;
  // make easing steeper with more multiples
  var i2 = i1 * i1 * i1 * i1;
  i2 = i2 / 2;
  return isFirstHalf ? i2 : i2*-1 + 1;
}
