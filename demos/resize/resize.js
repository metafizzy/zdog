// ------------------------- demo ------------------------- //

var zoom = 4;
var isSpinning = true;

var model = new Zdog.Anchor();

var canvasIllo = new Zdog.Illustration({
  element: 'canvas',
  zoom: zoom,
  resize: true,
  dragRotate: model,
  onDragStart: function() {
    isSpinning = false;
  },
  onResize: function( width, height ) {
    this.zoom = Math.min( width, height ) / 50;
  },
});

var svgIllo = new Zdog.Illustration({
  element: 'svg',
  zoom: zoom,
  resize: true,
  dragRotate: model,
  onDragStart: function() {
    isSpinning = false;
  },
  onResize: function( width, height ) {
    this.zoom = Math.min( width, height ) / 50;
  },
});

// HACK set initial zoom
svgIllo.setSize( svgIllo.width, svgIllo.height );

// ----- model ----- //

new Zdog.Rect({
  width: 20,
  height: 20,
  addTo: model,
  translate: { z: -10 },
  stroke: 2,
  color: '#E21',
});

new Zdog.Ellipse({
  diameter: 16,
  addTo: model,
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
  addTo: model,
  stroke: 2,
  fill: true,
  color: '#EA0',
});

new Zdog.Shape({
  translate: { x: 10, y: -5 },
  addTo: model,
  stroke: 7,
  color: '#246',
});

model.copyGraph({
  addTo: svgIllo,
});

// ----- animate ----- //

function animate() {
  model.rotate.y += isSpinning ? 0.03 : 0;
  model.updateGraph();
  svgIllo.renderGraph( model );
  canvasIllo.renderGraph( model );
  requestAnimationFrame( animate );
}

animate();

