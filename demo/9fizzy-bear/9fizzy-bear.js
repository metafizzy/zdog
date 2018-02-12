/* jshint browser: true, devel: true, unused: true, undef: true */
/* globals Shape, lerp, Vector3, TAU */

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

var camera = new Shape({ rendering: false });

var outlineCamera = new Shape({ rendering: false });

// -- illustration shapes --- //
var positiveUnibody, rightLegCutIn, bodyCutIn, backLegCutIn;


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
    // cut-in points
    var ciA = new Vector3({ z: 0, y: -24 });
    var ciB = new Vector3({ z: -16, y: -8 });
    var ciC = new Vector3({ z: -16, y: 6 });
    var ciD = new Vector3({ z: 0, y: 22 });
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
      // rotate: { y: 1.1 },
      addTo: unibody,
      color: black,
      closed: false,
      lineWidth: 4,
    });

  }

  // right ear
  var ear = new Shape({
    path: [ { x: -14, y: -20, z: 2 } ],
    addTo: unibody,
    color: isOutline ? black : magenta,
    lineWidth: 12 + outlineWidth,
  });
  // left ear
  ear.copy({
    path: [ { x: 14, y: -20, z: 2 } ]
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
      { x: 0, y: -2 },
      {
        arc: [
          { x: 4, y: -2 },
          { x: 4, y: 0 },
        ]
      },
      {
        arc: [
          { x: 4, y: 2 },
          { x: 0, y: 2 },
        ]
      },
      {
        arc: [
          { x: -4, y: 2 },
          { x: -4, y: 0 },
        ]
      },
      {
        arc: [
          { x: -4, y: -2 },
          { x: 0, y: -2 },
        ]
      },
    ],
    addTo: face,
    translate: { y: 4, z: -1 },
    color: isOutline ? black : 'white',
    lineWidth: 6 + outlineWidth,
    fill: false,
    closed: false,
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
    var eyePath = [
      { x: -2.5, y: 0 },
      {
        arc: [ { x: -2.5, y: -1.5 }, { x: 0, y: -1.5 } ]
      },
      {
        arc: [ { x: 2.5, y: -1.5 }, { x: 2.5, y: 0 } ]
      },
    ];

    // right eye
    var eye = new Shape({
      path: eyePath,
      addTo: face,
      translate: { y: -4, x: -7.5, z: 0 },
      // rotate: { y: -0.3 },
      color: black,
      lineWidth: 3,
      closed: false,
    });
    // left eye
    eye.copy({
      translate: { y: -4, x: 7.5, z: 0 },
    });

  }


  // right arm
  new Shape({
    path: [
      { x: -1 },
      { x: -8 },
    ],
    addTo: unibody,
    translate: { x: -17, y: 4 },
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
          { x: 5, y: 0 },
          { x: 9, y: -12 },
        ]
      }
    ],
    addTo: unibody,
    translate: { x: 18, y: 4 },
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
        { z: -8, y: 12 },
        {
          arc: [
            { z: -8, y: 20 },
            { z: 0, y: 20 },
          ]
        }
      ],
      addTo: leftShin,
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

// body lines
var bodyLines = [ magenta, orange, gold, blue ].map( function( color, i ) {
  return new Shape({
    path: [
      { x: -blXA, z: 0 },
      {
        arc: [ { x: -blXA, z: -blZ }, { x: -blXB, z: -blZ } ]
      },
      { x: blXB, z: -blZ },
      {
        arc: [ { x: blXA, z: -blZ }, { x: blXA, z: 0 } ]
      },
      {
        arc: [ { x: blXA, z: blZ }, { x: blXB, z: blZ },  ]
      },
      { x: -blXB, z: blZ },
      {
        arc: [ { x: -blXA, z: blZ }, { x: -blXA, z: 0 },  ]
      },
    ],
    addTo: positiveUnibody,
    translate: { y: -16.75 + 10.5*i },
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
  var cameraRY = camera.rotate.y = ( ( camera.rotate.y % TAU ) + TAU ) % TAU;
  // update cut-in rotates
  rightLegCutIn.rotate.y = 1.2 - cameraRY;
  backLegCutIn.rotate.y = 1.4 - cameraRY;
  var isCameraYFront = cameraRY < TAU/4 || cameraRY > TAU *3/4;
  var isCameraYRight = cameraRY < TAU/2;
  bodyCutIn.rotate.y = isCameraYFront == isCameraYRight ? 1.5 : -1.5;
  bodyCutIn.rotate.y -= cameraRY;
  bodyCutIn.translate.x = isCameraYRight ? 3 : -3;

  // render shapes
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
