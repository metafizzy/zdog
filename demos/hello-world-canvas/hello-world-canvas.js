// ----- variables ----- //

var isSpinning = true;

// ----- model ----- //

var illo = new Zdog.Illustration({
  element: '.illo',
  zoom: 5,
  dragRotate: true,
  onDragStart: function() {
    isSpinning = false;
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

// square
new Zdog.Rect({
  addTo: illo,
  width: 20,
  height: 20,
  translate: { z: -10 },
  stroke: 3,
  color: '#E62',
  fill: true,
});

// ----- animate ----- //

function animate() {
  illo.rotate.y += isSpinning ? 0.03 : 0;
  illo.updateRenderGraph();
  requestAnimationFrame( animate );
}

animate();
