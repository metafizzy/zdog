/* jshint browser: true, devel: true, unused: true, undef: true */


var TAU = Math.PI * 2;
var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
var w = 72;
var h = 72;
var zoom = 6;
var canvasWidth = canvas.width = w * zoom;
var canvasHeight = canvas.height = h * zoom;

var anchor = {
  x: 8,
  y: 4,
  angle: TAU/12,
};

var square = {
  points: [
    { x:  4, y:  4 },
    { x: -4, y:  4 },
    { x: -4, y: -4 },
    { x:  4, y: -4 },
  ],
  angle: 0,
};



// -- animate --- //

function animate() {
  update();
  render();
  requestAnimationFrame( animate );
}

animate();

// ----- update ----- //

function update() {
  anchor.angle += TAU/360;
  square.angle -= TAU/200;
}

function getRotation( point, angle ) {
  var rZSin = Math.sin( angle );
  var rZCos = Math.cos( angle );

  return {
    x: point.x*rZCos - point.y*rZSin,
    y: point.y*rZCos + point.x*rZSin,
  };
}

// ----- render ----- //

function render() {
  ctx.clearRect( 0, 0, canvasWidth, canvasHeight );
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  ctx.save();
  ctx.scale( zoom, zoom );
  ctx.translate( w/2, h/2 );

  // render cross hairs
  ctx.strokeStyle = '#DDD';
  ctx.beginPath();
  ctx.moveTo( -16, 0 );
  ctx.lineTo( 16, 0 );
  ctx.moveTo( 0, -16 );
  ctx.lineTo( 0, 16 );
  ctx.stroke();
  ctx.closePath();


  ctx.strokeStyle = '#19F';
  ctx.beginPath();

  square.points.forEach( function( point, i ) {
    // moveTo first point, lineTo others
    var renderMethod = i ? 'lineTo' : 'moveTo';
    // rotate square
    var rotate0 = getRotation( point, square.angle );
    // translate
    var pt = {
      x: rotate0.x + anchor.x,
      y: rotate0.y + anchor.y,
    };
    // rotate
    var ptr = getRotation( pt, anchor.angle );
    ctx[ renderMethod ]( ptr.x, ptr.y );
  });

  ctx.closePath();
  ctx.stroke();

  ctx.restore();
}
