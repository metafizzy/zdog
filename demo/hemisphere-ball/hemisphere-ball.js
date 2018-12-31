// -------------------------- demo -------------------------- //

var canvas = document.querySelector('canvas');
var w = 48;
var h = 48;
var minWindowSize = Math.min( window.innerWidth, window.innerHeight );
var zoom = Math.min( 10, Math.floor( minWindowSize / w ) );
canvas.width = w * zoom;
canvas.height = h * zoom;

var illo = new Illo({
  canvas: canvas,
  scale: zoom,
});

// colors
var yellow = '#ED0';
var gold = '#EA0';
var orange = '#E62';
var magenta = '#C25';
var navy = '#249';

// -- illustration shapes --- //

var scene = new Anchor();

// -----  ----- //


var hemi = new Hemisphere({
  radius: 6.5,
  addTo: scene,
  translate: { y: -16 },
  rotate: { x: -TAU/4 },
  color: magenta,
  baseColor: navy,
  stroke: false,
});
hemi.copy({
  translate: { y: 16 },
  rotate: { x: TAU/4 },
  color: magenta,
  baseColor: navy,
});

var colorWheel = [ navy, magenta, orange, gold, yellow, ];

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

    hemi.copy({
      addTo: rotor2,
      translate: { y: 16*ySide },
      rotate: { x: TAU/4*ySide },
      color: colorWheel[i],
      baseColor: colorWheel[ (i+7) % 5 ],
    });
  }
});

// -- animate --- //

var isRotating = true;
var t = 0;
var cycleFrame = 360;

illo.enableDragRotate( scene, function() {
  isRotating = false;
});

function animate() {
  rotate();
  scene.updateGraph();
  illo.render( scene );
  requestAnimationFrame( animate );
}

animate();

// -- update -- //

function rotate() {
  if ( !isRotating ) {
    return;
  }

  t += 1/cycleFrame;
  t = t % 1;
  var isFirstHalf = t < 0.5;
  var halfT = isFirstHalf ? t : t - 0.5;
  var doubleEaseT = easeInOut( halfT * 2, 3 ) / 2;
  doubleEaseT += isFirstHalf ? 0 : 0.5;
  scene.rotate.y = doubleEaseT * TAU;
  scene.rotate.x = Math.cos( doubleEaseT * TAU ) * TAU/12;
}
