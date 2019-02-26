// ------------------------- demo ------------------------- //

var zoom = 4;
var isSpinning = true;
var TAU = Zdog.TAU;

var illo = new Zdog.Illustration({
  element: 'canvas',
  zoom: zoom,
  resize: 'fullscreen',
  dragRotate: true,
  onDragStart: function() {
    isSpinning = false;
  },
  onResize: function( width, height ) {
    this.zoom = Math.min( width, height ) / 50;
  },
});

// ----- model ----- //

new Zdog.Rect({
  width: 20,
  height: 20,
  addTo: illo,
  translate: { z: -10 },
  stroke: 2,
  color: '#E21',
});

new Zdog.Ellipse({
  diameter: 16,
  addTo: illo,
  translate: { z: 10 },
  stroke: 4,
  color: '#19F',
});

new Zdog.Shape({
  path: [
    { x:  0, z:  1 },
    { x: -1, z: -1 },
    { x:  1, z: -1 },
  ],
  scale: { x: 5, z: 5 },
  addTo: illo,
  stroke: 2,
  fill: true,
  color: '#EA0',
});

new Zdog.Shape({
  translate: { x: 10, y: -5 },
  addTo: illo,
  stroke: 7,
  color: '#246',
});

// ----- animate ----- //

function animate() {
  illo.rotate.y += isSpinning ? +TAU/150 : 0;
  illo.updateRenderGraph();
  requestAnimationFrame( animate );
}

animate();

