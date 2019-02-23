// -------------------------- demo -------------------------- //

var illoElem = document.querySelector('.illo');
// unibody canvas for compositing
var unibodyCanvas = document.createElement('canvas');
var bodyLinesCanvas = document.createElement('canvas');
// document.body.appendChild( unibodyCanvas );
// document.body.appendChild( bodyLinesCanvas );
var w = 88;
var h = 88;
var minWindowSize = Math.min( window.innerWidth, window.innerHeight );
var zoom = Math.min( 6, Math.floor( minWindowSize / w ) );

var canvasWidth = illoElem.width = w * zoom;
var canvasHeight = illoElem.height = h * zoom;
unibodyCanvas.width = bodyLinesCanvas.width = canvasWidth;
unibodyCanvas.height = bodyLinesCanvas.height = canvasHeight;

var camera = new Zdog.Anchor();
var isSpinning = true;
var TAU = Zdog.TAU;

var mainIllo = new Zdog.Illustration({
  element: illoElem,
  zoom: zoom,
  dragRotate: camera,
  onDragStart: function() {
    isSpinning = false;
  },
});

var unibodyIllo = new Zdog.Illustration({
  element: unibodyCanvas,
  zoom: zoom,
});

var bodyLinesIllo = new Zdog.Illustration({
  element: bodyLinesCanvas,
  zoom: zoom,
});


var jumpRotation = new Zdog.Vector({
  x: 12/360 * TAU,
  y: -15/360 * TAU,
  z: -31/360 * TAU,
});

// colors
var magenta = '#C25';
var orange = '#E62';
var gold = '#EA0';
var blue = '#19F';
var black = '#333';

var bearAnchor = new Zdog.Anchor({
  addTo: camera,
});

var positiveAnchor = new Zdog.Group({
  addTo: bearAnchor,
  updateSort: true,
});
var outlineAnchor = new Zdog.Group({
  addTo: bearAnchor,
});
var bodySectionsAnchor = new Zdog.Group({
  addTo: bearAnchor,
  updateSort: true,
});

// -- illustration shapes --- //
var positiveUnibody, rightLegCutInA, rightLegCutInB, bodyCutIn,
  backLegCutIn, crotchCutIn;

var bodyWidth = 6;
var bodyHeight = 14;
var bodyLineWidth = 28;

[ false, true ].forEach( function( isOutline ) {
  var anchor = isOutline ? outlineAnchor : positiveAnchor;
  var outlineWidth = isOutline ? 8 : 0;

  // unibody
  var unibody = new Zdog.Rect({
    width: bodyWidth,
    height: bodyHeight,
    addTo: anchor,
    // translate: { y: -1 },
    color: isOutline ? black : magenta,
    stroke: bodyLineWidth + outlineWidth,
    fill: true,
  });

  if ( !isOutline ) {
    // set positiveUnibody
    positiveUnibody = unibody;
    // body cut-in
    // cut-in points
    var ciA = new Zdog.Vector({ z: 0, y: -23 });
    var ciB = new Zdog.Vector({ z: 16, y: -7 });
    var ciC = new Zdog.Vector({ z: 16, y: 7 });
    var ciD = new Zdog.Vector({ z: 0, y: 23 });
    // 45 degree points
    var topPoints = getQuarterArcPoints( ciA, ciB );
    var bottomPoints = getQuarterArcPoints( ciD, ciC );

    var cutInPath = [
      topPoints[0],
      { bezier: [ topPoints[1], topPoints[2], ciB ] },
      ciC,
      { bezier: [ bottomPoints[2], bottomPoints[1], bottomPoints[0] ] },
    ];

    bodyCutIn = new Zdog.Shape({
      path: cutInPath,
      translate: { x: 3 },
      addTo: unibody,
      color: black,
      closed: false,
      stroke: 4,
    });

  }

  // right ear
  var ear = new Zdog.Ellipse({
    diameter: 4,
    addTo: unibody,
    translate: { x: -14, y: -19, z: -2 },
    color: isOutline ? black : magenta,
    stroke: 8 + outlineWidth,
  });
  // left ear
  ear.copy({
    translate: { x: 14, y: -19, z: -2 },
  });


  // face container
  var face = new Zdog.Anchor({
    translate: { y: -2, z: 14 },
    addTo: unibody,
  });

  // snout
  new Zdog.Ellipse({
    width: 8,
    height: 4,
    addTo: face,
    translate: { y: 4, z: 1 },
    color: isOutline ? black : 'white',
    stroke: 6 + outlineWidth,
    fill: true,
  });

  if ( !isOutline ) {
    // nose
    new Zdog.Shape({
      path: [
        { x: -1.5, y: 0 },
        { x: 1.5, y: 0 },
        { x: 0, y: 0.5 },
      ],
      addTo: face,
      translate: { y: 1.5, z: 4 },
      color: black,
      stroke: 3,
      fill: true,
    });

    // right eye
    var eye = new Zdog.Shape({
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
      stroke: 2,
      closed: false,
      fill: true,
    });
    // left eye
    eye.copy({
      translate: { y: -3.25, x: 7.5, z: 0 },
    });

  }


  // right arm
  new Zdog.Shape({
    path: [
      { x: -1 },
      { x: -8 },
    ],
    addTo: unibody,
    translate: { x: -17, y: 5 },
    rotate: { y: 0.25 },
    color: isOutline ? black : gold,
    stroke: 12 + outlineWidth,
  });
  // left arm
  new Zdog.Shape({
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
    stroke: 12 + outlineWidth,
    closed: false,
  });

  // right leg
  var rightLeg = new Zdog.Shape({
    path: [
      { y: 4 },
      { y: 15 },
    ],
    addTo: unibody,
    translate: { x: -10, y: 13, z: -1 },
    rotate: { z: 49/360 * TAU, x: -0.3 },
    color: isOutline ? black : blue,
    stroke: 12 + outlineWidth,
  });

  // right leg cut-in
  if ( !isOutline ) {
    rightLegCutInA = new Zdog.Shape({
      path: [
        { z: 8, y: 4 },
        { z: 8, y: 15 },
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
      stroke: 4,
    });
    rightLegCutInB = rightLegCutInA.copy({
      scale: { z: -1 },
    });
  }


  // left leg
  var leftThigh = new Zdog.Shape({
    path: [
      { y: 2 },
      { y: 12 },
    ],
    addTo: unibody,
    translate: { x: 9, y: 13, z: -1 },
    rotate: { z: 0.7, x: -0.4 },
    color: isOutline ? black : blue,
    stroke: 12 + outlineWidth,
  });
  // left shin
  var leftShin = new Zdog.Shape({
    path: [
      { y: 0 },
      { y: 12 },
    ],
    addTo: leftThigh,
    translate: leftThigh.path[1],
    rotate: { z: 0.2, x: -0.9 },
    color: isOutline ? black : blue,
    stroke: 12 + outlineWidth,
  });

  if ( !isOutline ) {
    backLegCutIn = new Zdog.Shape({
      path: [
        { z: 8, y: -14 },
        { z: 8, y: -8 },
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
      stroke: 4,
    });

    crotchCutIn = new Zdog.Shape({
      path: [
        { x: -1.5, z: -2 },
        { x:  1, z: 0 }
      ],
      scale: { x: 2 },
      addTo: unibody,
      translate: { x: -5, y: 7+14+2 - 1.5, z: 2 },
      color: black,
      stroke: 4,
      closed: false,
    });
  }

});

var unibodyHeight = bodyHeight + bodyLineWidth; // 28 + 14 = 42
// section size = 42/4 == 10.5
var sectionSize = unibodyHeight / 4;

// body lines
[ magenta, orange, gold, blue ].forEach( function( color, i ) {
  var stripeGroup = new Zdog.Group({
    addTo: bodySectionsAnchor,
    translate: { y: ( i - 1.5 ) * 10.5 },
  });
  var cylinder = new Zdog.Cylinder({
    diameter: bodyLineWidth,
    length: sectionSize,
    addTo: stripeGroup,
    translate: { x: -bodyWidth/2 },
    rotate: { x: -TAU/4 },
    color: color,
    fill: true,
    stroke: false,
  });
  cylinder.copyGraph({
    translate: { x: bodyWidth/2 },
  });
  // panel to cover cylinders overlap
  var panel = new Zdog.Rect({
    width: bodyWidth,
    height: sectionSize,
    addTo: stripeGroup,
    translate: { z: bodyLineWidth/2 },
    color: color,
    fill: true,
    stroke: false,
  });
  panel.copy({
    translate: { z: -bodyLineWidth/2 },
  });
});

// unibody composited rendering
var unibodyRender = positiveUnibody.render;
var bodyLinesCtx = bodyLinesIllo.ctx;
positiveUnibody.render = function( ctx ) {
  unibodyRender.call( positiveUnibody, unibodyIllo.ctx, Zdog.CanvasRenderer );
  // render body lines separately, on its own canvas
  bodyLinesCtx.globalCompositeOperation = 'source-over';
  bodySectionsAnchor.renderGraphCanvas( bodyLinesCtx );
  // composite bodyLines in unibody
  bodyLinesCtx.restore();
  bodyLinesCtx.globalCompositeOperation = 'destination-in';
  bodyLinesCtx.drawImage( unibodyCanvas, 0, 0 );
  // draw unibody composite on to canvas
  ctx.restore();
  ctx.drawImage( bodyLinesCanvas, 0, 0 );
  // re-zoom
  mainIllo.ctx.save();
  mainIllo.ctx.translate( mainIllo.width/2, mainIllo.height/2 );
  var scale = mainIllo.pixelRatio * mainIllo.zoom;
  mainIllo.ctx.scale( scale, scale );
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

function update() {
  if ( isSpinning ) {
    t += 1/180;
    var easeT = Zdog.easeInOut( t % 1, 3 );
    camera.rotate.y = easeT*TAU*2 + jumpRotation.y;
  }

  camera.normalizeRotate();
  var cameraRY = camera.rotate.y;
  // update cut-in rotates
  rightLegCutInA.rotate.y = -1.2 - cameraRY;
  rightLegCutInB.rotate.y = -1.2 - cameraRY;
  backLegCutIn.rotate.y = -1.4 - cameraRY;

  var isCameraYFront = cameraRY < TAU/4 || cameraRY > TAU *3/4;
  var isCameraYRight = cameraRY > TAU/2;
  bodyCutIn.rotate.y = isCameraYFront == isCameraYRight ? -1.5 : 1.5;
  bodyCutIn.rotate.y -= cameraRY;
  bodyCutIn.translate.x = isCameraYRight ? 3 : -3;

  crotchCutIn.visible = cameraRY < TAU/4 || cameraRY > TAU *7/8;

  // update cameras
  camera.updateGraph();
}

// -- render -- //

setJumpRotate();

function render() {
  var ctx = mainIllo.ctx;
  mainIllo.prerenderCanvas();
  unibodyIllo.prerenderCanvas();
  bodyLinesIllo.prerenderCanvas();

  outlineAnchor.renderGraphCanvas( ctx );
  positiveAnchor.renderGraphCanvas( ctx );

  mainIllo.postrenderCanvas();
  unibodyIllo.postrenderCanvas();
  bodyLinesIllo.postrenderCanvas();
}

// ----- inputs ----- //

document.querySelector('.flat-button').onclick = function() {
  camera.rotate.set({});
};

document.querySelector('.jump-button').onclick = setJumpRotate;

function setJumpRotate() {
  camera.rotate.set( jumpRotation );
}

function getQuarterArcPoints( a, b ) {
  var start = new Zdog.Vector({
    z: Zdog.lerp( a.z, b.z, 5/7 ),
    y: Zdog.lerp( a.y, b.y, 2/7 ),
  });
  // control points
  var cp0 = new Zdog.Vector({
    z: Zdog.lerp( a.z, b.z, 24/28 ),
    y: Zdog.lerp( a.y, b.y, 12/28 ),
  });
  var cp1 = new Zdog.Vector({
    z: b.z,
    y: Zdog.lerp( a.y, b.y, 5/7 ),
  });

  return [ start, cp0, cp1 ];
}
