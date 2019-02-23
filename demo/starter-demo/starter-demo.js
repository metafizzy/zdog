var isSpinning = true;
var TAU = Zdog.TAU;

var illo = new Zdog.Illustration({
  element: '.illo',
  zoom: 4,
  dragRotate: true,
  onDragStart: function() {
    isSpinning = false; // stop rotating
  },
});

// circle
new Zdog.Ellipse({
  addTo: illo,
  diameter: 20,
  translate: { z: 10 },
  stroke: 5,
  color: '#636',
});

// triangle
new Zdog.Shape({
  addTo: illo,
  path: [
    { x:  0, y: -1 },
    { x:  1, y:  1 },
    { x: -1, y:  1 },
  ],
  scale: 8,
  translate: { z: -10 },
  rotate: { y: TAU/4 },
  color: '#E62',
  stroke: 3,
  fill: true,
});

// animate
function animate() {
  if ( isSpinning ) {
    illo.rotate.y += TAU/150;
  }
  illo.updateRenderGraph();
  requestAnimationFrame( animate );
}

animate();
