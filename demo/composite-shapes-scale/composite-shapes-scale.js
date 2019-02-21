// -------------------------- demo -------------------------- //

var illoElem = document.querySelector('.illo');
var w = 48;
var h = 48;
var minWindowSize = Math.min( window.innerWidth, window.innerHeight );
var zoom = Math.min( 8, Math.floor( minWindowSize / w ) );
illoElem.setAttribute( 'width', w * zoom );
illoElem.setAttribute( 'height', h * zoom );

var TAU = Zdog.TAU;
var isRotating = true;

var illo = new Zdog.Illustration({
  element: illoElem,
  zoom: zoom,
  scale: 2,
  dragRotate: true,
  onDragStart: function() {
    isRotating = false;
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
  illo.rotate.y += isRotating ? +TAU/150 : 0;
  illo.updateGraph();
  illo.renderGraph();
  requestAnimationFrame( animate );
}

animate();

// -- update -- //
