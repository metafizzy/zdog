var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
var w = 72;
var h = 72;
var zoom = 6;
var canvasWidth = canvas.width = w * zoom;
var canvasHeight = canvas.height = h * zoom;

// colors
var gold = '#FA4';
var crimson = '#C44';
// var charcoal = '#333';
// var gunMetal = '#39A';
var glow = '#DFB';

var camera = new Anchor();

// -- illustration shapes --- //

// head
var head = new Shape({
  translate: { y: -22.5 },
  lineWidth: 7,
  color: crimson,
  addTo: camera,
});
// mouth guard
new Rect({
  width: 1,
  height: 1,
  addTo: head,
  translate: { y: 2.5, z: -2.75 },
  color: crimson,
  lineWidth: 1,
  fill: true,
});


[ -1, 1 ].forEach( function( xSide ) {
  // visor panel
  new Shape({
    path: [
      { x: 0, y: -1, },
      { x: 0, y: 1.25, z: 0.25 },
      { x: 2.25*xSide, y: 0, z: 1},
      { x: 2.5*xSide, y: -1.5, z: 1.5 },
    ],
    addTo: head,
    translate: { x: 0, y: 0.5, z: -4  },
    lineWidth: 0.5,
    fill: true,
    color: glow,
  });
  // helmet crimson tube
  new Shape({
    path: [
      { y: -0.5, z: 1 },
      { y: 0.5, z: -1, x: -0.5*xSide },
    ],
    translate: { x: 3.5*xSide, y: 1, z: 0  },
    lineWidth: 1.5,
    color: crimson,
    addTo: head,
  });

  // breast plate top front
  // new Shape({
  //   path: [
  //     { x: 0, y: -2, z: -2 },
  //     { x: 0, y: 2, z: -4 },
  //     { x: 6*xSide, y: 0, z: -2 },
  //     { x: 5*xSide, y: -4, z: 1 },
  //     { x: 4*xSide, y: -4, z: 1 },
  //     { x: 1*xSide, y: -2, z: -2 },
  //   ],
  //   addTo: camera,
  //   translate: { y: -16, z: -2  },
  //   lineWidth: 1,
  //   fill: true,
  //   color: crimson,
  // });
  new Shape({
    path: [
      { x: 0, y: -1, z: -2 },
      { x: 0, y: 2.5, z: -4 },
      { x: 5*xSide, y: 0, z: -2 },
      { x: 4*xSide, y: -2, z: 1 },
      { x: 3*xSide, y: -2, z: 1 },
      { x: 1*xSide, y: -1, z: -2 },
    ],
    addTo: camera,
    translate: { y: -16, z: -2  },
    lineWidth: 3,
    fill: true,
    color: crimson,
  });
  

  // shoulder
  var shoulder = new Shape({
    translate: { x: 10*xSide, y: -19,  },
    lineWidth: 10,
    color: gold,
    addTo: camera,
  });
  // upper arm
  new Shape({
    path: [
      { y: 0 },
      { y: 6 },
    ],
    addTo: shoulder,
    translate: { x: -1.5*xSide, y: 2 },
    rotate: { z: -0.4*xSide },
    color: gold,
    lineWidth: 4.5,
  });


});


// -- animate --- //

function animate() {
  update();
  render();
  requestAnimationFrame( animate );
}

animate();

// -- update -- //

function update() {
  camera.updateGraph();
}

// -- render -- //
ctx.lineCap = 'round';
ctx.lineJoin = 'round';

function render() {
  ctx.clearRect( 0, 0, canvasWidth, canvasHeight );

  ctx.save();
  ctx.scale( zoom, zoom );
  ctx.translate( w/2, h/2 );

  camera.renderGraph( ctx );

  ctx.restore();
}

// ----- inputs ----- //

// click drag to rotate
var dragStartAngleX, dragStartAngleY;

new Dragger({
  startElement: canvas,
  onPointerDown: function() {
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
