// -------------------------- demo -------------------------- //

var illoElem = document.querySelector('.illo');
var w = 48;
var h = 48;
var minWindowSize = Math.min( window.innerWidth, window.innerHeight );
var zoom = Math.floor( minWindowSize / w );
illoElem.setAttribute( 'width', w * zoom );
illoElem.setAttribute( 'height', h * zoom );

var TAU = Zdog.TAU;
var isRotating = true;

var illo = new Zdog.Illustration({
  element: illoElem,
  scale: 4,
  zoom: zoom,
  dragRotate: true,
  onDragStart: function() {
    isRotating = false;
  },
});

var tiltAngle = Math.asin(2/3);

var prism = new Zdog.Anchor({
  addTo: illo,
});

// -- illustration shapes --- //

var RT2 = Math.sqrt(2);
var capLength = 6/RT2;
var sideLength =  2 / Math.cos( tiltAngle );
var sideZ = sideLength/2;

var cap = new Zdog.Rect({
  width: capLength,
  height: capLength,
  addTo: prism,
  translate: { z: -sideZ },
  stroke: 2,
  color: 'white',
});

cap.copy({
  translate: { z: sideZ },
});

var side = new Zdog.Shape({
  addTo: prism,
  path: [ { z: -1 }, { z: 1 } ],
  scale: sideZ,
  translate: { x: capLength/2, y: capLength/2 },
  stroke: 2,
  color: 'white',
});
side.copy({
  translate: { x: -capLength/2, y: capLength/2 },
});
side.copy({
  translate: { x: -capLength/2, y: -capLength/2 },
});
side.copy({
  translate: { x:  capLength/2, y: -capLength/2 },
});

// -- animate --- //

var t = 0;
var tSpeed = 1/90;


function animate() {
  // update
  if ( isRotating ) {
    var easeT = Zdog.easeInOut( t % 1, 3 );
    var turn = Math.floor( t );
    if ( turn === 0 ) {
      illo.rotate.z = Zdog.lerp( TAU/8 * -3, TAU/8, easeT );
      illo.rotate.x = Zdog.lerp( 0, tiltAngle, easeT );
    } else if ( turn == 1 ) {
      illo.rotate.x = Zdog.lerp( -TAU/2, 0, easeT );
    }
    t += tSpeed;
  }

  illo.updateGraph();

  illo.renderGraph();
  requestAnimationFrame( animate );
}

animate();


// ----- inputs ----- //

document.querySelector('.reset-button').onclick = reset;

function reset() {
  t = 0;
  illo.rotate.set({});
  isRotating = true;
}
