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
var t = 0;
var cycleFrame = 360;
// colors
var yellow = '#ED0';
var gold = '#EA0';
var orange = '#E62';
var magenta = '#C25';
// var navy = '#249';
var beige = '#FEC';
var blue = '#8AD';


var colorWheel = [ beige, magenta, orange, blue, yellow ];

// -- illustration shapes --- //

var scene = new Anchor();

// -----  ----- //

// top & bottom
var cone = new Cone({
  radius: 4,
  height: 10,
  addTo: scene,
  translate: { y: -16 },
  // scale: { x: 2, y: 2 },
  rotate: { x: -TAU/4 },
  color: colorWheel[1],
  baseColor: colorWheel[0],
  stroke: false,
});
cone.copy({
  translate: { y: 16 },
  rotate: { x: TAU/4 },
});



[ -1, 1 ].forEach( function( ySide ) {
  for ( var i=0; i < 5; i++ ) {
    var rotor1 = new Anchor({
      addTo: scene,
      rotate: { y: TAU/5 * i },
    });
    var rotor2 = new Anchor({
      addTo: rotor1,
      rotate: { x: TAU/6 },
    });

    cone.copy({
      addTo: rotor2,
      translate: { y: 16*ySide },
      rotate: { x: TAU/4*ySide },
      color: colorWheel[i],
      baseColor: colorWheel[ (i+7) % 5 ],
    });
  }
});

[ -1, 1 ].forEach( function( ySide ) {
  for ( var i=0; i < 5; i++ ) {
    var rotor1 = new Anchor({
      addTo: scene,
      rotate: { y: TAU/5 * (i+0.5) },
    });
    var rotor2 = new Anchor({
      addTo: rotor1,
      rotate: { x: TAU/10 },
    });

    cone.copy({
      addTo: rotor2,
      translate: { y: -16*ySide },
      rotate: { x: TAU/4*ySide },
      color: colorWheel[ (i+3) % 5 ],
      baseColor: colorWheel[i],
    });
  }
});

[ -1, 1 ].forEach( function( ySide ) {
  for ( var i=0; i < 5; i++ ) {
    var rotor1 = new Anchor({
      addTo: scene,
      rotate: { y: TAU/5 * (i+0.5) },
    });
    var rotor2 = new Anchor({
      addTo: rotor1,
      rotate: { x: TAU/4.5 },
    });

    cone.copy({
      addTo: rotor2,
      translate: { y: -16*ySide },
      // scale: { y: -1 },
      rotate: { x: TAU/4*ySide },
      color: colorWheel[ (i+1) % 5 ],
      baseColor: colorWheel[ (i+4) % 5 ],
    });
  }
});


// -- animate --- //

function easeInOut( i ) {
  var isFirstHalf = i < 0.5;
  var i1 = isFirstHalf ? i : 1 - i;
  i1 = i1 / 0.5;
  // make easing steeper with more multiples
  var i2 = i1 * i1 * i1;
  i2 = i2 / 2;
  return isFirstHalf ? i2 : i2*-1 + 1;
}

function animate() {
  update();
  render();
  requestAnimationFrame( animate );
}

animate();

// -- update -- //

function update() {
  if ( isRotating ) {
    t += 1/cycleFrame;
    t = t % 1;
    var isFirstHalf = t < 0.5;
    var halfT = isFirstHalf ? t : t - 0.5;
    var doubleEaseT = easeInOut( halfT * 2 ) / 2;
    doubleEaseT += isFirstHalf ? 0 : 0.5;
    scene.rotate.y = doubleEaseT * TAU;
    scene.rotate.x = Math.cos( doubleEaseT * TAU ) * TAU/12;
  }

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
