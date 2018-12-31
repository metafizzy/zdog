// -------------------------- demo -------------------------- //

var canvas = document.querySelector('canvas');
var w = 96;
var h = 96;
var minWindowSize = Math.min( window.innerWidth - 20 , window.innerHeight - 20 );
var zoom = Math.floor( minWindowSize / w );
canvas.width = w * zoom;
canvas.height = h * zoom;

var illo = new Illo({
  canvas: canvas,
  scale: zoom,
});

var scene = new Anchor();

// -- illustration shapes --- //

new Rect({
  width: 20,
  height: 20,
  addTo: scene,
  translate: { z: -10 },
  lineWidth: 2,
  color: '#E21',
});

new Ellipse({
  width: 16,
  height: 16,
  addTo: scene,
  translate: { z: 10 },
  lineWidth: 4,
  color: '#19F',
});

new Shape({
  path: [
    { x:  0, z:  1 },
    { x: -1, z: -1 },
    { x:  1, z: -1 },
  ],
  scale: { x: 5, z: 5 },
  addTo: scene,
  lineWidth: 2,
  fill: true,
  color: '#EA0',
});

// -- animate --- //


var isRotating = true;

function animate() {
  // update
  scene.rotate.y += isRotating ? +TAU/150 : 0;
  scene.updateGraph();
  // render
  illo.render( scene );
  requestAnimationFrame( animate );
}

animate();

// ----- inputs ----- //

illo.enableDragRotate( scene, function() {
  isRotating = false;
});
