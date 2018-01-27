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
    // { x: 2, y: 14, z: 0 },
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


[ -1, 1 ].forEach( function( xSide ) {

  // eyes
  var x = 8 * xSide;
  new Shape({
    points: [
      { x: x, y: -13, z: -11 },
      { x: x, y: -9, z: -11 },
    ],
    color: colors.eye,
    lineWidth: 4,
  });

  // ears
  var frontEarZ = -4;
  var topEarY = -30;
  var earColor = colors.fur;

  var earA = { x: 14*xSide, y: topEarY+12, z: frontEarZ+2 };
  var earB = { x: 14*xSide, y: topEarY, z: frontEarZ };
  var earC = { x: 8*xSide, y: topEarY+11, z: frontEarZ+14 };
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
  [ 0, -4 ].forEach( function( yShift ) {
    var whiskerX0 = 10*xSide;
    var whiskerX1 = 16*xSide;
    var whiskerY0 = -5+yShift;
    var whiskerY1 = -3+yShift;

    new Shape({
      points: [
        { x: whiskerX0, y: whiskerY0, z: -7 },
        { x: whiskerX0, y: whiskerY1, z: -7 },
        { x: whiskerX1, y: whiskerY1, z: -7 },
      ],
      fill: true,
      color: colors.fur,
      lineWidth: 2,
    });
  });

  // snout
  new Shape({
    points: [
      { x: 6*xSide, y: -5, z: -4 },
      { x: 0, y: -5, z: -11 }, // snout tip
    ],
    color: colors.fur,
    lineWidth: 14,
  });


  // arms

  // shoulder
  new Shape({
    points: [
      { x: 13*xSide, y: 4, z: 0 },
      { x: 15*xSide, y: 8, z: 0 },
      { x: 15*xSide, y: 8, z: 4 },
      { x: 13*xSide, y: 4, z: 4 },
    ],
    closed: true,
    color: colors.armor,
    lineWidth: 6,
  });
  // arm
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
      { x: 6*xSide, y: 26, z: 0 },
    ],
    color: colors.armor,
    lineWidth: 8,
  });

});

var cloakX0 = 8;
// var cloakX1 = 8;

var cloakY0 = 4;
var cloakY1 = 6;
var cloakY2 = 13;
var cloakY3 = 20;

var cloakZ0 = 0;
var cloakZ1 = 6;
var cloakZ2 = 8;

[
  { ya: cloakY0, za: cloakZ0, yb: cloakY1, zb: cloakZ1 },
  { ya: cloakY1, za: cloakZ1, yb: cloakY2, zb: cloakZ2 },
  { ya: cloakY2, za: cloakZ2, yb: cloakY3, zb: cloakZ2 },
].forEach( function( yzPosition ) {
  [ 1, -1 ].forEach( function( zSide ) {
    var za = yzPosition.za * zSide;
    var zb = yzPosition.zb * zSide;
    new Shape({
      points: [
        { x: -cloakX0, y: yzPosition.ya, z: za },
        { x: cloakX0, y: yzPosition.ya, z: za },
        { x: cloakX0, y: yzPosition.yb, z: zb },
        { x: -cloakX0, y: yzPosition.yb, z: zb },
      ],
      fill: true,
      color: colors.cloak,
      lineWidth: 4,
    });
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
