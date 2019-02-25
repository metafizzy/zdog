// ------------------------- demo ------------------------- //

var illoElem = document.querySelector('.illo');
var sceneSize = 48;
var minWindowSize = Math.min( window.innerWidth - 20 , window.innerHeight - 20 );
var zoom = Math.floor( minWindowSize / sceneSize );
var illoSize = sceneSize * zoom;
illoElem.setAttribute( 'width', illoSize );
illoElem.setAttribute( 'height', illoSize );
var isSpinning = true;
var TAU = Zdog.TAU;

var illo = new Zdog.Illustration({
  element: illoElem,
  zoom: zoom,
  dragRotate: true,
  onDragStart: function() {
    isSpinning = false;
  },
});

// ----- model ----- //

var rect = new Zdog.Rect({
  width: 20,
  height: 20,
  addTo: illo,
  translate: { y: 2 },
  rotate: { x: TAU/4 },
  stroke: 2,
  color: '#E21',
});

new Zdog.Ellipse({
  diameter: 20,
  addTo: illo,
  translate: { y: -2 },
  rotate: { x: TAU/4 },
  stroke: 2,
  color: '#19F',
});

new Zdog.Shape({
  addTo: rect,
  translate: { y: -10, z: 2 },
  stroke: 2,
  color: '#EA0',
})

// ----- animate ----- //

function animate() {
  illo.rotate.y += isSpinning ? +TAU/150 : 0;
  illo.updateRenderGraph();
  requestAnimationFrame( animate );
}

animate();

