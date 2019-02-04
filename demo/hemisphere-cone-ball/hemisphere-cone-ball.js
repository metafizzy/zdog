// -------------------------- demo -------------------------- //

var canvas = document.querySelector('canvas');
var w = 48;
var h = 48;
var minWindowSize = Math.min( window.innerWidth, window.innerHeight );
var zoom = Math.min( 10, Math.floor( minWindowSize / w ) );
canvas.width = w * zoom;
canvas.height = h * zoom;

var isRotating = true;

var illo = new Illo({
  canvas: canvas,
  zoom: zoom,
  dragRotate: true,
  onDragStart: function() {
    isRotating = false;
  },
});

// colors
var yellow = '#ED0';
var gold = '#EA0';
var orange = '#E62';
var garnet = '#C25';
var eggplant = '#636';

// -- illustration shapes --- //

var hemi = new Hemisphere({
  addTo: illo,
  diameter: 13,
  translate: { y: -16 },
  rotate: { x: -TAU/4 },
  color: garnet,
  baseColor: eggplant,
  stroke: false,
});
var cone = new Cone({
  addTo: illo,
  diameter: 13,
  length: 6.5,
  translate: { y: 16 },
  rotate: { x: TAU/4 },
  color: garnet,
  baseColor: eggplant,
  stroke: false,
});

var colorWheel = [ eggplant, garnet, orange, gold, yellow, ];

[ true, false ].forEach( function( isHemi ) {
  var ySide = isHemi ? -1 : 1;
  var shape = isHemi ? hemi : cone;

  for ( var i=0; i < 5; i++ ) {
    var rotor1 = new Anchor({
      addTo: illo,
      rotate: { y: TAU/5 * i },
    });
    var rotor2 = new Anchor({
      addTo: rotor1,
      rotate: { x: TAU/6 },
    });

    shape.copy({
      addTo: rotor2,
      color: colorWheel[i],
      baseColor: colorWheel[ (i+7) % 5 ],
    });
  }
});

// -- animate --- //

var t = 0;
var cycleFrame = 360;

function animate() {
  rotate();
  illo.updateGraph();
  illo.renderGraph();
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
  illo.rotate.y = doubleEaseT * TAU;
  illo.rotate.x = Math.cos( doubleEaseT * TAU ) * TAU/12;
}
