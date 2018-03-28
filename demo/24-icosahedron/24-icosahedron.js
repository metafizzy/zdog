// -------------------------- demo -------------------------- //

var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
var w = 48;
var h = 48;
var minWindowSize = Math.min( window.innerWidth, window.innerHeight );
var zoom = Math.min( 10, Math.floor( minWindowSize / w ) );
var pixelRatio = window.devicePixelRatio || 1;
zoom *= pixelRatio;
var canvasWidth = canvas.width = w * zoom;
var canvasHeight = canvas.height = h * zoom;
// set canvas screen size
if ( pixelRatio > 1 ) {
  canvas.style.width = canvasWidth / pixelRatio + 'px';
  canvas.style.height = canvasHeight / pixelRatio + 'px';
}

var PHI = ( Math.sqrt(5) - 1 ) / 2;
var isRotating = true;
var cameraT = 0;
var cameraSpeed = TAU/180;
// colors
var yellow = '#ED0';
var gold = '#EA0';
var orange = '#E62';
var magenta = '#C25';
var navy = '#249';

// -- illustration shapes --- //

var scene = new Anchor({
  // rotate: { z: TAU/8 },
});

// -----  ----- //

var a = 14;
var b = a * PHI;

var dot = new Shape({
  rendering: false,
  translate: { x: 0, y: a, z: b },
  addTo: scene,
  lineWidth: 1,
  color: navy,
});
dot.copy({ translate: { x: 0, y: -a, z: -b } });

dot.copy({ translate: { x:  b, y:  0, z:  a }, color: gold });
dot.copy({ translate: { x: -b, y:  0, z: -a }, color: gold });

dot.copy({ translate: { x:  a, y:  b, z:  0 }, color: magenta });
dot.copy({ translate: { x: -a, y: -b, z:  0 }, color: magenta });

dot.copy({ translate: { x:  0, y:  a, z: -b }, color: orange });
dot.copy({ translate: { x:  0, y: -a, z:  b }, color: orange });

dot.copy({ translate: { x: -b, y:  0, z:  a }, color: yellow });
dot.copy({ translate: { x:  b, y:  0, z: -a }, color: yellow });

dot.copy({ translate: { x:  a, y: -b, z:  0 } });
dot.copy({ translate: { x: -a, y:  b, z:  0 } });

// -----  ----- //


hemisphere({
  size: 13,
  addTo: scene,
  translate: { y: -16 },
  rotate: { x: -TAU/4 },
  insideColor: gold,
  outsideColor: navy,
  stroke: false,
  fill: true,
});
hemisphere({
  size: 13,
  addTo: scene,
  translate: { y: 16 },
  rotate: { x: TAU/4 },
  insideColor: gold,
  outsideColor: navy,
  stroke: false,
  fill: true,
});

var colorWheel = [ navy, magenta, orange, gold, yellow ];

( function() {

  for ( var i=0; i < 5; i++ ) {
    var rotor1 = new Anchor({
      addTo: scene,
      rotate: { y: TAU/5 * i },
    });
    var rotor2 = new Anchor({
      addTo: rotor1,
      rotate: { x: TAU/6 },
    });

    hemisphere({
      size: 13,
      addTo: rotor2,
      translate: { y: 16 },
      rotate: { x: TAU/4 },
      outsideColor: colorWheel[i],
      insideColor: colorWheel[ (i+7) % 5 ],
      stroke: false,
      fill: true,
    });
  }

})();
( function() {

  for ( var i=0; i < 5; i++ ) {
    var rotor1 = new Anchor({
      addTo: scene,
      rotate: { y: TAU/5 * i },
    });
    var rotor2 = new Anchor({
      addTo: rotor1,
      rotate: { x: TAU/6 },
    })
    hemisphere({
      size: 13,
      addTo: rotor2,
      translate: { y: -16 },
      rotate: { x: -TAU/4 },
      outsideColor: colorWheel[i],
      insideColor: colorWheel[ (i+7) % 5 ],
      stroke: false,
      fill: true,
    });
  }


})();

// -- animate --- //

function animate() {
  update();
  render();
  requestAnimationFrame( animate );
}

animate();

// -- update -- //

function update() {
  if ( isRotating ) {
    cameraT += cameraSpeed;
    scene.rotate.y = cameraT;
    scene.rotate.x = Math.sin( cameraT/4 ) * TAU/8;
  }

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
