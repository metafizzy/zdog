// -------------------------- demo -------------------------- //

var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
var w = 72;
var h = 72;
var minWindowSize = Math.min( window.innerWidth, window.innerHeight );
var zoom = Math.min( 6, Math.floor( minWindowSize / w ) );
var pixelRatio = window.devicePixelRatio || 1;
zoom *= pixelRatio;
var canvasWidth = canvas.width = w * zoom;
var canvasHeight = canvas.height = h * zoom;
canvas.style.width = canvasWidth / pixelRatio + 'px';
canvas.style.height = canvasHeight / pixelRatio + 'px';
// colors
var colors = {
  eye: '#333',
  white: '#FFF',
  hair: '#631',
  overalls: '#24D',
  cloth: '#E11',
  skin: '#FC9',
  leather: '#A63',
};

var camera = new Shape({ rendering: false });

// -- illustration shapes --- //

// head
new Shape({
  path: [
    { x: 0, y: -12, z: -1 },
  ],
  color: colors.skin,
  lineWidth: 23,
  addTo: camera,
});

// nose
new Shape({
  path: [
    { x: 0, y: -7, z: -14 },
  ],
  color: colors.skin,
  lineWidth: 7,
  addTo: camera,
});



// chin
var chinSide = { x: -5, y: -6, z: -5 };
var chinCenter = { x: 0, y: -3.5, z: -7 };
new Shape({
  path: [
    chinSide,
    chinCenter
  ],
  color: colors.skin,
  lineWidth: 10,
  addTo: camera,
});
// reverse
chinSide.x = -chinSide.x;
new Shape({
  path: [
    chinCenter,
    chinSide
  ],
  color: colors.skin,
  lineWidth: 10,
  addTo: camera,
});
// mouth
new Shape({
  path: [
    { x: -3, y: -3, z: -10 },
    { x: -1, y: -1, z: -10 },
    { x:  1, y: -1, z: -10 },
    { x:  3, y: -3, z: -10 },
  ],
  color: colors.cloth,
  fill: true,
  lineWidth: 2,
  addTo: camera,
});



// hat front
var hatFrontA = { x: -8, y: -20, z: -6 };
var hatFrontB = { x: -4, y: -23, z: -8 };
var hatFrontC = { x: -hatFrontB.x, y: hatFrontB.y, z: hatFrontB.z };

new Shape({
  path: [
    hatFrontA,
    hatFrontB,
    { x: -hatFrontB.x, y: hatFrontB.y, z: hatFrontB.z },
    { x: -hatFrontA.x, y: hatFrontA.y, z: hatFrontA.z },
  ],
  color: colors.cloth,
  closed: false,
  fill: false,
  lineWidth: 11,
  addTo: camera,
});
new Shape({
  path: [
    hatFrontB,
    hatFrontC,
  ],
  color: colors.cloth,
  closed: false,
  fill: false,
  lineWidth: 11,
  addTo: camera,
});
// hatFrontD
hatFrontA.x = -hatFrontA.x;
new Shape({
  path: [
    hatFrontC,
    hatFrontA,
  ],
  color: colors.cloth,
  closed: false,
  fill: false,
  lineWidth: 11,
  addTo: camera,
});


var hatTopFrontX = 10;
var hatTopFrontY = -19;
var hatTopFrontZ = -6;
var hatTopBackX = 7;
var hatTopBackY = -17;
var hatTopBackZ = 9;

var hatTopBackA = { x:  hatTopBackX, y: hatTopBackY, z: hatTopBackZ };
var hatTopBackB = { x: -hatTopBackX, y: hatTopBackY, z: hatTopBackZ };

// hat top
new Shape({
  path: [
    { x: -hatTopFrontX, y: hatTopFrontY, z: hatTopFrontZ },
    { x:  hatTopFrontX, y: hatTopFrontY, z: hatTopFrontZ },
    hatTopBackA,
    hatTopBackB,
  ],
  color: colors.cloth,
  fill: true,
  lineWidth: 9,
  addTo: camera,
});
// hat top back
new Shape({
  path: [
    hatTopBackA,
    hatTopBackB,
  ],
  color: colors.cloth,
  lineWidth: 9,
  addTo: camera,
});

// hat top cover
new Shape({
  path: [
    { x: -3, y: -20, z: 7 },
    { x:  3, y: -20, z: 7 },
    { x:  3, y: -23, z: -5 },
    { x: -3, y: -23, z: -5 },
  ],
  color: colors.cloth,
  lineWidth: 6,
  addTo: camera,
});

[ -1, 1 ].forEach( function( xSide ) {
  // eyes pupil
  new Shape({
    path: [
      { x: 5*xSide, y: -10, z: -10 },
      { x: 5*xSide, y: -8, z: -10 },
    ],
    color: colors.eye,
    lineWidth: 3,
    addTo: camera,
  });


  // eye brow
  new Shape({
    path: [
      { x: 7*xSide, y: -13.5, z: -10 },
      { x: 5.5*xSide, y: -14, z: -11 },
      { x: 4*xSide, y: -13.5, z: -11 },
    ],
    color: colors.hair,
    closed: false,
    lineWidth: 2.5,
    addTo: camera,
  });


  // hat brim
  // brim has left & right side
  new Shape({
    path: [
      { x: 10*xSide, y: -16, z: -8 },
      { x: 8*xSide, y: -16, z: -13 },
      { x: 0, y: -18, z: -17 },
      { x: 0, y: -19, z: -10 },
    ],
    color: colors.cloth,
    fill: true,
    lineWidth: 4,
    addTo: camera,
  });

  // hat top side
  new Shape({
    path: [
      { x:  hatTopFrontX*xSide, y: hatTopFrontY, z: hatTopFrontZ },
      { x:  hatTopBackX*xSide, y: hatTopBackY, z: hatTopBackZ },
    ],
    color: colors.cloth,
    lineWidth: 9,
    addTo: camera,
  });
  new Shape({
    path: [
      { x: 3*xSide, y: -20, z: 7 },
      { x: 3*xSide, y: -23, z: -5 },
    ],
    color: colors.cloth,
    lineWidth: 6,
    addTo: camera,
  });

  var mustacheGroup = new Group({
    addTo: camera,
  });

  // mustache
  new Shape({
    path: [
      { x: 2*xSide, y: -4.5, z: -12.5 },
      { x: 6.5*xSide, y: -5.5, z: -11 },
    ],
    color: colors.hair,
    fill: true,
    lineWidth: 3,
    addTo: mustacheGroup,
  });
  // mustache sections
  new Shape({
    path: [
      { x: 1.75*xSide, y: -4, z: -12 },
    ],
    color: colors.hair,
    fill: true,
    lineWidth: 4,
    addTo: mustacheGroup,
  });
  new Shape({
    path: [
      { x: 4.5*xSide, y: -4.5, z: -11.75 },
    ],
    color: colors.hair,
    fill: true,
    lineWidth: 4,
    addTo: mustacheGroup,
  });

  // side burns
  new Shape({
    path: [
      { x: 10*xSide, y: -9, z: -3 },
      { x: 10*xSide, y: -13, z: -1.5 },
      { x: 10*xSide, y: -13, z: -4 },
      { x: 10*xSide, y: -10, z: -5 },
    ],
    color: colors.hair,
    closed: false,
    fill: true,
    lineWidth: 3,
    addTo: camera,
  });

  // ears
  new Shape({
    path: [
      { x: 10*xSide, y: -8, z: 1 },
      { x: 10*xSide, y: -12, z: 1 },
      { x: 11*xSide, y: -12, z: 3 },
      { x: 10*xSide, y: -8, z: 2 },
    ],
    color: colors.skin,
    fill: true,
    lineWidth: 4,
    addTo: camera,
  });

  // hair side panel
  new Shape({
    path: [
      { x: 9*xSide, y: -12, z: 5 },
      { x: 8*xSide, y: -5, z: 4 },
      { x: 5*xSide, y: -5, z: 9 },
      { x: 6*xSide, y: -11.5, z: 10 },
    ],
    color: colors.hair,
    fill: true,
    lineWidth: 3,
    addTo: camera,
  });
  // hair balls
  new Shape({
    path: [
      { x: 6*xSide, y: -4, z: 7 },
    ],
    color: colors.hair,
    lineWidth: 6,
    addTo: camera,
  });
  new Shape({
    path: [
      { x: 2*xSide, y: -4, z: 9 },
    ],
    color: colors.hair,
    lineWidth: 6,
    addTo: camera,
  });

});

// hair back panel
new Shape({
  path: [
    { x: 5, y: -5, z: 9 },
    { x: 6, y: -11.5, z: 10 },
    { x: -6, y: -11.5, z: 10 },
    { x: -5, y: -5, z: 9 },
  ],
  color: colors.hair,
  fill: true,
  lineWidth: 3,
  addTo: camera,
});


// belly/butt
new Shape({
  path: [
    { x: 0, y: 10, z: -1 },
  ],
  color: colors.overalls,
  lineWidth: 20,
  addTo: camera,
});

// right arm
var rightShoulder = { x: -8, y: 2, z: 2 };
new Shape({
  path: [
    rightShoulder,
    { x: -14, y: -7, z: -1 },
  ],
  color: colors.cloth,
  lineWidth: 8,
  addTo: camera,
});

// right hand
new Shape({
  path: [
    { x: -17, y: -13, z: -2 },
  ],
  color: colors.white,
  lineWidth: 12,
  addTo: camera,
});

// left arm
var leftShoulder = { x: 6, y: 3, z: 3 };
var leftElbow = { x: 8, y: 6, z: 7 };
new Shape({
  path: [
    leftShoulder,
    leftElbow,
  ],
  color: colors.cloth,
  lineWidth: 8,
  addTo: camera,
});
new Shape({
  path: [
    leftElbow,
    { x: 12, y: 8, z: 8 },
  ],
  color: colors.cloth,
  lineWidth: 8,
  addTo: camera,
});
// left hand
new Shape({
  path: [
    { x: 17, y: 11, z: 7 },
  ],
  color: colors.white,
  lineWidth: 12,
  addTo: camera,
});

new Shape({
  path: [
    leftShoulder,
    rightShoulder,
  ],
  color: colors.cloth,
  lineWidth: 8,
  addTo: camera,
});

// right leg
new Shape({
  path: [
    { x: -5, y: 14, z: -3 },
    { x: -5, y: 20, z: -2 },
    { x: -5, y: 22, z: -1 }
  ],
  closed: false,
  color: colors.overalls,
  lineWidth: 10,
  addTo: camera,
});
// right foot toe
new Shape({
  path: [
    { x: -5, y: 28, z: 1.5 }
  ],
  color: colors.leather,
  lineWidth: 11,
  addTo: camera,
});
// right foot sole
new Shape({
  path: [
    { x: -3, y: 22, z: 4 },
    { x: -7, y: 22, z: 4 },
    { x: -7, y: 29, z: 4 },
    { x: -3, y: 29, z: 4 },
  ],
  fill: true,
  color: colors.leather,
  lineWidth: 6,
  addTo: camera,
});


// left leg
new Shape({
  path: [
    { x: 5, y: 14, z: -3 },
    { x: 5, y: 12, z: -8 },
    { x: 5, y: 13, z: -12 },
  ],
  closed: false,
  color: colors.overalls,
  lineWidth: 10,
  addTo: camera,
});
// left foot toe
new Shape({
  path: [
    { x: 5, y: 9, z: -17 }
  ],
  color: colors.leather,
  lineWidth: 11,
  addTo: camera,
});
// left foot sole
new Shape({
  path: [
    { x: 3, y: 8, z:  -19.5 },
    { x: 7, y: 8, z:  -19.5 },
    { x: 7, y: 15, z: -18 },
    { x: 3, y: 15, z: -18 },
  ],
  fill: true,
  color: colors.leather,
  lineWidth: 6,
  addTo: camera,
});

var shapes = camera.getShapes();

// -- animate --- //


function animate() {
  update();
  render();
  requestAnimationFrame( animate );
}

animate();

// -- update -- //

var isRotating = true;

function update() {
  camera.rotate.y += isRotating ? -0.03 : 0;
  camera.update();
  // sort
  shapes.forEach( function updateEachSortValue( shape ) {
    shape.updateSortValue();
  });
  // z-sort
  shapes.sort( function sortBySortValue( a, b ) {
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
    var angleXMove = moveY / ( zoom/pixelRatio * 100 ) * TAU;
    var angleYMove = moveX / ( zoom/pixelRatio * 100 ) * TAU;
    camera.rotate.x = dragStartAngleX + angleXMove;
    camera.rotate.y = dragStartAngleY + angleYMove;
  },
});
