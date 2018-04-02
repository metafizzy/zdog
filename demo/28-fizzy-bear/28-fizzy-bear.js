// -------------------------- demo -------------------------- //

var canvas = document.querySelector('canvas');
// unibody canvas for compositing
var unibodyCanvas = document.createElement('canvas');
var bodyLinesCanvas = document.createElement('canvas');
var ctx = canvas.getContext('2d');
var unibodyCtx = unibodyCanvas.getContext('2d');
var bodyLinesCtx = bodyLinesCanvas.getContext('2d');
// document.body.appendChild( bodyLinesCanvas );
var w = 88;
var h = 88;
var minWindowSize = Math.min( window.innerWidth, window.innerHeight );
var zoom = Math.min( 6, Math.floor( minWindowSize / w ) );
var pixelRatio = window.devicePixelRatio || 1;
zoom *= pixelRatio;
var canvasWidth = canvas.width = w * zoom;
var canvasHeight = canvas.height = h * zoom;
// set canvas screen size
if ( pixelRatio > 1 ) {
  canvas.style.width = canvasWidth / pixelRatio + 'px';
  canvas.style.height = canvasHeight / pixelRatio + 'px';
}
unibodyCanvas.width = bodyLinesCanvas.width = canvasWidth;
unibodyCanvas.height = bodyLinesCanvas.height = canvasHeight;

var isRotating = true;

var jumpRotation = new Vector3({
  x: -10/360 * TAU,
  y: 18/360 * TAU,
  z: -31/360 * TAU,
});

// colors
var magenta = '#C25';
var orange = '#E62';
var gold = '#EA0';
var blue = '#19F';
var black = '#333';

var camera = new Anchor();

var outlineCamera = new Anchor();

// -- illustration shapes --- //
var positiveUnibody, rightLegCutInA, rightLegCutInB, bodyCutIn, backLegCutIn;


[ false, true ].forEach( function( isOutline ) {
  var shapeCamera = isOutline ? outlineCamera : camera;
  var outlineWidth = isOutline ? 8 : 0;

  // unibody
  var unibody = new Rect({
    width: 6,
    height: 14,
    addTo: shapeCamera,
    translate: { y: -1 },
    color: isOutline ? black : magenta,
    lineWidth: 28 + outlineWidth,
    fill: true,
  });

  if ( !isOutline ) {
    // set positiveUnibody
    positiveUnibody = unibody;
    // body cut-in
    // cut-in points
    var ciA = new Vector3({ z: 0, y: -23 });
    var ciB = new Vector3({ z: -16, y: -7 });
    var ciC = new Vector3({ z: -16, y: 7 });
    var ciD = new Vector3({ z: 0, y: 23 });
    // 45 degree points
    var topPoints = getQuarterArcPoints( ciA, ciB );
    var bottomPoints = getQuarterArcPoints( ciD, ciC );

    var cutInPath = [
      topPoints[0],
      { bezier: [ topPoints[1], topPoints[2], ciB ] },
      ciC,
      { bezier: [ bottomPoints[2], bottomPoints[1], bottomPoints[0] ] },
    ];

    bodyCutIn = new Shape({
      path: cutInPath,
      translate: { x: 3 },
      addTo: unibody,
      color: black,
      closed: false,
      lineWidth: 4,
    });

  }

  // right ear
  var ear = new Ellipse({
    width: 4,
    height: 4,
    addTo: unibody,
    translate: { x: -14, y: -19, z: 2 },
    color: isOutline ? black : magenta,
    lineWidth: 8 + outlineWidth,
  });
  // left ear
  ear.copy({
    translate: { x: 14, y: -19, z: 2 },
  });


  // face container
  var face = new Anchor({
    translate: { y: -2, z: -14 },
    addTo: unibody,
  });

  // snout
  new Ellipse({
    width: 8,
    height: 4,
    addTo: face,
    translate: { y: 4, z: -1 },
    color: isOutline ? black : 'white',
    lineWidth: 6 + outlineWidth,
    fill: true,
  });

  if ( !isOutline ) {
    // nose
    new Shape({
      path: [
        { x: -1.5, y: 0 },
        { x: 1.5, y: 0 },
        { x: 0, y: 0.5 },
      ],
      addTo: face,
      translate: { y: 1.5, z: -4 },
      color: black,
      lineWidth: 3,
      fill: true,
    });

    // right eye
    var eye = new Shape({
      path: [
        { x: -4, y: 0 },
        { arc: [
          { x: -4, y: -4 },
          { x: 0, y: -4 }
        ]},
        { arc: [
          { x: 4, y: -4 },
          { x: 4, y: 0 } 
        ]},
        { arc: [
          { x: 3, y: -1.5 },
          { x: 0, y: -1.5 } 
        ]},
        { arc: [
          { x: -3, y: -1.5 },
          { x: -4, y: 0 } 
        ]},
      ],
      addTo: face,
      translate: { y: -3.25, x: -7.5, z: 0 },
      scale: { x: 0.6, y: 0.5 },
      color: black,
      lineWidth: 2,
      closed: false,
      fill: true,
    });
    // left eye
    eye.copy({
      translate: { y: -3.25, x: 7.5, z: 0 },
    });

  }


  // right arm
  new Shape({
    path: [
      { x: -1 },
      { x: -8 },
    ],
    addTo: unibody,
    translate: { x: -17, y: 5 },
    rotate: { y: -0.25 },
    color: isOutline ? black : gold,
    lineWidth: 12 + outlineWidth,
  });
  // left arm
  new Shape({
    path: [
      { x: 0 },
      {
        bezier: [
          { x: 0, y: 0 },
          { x: 5, y: -3 },
          { x: 8, y: -11 },
        ]
      }
    ],
    addTo: unibody,
    translate: { x: 18, y: 5 },
    rotate: {  x: 0.4 },
    color: isOutline ? black : gold,
    lineWidth: 12 + outlineWidth,
    closed: false,
  });

  // right leg
  var rightLeg = new Shape({
    path: [
      { y: 4 },
      { y: 15 },
    ],
    addTo: unibody,
    translate: { x: -10, y: 13, z: 1 },
    rotate: { z: 49/360 * TAU, x: 0.3 },
    color: isOutline ? black : blue,
    lineWidth: 12 + outlineWidth,
  });

  // right leg cut-in
  if ( !isOutline ) {
    rightLegCutInA = new Shape({
      path: [
        { z: -8, y: 4 },
        { z: -8, y: 15 },
        // {
        //   arc: [
        //     { z: -8, y: 23 },
        //     { z: 0, y: 23 },
        //   ]
        // }
      ],
      addTo: rightLeg,
      // rotate: { y: 1 },
      closed: false,
      color: black,
      lineWidth: 4,
    });
    rightLegCutInB = rightLegCutInA.copy({
      scale: { z: -1 },
    });
  }


  // left leg
  var leftThigh = new Shape({
    path: [
      { y: 2 },
      { y: 13 },
    ],
    addTo: unibody,
    translate: { x: 9, y: 13, z: 1 },
    rotate: { z: 49/360 * TAU, x: 0.2 },
    color: isOutline ? black : blue,
    lineWidth: 12 + outlineWidth,
  });
  // left shin
  var leftShin = new Shape({
    path: [
      { y: 0 },
      { y: 12 },
    ],
    addTo: leftThigh,
    translate: leftThigh.path[1],
    rotate: { z: 0.2, x: 0.8 },
    color: isOutline ? black : blue,
    lineWidth: 12 + outlineWidth,
  });

  if ( !isOutline ) {
    backLegCutIn = new Shape({
      path: [
        { z: -8, y: -14 },
        { z: -8, y: -8 },
        // { arc: [
        //   { z: -8, y: 0 },
        //   { z: 0, y: 0 },
        // ]},
      ],
      addTo: leftShin,
      translate: { y: 20 },
      closed: false,
      // rotate: { y: 1 },
      color: black,
      lineWidth: 4,
    });
  }

});

var bodyFillWidth = 34;
var bodyFillDepth = 28;
var bodyLineWidth = 10.5;

var blXA = (bodyFillWidth - bodyLineWidth) / 2 + 2.75;
var blXB = (bodyFillWidth - bodyFillDepth) / 2 + 2.75;
var blZ  = (bodyFillDepth - bodyLineWidth) / 2 + 2.75;

var bodyLinesCamera = new Anchor();
// body lines
[ magenta, orange, gold, blue ].map( function( color, i ) {
  return new RoundedRect({
    width: blXA * 2,
    height: blZ * 2,
    radius: blZ,
    addTo: bodyLinesCamera,
    translate: { y: -16.75 + 10.5*i },
    rotate: { x: TAU/4 },
    color: color,
    lineWidth: 11,
    fill: true,
    closed: false,
  });
});

// unibody composited rendering
var unibodyRender = positiveUnibody.render;
positiveUnibody.render = function( ctx ) {
  // render unibody on its own canvas, so we can use lineWidth
  unibodyRender.call( positiveUnibody, unibodyCtx );
  // render body lines separately, on its own canvas
  bodyLinesCtx.globalCompositeOperation = 'source-over';
  bodyLinesCamera.renderGraph( bodyLinesCtx );
  // composite bodyLines in unibody
  bodyLinesCtx.restore();
  bodyLinesCtx.globalCompositeOperation = 'destination-in';
  bodyLinesCtx.drawImage( unibodyCanvas, 0, 0 );
  zoomContext( bodyLinesCtx );
  // draw unibody composite on to canvas
  ctx.restore();
  ctx.drawImage( bodyLinesCanvas, 0, 0 );
  zoomContext( ctx );
};

// -- animate --- //

var t = 0;

function animate() {
  update();
  render();
  requestAnimationFrame( animate );
}

animate();

// -- update -- //

// i, 0->1
function easeInOut( i ) {
  var isFirstHalf = i < 0.5;
  var i1 = isFirstHalf ? i : 1 - i;
  i1 = i1 / 0.5;
  // make easing steeper with more multiples
  var i2 = i1 * i1 * i1;
  i2 = i2 / 2;
  return isFirstHalf ? i2 : i2*-1 + 1;
}

function update() {
  if ( isRotating ) {
    t += TAU/180;
    var easeT = easeInOut( ( t/TAU) % 1 );
    camera.rotate.y = easeT*TAU*-2 + jumpRotation.y;
  }

  camera.normalizeRotate();
  // sync cameras
  outlineCamera.rotate.set( camera.rotate );
  bodyLinesCamera.rotate.set( camera.rotate );

  // normalize angle y
  var cameraRY = camera.rotate.y = modulo( camera.rotate.y, TAU );
  // update cut-in rotates
  rightLegCutInA.rotate.y = 1.2 - cameraRY;
  rightLegCutInB.rotate.y = 1.2 - cameraRY;
  backLegCutIn.rotate.y = 1.4 - cameraRY;
  var isCameraYFront = cameraRY < TAU/4 || cameraRY > TAU *3/4;
  var isCameraYRight = cameraRY < TAU/2;
  bodyCutIn.rotate.y = isCameraYFront == isCameraYRight ? 1.5 : -1.5;
  bodyCutIn.rotate.y -= cameraRY;
  bodyCutIn.translate.x = isCameraYRight ? 3 : -3;

  // update cameras
  outlineCamera.updateGraph();
  camera.updateGraph();
  bodyLinesCamera.updateGraph();
}

// -- render -- //
ctx.lineCap = 'round';
ctx.lineJoin = 'round';
unibodyCtx.lineCap = bodyLinesCtx.lineCap = 'round';
unibodyCtx.lineJoin = bodyLinesCtx.lineJoin  = 'round';
setJumpRotate();

function render() {
  ctx.clearRect( 0, 0, canvasWidth, canvasHeight );
  unibodyCtx.clearRect( 0, 0, canvasWidth, canvasHeight );
  bodyLinesCtx.clearRect( 0, 0, canvasWidth, canvasHeight );
  zoomContext( ctx );
  zoomContext( unibodyCtx );
  zoomContext( bodyLinesCtx );

  outlineCamera.renderGraph( ctx );
  camera.renderGraph( ctx );

  ctx.restore();
  unibodyCtx.restore();
  bodyLinesCtx.restore();
}

function zoomContext( context ) {
  context.save();
  context.scale( zoom, zoom );
  /* nudge up to center (lazy) */
  context.translate( w/2, h/2 - 4 );
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

document.querySelector('.flat-button').onclick = function() {
  camera.rotate.set({ x: 0, y: 0, z: 0 });
};

document.querySelector('.jump-button').onclick = setJumpRotate;

function setJumpRotate() {
  camera.rotate.set( jumpRotation );
}

function getQuarterArcPoints( a, b ) {
  var start = new Vector3({
    z: lerp( a.z, b.z, 5/7 ),
    y: lerp( a.y, b.y, 2/7 ),
  });
  // control points
  var cp0 = new Vector3({
    z: lerp( a.z, b.z, 24/28 ),
    y: lerp( a.y, b.y, 12/28 ),
  });
  var cp1 = new Vector3({
    z: b.z,
    y: lerp( a.y, b.y, 5/7 ),
  });

  return [ start, cp0, cp1 ];
}
