/* globals Shifter */

// -------------------------- demo -------------------------- //

var canvas = document.querySelector('canvas');
var w = 10;
var h = 10;
var minWindowSize = Math.min( window.innerWidth, window.innerHeight - 40 );
var zoom = Math.floor( minWindowSize / w );
canvas.width = w * zoom;
canvas.height = h * zoom;

var illo = new Zdog.Illustration({
  canvas: canvas,
  zoom: zoom,
  dragRotate: true,
});

// -- illustration shapes --- //

var shifterA = new Shifter({
  addTo: illo,
  translate: { x: -3 },
});
var shifterB = new Shifter({
  addTo: illo,
});
var shifterC = new Shifter({
  addTo: illo,
  translate: { x: 3 },
});

// -- animate --- //

var t = 0;
var tSpeed = 1/80;

function animate() {
  // update
  shifterA.update( t + 4 );
  shifterB.update( t + 2 );
  shifterC.update( t + 0 );

  t += tSpeed;

  illo.updateRenderGraph();
  requestAnimationFrame( animate );
}

animate();

