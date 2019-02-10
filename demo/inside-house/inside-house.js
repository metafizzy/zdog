// -------------------------- demo -------------------------- //

var canvas = document.querySelector('canvas');
var w = 48;
var h = 48;
var minWindowSize = Math.min( window.innerWidth, window.innerHeight );
var zoom = Math.min( 8, Math.floor( minWindowSize / w ) );
canvas.width = w * zoom;
canvas.height = h * zoom;

var isRotating = true;
var TAU = Zdog.TAU;

// default to flat, filled shapes
[ Zdog.Shape, Zdog.Rect, Zdog.Ellipse ].forEach( function( ItemClass ) {
  ItemClass.defaults.fill = true;
  ItemClass.defaults.stroke = false;
  ItemClass.defaults.backface = false;
  ItemClass.defaults.front = { z: 1 };
});

var illo = new Zdog.Illustration({
  canvas: canvas,
  zoom: zoom,
  dragRotate: true,
  onDragStart: function() {
    isRotating = false;
  },
});

// -- house --- //

var house = new Zdog.Anchor({
  addTo: illo,
  scale: 10,
});

var nsWall = new Zdog.Shape({
  path: [
    { x: -1, y: -1 },
    { x:  0, y: -2 },
    { x:  1, y: -1 },
    { x:  1, y:  1 },
    { x: -1, y:  1 },
  ],
  addTo: house,
  translate: { z: -1 },
  fill: true,
  color: 'hsla(45, 100%, 50%, 0.6)',
});

nsWall.copy({
  translate: { z: 1 },
  rotate: { y: TAU/2 },
});

var ewWall = new Zdog.Rect({
  width: 2,
  height: 2,
  addTo: house,
  translate: { x: -1 },
  rotate: { y: -TAU/4 },
  fill: true,
  color: 'hsla(210, 100%, 50%, 0.6)',
});

ewWall.copy({
  translate: { x: 1 },
  rotate: { y: TAU/4 },
});

// floor
new Zdog.Shape({
  path: [
    { x: -1, z: -1 },
    { x:  1, z: -1 },
    { x:  1, z:  1 },
    { x: -1, z:  1 },
  ],
  addTo: house,
  backface: true,
  translate: { y: 1 },
  // front: { y: Zdog.Shape.defaults.front.z * -1 },
  fill: true,
  color: 'hsla(120, 100%, 40%, 0.8)',
});

// roof
var roofLength = Math.sqrt(2);
var roof = new Zdog.Shape({
  path: [
    { x: 0, y: -1 },
    { x: roofLength, y: -1 },
    { x: roofLength, y:  1 },
    { x: 0, y:  1 },
  ],
  addTo: house,
  translate: { y: -2 },
  rotate: { x: -TAU/4, y: TAU/8 },
  fill: true,
  color: 'hsla(0, 100%, 60%, 0.6)',
});

roof.copy({
  scale: { x: -1 },
  rotate: { x: -TAU/4, y: -TAU/8 },
});

// -- chair --- //

var chair = new Zdog.Group({
  addTo: illo,
  scale: 2,
  translate: { y: 5 },
});
// chair back
var chairLegs = new Zdog.Shape({
  path: [
    { x: -1, y:  2 },
    { x: -1, y: -2 },
    { x:  1, y: -2 },
    { x:  1, y:  2 },
  ],
  addTo: chair,
  translate: { z: 1 },
  closed: false,
  stroke: 1,
  fill: false,
  color: '#333',
  backface: true,
});
// chair front
chairLegs.copy({
  path: [
    { x: -1, y: 2 },
    { x: -1, y: 0 },
    { x:  1, y: 0 },
    { x:  1, y: 2 },
  ],
  translate: { z: -1 },
});
// chair seat
new Zdog.Rect({
  width: 2,
  height: 2,
  addTo: chair,
  rotate: { x: TAU/4 },
  stroke: 1,
  fill: true,
  color: '#333',
  backface: true,
});

// -- animate --- //

function animate() {
  illo.rotate.y += isRotating ? +TAU/240 : 0;
  illo.updateRenderGraph();
  requestAnimationFrame( animate );
}

animate();

