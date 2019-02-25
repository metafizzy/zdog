// -------------------------- demo -------------------------- //

var illoElem = document.querySelector('.illo');
var w = 48;
var h = 48;
var minWindowSize = Math.min( window.innerWidth, window.innerHeight );
var zoom = Math.min( 10, Math.floor( minWindowSize / w ) );
illoElem.setAttribute( 'width', w * zoom );
illoElem.setAttribute( 'height', h * zoom );

var isSpinning = true;
var TAU = Zdog.TAU;

var illo = new Zdog.Illustration({
  element: illoElem,
  zoom: zoom,
  dragRotate: true,
  onDragStart: function() {
    isSpinning = false;
  },
});

// colors
var yellow = '#ED0';
var gold = '#EA0';
var orange = '#E62';
var garnet = '#C25';
var eggplant = '#636';

// -- illustration shapes --- //

var hemi = new Zdog.Hemisphere({
  diameter: 13,
  addTo: illo,
  translate: { y: -16 },
  rotate: { x: -TAU/4 },
  color: garnet,
  backface: eggplant,
  stroke: false,
});
hemi.copy({
  translate: { y: 16 },
  rotate: { x: TAU/4 },
  color: garnet,
  backface: eggplant,
});

var colorWheel = [ eggplant, garnet, orange, gold, yellow, ];

[ -1, 1 ].forEach( function( ySide ) {
  for ( var i=0; i < 5; i++ ) {
    var rotor1 = new Zdog.Anchor({
      addTo: illo,
      rotate: { y: TAU/5 * i },
    });
    var rotor2 = new Zdog.Anchor({
      addTo: rotor1,
      rotate: { x: TAU/6 },
    });

    hemi.copy({
      addTo: rotor2,
      translate: { y: 16*ySide },
      rotate: { x: TAU/4*ySide },
      color: colorWheel[i],
      backface: colorWheel[ (i+7) % 5 ],
    });
  }
});

// -- animate --- //

var keyframes = [
  { x: TAU * 0,   y: TAU * 0 },
  { x: TAU * 1/2, y: TAU * 1/2 },
  { x: TAU * 1,   y: TAU * 1 },
];

var t = 0;

function animate() {
  rotate();
  illo.updateRenderGraph();
  requestAnimationFrame( animate );
}

animate();

// -- update -- //

function rotate() {
  if ( !isSpinning ) {
    return;
  }
  var easeT = Zdog.easeInOut( t % 1, 3 );
  var turnLimit = keyframes.length - 1;
  var turn = Math.floor( t % turnLimit );
  var keyA = keyframes[ turn ];
  var keyB = keyframes[ turn + 1 ];
  var thetaX = Zdog.lerp( keyA.x, keyB.x, easeT );
  illo.rotate.x = Math.cos( thetaX ) * TAU/12;
  illo.rotate.y = Zdog.lerp( keyA.y, keyB.y, easeT ) ;
  t += 1/180;
}
