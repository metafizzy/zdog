// -------------------------- demo -------------------------- //

var canvas = document.querySelector('canvas');
var w = 48;
var h = 48;
var minWindowSize = Math.min( window.innerWidth, window.innerHeight );
var zoom = Math.floor( minWindowSize / w );
canvas.width = w * zoom;
canvas.height = h * zoom;

var illo = new Illo({
  canvas: canvas,
  scale: zoom,
});

var tiltAngle = Math.asin(2/3);

var scene = new Anchor({
  scale: 4,
});

var prism = new Anchor({
  addTo: scene,
});

// -- illustration shapes --- //

var RT2 = Math.sqrt(2);
var capLength = 6/RT2;
var sideLength =  2 / Math.cos( tiltAngle );
var sideZ = sideLength/2;

var cap = new Rect({
  width: capLength,
  height: capLength,
  addTo: prism,
  translate: { z: -sideZ },
  lineWidth: 2,
  color: 'white',
});

cap.copy({
  translate: { z: sideZ },
});

var side = new Shape({
  addTo: prism,
  path: [ { z: -1 }, { z: 1 } ],
  scale: sideZ,
  translate: { x: capLength/2, y: capLength/2 },
  lineWidth: 2,
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

var isRotating = true;
var t = 0;
var tSpeed = 1/90;

illo.enableDragRotate( scene, function() {
  isRotating = false;
});

function animate() {
  // update
  if ( isRotating ) {
    var easeT = easeInOut( t, 3 );
    var turn = Math.floor( t );
    if ( turn === 0 ) {
      scene.rotate.z = lerp( TAU/8 * -3, TAU/8, easeT );
      scene.rotate.x = lerp( 0, tiltAngle, easeT );
    } else if ( turn == 1 ) {
      prism.rotate.x = lerp( -TAU/2, 0, easeT );
    }
    t += tSpeed;
  }

  scene.updateGraph();

  // render
  illo.render( scene );

  requestAnimationFrame( animate );
}

animate();


// ----- inputs ----- //

document.querySelector('.reset-button').onclick = reset;

function reset() {
  t = 0;
  scene.rotate.set({});
  prism.rotate.set({});
  isRotating = true;
}
