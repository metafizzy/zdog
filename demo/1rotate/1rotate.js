/* jshint browser: true, devel: true, unused: true, undef: true */

// *~*~*~* Bless this mess *~*~*~* //

var TAU = Math.PI * 2;
var canvas = document.querySelector('canvas');
var rotateSlider= document.querySelector('.rotate-slider');
var ctx = canvas.getContext('2d');
var w = 48;
var h = 64;
var zoom = 8;
var canvasWidth = canvas.width = w * zoom;
var canvasHeight = canvas.height = h * zoom;
// colors
var colors = {
  fur: '#EA0',
  eye: '#333',
  inner: 'white',
  cloak: '#F18',
  // cloak: 'hsla(0, 100%, 50%, 0.2)',
  armor: '#915',
};

var isRotating = true;
var angleY = 0;
var rYCos, rYSin;
var persp = 0.5;

// -- Pseudo Vector3 class -- //

function Vector3( x, y, z ) {
  this.x = x;
  this.y = y;
  this.z = z;
}

Vector3.prototype.update = function() {
  var rzx = rYSin * -this.z;
  var rzy = rYCos * -this.z;
  var zx = this.x * rYCos;
  var zy = this.x * -rYSin;
  this.renderZ = rzy + zy;
  this.renderX = rzx + zx + w/2;
  this.renderY = this.renderZ * persp + this.y;
};

// -- Shape class -- //

// collection of shapes
var shapes = [];

function Shape( properties ) {
  // default
  this.stroke = true;
  this.fill = false;
  this.lineWidth = 1;
  this.closed = true;
  // extend properties
  for ( var propName in properties ) {
    this[ propName ] = properties[ propName ];
  }
  // convert plain ol' object to Vector3 object
  this.points = this.points.map( function( point ) {
    return new Vector3( point.x, point.y, point.z );
  });

  // add to collection
  shapes.push( this );
}

Shape.prototype.update = function() {
  var sortValueTotal = 0;
  this.points.forEach( function( point ) {
    point.update();
    sortValueTotal += point.y - point.renderZ;
  });

  // average sort value of all points
  // def not geometrically correct, but works for me
  this.sortValue = sortValueTotal / this.points.length;
};

Shape.prototype.render = function() {
  // set default color
  ctx.fillStyle = this.color;
  ctx.strokeStyle = this.color;
  // set any render properties
  ctx.lineWidth = this.lineWidth;
  ctx.lineCap = 'round';

  // render points
  ctx.beginPath();
  this.points.forEach( function( point, i ) {
    // moveTo first point, lineTo others
    var renderMethod = i ? 'lineTo' : 'moveTo';
    ctx[ renderMethod ]( point.renderX, point.renderY );
    // console.log( renderMethod, point.renderX, point.renderY );
  });
  // close path by return to first point
  var length = this.points.length;
  var isOnePoint = length == 1;
  var isClosed = this.closed && length > 2;
  if ( isOnePoint || isClosed ) {
    var point0 = this.points[0];
    ctx.lineTo( point0.renderX, point0.renderY );
  }
  if ( this.stroke ) {
    ctx.stroke();
  }
  if ( this.fill ) {
    ctx.fill();
  }
  // debugger;
  ctx.closePath();
};

// -- illustration shapes --- //

// body center
new Shape({
  points: [
    { x: -2, y: 42, z: 0 },
    { x: -2, y: 44, z: 0 },
    { x: 2, y: 44, z: 0 },
    { x: 2, y: 42, z: 0 },
  ],
  color: colors.inner,
  lineWidth: 12,
});

// head circle
new Shape({
  points: [
    { x: 0, y: 24, z: 0 },
  ],
  color: colors.fur,
  lineWidth: 32,
});


// left eye
new Shape({
  points: [
    { x: -8, y: 23, z: -11 },
    { x: -8, y: 27, z: -11 },
  ],
  color: colors.eye,
  lineWidth: 4,
});

// right eye
new Shape({
  points: [
    { x: 8, y: 23, z: -11 },
    { x: 8, y: 27, z: -11 },
  ],
  color: colors.eye,
  lineWidth: 4,
});

var frontEarZ = -4;
var topEarY = 8;

var earA = { x: -14, y: topEarY+12, z: frontEarZ+4 };
var earB = { x: -14, y: topEarY, z: frontEarZ };
var earC = { x: -8, y: topEarY+11, z: frontEarZ+14 };
var earD = { x: -10, y: topEarY, z: frontEarZ };
var earE = { x: -3, y: topEarY+5, z: frontEarZ-1 };

var earColor = colors.fur;

// left ear
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

new Shape({
  points: [
    { x: earA.x+4, y: earA.y-3, z: frontEarZ+1 },
    { x: earD.x, y: earD.y+5, z: frontEarZ-1 },
    { x: earE.x-4, y: earE.y+2, z: frontEarZ },
  ],
  color: colors.inner,
  fill: true,
  lineWidth: 3,
});

earA.x *= -1; earB.x *= -1; earC.x *= -1; earD.x *= -1; earE.x *= -1;

// right ear
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

new Shape({
  points: [
    { x: earA.x-4, y: earA.y-3, z: frontEarZ+1 },
    { x: earD.x, y: earD.y+5, z: frontEarZ-1 },
    { x: earE.x+4, y: earE.y+2, z: frontEarZ },
  ],
  color: colors.inner,
  fill: true,
  lineWidth: 3,
});

// snout
new Shape({
  points: [
    { x: -8, y: 29, z: -4 },
    { x: 0, y: 29, z: -10.5 }, // snout tip
    { x: 8, y: 29, z: -4 },
  ],
  color: colors.fur,
  lineWidth: 14,
});

// whiskers
var whiskerX0 = 7;
var whiskerX1 = 16;
var whiskerY0 = 28;
var whiskerY1 = 33;
var whiskerZ = -7;
var whiskerColor = colors.fur;

// left bottom whisker
new Shape({
  points: [
    { x: -whiskerX0, y: whiskerY0, z: whiskerZ },
    { x: -whiskerX0, y: whiskerY1, z: whiskerZ },
    { x: -whiskerX1, y: whiskerY1, z: whiskerZ },
  ],
  fill: true,
  color: whiskerColor,
  lineWidth: 2,
});
// left top whisker
new Shape({
  points: [
    { x: -whiskerX0-1, y: whiskerY0-4, z: whiskerZ },
    { x: -whiskerX0-1, y: whiskerY1-4, z: whiskerZ },
    { x: -whiskerX1-1, y: whiskerY1-4, z: whiskerZ },
  ],
  fill: true,
  color: whiskerColor,
  lineWidth: 2,
});

// left bottom whisker
new Shape({
  points: [
    { x: whiskerX0, y: whiskerY0, z: whiskerZ },
    { x: whiskerX0, y: whiskerY1, z: whiskerZ },
    { x: whiskerX1, y: whiskerY1, z: whiskerZ },
  ],
  fill: true,
  color: whiskerColor,
  lineWidth: 2,
});
// left top whisker
new Shape({
  points: [
    { x: whiskerX0+1, y: whiskerY0-4, z: whiskerZ },
    { x: whiskerX0+1, y: whiskerY1-4, z: whiskerZ },
    { x: whiskerX1+1, y: whiskerY1-4, z: whiskerZ },
  ],
  fill: true,
  color: whiskerColor,
  lineWidth: 2,
});



// left shoulder
new Shape({
  points: [
    { x: -11, y: 38, z: 2 },
    { x: -12, y: 40, z: 2 },
  ],
  closed: false,
  color: colors.armor,
  lineWidth: 8,
});
// right shoulder
new Shape({
  points: [
    { x: 11, y: 38, z: 2 },
    { x: 12, y: 40, z: 2 },
  ],
  color: colors.armor,
  lineWidth: 8,
});

// left arm
new Shape({
  points: [
    { x: -12, y: 42, z: 2 },
    { x: -12, y: 44, z: 2 },
  ],
  color: colors.fur,
  lineWidth: 8,
});
// right arm
new Shape({
  points: [
    { x: 12, y: 42, z: 2 },
    { x: 12, y: 44, z: 2 },
  ],
  color: colors.fur,
  lineWidth: 8,
});

// left hand
new Shape({
  points: [ { x: -11, y: 46, z: 1} ],
  color: colors.armor,
  lineWidth: 10,
});
// right hand
new Shape({
  points: [ { x: 11, y: 46, z: 1} ],
  color: colors.armor,
  lineWidth: 10,
});

// left leg
new Shape({
  points: [
    { x: -6, y: 48, z: 0 },
    { x: -6, y: 52, z: 0 },
  ],
  color: colors.armor,
  lineWidth: 8,
});
// right leg
new Shape({
  points: [
    { x: 6, y: 48, z: 0 },
    { x: 6, y: 52, z: 0 },
  ],
  color: colors.armor,
  lineWidth: 8,
});


var cloakX0 = 8;
// var cloakX1 = 8;

var cloakY0 = 35;
var cloakY1 = 37;
var cloakY2 = 40;
var cloakY3 = 47;

var cloakZ0 = 0;
var cloakZ1 = 5;
var cloakZ2 = 7;

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
  angleY += isRotating ? TAU/180 : 0;
  rYCos = Math.cos( angleY );
  rYSin = Math.sin( angleY );
  // perspective sort
  shapes.sort( function( a, b ) {
    return ( b.sortValue ) - ( a.sortValue );
  });
  // render shapes
  shapes.forEach( function( shape ) {
    shape.update();
  });
}

// -- render -- //

function render() {
  ctx.clearRect( 0, 0, canvasWidth, canvasHeight );
ctx.lineCap = 'round';
ctx.lineJoin = 'round';

  ctx.save();
  ctx.scale( zoom, zoom );
  ctx.translate( 0, 3 );

  shapes.forEach( function( shape ) {
    shape.render();
  });

  ctx.restore();
}

// ----- inputs ----- //

rotateSlider.addEventListener( 'input', function() {
  isRotating = false;
  angleY = parseInt( rotateSlider.value ) / 360 * TAU;
  // console.log( rotateSlider.value )
});
