/* globals Shifter */

// -------------------------- demo -------------------------- //

var canvas = document.querySelector('canvas');
var w = 10;
var h = 10;
var minWindowSize = Math.min( window.innerWidth, window.innerHeight - 40 );
var zoom = Math.floor( minWindowSize / w );
canvas.width = w * zoom;
canvas.height = h * zoom;

var illo = new Illo({
  canvas: canvas,
  prerender: function( ctx ) {
    ctx.scale( zoom, zoom );
  },
});

var scene = new Anchor();

illo.enableDragRotate( scene );

// -- illustration shapes --- //


var shifterA = new Shifter({
  addTo: scene,
  translate: { x: -3 },
});
var shifterB = new Shifter({
  addTo: scene,
});
var shifterC = new Shifter({
  addTo: scene,
  translate: { x: 3 },
});

// var shifterD = new Shifter({
//   addTo: scene,
//   translate: { x: -3, y: -3 },
// });
// var shifterE = new Shifter({
//   addTo: scene,
//   translate: { x: 0, y: -3 },
// });
// var shifterF = new Shifter({
//   addTo: scene,
//   translate: { x: 3, y: -3 },
// });
//
// var shifterG = new Shifter({
//   addTo: scene,
//   translate: { x: -3, y: 3 },
// });
// var shifterH = new Shifter({
//   addTo: scene,
//   translate: { x: 0, y: 3 },
// });
// var shifterI = new Shifter({
//   addTo: scene,
//   translate: { x: 3, y: 3 },
// });


// -- animate --- //

var t = 0;
var tSpeed = 1/80;

function animate() {
  // update
  shifterA.update( t + 4 );
  shifterB.update( t + 2 );
  shifterC.update( t + 0 );

  // shifterD.update( t + 6 );
  // shifterE.update( t + 4 );
  // shifterF.update( t + 2 );
  //
  // shifterG.update( t + 8 );
  // shifterH.update( t + 6 );
  // shifterI.update( t + 4 );

  t += tSpeed;

  scene.updateGraph();

  // render
  illo.render( scene );
  requestAnimationFrame( animate );
}

animate();

