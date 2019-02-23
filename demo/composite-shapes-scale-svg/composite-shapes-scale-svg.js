// -------------------------- demo -------------------------- //

var svg = document.querySelector('svg');
var sceneSize = 48;
var minWindowSize = Math.min( window.innerWidth - 20 , window.innerHeight - 20 );
var zoom = Math.floor( minWindowSize / sceneSize );
svg.setAttribute( 'width', sceneSize * zoom );
svg.setAttribute( 'height', sceneSize * zoom );
var isSpinning = true;
var TAU = Zdog.TAU;

var illo = new Zdog.Illustration({
  element: svg,
  zoom: zoom,
  scale: 2,
  dragRotate: true,
  onDragStart: function() {
    isSpinning = false;
  },
});

// -- illustration shapes --- //

new Zdog.Rect({
  width: 10,
  height: 10,
  addTo: illo,
  translate: { z: -10 },
  stroke: 2,
  color: '#E21',
});

/*
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
*/

new Zdog.Hemisphere({
  diameter: 4,
  scale: 2,
  addTo: illo,
  translate: { x: 8 },
  color: '#EA0',
  backface: '#456',
  stroke: false,
});

var cyl = new Zdog.Cylinder({
  diameter: 4,
  length: 4,
  scale: 2,
  addTo: illo,
  translate: { x: 0 },
  color: '#C25',
  backface: '#E62',
  frontBaseColor: '#EA0',
  rearBaseColor: '#636',
  stroke: false,
});

new Zdog.Cone({
  diameter: 4,
  length: 3,
  scale: 2,
  addTo: illo,
  translate: { x: -8 },
  color: '#456',
  backface: '#EA0',
  stroke: false,
});

// -- animate --- //

function animate() {
  illo.rotate.y += isSpinning ? +TAU/150 : 0;
  illo.updateGraph();
  illo.renderGraph();
  requestAnimationFrame( animate );
}

animate();

// -- update -- //
