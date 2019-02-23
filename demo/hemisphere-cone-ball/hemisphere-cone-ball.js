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
  var ySide = isHemi ? -1 : 1;
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

var t = 0;
var cycleFrame = 360;

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

  t += 1/cycleFrame;
  t = t % 1;
  var isFirstHalf = t < 0.5;
  var halfT = isFirstHalf ? t : t - 0.5;
  var doubleEaseT = Zdog.easeInOut( halfT*2 % 1, 3 ) / 2;
  doubleEaseT += isFirstHalf ? 0 : 0.5;
  illo.rotate.y = doubleEaseT * TAU;
  illo.rotate.x = Math.cos( doubleEaseT * TAU ) * TAU/12;
}
