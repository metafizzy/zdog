// -------------------------- demo -------------------------- //

var illoElem = document.querySelector('.illo');
var w = 48;
var h = 48;
var minWindowSize = Math.min( window.innerWidth - 20 , window.innerHeight - 20 );
var zoom = Math.floor( minWindowSize / w );
illoElem.setAttribute( 'width', w * zoom );
illoElem.setAttribute( 'height', h * zoom );
var isSpinning = true;
var TAU = Zdog.TAU;

var illo = new Zdog.Illustration({
  element: illoElem,
  zoom: zoom,
  rotate: { x: -TAU/8 },
  dragRotate: true,
  onDragStart: function() {
    isSpinning = false;
  },
});

// -- illustration shapes --- //

var teeth = 8;
var frontZ = { z: 3 };
var backZ = { z: -3 };

var colorA = '#EA0';
var colorB = '#345';

var gearPath = ( function() {
  var path = [];
  var teethCount = teeth * 4;
  for ( var i=0; i < teethCount; i++ ) {
    var isOuter = i % 4 < 2;
    var radius = isOuter ? 12 : 9.5;
    var theta = Math.ceil( i/2 ) * 2;
    theta += i % 2 ? -0.2 : 0.2;
    theta = ( theta/teethCount + 1/teethCount ) * TAU ;
    path.push({
      x: Math.cos( theta ) * radius,
      y: Math.sin( theta ) * radius,
    });
  }
  return path;
})();

var gear = new Zdog.Anchor({
  addTo: illo,
  rotate: { x: TAU/4 },
});

var gearSide = new Zdog.Anchor({
  addTo: gear,
  translate: frontZ,
});
// gear face
new Zdog.Shape({
  addTo: gearSide,
  path: gearPath,
  color: colorA,
  backface: false,
  fill: true,
  stroke: 1/zoom,
  closed: false,
  // visible: false,
});
// nub
new Zdog.Cylinder({
  addTo: gearSide,
  diameter: 6,
  length: 2,
  color: colorB,
  backface: 'white',
  translate: { z: 1 },
  fill: true,
  stroke: false,
});

gearSide.copyGraph({
  rotate: { y: TAU/2 },
  translate: backZ,
});

gearPath.forEach( function( corner, i ) {
  var nextCorner = gearPath[ i + 1 ] || gearPath[0];
  new Zdog.Shape({
    addTo: gear,
    path: [
      new Zdog.Vector( corner ).add( frontZ ),
      new Zdog.Vector( corner ).add( backZ ),
      new Zdog.Vector( nextCorner ).add( backZ ),
      new Zdog.Vector( nextCorner ).add( frontZ ),
    ],
    color: i % 2 ? colorA : colorB,
    fill: true,
    stroke: 1/zoom,
  });
});

// -- animate --- //

function animate() {
  illo.rotate.y += isSpinning ? +TAU/240 : 0;
  illo.updateRenderGraph();
  requestAnimationFrame( animate );
}

animate();

