var TAU = Math.PI * 2;

var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
var canvasW = canvas.width;
var canvasH = canvas.height;



var radius = 100;
var distance = 150;
var eccen = 0.6;

function animate() {
  render();
  requestAnimationFrame( animate );
  // ctx.clearRect( 0, 0, canvasW, canvasH );
}

animate();

function render() {
  ctx.clearRect( 0, 0, canvasW, canvasH );

  ctx.save();
  ctx.translate( canvasW/2, canvasH/2 );

  renderSemiCircle();
  var expandDistance = distance/eccen;
  // expand tip
  dot( 0, -expandDistance );

  var expandTheta = Math.acos( radius/ expandDistance );
  var tangentX = Math.sin( expandTheta ) * radius;
  var expandTangentY = Math.cos( expandTheta ) * radius * -1;
  dot( tangentX, expandTangentY );

  line( 0, -expandDistance, tangentX, expandTangentY );


  ctx.save();
  ctx.scale( 1, eccen );
  renderSemiCircle();
  ctx.restore();
  // dot( expandTangentX, expandTangentY );
  // tip
  dot( 0, -distance );
  var tangentY = expandTangentY * eccen;
  dot( tangentX, tangentY );
  line( 0, -distance, tangentX, tangentY )
  line( 0, -distance, -tangentX, tangentY )
  

  ctx.restore();
}

function renderScene() {

}

function renderSemiCircle() {
  ctx.strokeStyle = 'hsla(210, 100%, 50%, 0.8)';
  ctx.beginPath();
  ctx.arc( 0, 0, radius, TAU/2, TAU );
  ctx.stroke();

}


function dot( x, y ) {
  ctx.fillStyle = 'hsla(0, 100%, 40%, 0.8)';
  ctx.beginPath();
  ctx.arc( x, y, 2, 0, TAU );
  ctx.fill();
}

function line( x1, y1, x2, y2 ) {
  ctx.strokeStyle = 'hsla(0, 100%, 40%, 0.4)';
  ctx.beginPath();
  ctx.moveTo( x1, y1 );
  ctx.lineTo( x2, y2 );
  ctx.stroke();
}