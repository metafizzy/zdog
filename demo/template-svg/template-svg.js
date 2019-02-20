// ------------------------- demo ------------------------- //

var svg = document.querySelector('svg');
var sceneSize = 48;
var minWindowSize = Math.min( window.innerWidth - 20 , window.innerHeight - 20 );
var zoom = Math.floor( minWindowSize / sceneSize );
svg.setAttribute( 'width', sceneSize * zoom );
svg.setAttribute( 'height', sceneSize * zoom );
var isRotating = true;
var TAU = Zdog.TAU;

var illo = new Zdog.Illustration({
  element: svg,
  zoom: zoom,
  dragRotate: true,
  onDragStart: function() {
    isRotating = false;
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
  addTo: illo,
  translate: { x: 12, y: -6 },
  stroke: 8,
  color: '#6A6',
});



// ----- animate ----- //

function animate() {
  illo.rotate.y += isRotating ? +TAU/150 : 0;
  illo.updateGraph();
  illo.renderGraph();
  requestAnimationFrame( animate );
}

animate();

