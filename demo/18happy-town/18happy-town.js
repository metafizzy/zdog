/* globals makeBuilding, gold */
// red, blue, navy, gold, white, 

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

  var townSize = 72;
  var rows = 3;
  var cols = 8;
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
})();

// ----- hill ----- //

// new Shape({
//   path: [
//     { x: 0, y: 0 },
//     { x: 4, y: 0 },
//     { x: 10, y: 6 },
//     { x: 14, y: 6 },
//     { x: 20, y: 12 },
//     { x: 28, y: 12 },
//     { x: 30, y: 14 },
//   ],
//   addTo: town,
//   translate: { x: -6, y: -20, z: 12 },
//   lineWidth: 8,
//   fill: false,
//   stroke: true,
//   closed: false,
//   color: gold,
// });

// var hillPillow = new Rect({
//   width: 16,
//   height: 16,
//   addTo: town,
//   rotate: { x: TAU/4 },
//   translate: { y: -8, z: 4, x: 18 },
//   fill: true,
//   stroke: true,
//   lineWidth: 8,
//   color: gold,
// });
// hillPillow.copy({
//   translate: { y: -8, z: 4, x: 2 },
// });
// hillPillow.copy({
//   translate: { y: -8, z: 4, x: -14 },
// });
// hillPillow.copy({
//   translate: { y: -12, z: 4, x: 2 },
// });

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
