// -------------------------- demo -------------------------- //

var illoElem = document.querySelector('.illo');
var w = 48;
var h = 48;
var minWindowSize = Math.min( window.innerWidth, window.innerHeight );
var zoom = Math.floor( minWindowSize / w );
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
  addTo: illo,
  diameter: 13,
  translate: { y: -16 },
  rotate: { x: -TAU/4 },
  color: garnet,
  backface: eggplant,
  stroke: false,
});
var cone = new Zdog.Cone({
  addTo: illo,
  diameter: 13,
  length: 6.5,
  translate: { y: 16 },
  rotate: { x: TAU/4 },
  color: garnet,
  backface: eggplant,
  stroke: false,
});

var colorWheel = [ eggplant, garnet, orange, gold, yellow, ];

[ true, false ].forEach( function( isHemi ) {
  var shape = isHemi ? hemi : cone;

  for ( var i=0; i < 5; i++ ) {
    var rotor1 = new Zdog.Anchor({
      addTo: illo,
      rotate: { y: TAU/5 * i },
    });
    var rotor2 = new Zdog.Anchor({
      addTo: rotor1,
      rotate: { x: TAU/6 },
    });

    shape.copy({
      addTo: rotor2,
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

var ticker = 0;
var cycleCount = 180;
var turnLimit = keyframes.length - 1;

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
  var progress = ticker / cycleCount;
  var tween = Zdog.easeInOut( progress % 1, 3 );
  var turn = Math.floor( progress % turnLimit );
  var keyA = keyframes[ turn ];
  var keyB = keyframes[ turn + 1 ];
  var thetaX = Zdog.lerp( keyA.x, keyB.x, tween );
  illo.rotate.x = Math.cos( thetaX ) * TAU/12;
  illo.rotate.y = Zdog.lerp( keyA.y, keyB.y, tween ) ;
  ticker++;
}
