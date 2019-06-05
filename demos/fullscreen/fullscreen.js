// ----- setup ----- //

var isSpinning = true;
var gold = '#EA0';
var orange = '#E62';
var garnet = '#C25';
var eggplant = '#636';

var illo = new Zdog.Illustration({
  element: '.illo',
  zoom: 4,
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
  color: garnet,
});

new Zdog.Ellipse({
  diameter: 16,
  addTo: illo,
  translate: { z: 10 },
  stroke: 4,
  color: eggplant,
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
  color: gold,
});

new Zdog.Shape({
  translate: { x: 10, y: -5 },
  addTo: illo,
  stroke: 7,
  color: orange,
});

// ----- animate ----- //

function animate() {
  illo.rotate.y += isSpinning ? 0.03 : 0;
  illo.updateRenderGraph();
  requestAnimationFrame( animate );
}

animate();

