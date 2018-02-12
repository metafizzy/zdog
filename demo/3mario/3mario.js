/* jshint browser: true, devel: true, unused: true, undef: true */
/* globals Shape, Group, Dragger */

var TAU = Math.PI * 2;
var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
var w = 72;
var h = 72;
var minWindowSize = Math.min( window.innerWidth, window.innerHeight );
var zoom = Math.min( 6, Math.floor( minWindowSize / w ) );
var canvasWidth = canvas.width = w * zoom;
var canvasHeight = canvas.height = h * zoom;
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

var cameraRotation = { x: 0, y: 0, z: 0 };

// collection of shapes
var shapes = [];

// -- illustration shapes --- //

// head
new Shape({
  points: [
    { x: 0, y: -12, z: -1 },
  ],
  color: colors.skin,
  lineWidth: 23,
  addTo: shapes,
});

// nose
new Shape({
  points: [
    { x: 0, y: -7, z: -14 },
  ],
  color: colors.skin,
  lineWidth: 7,
  addTo: shapes,
});



// chin
var chinSide = { x: -5, y: -6, z: -5 };
var chinCenter = { x: 0, y: -3.5, z: -7 };
new Shape({
  points: [
    chinSide,
    chinCenter
  ],
  color: colors.skin,
  lineWidth: 10,
  addTo: shapes,
});
// reverse
chinSide.x = -chinSide.x;
new Shape({
  points: [
    chinCenter,
    chinSide
  ],
  color: colors.skin,
  lineWidth: 10,
  addTo: shapes,
});
// mouth
new Shape({
  points: [
    { x: -3, y: -3, z: -10 },
    { x: -1, y: -1, z: -10 },
    { x:  1, y: -1, z: -10 },
    { x:  3, y: -3, z: -10 },
  ],
  color: colors.cloth,
  fill: true,
  lineWidth: 2,
  addTo: shapes,
});



// hat front
var hatFrontA = { x: -8, y: -20, z: -6 };
var hatFrontB = { x: -4, y: -23, z: -8 };
var hatFrontC = { x: -hatFrontB.x, y: hatFrontB.y, z: hatFrontB.z };

new Shape({
  points: [
    hatFrontA,
    hatFrontB,
    { x: -hatFrontB.x, y: hatFrontB.y, z: hatFrontB.z },
    { x: -hatFrontA.x, y: hatFrontA.y, z: hatFrontA.z },
  ],
  color: colors.cloth,
  closed: false,
  fill: false,
  lineWidth: 11,
  addTo: shapes,
});
new Shape({
  points: [
    hatFrontB,
    hatFrontC,
  ],
  color: colors.cloth,
  closed: false,
  fill: false,
  lineWidth: 11,
  addTo: shapes,
});
// hatFrontD
hatFrontA.x = -hatFrontA.x;
new Shape({
  points: [
    hatFrontC,
    hatFrontA,
  ],
  color: colors.cloth,
  closed: false,
  fill: false,
  lineWidth: 11,
  addTo: shapes,
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
  points: [
    { x: -hatTopFrontX, y: hatTopFrontY, z: hatTopFrontZ },
    { x:  hatTopFrontX, y: hatTopFrontY, z: hatTopFrontZ },
    hatTopBackA,
    hatTopBackB,
  ],
  color: colors.cloth,
  fill: true,
  lineWidth: 9,
  addTo: shapes,
});
// hat top back
new Shape({
  points: [
    hatTopBackA,
    hatTopBackB,
  ],
  color: colors.cloth,
  lineWidth: 9,
  addTo: shapes,
});

// hat top cover
new Shape({
  points: [
    { x: -3, y: -20, z: 7 },
    { x:  3, y: -20, z: 7 },
    { x:  3, y: -23, z: -5 },
    { x: -3, y: -23, z: -5 },
  ],
  color: colors.cloth,
  lineWidth: 6,
  addTo: shapes,
});

[ -1, 1 ].forEach( function( xSide ) {
  // eyes pupil
  new Shape({
    points: [
      { x: 5*xSide, y: -10, z: -10 },
      { x: 5*xSide, y: -8, z: -10 },
    ],
    color: colors.eye,
    lineWidth: 3,
    addTo: shapes,
  });


  // eye brow
  new Shape({
    points: [
      { x: 7*xSide, y: -13.5, z: -10 },
      { x: 5.5*xSide, y: -14, z: -11 },
      { x: 4*xSide, y: -13.5, z: -11 },
    ],
    color: colors.hair,
    closed: false,
    lineWidth: 2.5,
    addTo: shapes,
  });


  // hat brim
  // brim has left & right side
  new Shape({
    points: [
      { x: 10*xSide, y: -16, z: -8 },
      { x: 8*xSide, y: -16, z: -13 },
      { x: 0, y: -18, z: -17 },
      { x: 0, y: -19, z: -10 },
    ],
    color: colors.cloth,
    fill: true,
    lineWidth: 4,
    addTo: shapes,
  });

  // hat top side
  new Shape({
    points: [
      { x:  hatTopFrontX*xSide, y: hatTopFrontY, z: hatTopFrontZ },
      { x:  hatTopBackX*xSide, y: hatTopBackY, z: hatTopBackZ },
    ],
    color: colors.cloth,
    lineWidth: 9,
    addTo: shapes,
  });
  new Shape({
    points: [
      { x: 3*xSide, y: -20, z: 7 },
      { x: 3*xSide, y: -23, z: -5 },
    ],
    color: colors.cloth,
    lineWidth: 6,
    addTo: shapes,
  });

  var mustacheGroup = new Group({
    addTo: shapes,
  });

  // mustache
  new Shape({
    points: [
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
    points: [
      { x: 1.75*xSide, y: -4, z: -12 },
    ],
    color: colors.hair,
    fill: true,
    lineWidth: 4,
    addTo: mustacheGroup,
  });
  new Shape({
    points: [
      { x: 4.5*xSide, y: -4.5, z: -11.75 },
    ],
    color: colors.hair,
    fill: true,
    lineWidth: 4,
    addTo: mustacheGroup,
  });

  // side burns
  new Shape({
    points: [
      { x: 10*xSide, y: -9, z: -3 },
      { x: 10*xSide, y: -13, z: -1.5 },
      { x: 10*xSide, y: -13, z: -4 },
      { x: 10*xSide, y: -10, z: -5 },
    ],
    color: colors.hair,
    closed: false,
    fill: true,
    lineWidth: 3,
    addTo: shapes,
  });

  // ears
  new Shape({
    points: [
      { x: 10*xSide, y: -8, z: 1 },
      { x: 10*xSide, y: -12, z: 1 },
      { x: 11*xSide, y: -12, z: 3 },
      { x: 10*xSide, y: -8, z: 2 },
    ],
    color: colors.skin,
    fill: true,
    lineWidth: 4,
    addTo: shapes,
  });

  // hair side panel
  new Shape({
    points: [
      { x: 9*xSide, y: -12, z: 5 },
      { x: 8*xSide, y: -5, z: 4 },
      { x: 5*xSide, y: -5, z: 9 },
      { x: 6*xSide, y: -11.5, z: 10 },
    ],
    color: colors.hair,
    fill: true,
    lineWidth: 3,
    addTo: shapes,
  });
  // hair balls
  new Shape({
    points: [
      { x: 6*xSide, y: -4, z: 7 },
    ],
    color: colors.hair,
    lineWidth: 6,
    addTo: shapes,
  });
  new Shape({
    points: [
      { x: 2*xSide, y: -4, z: 9 },
    ],
    color: colors.hair,
    lineWidth: 6,
    addTo: shapes,
  });

});

// hair back panel
new Shape({
  points: [
    { x: 5, y: -5, z: 9 },
    { x: 6, y: -11.5, z: 10 },
    { x: -6, y: -11.5, z: 10 },
    { x: -5, y: -5, z: 9 },
  ],
  color: colors.hair,
  fill: true,
  lineWidth: 3,
  addTo: shapes,
});


// belly/butt
new Shape({
  points: [
    { x: 0, y: 10, z: -1 },
  ],
  color: colors.overalls,
  lineWidth: 20,
  addTo: shapes,
});

// right arm
var rightShoulder = { x: -8, y: 2, z: 2 };
new Shape({
  points: [
    rightShoulder,
    { x: -14, y: -7, z: -1 },
  ],
  color: colors.cloth,
  lineWidth: 8,
  addTo: shapes,
});

// right hand
new Shape({
  points: [
    { x: -17, y: -13, z: -2 },
  ],
  color: colors.white,
  lineWidth: 12,
  addTo: shapes,
});

// left arm
var leftShoulder = { x: 6, y: 3, z: 3 };
var leftElbow = { x: 8, y: 6, z: 7 };
new Shape({
  points: [
    leftShoulder,
    leftElbow,
  ],
  color: colors.cloth,
  lineWidth: 8,
  addTo: shapes,
});
new Shape({
  points: [
    leftElbow,
    { x: 12, y: 8, z: 8 },
  ],
  color: colors.cloth,
  lineWidth: 8,
  addTo: shapes,
});
// left hand
new Shape({
  points: [
    { x: 17, y: 11, z: 7 },
  ],
  color: colors.white,
  lineWidth: 12,
  addTo: shapes,
});

new Shape({
  points: [
    leftShoulder,
    rightShoulder,
  ],
  color: colors.cloth,
  lineWidth: 8,
  addTo: shapes,
});

// right leg
new Shape({
  points: [
    { x: -5, y: 14, z: -3 },
    { x: -5, y: 20, z: -2 },
    { x: -5, y: 22, z: -1 }
  ],
  closed: false,
  color: colors.overalls,
  lineWidth: 10,
  addTo: shapes,
});
// right foot toe
new Shape({
  points: [
    { x: -5, y: 28, z: 1.5 }
  ],
  color: colors.leather,
  lineWidth: 11,
  addTo: shapes,
});
// right foot sole
new Shape({
  points: [
    { x: -3, y: 22, z: 4 },
    { x: -7, y: 22, z: 4 },
    { x: -7, y: 29, z: 4 },
    { x: -3, y: 29, z: 4 },
  ],
  fill: true,
  color: colors.leather,
  lineWidth: 6,
  addTo: shapes,
});


// left leg
new Shape({
  points: [
    { x: 5, y: 14, z: -3 },
    { x: 5, y: 12, z: -8 },
    { x: 5, y: 13, z: -12 },
  ],
  closed: false,
  color: colors.overalls,
  lineWidth: 10,
  addTo: shapes,
});
// left foot toe
new Shape({
  points: [
    { x: 5, y: 9, z: -17 }
  ],
  color: colors.leather,
  lineWidth: 11,
  addTo: shapes,
});
// left foot sole
new Shape({
  points: [
    { x: 3, y: 8, z:  -19.5 },
    { x: 7, y: 8, z:  -19.5 },
    { x: 7, y: 15, z: -18 },
    { x: 3, y: 15, z: -18 },
  ],
  fill: true,
  color: colors.leather,
  lineWidth: 6,
  addTo: shapes,
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
  // perspective sort
  shapes.sort( function( a, b ) {
    return b.sortValue - a.sortValue;
  });
  // render shapes
  shapes.forEach( function( shape ) {
    shape.update( cameraRotation );
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
    dragStartAngleX = cameraRotation.x;
    dragStartAngleY = cameraRotation.y;
  },
  onPointerMove: function( pointer, moveX, moveY ) {
    var angleXMove = moveY / ( zoom * 100 ) * TAU;
    var angleYMove = moveX / ( zoom * 100 ) * TAU;
    cameraRotation.x = dragStartAngleX + angleXMove;
    cameraRotation.y = dragStartAngleY + angleYMove;
  },
});
