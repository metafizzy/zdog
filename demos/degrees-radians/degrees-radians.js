// ----- setup ----- //

var isSpinning = true;
var eggplant = '#636';
var garnet = '#C25';
var orange = '#E62';
var gold = '#EA0';

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

new Zdog.Ellipse({
  diameter: 16,
  addTo: illo,
  translate: { z: 10 },
  stroke: 4,
  color: eggplant,
});

new Zdog.Rect({
  width: 5,
  height: 5,
  addTo: illo,
  stroke: 3,
  color: garnet,
});

new Zdog.Rect({
  width: 2,
  height: 2,
  addTo: illo,
  stroke: 2,
  translate:{
    z: -5,
  },
  color: orange,
});

new Zdog.Rect({
  width: 1,
  height: 1,
  addTo: illo,
  stroke: 1,
  translate:{
    z: -8,
  },
  color: gold,
});


// ----- animate -----a //

function animate() {
  // Spinning 5 degrees on both axis
  illo.rotate.y += isSpinning ? Zdog.toRadians(5) : 0;
  illo.rotate.x += isSpinning ? Zdog.toRadians(5) : 0;
  illo.updateRenderGraph();
  requestAnimationFrame( animate );
}

animate();

