// ------------------------- demo ------------------------- //

var illoElem = document.querySelector('.illo');
var sceneSize = 48;
var minWindowSize = Math.min( window.innerWidth - 20 , window.innerHeight - 20 );
var zoom = Math.floor( minWindowSize / sceneSize );
var illoSize = sceneSize * zoom;
illoElem.setAttribute( 'width', illoSize );
illoElem.setAttribute( 'height', illoSize );
var isRotating = true;
var TAU = Zdog.TAU;

var illo = new Zdog.Illustration({
  element: illoElem,
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
  translate: { x: 10, y: -5 },
  addTo: illo,
  stroke: 7,
  color: '#246',
});

// ----- animate ----- //

function animate() {
  illo.rotate.y += isRotating ? +TAU/150 : 0;
  illo.updateRenderGraph();
  requestAnimationFrame( animate );
}

animate();

