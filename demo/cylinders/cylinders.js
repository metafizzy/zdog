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
var magenta = '#C25';
var navy = '#249';

// -- illustration shapes --- //

var y = 12;

var cylinder = new Zdog.Cylinder({
  diameter: 10,
  length: 5,
  addTo: illo,
  translate: { y: -y },
  rotate: { x: -TAU/4 },
  // rotate: { x: -TAU/8 },
  color: magenta,
  backface: navy,
  stroke: false,
});
cylinder.copy({
  addTo: illo,
  translate: { y: y },
  rotate: { x: TAU/4 },
  color: magenta,
  backface: navy,
});

var colorWheel = [ navy, magenta, orange, gold, yellow, ];

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

    cylinder.copy({
      addTo: rotor2,
      translate: { y: y*ySide },
      rotate: { x: TAU/4*ySide },
      color: colorWheel[i],
      backface: colorWheel[ (i+7) % 5 ],
    });
  }
});

new Zdog.Shape({
  visible: false,
  addTo: illo,
  stroke: 18,
  // color: '#FED',
  color: 'hsla(50, 50%, 90%, 0.8)',
});

// -- animate --- //

var keyframes = [
  { x: TAU * 0,   y: TAU * 0 },
  { x: TAU * 1/2, y: TAU * 1/2 },
  { x: TAU * 1,   y: TAU * 1 },
];

var t = 0;

function animate() {
  spin();
  illo.updateRenderGraph();
  requestAnimationFrame( animate );
}

animate();

// -- update -- //

function spin() {
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

