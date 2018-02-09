/* jshint browser: true, devel: true, unused: true, undef: true */
/* globals Shape */

var TAU = Math.PI * 2;
var canvas = document.querySelector('canvas');
// unibody canvas for compositing
var unibodyCanvas = document.createElement('canvas');
var bodyLinesCanvas = document.createElement('canvas');
var ctx = canvas.getContext('2d');
var unibodyCtx = unibodyCanvas.getContext('2d');
var bodyLinesCtx = bodyLinesCanvas.getContext('2d');
var w = 88;
var h = 88;
var zoom = 5;
var canvasWidth = canvas.width =  w * zoom;
var canvasHeight = canvas.height = h * zoom;
unibodyCanvas.width = bodyLinesCanvas.width = canvasWidth;
unibodyCanvas.height = bodyLinesCanvas.height = canvasHeight;


// colors
var magenta = '#C25';
var orange = '#E62';
var gold = '#EA0';
var blue = '#19F';
var black = '#333';

var camera = new Shape({
  rendering: false,
});

var outlineCamera = new Shape({
  rendering: false,
});

// -- illustration shapes --- //
var positiveUnibody, rightLegCutIn, bodyLeftCutIn, bodyRightCutIn, backLegCutIn;


[ false, true ].forEach( function( isOutline ) {
  var shapeCamera = isOutline ? outlineCamera : camera;
  var outlineWidth = isOutline ? 8 : 0;

  // unibody
  var unibody = new Shape({
    path: [
      // {},
      { x: -3, y: -8 },
      { x:  3, y: -8 },
      { x:  3, y:  6 },
      { x: -3, y:  6 },
    ],
    addTo: shapeCamera,
    // rendering: false,
    color: isOutline ? black : magenta,
    lineWidth: 28 + outlineWidth,
    fill: true,
  });

  if ( !isOutline ) {
    positiveUnibody = unibody;

    bodyLeftCutIn = new Shape({
      path: [
        { z: -15.5, y: -12 },
        { z: -16, y: -9 },
        { z: -16, y: 7 },
        { z: -15.5, y: 10 },
      ],
      translate: { x: 3 },
      rotate: { y: 1.1 },
      addTo: unibody,
      color: black,
      closed: false,
      lineWidth: 4,
    });
    bodyRightCutIn = new Shape({
      path: [
        { z: -15.5, y: -12 },
        { z: -16, y: -9 },
        { z: -16, y: 7 },
        { z: -15.5, y: 10 },
      ],
      translate: { x: -3 },
      rotate: { y: -1.1 },
      addTo: unibody,
      color: black,
      closed: false,
      lineWidth: 4,
    });

  }

  // right ear
  new Shape({
    path: [ { x: -14, y: -20, z: 2 } ],
    addTo: unibody,
    color: isOutline ? black : magenta,
    lineWidth: 12 + outlineWidth,
  });
  // left ear
  new Shape({
    path: [ { x: 14, y: -20, z: 2 } ],
    addTo: unibody,
    color: isOutline ? black : magenta,
    lineWidth: 12 + outlineWidth,
  });


  // face container
  var face = new Shape({
    rendering: false,
    translate: { y: -3, z: -14 },
    addTo: unibody,
  });

  // snout
  new Shape({
    path: [
      { x: -2, y: -2 },
      { x: 2, y: -2 },
      { x: 4, y: 0 },
      { x: 2, y: 2 },
      { x: -2, y: 2 },
      { x: -4, y: 0 },
    ],
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

    // eyes
    var eyePoints = [
      { x: -2.5, y: 1, },
      { x: -1, y: -0.5 },
      { x: 1, y: -0.5 },
      { x: 2.5, y: 1, },
    ];

    // right eye
    new Shape({
      path: eyePoints,
      addTo: face,
      translate: { y: -5, x: -7.5, z: 0 },
      // rotate: { y: -0.3 },
      color: black,
      lineWidth: 3,
      closed: false,
    });
    // left eye
    new Shape({
      path: eyePoints,
      addTo: face,
      translate: { y: -5, x: 7.5, z: 0 },
      // rotate: { y: 0.3 },
      color: black,
      lineWidth: 3,
      closed: false,
    });

  }


  // right arm
  var rightArm = new Shape({
    path: [
      { x: 0 },
      { x: -8 },
    ],
    addTo: unibody,
    translate: { x: -17, y: 4 },
    rotate: { y: -0.25 },
    color: isOutline ? black : gold,
    lineWidth: 12 + outlineWidth,
  });
  // left arm
  var leftShoulder = new Shape({
    path: [
      { x: 0 },
      { x: 6 },
    ],
    addTo: unibody,
    translate: { x: 16, y: 4 },
    rotate: { z: -35/360 * TAU, x: 0.4 },
    color: isOutline ? black : gold,
    lineWidth: 12 + outlineWidth,
  });
  // left forearm
  new Shape({
    path: [
      { x: 0 },
      { x: 11 },
    ],
    addTo: leftShoulder,
    translate: leftShoulder.path[1],
    rotate: { z: -35/360 * TAU },
    color: isOutline ? black : gold,
    lineWidth: 12 + outlineWidth,
  });

  // right leg
  var rightLeg = new Shape({
    path: [
      { y: 4 },
      { y: 15 },
    ],
    addTo: unibody,
    translate: { x: -10, y: 12, z: 1 },
    rotate: { z: 49/360 * TAU, x: 0.3 },
    color: isOutline ? black : blue,
    lineWidth: 12 + outlineWidth,
  });

  // right leg cut-in
  if ( !isOutline ) {
    rightLegCutIn = new Shape({
      path: [
        { z: -8, y: 4 },
        { z: -8, y: 15 },
      ],
      addTo: rightLeg,
      // rotate: { y: 1 },
      color: black,
      lineWidth: 4,
    });
  }


  // left leg
  var leftThigh = new Shape({
    path: [
      { y: 2 },
      { y: 13 },
    ],
    addTo: unibody,
    translate: { x: 9, y: 12, z: 1 },
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
        { z: -8, y: 6 },
        { z: -8, y: 13 },
      ],
      addTo: leftShin,
      // rotate: { y: 1 },
      color: black,
      lineWidth: 4,
    });
  }

});



// body lines
var bodyLines = [ magenta, orange, gold, blue ].map( function( color, i ) {
  return new Shape({
    path: [
      { x: -15, z: 0 },
      { x: -9, z: -12 },
      { x:  9, z: -12 },
      { x:  15, z: 0 },
      { x:  9, z:  12 },
      { x: -9, z:  12 },
    ],
    addTo: positiveUnibody,
    translate: { y: -16.75 + 10.5*i },
    color: color,
    lineWidth: 11,
    fill: true,
  });
});

// unibody composited rendering
var unibodyRender = positiveUnibody.render;
positiveUnibody.render = function( ctx ) {
  // render unibody on its own canvas, so we can use lineWidth
  unibodyRender.call( positiveUnibody, unibodyCtx );
  // render body lines separately, on its own canvas
  bodyLinesCtx.globalCompositeOperation = 'source-over';
  bodyLines.forEach( function( bodyLine ) {
    bodyLine.render( bodyLinesCtx );
  });
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

var outlineShapes = outlineCamera.getShapes();
var positiveShapes = camera.getShapes();
// filter out bodyLines
positiveShapes = positiveShapes.filter( function( shape ) {
  return !bodyLines.includes( shape );
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
  camera.update();
  outlineCamera.update();
  // normalize angle y
  camera.rotate.y = ( ( camera.rotate.y % TAU ) + TAU ) % TAU;
  // update cut-in rotates
  rightLegCutIn.rotate.y = 1.2 - camera.rotate.y;
  backLegCutIn.rotate.y = 1.4 - camera.rotate.y;
  bodyLeftCutIn.rotate.y = 1.5 - camera.rotate.y;
  bodyRightCutIn.rotate.y = -1.5 - camera.rotate.y;
  var isCameraYRight = camera.rotate.y < TAU/4 || camera.rotate.y > TAU *3/4;
  bodyLeftCutIn.translate.x = isCameraYRight ? 3 : -3;
  bodyRightCutIn.translate.x = isCameraYRight ? -3 : 3;
  positiveShapes.forEach( updateEachSortValue );
  bodyLines.forEach( updateEachSortValue );
  // perspective sort
  positiveShapes.sort( sortBySortValue );
  bodyLines.sort( sortBySortValue );
}

function updateEachSortValue( shape ) {
  shape.updateSortValue();
}

function sortBySortValue( a, b ) {
  return b.sortValue - a.sortValue;
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

  outlineShapes.forEach( eachShapeRender );
  positiveShapes.forEach( eachShapeRender );

  ctx.restore();
  unibodyCtx.restore();
  bodyLinesCtx.restore();
}

function eachShapeRender( shape ) {
  shape.render( ctx );
}

function zoomContext( context ) {
  context.save();
  context.scale( zoom, zoom );
  context.translate( w/2, h/2 );
}


// ----- inputs ----- //

// click drag to rotate

var dragStartX, dragStartY;
var dragStartAngleX, dragStartAngleY;

document.addEventListener( 'mousedown', function( event ) {
  dragStartX = event.pageX;
  dragStartY = event.pageY;
  dragStartAngleX = camera.rotate.x;
  dragStartAngleY = camera.rotate.y;

  window.addEventListener( 'mousemove', onMousemoveDrag );
  window.addEventListener( 'mouseup', onMouseupDrag );
});

function onMousemoveDrag( event ) {
  var dx = event.pageX - dragStartX;
  var dy = event.pageY - dragStartY;
  var angleXMove = dy / ( zoom * 100 ) * TAU;
  var angleYMove = dx / ( zoom * 100 ) * TAU;
  camera.rotate.x = dragStartAngleX + angleXMove;
  camera.rotate.y = dragStartAngleY + angleYMove;
  syncCameras();
  // console.log( ~~(camera.rotate.y/TAU * 360) );
}

function onMouseupDrag() {
  window.removeEventListener( 'mousemove', onMousemoveDrag );
  window.removeEventListener( 'mouseup', onMouseupDrag );
}

document.querySelector('.flat-button').onclick = function() {
  camera.rotate = {
    x: 0,
    y: 0,
    z: 0,
  };
  syncCameras();
};

document.querySelector('.jump-button').onclick = setJumpRotate;

function setJumpRotate() {
  camera.rotate = {
    x: -10/360 * TAU,
    y: 18/360 * TAU,
    z: -31/360 * TAU,
  };
  syncCameras();

}

function syncCameras() {
  camera.rotate.y = ((camera.rotate.y % TAU) + TAU) % TAU;
  outlineCamera.rotate = camera.rotate;
}
