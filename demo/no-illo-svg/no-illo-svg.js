// ------------------------- demo ------------------------- //

var svg = document.querySelector('svg');
var sceneSize = 48;
var zoom = 8;
var illoSize = sceneSize * zoom;
svg.setAttribute( 'viewBox', -sceneSize/2 + ' ' + -sceneSize/2 + ' ' +
  sceneSize + ' ' + sceneSize );
svg.style.width = svg.style.height = illoSize + 'px';

var isSpinning = true;
var TAU = Zdog.TAU;

var scene = new Zdog.Anchor();

// ----- model ----- //

new Zdog.Rect({
  width: 20,
  height: 20,
  addTo: scene,
  translate: { z: -10 },
  stroke: 2,
  color: '#E21',
});

new Zdog.Ellipse({
  diameter: 16,
  addTo: scene,
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
  addTo: scene,
  stroke: 2,
  fill: true,
  color: '#EA0',
});


new Zdog.Shape({
  addTo: scene,
  translate: { y: 8 },
  stroke: 8,
  color: '#6A6',
});



// ----- animate ----- //

function animate() {
  scene.rotate.y += isSpinning ? +TAU/150 : 0;
  scene.updateGraph();
  render();
  requestAnimationFrame( animate );
}

function render() {
  // clear
  scene.renderGraphSvg( svg );
}

animate();

// ----- drag ----- //

// click drag to rotate
var dragStartRX, dragStartRY;

new Zdog.Dragger({
  startElement: svg,
  onDragStart: function() {
    isSpinning = false;
    dragStartRX = scene.rotate.x;
    dragStartRY = scene.rotate.y;
  },
  onDragMove: function( pointer, moveX, moveY ) {
    scene.rotate.x = dragStartRX - ( moveY / illoSize * TAU );
    scene.rotate.y = dragStartRY - ( moveX / illoSize * TAU );
  },
});
