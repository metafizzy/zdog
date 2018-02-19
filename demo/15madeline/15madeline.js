// -------------------------- demo -------------------------- //

var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
var w = 64;
var h = 64;
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

var camera = new Shape({
  rendering: false,
});

// -- illustration shapes --- //

var body = new Shape({
  rendering: false,
  addTo: camera,
  rotate: { x: TAU/8 },
});

var head = new Shape({
  rendering: false,
  addTo: body,
  translate: { y: -11, z: 2 },
  rotate: { x: -TAU/8 },
});

// face
new Ellipse({
  width: 6,
  height: 6,
  addTo: head,
  translate: { z: -4 },
  lineWidth: 8,
  color: madColor.skin,
});

// back head
new Shape({
  path: [
    { x: -1 },
    { x: 1 },
  ],
  addTo: head,
  translate: { y: -4, z: 1 },
  lineWidth: 18,
  color: madColor.hair,
});

var bang = new Shape({
  path: [
    {},
    { arc: [
      { z: -4, y: 4 },
      { z: 0, y: 8 },
    ]},
  ],
  addTo: head,
  translate: { x: 2, y: -7.5, z: -6 },
  rotate: { x: -0.5, z: -0.5 },
  lineWidth: 4,
  color: madColor.hair,
  closed: false,
});
bang.copy({
  translate: { x: 5, y: -6, z: -5 },
  rotate: { x: 0.3, z: -0.5 },
});
bang.copy({
  translate: { x: 5, y: -6, z: -3 },
  rotate: { y: 0.7, z: -1 },
});

// left side
bang.copy({
  translate: { x: -2, y: -7.5, z: -6 },
  rotate: { x: 0, z: TAU/16*6 },
});
bang.copy({
  translate: { x: -5, y: -6, z: -5 },
  rotate: { x: 0, z: TAU/4 },
});
bang.copy({
  translate: { x: -5, y: -6, z: -3 },
  rotate: { y: -0.7, z: 1 },
});


// hair cover
new Shape({
  path: [
    { x: -3 },
    { x:  3 },
  ],
  addTo: head,
  lineWidth: 7,
  translate: { y: -8, z: -5 },
  color: madColor.hair,
});

var lock = new Shape({
  path: [
    { y: 0 },
    { y: 25 },
  ],
  addTo: head,
  translate: { y: -4, z: 6 },
  rotate: { x: TAU/4 },
  lineWidth: 8,
  color: madColor.hair,
});
lock.copy({
  translate: { x: -6, y: -4, z: 6 },
});
lock.copy({
  translate: { x: 6, y: -4, z: 6 },
});

// ----- torso ----- //


// 2nd rib
var torsoRib = new Ellipse({
  width: 10,
  height: 10,
  addTo: body,
  rotate: { x: TAU/4 },
  translate: { y: -1 },
  lineWidth: 6,
  color: madColor.parkaLight,
  fill: true,
});
// neck rib
torsoRib.copy({
  width: 6,
  height: 6,
  translate: { y: -5 },
});
// 3rd rib
torsoRib.copy({
  translate: { y: 3 },
});
// 4th rib
torsoRib.copy({
  translate: { y: 7 },
  color: madColor.parkaDark,
});
// waist
new Ellipse({
  width: 10,
  height: 8,
  addTo: body,
  rotate: { x: TAU/4 },
  translate: { y: 11 },
  lineWidth: 4,
  color: madColor.tight,
  fill: true,
});


// arms
[ -1, 1 ].forEach( function( xSide ) {
  var shoulderJoint = new Shape({
    rendering: false,
    addTo: body,
    translate: { x: 9*xSide, y: -3, z: 2 },
  });

  // top shoulder rib
  var armRib = new Ellipse({
    width: 2,
    height: 2,
    rotate: { x: TAU/4 },
    addTo: shoulderJoint,
    translate: { x: 0*xSide },
    lineWidth: 6,
    color: madColor.parkaLight,
    fill: true,
  });
  armRib.copy({
    translate: { y: 4 },
  });

  var elbowJoint = new Shape({
    rendering: false,
    addTo: shoulderJoint,
    translate: { y: 8 },
  });

  armRib.copy({
    addTo: elbowJoint,
    translate: { x: 0, y: 0 },
  });
  armRib.copy({
    addTo: elbowJoint,
    translate: { y: 4 },
    color: madColor.parkaDark,
  });

  // hand
  new Shape({
    addTo: elbowJoint,
    translate: { y: 9, z: -1 },
    lineWidth: 8,
    color: madColor.skin,
  });

  if ( xSide == 1 ) {
    // extend left hand
    shoulderJoint.rotate = Vector3.sanitize({ x: -TAU/8*3, z: -TAU/32 });
  } else {
    // back right hand
    shoulderJoint.rotate = Vector3.sanitize({ z: TAU/16*2, x: TAU/16*2 });
    elbowJoint.rotate = Vector3.sanitize({ z: TAU/8 });
  }

  // ----- legs ----- //
  var knee = { y: 7 };
  var thigh = new Shape({
    path: [ { y: 0 }, knee ],
    addTo: body,
    translate: { x: 4.5*xSide, y: 13 },
    lineWidth: 7,
    color: madColor.tight,
  });

  var shin = new Shape({
    path: [ { y: 0 }, { y: 8 } ],
    addTo: thigh,
    lineWidth: 6,
    translate: knee,
    color: madColor.tight,
  });

  if ( xSide == -1 ) {
    // bend right leg
    thigh.rotate = Vector3.sanitize({ x: -TAU/16*3, z: TAU/16 });
    shin.rotate = Vector3.sanitize({ x: TAU/16*5 });
  }

});

// butt
new Shape({
  path: [
    { x: -3 },
    { x: 3 },
  ],
  rendering: false,
  addTo: body,
  translate: { y: 11, z: 2 },
  lineWidth: 8,
  color: madColor.tight,
});


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
  camera.rotate.y += isRotating ? +TAU/150 : 0;

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
