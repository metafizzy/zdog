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

function makeWall( options ) {
  var rotor = new Anchor({
    addTo: scene,
    rotate: options.rotate,
  });

  // rotor
  var wall = new Anchor({
    addTo: rotor,
    translate: { z: 4 },
  });

  var topBlock = new Anchor({
    addTo: wall,
    translate: { x: -4, y: -4 },
  });

  // side faces
  var face = new Rect({
    addTo: topBlock,
    width: 2,
    height: 2,
    translate: { z: 1 },
    color: options.outside,
    // stroke: false,
    lineWidth: 1/zoom,
  });
  face.copy({
    translate: { x: -1 },
    rotate: { y: TAU/4 },
    color: options.left,
  });
  face.copy({
    translate: { x: 1 },
    rotate: { y: -TAU/4 },
    color: options.right,
  });
  face.copy({
    translate: { z: -1 },
    rotate: { y: TAU/2 },
    color: options.inside,
  });
  // top
  face.copy({
    translate: { y: -1 },
    rotate: { x: TAU/4 },
    color: black,
  });

  topBlock.copyGraph({
    translate: { x:  0, y: -4 },
  });

  var topTile = new Rect({
    addTo: wall,
    width: 2,
    height: 2,
    color: black,
    lineWidth: 1/zoom,
    rotate: { x: TAU/4 },
    translate: { x: -2, y: -3 },
  });
  topTile.copy({
    translate: { x:  2, y: -3 }
  });

  // outside arch
  var arch = new Shape({
    addTo: wall,
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
    translate: { z: 1 },
    color: options.outside,
    lineWidth: 1/zoom,
  });
  // inside arch
  arch.copy({
    translate: { z: -1 },
    rotate: { y: TAU/2 },
    color: options.inside,
  });

  // outside columns
  var outsideColumn = new Rect({
    addTo: wall,
    width: 2,
    height: 8,
    translate: { x: -4, y: 1, z: 1 },
    color: options.outside,
    lineWidth: 1/zoom,
  });
  outsideColumn.copy({
    translate: { x: 4, y: 1, z: 1 },
  });

  var insideColumn = new Rect({
    addTo: wall,
    width: 2,
    height: 3,
    translate: { x: -3, y: 3.5 },
    rotate: { y: -TAU/4 },
    color: options.right,
    lineWidth: 1/zoom,
  });
  insideColumn.copy({
    translate: { x:  3, y: 3.5 },
    rotate: { y: TAU/4 },
    color: options.left,
  });

  // under arch, quarter arc
  var underArch = new Shape({
    addTo: wall,
    path: [
      { x:  3, y:  2 },
      { arc: [
        { x: 3, y: -1 },
        { x: 0, y: -1 }
      ]},
      { x: 0, y: -1, z: -2 },
      { arc: [
        { x: 3, y: -1, z: -2 },
        { x: 3, y: 2, z: -2 },
      ]},
    ],
    translate: { z: 1 },
    // front: { x: -1, y: 1 },
    backfaceVisible: true,
    color: options.left,
    lineWidth: 1/zoom,
  });
  underArch.copy({
    scale: { x: -1 },
    // front: { x: 1, y: 1 },
    color: options.right,
  });

}

makeWall({
  rotate: {},
  outside: white,
  inside: black,
  left: white,
  right: black,
});

makeWall({
  rotate: { y: -TAU/4 },
  outside: black,
  inside: white,
  left: white,
  right: black,
});

makeWall({
  rotate: { y: -TAU/2 },
  outside: black,
  inside: white,
  left: black,
  right: white,
});

makeWall({
  rotate: { y: TAU * -3/4 },
  outside: white,
  inside: black,
  left: black,
  right: white,
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
