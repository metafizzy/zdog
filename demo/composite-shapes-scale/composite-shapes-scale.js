// -------------------------- demo -------------------------- //

var canvas = document.querySelector('canvas');
var w = 48;
var h = 48;
var minWindowSize = Math.min( window.innerWidth, window.innerHeight );
var zoom = Math.min( 8, Math.floor( minWindowSize / w ) );
canvas.width = w * zoom;
canvas.height = h * zoom;

var isRotating = true;

var illo = new Illo({
  canvas: canvas,
  zoom: zoom,
  scale: 2,
  dragRotate: true,
  onDragStart: function() {
    isRotating = false;
  },
});

// -- illustration shapes --- //

new Rect({
  width: 10,
  height: 10,
  addTo: illo,
  translate: { z: -10 },
  lineWidth: 2,
  color: '#E21',
});

/*
new Ellipse({
  diameter: 16,
  addTo: illo,
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
  addTo: illo,
  lineWidth: 2,
  fill: true,
  color: '#EA0',
});
*/

new Hemisphere({
  diameter: 4,
  scale: 2,
  addTo: illo,
  translate: { x: 8 },
  color: '#EA0',
  baseColor: '#456',
  stroke: false,
});

new Cylinder({
  diameter: 4,
  length: 4,
  scale: 2,
  addTo: illo,
  translate: { x: 0 },
  color: '#C25',
  baseColor: '#E62',
  stroke: false,
});

new Cone({
  diameter: 4,
  length: 3,
  scale: 2,
  addTo: illo,
  translate: { x: -8 },
  color: '#456',
  baseColor: '#EA0',
  stroke: false,
});

// -- animate --- //

function animate() {
  illo.rotate.y += isRotating ? +TAU/150 : 0;
  illo.updateGraph();
  illo.renderGraph();
  requestAnimationFrame( animate );
}

animate();

// -- update -- //
