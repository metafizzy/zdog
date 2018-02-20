/* globals makeMadeline: false */

// -------------------------- demo -------------------------- //

var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
var w = 160;
var h = 160;
var minWindowSize = Math.min( window.innerWidth, window.innerHeight );
var zoom = Math.min( 7, Math.floor( minWindowSize / w ) );
var pixelRatio = window.devicePixelRatio || 1;
zoom *= pixelRatio;
var canvasWidth = canvas.width = w * zoom;
var canvasHeight = canvas.height = h * zoom;
// set canvas screen size
if ( pixelRatio > 1 ) {
  canvas.style.width = canvasWidth / pixelRatio + 'px';
  canvas.style.height = canvasHeight / pixelRatio + 'px';
}

var isRotating = true;

var madColor = {
  skin: '#FD9',
  hair: '#D64',
  parkaLight: '#ACC',
  parkaDark: '#799',
  tight: '#434',
};
var badColor = {
  skin: '#DBC',
  hair: '#A57',
  parkaLight: '#756',
  parkaDark: '#534',
  tight: '#332',
};

var featherGold = '#FE5';

var camera = new Shape({
  rendering: false,
  rotate: { y: TAU/4 },
});

// -- illustration shapes --- //

makeMadeline( camera, madColor );
makeMadeline( camera, badColor, { y: TAU/2 } );


// ----- feather ----- //

var feather = new Shape({
  rendering: false,
  addTo: camera,
  rotate: { y: -TAU/4 },
});

( function() {

  var featherPartCount = 8;
  var radius = 12;
  var angleX = (TAU/featherPartCount) / 2;
  var sector = (TAU * radius)/2 / featherPartCount;

  for ( var i=0; i < featherPartCount; i++ ) {
    var curve = Math.cos( (i/featherPartCount) * TAU*3/4 + TAU*1/4 );
    var x = 4 - curve*2;
    var y0 = sector/2;
    var isLast = i == featherPartCount - 1;
    var y2 = isLast ? sector * -1 : -y0;
    var z1 = -radius + 2 + curve*-1.5;
    var z2 = isLast ? -radius : -radius;
    var barb = new Shape({
      path: [
        { x: 0, y: y0, z: -radius },
        { x: x, y: -sector/2, z: z1 },
        { x: 0, y: y2, z: z2 },
      ],
      addTo: feather,
      rotate: { x: angleX * -i + TAU/8 },
      lineWidth: 2,
      color: featherGold,
      fill: true,
    });
    barb.copy({
      scale: { x: -1 },
    });
  }

  // rachis
  new Shape({
    path: [
      { y: radius },
      { arc: [
        { y: radius, z: -radius },
        { y: 0, z: -radius },
      ]},
    ],
    addTo: feather,
    lineWidth: 2,
    color: featherGold,
    closed: false,
  });
})();

// ----- rods ----- //

( function() {

  var rodCount = 16;
  for ( var i=0; i < rodCount; i++ ) {
    var zRotor = new Shape({
      rendering: false,
      addTo: camera,
      rotate: { z: TAU/rodCount * i },
    });

    var y0 = 32;
    var y1 = y0 + 2 + Math.random()*24;
    new Shape({
      path: [
        { y: y0 },
        { y: y1 },
      ],
      addTo: zRotor,
      rotate: { x: ( Math.random() * 2 - 1 ) * TAU/8 },

      color: 'white',
      lineWidth: 2,
    });
  }

})();

// -----  ----- //

var shapes = camera.getShapes();

// -- animate --- //

function animate() {
  update();
  render();
  requestAnimationFrame( animate );
}

animate();

// -- update -- //

function update() {
  camera.rotate.y += isRotating ? -TAU/150 : 0;

  // rotate
  camera.update();
  shapes.forEach( function( shape ) {
    shape.updateSortValue();
  });
  // perspective sort
  shapes.sort( function( a, b ) {
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
    var angleXMove = moveY / canvasWidth * TAU;
    var angleYMove = moveX / canvasWidth * TAU;
    camera.rotate.x = dragStartAngleX + angleXMove;
    camera.rotate.y = dragStartAngleY + angleYMove;
  },
});
