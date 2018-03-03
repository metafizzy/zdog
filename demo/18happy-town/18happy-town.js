/* globals makeBuilding, red, blue, navy, gold, white */

// -------------------------- demo -------------------------- //

var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
var w = 160;
var h = 160;
var minWindowSize = Math.min( window.innerWidth, window.innerHeight );
var zoom = Math.min( 6, Math.floor( minWindowSize / w ) );
var pixelRatio = window.devicePixelRatio || 1;
zoom *= pixelRatio;
var canvasWidth = canvas.width = w * zoom;
var canvasHeight = canvas.height = h * zoom;
// set canvas screen size
if ( pixelRatio > 1 ) {
  canvas.style.width = canvasWidth / pixelRatio + 'px';
  canvas.style.height = canvasHeight / pixelRatio + 'px';
}

var isRotating = false;

// default to flat, filled shapes
Shape.defaults.fill = true;
Shape.defaults.stroke = false;
// Shape.defaults.lineWidth = 1/zoom;

var camera = new Shape({
  rendering: false,
  rotate: { y: -TAU/8 },
});

// -- illustration shapes --- //

var quarterView = 1/Math.sin(TAU/8);

// anchor
var town = new Shape({
  rendering: false,
  addTo: camera,
  translate: { y: 36 },
  scale: { x: quarterView, z: quarterView },
});

// ----- front building ----- //

var frontAnchor = new Shape({
  rendering: false,
  addTo: town,
  translate: { x: 16, y: -4, z: -20 },
});

makeBuilding({
  width: 22,
  depth: 16,
  height: 20,
  addTo: frontAnchor,
  gable: 'ew',
  southWindows: [ 3, 1 ],
  eastWindows: [ 2, 2 ],
  westWindows: [ 2, 2 ],
  northWindows: [ 3, 2 ],
});

// ----- left building ----- //

var leftAnchor = new Shape({
  rendering: false,
  addTo: town,
  translate: { x: -13, y: -10, z: -23 },
});

makeBuilding({
  width: 16,
  depth: 22,
  height: 20,
  addTo: leftAnchor,
  gable: 'ns',
  southWindows: [ 2, 2 ],
  eastWindows: [ 3, 2 ],
  westWindows: [ 3, 2 ],
  northWindows: [ 2, 2 ],
});

// hill

// east slope
var leftEWSlope = new Shape({
  path: [
    { x: 0, y: 0, z: -11 },
    { x: 0, y: 0, z:  11 },
    { x: 6, y: 6, z:  11 },
    { x: 6, y: 6, z: -11 },
  ],
  addTo: leftAnchor,
  translate: { x: 8 },
  color: gold,
});
// west slope
leftEWSlope.copy({
  scale: { x: -1 },
  translate: { x: -8 },
  color: navy,
});

// south slope
new Shape({
  path: [
    { z:  0, y: 0, x: -8 },
    { z:  0, y: 0, x:  8 },
    { z: -6, y: 6, x:  8 },
    { z: -6, y: 6, x: -8 },
  ],
  addTo: leftAnchor,
  translate: { z: -11 },
  color: navy,
});

// south east corner
var leftCorner = new Shape({
  path: [
    { x: 0, y: 0, z:  0 },
    { x: 6, y: 6, z:  0 },
    { x: 0, y: 6, z: -6 },
  ],
  addTo: leftAnchor,
  translate: { x: 8, z: -11 },
  color: red,
});
// south west corner
leftCorner.copy({
  scale: { x: -1 },
  translate: { x: -8, z: -11 },
  color: navy,
});



// ----- back tower ----- //

var towerAnchor = new Shape({
  rendering: false,
  addTo: town,
  translate: { x: -13, y: -24, z: 4 },
});

makeBuilding({
  width: 16,
  depth: 16,
  height: 28,
  addTo: towerAnchor,
  gable: 'ns',
  southWindows: [ 2, 3 ],
  eastWindows: [ 2, 3 ],
  westWindows: [ 2, 3 ],
  northWindows: [ 2, 3 ],
});

// big east slope
var towerEWSlope = new Shape({
  path: [
    { x: 0, y: 0, z: -1 },
    { x: 0, y: 0, z:  1 },
    { x: 1, y: 1, z:  1 },
    { x: 1, y: 1, z: -1 },
  ],
  addTo: towerAnchor,
  translate: { x: 8 },
  // size by scaling
  scale: { x: 20, y: 20, z: 8 },
  color: gold,
});

// south slope down to left building
var towerNSSLope = new Shape({
  path: [
    { z: 0, y: 0, x: -1 },
    { z: 0, y: 0, x:  1 },
    { z: 1, y: 1, x:  1 },
    { z: 1, y: 1, x: -1 },
  ],
  addTo: towerAnchor,
  translate: { z: -8 },
  scale: { x: 8, y: 14, z: -8 },
  color: navy,
});

// south east corner
new Shape({
  path: [
    { x: 0, y: 0, z: 0 },
    { x: 20, y: 20, z: 0 },
    { x: 6, y: 20, z: -8 },
    { x: 0, y: 14, z: -8 },
  ],
  addTo: towerAnchor,
  translate: { x: 8, z: -8 },
  color: red,
});

// north slope
towerNSSLope.copy({
  translate: { z: 8 },
  scale: { x: 8, y: 20, z: 7 },
  color: gold,
});

// north east corner
new Shape({
  path: [
    { x: 0, y: 0, z: 0 },
    { x: 20, y: 20, z: 0 },
    { x: 0, y: 20, z: 7 },
  ],
  addTo: towerAnchor,
  translate: { x: 8, z: 8 },
  color: gold,
});

// west slope
towerEWSlope.copy({
  scale: { x: -12, y: 20, z: 8 },
  translate: { x: -8 },
  color: navy,
});

// north west corner
new Shape({
  path: [
    { x: 0, y: 0, z: 0 },
    { x: -12, y: 20, z: 0 },
    { x: 0, y: 20, z: 7 },
  ],
  addTo: towerAnchor,
  translate: { x: -8, z: 8 },
  color: blue,
});

// south west corner back to left building
new Shape({
  path: [
    { x: 0, y: 0, z: 0 },
    { x: -12, y: 20, z: 0 },
    { x: -6, y: 20, z: -8 },
    { x: 0, y: 14, z: -8 },
  ],
  addTo: towerAnchor,
  translate: { x: -8, z: -8 },
  color: navy,
});

// ----- church ----- //

var churchAnchor = new Shape({
  rendering: false,
  addTo: town,
  translate: { x: -5, y: -4, z: 27 },
});

makeBuilding({
  width: 22,
  depth: 16,
  height: 28,
  addTo: churchAnchor,
  gable: 'ew',
  southWindows: [ 3, 2 ],
  eastWindows: [ 2, 2 ],
  // westWindows: [ 0, 3 ],
  northWindows: [ 3, 2 ],
});

// ----- ground plates ----- //

( function() {

  var townSize = 80;
  var rows = 2;
  var cols = 2;
  var plateW = townSize / cols;
  var plateH = townSize / rows;

  for ( var row=0; row < rows; row++ ) {
    for ( var col=0; col < cols; col++ ) {
      var x = ( col - cols/2 + 0.5 ) * plateW;
      var z = ( row - rows/2 + 0.5 ) * plateH;
      new Rect({
        width: plateW,
        height: plateH,
        addTo: town,
        translate: { x: x, z: z, y: 0 },
        rotate: { x: TAU/4 },
        fill: true,
        stroke: true,
        lineWidth: 8,
        // color: '#' + ( row + 2 ) + ( col + 2 ) + ( col + 2 ),
        color: navy,
      });
    }
  }
});

// flat earth
new Ellipse({
  width: 128,
  height: 128,
  addTo: camera,
  translate: town.translate,
  rotate: { x: TAU/4 },
  lineWidth: 8,
  stroke: true,
  color: navy,
});

// ----- hill ----- //

new Shape({
  path: [
    { x:  0, y: 4 },
    { x: 12, y: 4 },
    { x: 20, y: 12 },
    { x: 33, y: 12 },
    // bring it back into hill
    { x: 20, y: 12, z: -8 },
  ],
  addTo: town,
  translate: { x: -6, y: -20, z: 12 },
  lineWidth: 8,
  stroke: true,
  color: gold,
});

// -----  ----- //

var shapes = camera.getShapes();

// -- animate --- //

function animate() {
  update();
  render();
  requestAnimationFrame( animate );
}

animate();

// -- update -- //

function update() {
  camera.rotate.y += isRotating ? +TAU/150 : 0;

  // rotate
  camera.update();
  shapes.forEach( function( shape ) {
    shape.updateSortValue();
  });
  // perspective sort
  shapes.sort( function( a, b ) {
    return b.sortValue - a.sortValue;
  });
}

// -- render -- //

function render() {
  ctx.clearRect( 0, 0, canvasWidth, canvasHeight );
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  ctx.save();
  ctx.scale( zoom, zoom );
  ctx.translate( w/2, h/2 );

  shapes.forEach( function( shape ) {
    shape.render( ctx );
  });

  ctx.restore();
}

// ----- inputs ----- //

// click drag to rotate
var dragStartAngleX, dragStartAngleY;

new Dragger({
  startElement: canvas,
  onPointerDown: function() {
    isRotating = false;
    dragStartAngleX = camera.rotate.x;
    dragStartAngleY = camera.rotate.y;
  },
  onPointerMove: function( pointer, moveX, moveY ) {
    var angleXMove = moveY / canvasWidth * TAU;
    var angleYMove = moveX / canvasWidth * TAU;
    camera.rotate.x = dragStartAngleX + angleXMove;
    camera.rotate.y = dragStartAngleY + angleYMove;
  },
});

document.querySelector('.reset-button').onclick = function() {
  camera.rotate.set({ x: 0, y: -TAU/8 });
};
