// -------------------------- demo -------------------------- //

var canvas = document.querySelector('canvas');
var w = 64;
var h = 64;
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
// var gold = '#EA0';
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
