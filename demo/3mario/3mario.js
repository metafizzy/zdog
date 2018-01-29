/* jshint browser: true, devel: true, unused: true, undef: true */
/* globals Shape */

var TAU = Math.PI * 2;
var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
var w = 64;
var h = 64;
var zoom = 6;
var canvasWidth = canvas.width = w * zoom;
var canvasHeight = canvas.height = h * zoom;
// colors
var colors = {
  fur: '#EA0',
  eye: '#444',
  inner: '#FEE',
  cloak: '#F18',
  // cloak: 'hsla(0, 100%, 50%, 0.2)',
  armor: '#915',
  hair: '#631',
  overalls: '#24D',
  cloth: '#E11',
  skin: '#FCA',
  button: '#FE0',
};

var rZSpeed = 0;

var angleX = 0;
var angleY = 0;
var angleZ = 0;

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
});

// nose
new Shape({
  points: [
    { x: 0, y: -7, z: -14 },
  ],
  color: colors.skin,
  lineWidth: 7,
});



// chin
var chinSide = { x: -5, y: -6, z: -5 };
var chinCenter = { x: 0, y: -4.5, z: -7 };
var chinWidth = 7;
new Shape({
  points: [
    chinSide,
    chinCenter
  ],
  color: colors.skin,
  lineWidth: 10,
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
});
// hat top back
new Shape({
  points: [
    hatTopBackA,
    hatTopBackB,
  ],
  color: colors.cloth,
  lineWidth: 9,
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
  });
  // eye white
  // new Shape({
  //   points: [
  //     { x: 5.5*xSide, y: -10, z: -8 },
  //     { x: 5.5*xSide, y: -8, z: -8 },
  //   ],
  //   color: colors.inner,
  //   lineWidth: 4,
  // });
  // eye highlight
  new Shape({
    points: [
      { x: 5*xSide, y: -10, z: -10.7 },
    ],
    color: colors.inner,
    lineWidth: 1.5,
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
  });

  // hat top side
  new Shape({
    points: [
      { x:  hatTopFrontX*xSide, y: hatTopFrontY, z: hatTopFrontZ },
      { x:  hatTopBackX*xSide, y: hatTopBackY, z: hatTopBackZ },
    ],
    color: colors.cloth,
    lineWidth: 9,
  });
  new Shape({
    points: [
      { x: 3*xSide, y: -20, z: 7 },
      { x: 3*xSide, y: -23, z: -5 },
    ],
    color: colors.cloth,
    lineWidth: 6,
  });

  // mustache
  new Shape({
    points: [
      { x: 2*xSide, y: -4.5, z: -12 },
      { x: 6.5*xSide, y: -5.5, z: -10 },
    ],
    color: colors.hair,
    fill: true,
    lineWidth: 3,
  });
  // mustache sections
  new Shape({
    points: [
      { x: 1.75*xSide, y: -4, z: -11.5 },
    ],
    color: colors.hair,
    fill: true,
    lineWidth: 4,
  });
  new Shape({
    points: [
      { x: 4.5*xSide, y: -4.5, z: -11 },
    ],
    color: colors.hair,
    fill: true,
    lineWidth: 4,
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
  });
  // hair balls
  new Shape({
    points: [
      { x: 6*xSide, y: -4, z: 7 },
    ],
    color: colors.hair,
    lineWidth: 6,
  });
  new Shape({
    points: [
      { x: 2*xSide, y: -4, z: 9 },
    ],
    color: colors.hair,
    lineWidth: 6,
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
});



// shoulders & upper body
var shoulderY = 3;
var neckBottom = { x: 0, y: shoulderY, z: 1 };

new Shape({
  points: [
    { x: 4, y: shoulderY, z:  2 },
    neckBottom,
  ],
  color: colors.cloth,
  lineWidth: 10,
});
new Shape({
  points: [
    neckBottom,
    { x: -4, y: shoulderY, z:  2 },
  ],
  color: colors.cloth,
  lineWidth: 10,
});


// belly/butt

new Shape({
  points: [
    { x: 0, y: 10, z: -1 },
  ],
  color: colors.overalls,
  lineWidth: 20,
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
  // rotate
  angleZ += rZSpeed;
  // perspective sort
  shapes.sort( function( a, b ) {
    return ( b.sortValue ) - ( a.sortValue );
  });
  // render shapes
  shapes.forEach( function( shape ) {
    shape.update( angleX, angleY, angleZ );
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

document.querySelector('.toggle-z-rotation-button').onclick = function() {
  rZSpeed = rZSpeed ? 0 : TAU/360;
};

// click drag to rotate

var dragStartX, dragStartY;
var dragStartAngleX, dragStartAngleY;

document.addEventListener( 'mousedown', function( event ) {
  dragStartX = event.pageX;
  dragStartY = event.pageY;
  dragStartAngleX = angleX;
  dragStartAngleY = angleY;

  window.addEventListener( 'mousemove', onMousemoveDrag );
  window.addEventListener( 'mouseup', onMouseupDrag );
});

function onMousemoveDrag( event ) {
  var dx = event.pageX - dragStartX;
  var dy = event.pageY - dragStartY;
  var angleXMove = dy * TAU/360;
  var angleYMove = dx * TAU/360;
  angleX = dragStartAngleX + angleXMove;
  angleY = dragStartAngleY + angleYMove;
}

function onMouseupDrag() {
  window.removeEventListener( 'mousemove', onMousemoveDrag );
  window.removeEventListener( 'mouseup', onMouseupDrag );
}
