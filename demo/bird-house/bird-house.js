// -------------------------- demo -------------------------- //

var canvas = document.querySelector('canvas');
var w = 48;
var h = 48;
var minWindowSize = Math.min( window.innerWidth - 20 , window.innerHeight - 20 );
var zoom = Math.floor( minWindowSize / w );
canvas.width = w * zoom;
canvas.height = h * zoom;
var isRotating = false;
// colors
var gold = '#EA0';
var red = '#E21';
var denim = '#345';

[ Shape, Ellipse, Rect ].forEach( function( ShapeClass ) {
  ShapeClass.defaults.stroke = 1/zoom;
  ShapeClass.defaults.fill = true;
});

var illo = new Illo({
  canvas: canvas,
  zoom: zoom,
  dragRotate: true,
  onDragStart: function() {
    isRotating = false;
  },
});

// -- illustration shapes --- //

var house = new Anchor({
  addTo: illo,
  scale: 4,
});

var frontGroup = new Group({
  addTo: house,
  translate: { z: 2 },
});

var gable = new Shape({
  addTo: frontGroup,
  path: [
    { x: 0, y: -2 },
    { x: 2, y: 0 },
    { x: 2, y: 2 },
    { x: -2, y: 2 },
    { x: -2, y: 0 },
  ],
  closed: true,
  color: gold,
});
gable.copy({
  addTo: house,
  translate: { z: -2 },
});

// hole
new Ellipse({
  addTo: frontGroup,
  diameter: 1.25,
  color: denim,
  stroke: false,
});

var side = new Rect({
  addTo: house,
  width: 4,
  height: 2,
  rotate: { y: TAU/4 },
  translate: { x: 2, y: 1 },
  color: denim,
});
side.copy({
  translate: { x: -2, y: 1 },
});

var roofAnchor = new Anchor({
  addTo: house,
  translate: { y: -2 },
  rotate: { z: -TAU/8 },
});

var roofW = Math.sqrt(2) * 2;
// var roofW = 4;

var roof = new Rect({
  addTo: roofAnchor,
  width: roofW,
  height: 4,
  translate: { x: -roofW/2 },
  rotate: { x: TAU/4 },
  color: red,
  backface: denim,
});

roof.copy({
  width: 1,
  translate: { x: -roofW - 0.5 },
  // color: gold,
});

roofAnchor.copyGraph({
  scale: { x: -1 },
  rotate: { z: TAU/8 },
});

// base
new Rect({
  addTo: house,
  width: 4,
  height: 4,
  translate: { y: 2 },
  rotate: { x: TAU/4 },
  color: red,
});

// -- animate --- //

function animate() {
  illo.rotate.y += isRotating ? +TAU/150 : 0;
  illo.updateGraph();
  illo.renderGraph();
  requestAnimationFrame( animate );
}

animate();

