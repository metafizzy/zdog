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
var yellow = "#ED0";
var gold = '#EA0';
var orange = '#E62';
var garnet = '#C25';
var eggplant = '#636';

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
  color: garnet,
});

// hole
new Ellipse({
  addTo: frontGroup,
  diameter: 1.25,
  color: eggplant,
  stroke: false,
});

var side = new Rect({
  addTo: house,
  width: 4,
  height: 2,
  rotate: { y: TAU/4 },
  translate: { x: 2, y: 1 },
  color: orange,
});
side.copy({
  translate: { x: -2, y: 1 },
  color: garnet,
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
  color: orange,
  backface: eggplant,
});

roof.copy({
  width: 1,
  translate: { x: -roofW - 0.5 },
  // color: gold,
});

var roofCopy = roofAnchor.copyGraph({
  scale: { x: -1 },
  rotate: { z: TAU/8 },
});

roofCopy.children[0].color = yellow;
roofCopy.children[1].color = yellow;

// base
new Rect({
  addTo: house,
  width: 4,
  height: 4,
  translate: { y: 2 },
  rotate: { x: TAU/4 },
  color: eggplant,
});

// -- animate --- //

function animate() {
  illo.rotate.y += isRotating ? +TAU/150 : 0;
  illo.updateGraph();
  illo.renderGraph();
  requestAnimationFrame( animate );
}

animate();

