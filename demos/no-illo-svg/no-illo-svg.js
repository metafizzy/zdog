// ----- setup ----- //

// svg element
var svg = document.querySelector('svg');
// set size
var zoom = 5;
var svgWidth = svg.getAttribute('width');
var svgHeight = svg.getAttribute('height');
// set viewBox for zoom & centering
var viewWidth = svgWidth / zoom;
var viewHeight = svgHeight / zoom;
svg.setAttribute( 'viewBox', -viewWidth/2 + ' ' + -viewHeight/2 + ' ' +
  viewWidth + ' ' + viewHeight );
// rendering variable
var isSpinning = true;
var TAU = Zdog.TAU;

var scene = new Zdog.Anchor();

// ----- model ----- //

// circle
new Zdog.Ellipse({
  addTo: scene,
  diameter: 20,
  translate: { z: 10 },
  stroke: 5,
  color: '#636',
});

// square
new Zdog.Rect({
  addTo: scene,
  width: 20,
  height: 20,
  translate: { z: -10 },
  stroke: 3,
  color: '#E62',
  fill: true,
});

// ----- animate ----- //

function animate() {
  scene.rotate.y += isSpinning ? 0.03 : 0;
  scene.updateGraph();
  render();
  requestAnimationFrame( animate );
}

function render() {
  empty( svg );
  scene.renderGraphSvg( svg );
}

animate();

function empty( element ) {
  while ( element.firstChild ) {
    element.removeChild( element.firstChild );
  }
}

// ----- drag ----- //

var dragStartRX, dragStartRY;
var minSize = Math.min( svgWidth, svgHeight );

// add drag-rotatation with Dragger
new Zdog.Dragger({
  startElement: svg,
  onDragStart: function() {
    isSpinning = false;
    dragStartRX = scene.rotate.x;
    dragStartRY = scene.rotate.y;
  },
  onDragMove: function( pointer, moveX, moveY ) {
    scene.rotate.x = dragStartRX - ( moveY / minSize * TAU );
    scene.rotate.y = dragStartRY - ( moveX / minSize * TAU );
  },
});
