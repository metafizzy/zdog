/* jshint browser: true, devel: true, unused: true, undef: true */
/* globals Shape */

var TAU = Math.PI * 2;
var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
var w = 72;
var h = 72;
var zoom = 6;
var canvasWidth = canvas.width = w * zoom;
var canvasHeight = canvas.height = h * zoom;
// colors
var colors = {
  fur: '#EA0',
  eye: '#444',
  inner: '#FEE',
  cloak: '#F18',
  // cloak: 'hsla(0, 100%, 50%, 0.1)',
  armor: '#926',
};

var rZSpeed = 0;

var angleX = 0;
var angleY = 0;
var angleZ = 0;

// collection of shapes
var shapes = [];

// -- illustration shapes --- //
// body center
new Shape({
  points: [
    { x: -3, y: 10, z: 0 },
    { x: 0, y: 14, z: 0 },
    { x: 3, y: 10, z: 0 },
  ],
  color: colors.inner,
  lineWidth: 13,
});

// head circle
new Shape({
  points: [
    { x: 0, y: -12, z: 0 },
  ],
  color: colors.fur,
  lineWidth: 32,
});

// nose

var noseZ = -17;

new Shape({
  points: [
    { x: -1, y: -7, z: noseZ },
    { x: 1, y: -7, z: noseZ },
  ],
  color: colors.eye,
  lineWidth: 3,
});
new Shape({
  points: [
    { x: 0, y: -7, z: noseZ },
    { x: 0, y: -6, z: noseZ },
  ],
  color: colors.eye,
  lineWidth: 3,
});

// snout
new Shape({
  points: [
    { x: -2, y: -5, z: -11 },
    { x:  2, y: -5, z: -11 },
    { x:  2, y: -3, z: -7 },
    { x: -2, y: -3, z: -7 },
  ],
  color: colors.fur,
  lineWidth: 12,
});


[ -1, 1 ].forEach( function( xSide ) {

  // eyes
  new Shape({
    points: [
      { x: 8*xSide, y: -12, z: -11 },
      { x: 8*xSide, y: -9, z: -11 },
    ],
    color: colors.eye,
    lineWidth: 4,
  });

  // ears
  var frontEarZ = -4;
  var topEarY = -30;
  var earColor = colors.fur;

  var earA = { x: 14*xSide, y: topEarY+12, z: frontEarZ+4 };
  var earB = { x: 14*xSide, y: topEarY, z: frontEarZ };
  var earC = { x: 7*xSide, y: topEarY+11, z: frontEarZ+14 };
  var earD = { x: 10*xSide, y: topEarY, z: frontEarZ };
  var earE = { x: 3*xSide, y: topEarY+5, z: frontEarZ };
  // outer ear
  new Shape({
    points: [ earA, earB, earC ],
    color: earColor,
    fill: true,
    lineWidth: 4,
  });
  new Shape({
    points: [ earB, earC, earD ],
    color: earColor,
    fill: true,
    lineWidth: 4,
  });
  new Shape({
    points: [ earC, earD, earE ],
    color: earColor,
    fill: true,
    lineWidth: 4,
  });
  // inner ear
  var innerEarXShift = 4*xSide;
  new Shape({
    points: [
      { x: earA.x - innerEarXShift , y: earA.y-3, z: frontEarZ },
      { x: earD.x, y: earD.y+5, z: frontEarZ },
      { x: earE.x + innerEarXShift, y: earE.y+2, z: frontEarZ },
    ],
    color: colors.inner,
    fill: true,
    lineWidth: 3,
  });


  // whiskers
  [ -0, -6 ].forEach( function( yShift ) {
    var whiskerX0 = 10*xSide;
    var whiskerX1 = 17*xSide;
    var whiskerY0 = -6+yShift;
    var whiskerY1 = -2+yShift;

    new Shape({
      points: [
        { x: whiskerX0, y: whiskerY0, z: -6 },
        { x: whiskerX0, y: whiskerY1, z: -6 },
        { x: whiskerX1, y: whiskerY1, z: -6 },
      ],
      fill: true,
      color: colors.fur,
      lineWidth: 3,
    });
  });

  // arms

  // shoulder
  new Shape({
    points: [
      { x: 11*xSide, y: 6, z: 2 },
      { x: 12*xSide, y: 9, z: 2.5 },
    ],
    closed: true,
    color: colors.armor,
    lineWidth: 8,
  });
  // forearm
  new Shape({
    points: [
      { x: 12*xSide, y: 12, z: 2.5 },
      { x: 12*xSide, y: 15, z: 2 },
    ],
    color: colors.fur,
    lineWidth: 8,
  });
  // hand
  new Shape({
    points: [ { x: 11*xSide, y: 18, z: 1} ],
    color: colors.armor,
    lineWidth: 10,
  });

  // leg
  new Shape({
    points: [
      { x: 6*xSide, y: 20, z: 0 },
      { x: 6*xSide, y: 27, z: 0 },
    ],
    color: colors.armor,
    lineWidth: 8,
  });

});

var cloakX0 = 8;
var cloakX1 = 5;
// var cloakX1 = 8;

var cloakY0 = 4;
var cloakY1 = 6;
var cloakY2 = 13;
var cloakY3 = 21;

var cloakZ0 = 0;
var cloakZ1 = 6;
var cloakZ2 = 8;

[ 1, -1 ].forEach( function( zSide ) {
  // top straps
  [ 1, -1 ].forEach( function( xSide ) {
    new Shape({
    points: [
        { x: cloakX0*xSide, y: cloakY0, z: cloakZ0*zSide },
        { x: cloakX0*xSide, y: cloakY1, z: cloakZ1*zSide },
        { x: cloakX1*xSide, y: cloakY1, z: cloakZ1*zSide },
      ],
      fill: true,
      color: colors.cloak,
      lineWidth: 4,
    });
  });

  var vNeckY = ( cloakY1+cloakY2 ) / 2;
  var vNeckZ = ( cloakZ2+cloakZ1 ) / 2 * zSide;
  new Shape({
    points: [
      { x: -cloakX0, y: cloakY1, z: cloakZ1*zSide },
      { x: -cloakX1, y: cloakY1, z: cloakZ1*zSide },
      { x: 0, y: vNeckY, z: vNeckZ },
      { x: cloakX1, y: cloakY1, z: cloakZ1*zSide },
      { x: cloakX0, y: cloakY1, z: cloakZ1*zSide },
      { x: cloakX0, y: cloakY2, z: cloakZ2*zSide },
      { x: -cloakX0, y: cloakY2, z: cloakZ2*zSide },
    ],
    fill: true,
    color: colors.cloak,
    lineWidth: 4,
  });
  new Shape({
    points: [
      { x: -cloakX0, y: cloakY2, z: cloakZ2*zSide },
      { x: cloakX0, y: cloakY2, z: cloakZ2*zSide },
      { x: cloakX0, y: cloakY3, z: cloakZ2*zSide },
      { x: -cloakX0, y: cloakY3, z: cloakZ2*zSide },
    ],
    fill: true,
    color: colors.cloak,
    lineWidth: 4,
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
  // rotate
  angleZ += rZSpeed;
  // perspective sort
  shapes.sort( function( a, b ) {
    return b.sortValue - a.sortValue;
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
