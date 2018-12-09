// -------------------------- demo -------------------------- //

var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
var w = 32;
var h = 32;
var minWindowSize = Math.min( window.innerWidth - 20, window.innerHeight - 40 );
var zoom = Math.floor( minWindowSize / w );
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
var white = 'white';
var black = '#333';

var scene = new Anchor({
  rotate: { x: -35/360 * TAU, y: 45/360 * TAU },
});

[ Shape, Rect ].forEach( function( ItemClass ) {
  ItemClass.defaults.fill = true;
  // ItemClass.defaults.stroke = false;
  ItemClass.defaults.backfaceVisible = false;
});

// -- illustration shapes --- //

var topBlock = ( function() {
  var block = new Anchor({
    addTo: scene,
    translate: { x: -4, y: -4, z: 4 },
  });

  // side faces
  var face = new Rect({
    addTo: block,
    width: 2,
    height: 2,
    translate: { z: 1 },
    color: white,
    // stroke: false,
    lineWidth: 1/zoom,
  });
  face.copy({
    translate: { x: -1 },
    rotate: { y: TAU/4 },
  });
  face.copy({
    translate: { x: 1 },
    rotate: { y: -TAU/4 },
    color: black,
  });
  face.copy({
    translate: { z: -1 },
    rotate: { y: TAU/2 },
    color: black,
  });
  // top
  face.copy({
    translate: { y: -1 },
    rotate: { x: TAU/4 },
    color: black,
  });

  return block;
})();

topBlock.copyGraph({
  translate: { x:  0, y: -4, z:  4 },
});
topBlock.copyGraph({
  translate: { x:  4, y: -4, z:  4 },
});
topBlock.copyGraph({
  translate: { x:  4, y: -4, z:  0 },
});
topBlock.copyGraph({
  translate: { x:  4, y: -4, z: -4 },
});
topBlock.copyGraph({
  translate: { x:  0, y: -4, z: -4 },
});
topBlock.copyGraph({
  translate: { x: -4, y: -4, z: -4 },
});
topBlock.copyGraph({
  translate: { x: -4, y: -4, z:  0 },
});

var topTile = new Rect({
  addTo: scene,
  width: 2,
  height: 2,
  color: black,
  lineWidth: 1/zoom,
  rotate: { x: TAU/4 },
  translate: { x: -2, y: -3, z:  4 },
});
topTile.copy({
  translate: { x:  2, y: -3, z:  4 }
});
topTile.copy({
  translate: { x:  4, y: -3, z:  2 }
});
topTile.copy({
  translate: { x:  4, y: -3, z: -2 }
});
topTile.copy({
  translate: { x:  2, y: -3, z: -4 }
});
topTile.copy({
  translate: { x: -2, y: -3, z: -4 }
});
topTile.copy({
  translate: { x: -4, y: -3, z: -2 }
});
topTile.copy({
  translate: { x: -4, y: -3, z:  2 }
});

var outsideArch = new Shape({
  addTo: scene,
  path: [
    { x: -5, y: -3 },
    { x:  5, y: -3 },
    { x:  5, y:  5 },
    { x:  3, y:  5 },
    { x:  3, y:  2 },
    { arc: [
      { x: 3, y: -1 },
      { x: 0, y: -1 }
    ]},
    { arc: [
      { x: -3, y: -1 },
      { x: -3, y: 2 }
    ]},
    { x: -3, y:  5 },
    { x: -5, y:  5 },
  ],
  translate: { z: 5 },
  color: white,
  lineWidth: 1/zoom,
});

outsideArch.copy({
  translate: { x: 5 },
  rotate: { y: -TAU/4 },
  color: black,
});
outsideArch.copy({
  translate: { x: -5 },
  rotate: { y: TAU/4 },
});

outsideArch.copy({
  translate: { z: -5 },
  rotate: { y: TAU/2 },
  color: black,
});


var insideArch = new Shape({
  addTo: scene,
  path: [
    { x: -3, y: -3 },
    { x:  3, y: -3 },
    { x:  3, y:  2 },
    { arc: [
      { x: 3, y: -1 },
      { x: 0, y: -1 }
    ]},
    { arc: [
      { x: -3, y: -1 },
      { x: -3, y: 2 }
    ]},
  ],
  translate: { z: -3 },
  color: white,
  lineWidth: 1/zoom,
});
insideArch.copy({
  translate: { x: -3 },
  rotate: { y: -TAU/4 },
  color: black,
});
insideArch.copy({
  translate: { x: 3 },
  rotate: { y: TAU/4 },
});

insideArch.copy({
  translate: { z: 3 },
  rotate: { y: TAU/2 },
  color: black,
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
  scene.rotate.y += isRotating ? +TAU/150 : 0;

  scene.updateGraph();
}

// -- render -- //

ctx.lineCap = 'round';
ctx.lineJoin = 'round';

function render() {
  ctx.clearRect( 0, 0, canvasWidth, canvasHeight );

  ctx.save();
  ctx.scale( zoom, zoom );
  ctx.translate( w/2, h/2 );

  scene.renderGraph( ctx );

  ctx.restore();
}

// ----- inputs ----- //

// click drag to rotate
var dragStartAngleX, dragStartAngleY;

new Dragger({
  startElement: canvas,
  onPointerDown: function() {
    isRotating = false;
    dragStartAngleX = scene.rotate.x;
    dragStartAngleY = scene.rotate.y;
  },
  onPointerMove: function( pointer, moveX, moveY ) {
    var angleXMove = moveY / canvasWidth * TAU;
    var angleYMove = moveX / canvasWidth * TAU;
    scene.rotate.x = dragStartAngleX + angleXMove;
    scene.rotate.y = dragStartAngleY + angleYMove;
  },
});
