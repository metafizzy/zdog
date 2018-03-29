// -------------------------- demo -------------------------- //

var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
var w = 128;
var h = 128;
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

var isRotating = false;
var quarterTurn = Math.sin( TAU/8 );

var sceneStartRotation = { y: TAU/8 };

var scene = new Anchor({
  rotate: sceneStartRotation,
});

// ----- colors ----- //

var beigeDark = '#F96';
var beigeLight = '#FC9';
var skinDark = '#F66';
var skinMedium = '#F88';
var skinLight = '#FAA';
var navy = '#036';
var midnight = '#003';
var auburn = '#903';
var red = '#C33';
var sky = '#09D';
var offWhite = '#FFD';
var white = 'white';
var blueDark = '#66C';
var bluePale = '#CCF';

// ----- template shapes ----- //

var semiCircle = new Shape({
  path: [
    { x: 1, y: 0 },
    { arc: [
      { x: 1, y: 1 },
      { x: 0, y: 1 },
    ]},
    { arc: [
      { x: -1, y: 1 },
      { x: -1, y: 0 },
    ]},
  ],
});


// -- models --- //

var ground = new Anchor({
  addTo: scene,
  translate: { y: 56 },
});

// ----- dude ----- //

( function() {

  var dude = new Anchor({
    addTo: ground,
    translate: { x : 24, z: -12 },
  });

  var hipX = ( 8 / quarterTurn ) / 2;
  var hips = new Shape({
    path: [
      { x: -hipX },
      { x:  hipX },
    ],
    addTo: dude,
    translate: { y: -49 },
    rotate: { x: -TAU/16 },
    lineWidth: 8,
    color: beigeLight,
  });

  // right thigh
  var rightThigh = new Shape({
    path: [
      { y: 0 },
      { y: 18 },
    ],
    addTo: hips,
    translate: { x: -hipX },
    lineWidth: 8,
    color: beigeLight,
  });
  // right tight line
  var rightThighLine = rightThigh.copy({
    addTo: rightThigh,
    translate: { x: -4 },
    color: white,
    lineWidth: 0.5,
  });

  var shinEnd = { y: 22 };

  var rightShin = rightThigh.copy({
    path: [
      { y: 0 },
      shinEnd,
    ],
    addTo: rightThigh,
    translate: { y: 18 },
  });
  // right shin line
  rightThighLine.copy({
    path: [
      { y: -2 },
      shinEnd,
    ],
    addTo: rightShin,
  });

  var rightAnkle = new Shape({
    path: [
      { y: 3 },
      { y: 4 },
    ],
    addTo: rightShin,
    translate: shinEnd,
    color: skinMedium,
    lineWidth: 6,
  });

  var leftThigh = rightThigh.copy({
    translate: { x: hipX },
    color: beigeDark,
  });
  // left thigh line
  rightThighLine.copy({
    addTo: leftThigh,
    translate: { x: 4 },
    color: beigeLight,
  });

  var leftShin = rightShin.copy({
    addTo: leftThigh,
    rotate: { x: TAU/4 - hips.rotate.x },
    color: beigeDark,
  });
  // left shin line
  leftShin.copy({
    addTo: leftShin,
    translate: { x: 4 },
    rotate: {},
    color: beigeLight,
    lineWidth: rightThighLine.lineWidth,
  });

  var leftAnkle = rightAnkle.copy({
    addTo: leftShin,
    color: skinDark,
  });

  // shoes
  [ true, false ].forEach( function( isRight ) {
    var shoeAngleX = isRight ? -TAU/16 : hips.rotate.x;
    var shoe = new RoundedRect({
      width: 2,
      height: 10,
      radius: 2,
      addTo: isRight ? rightAnkle : leftAnkle,
      translate: { y: 6, z: -4 },
      rotate: { x: TAU/4 + shoeAngleX },
      color: isRight ? white : offWhite,
      fill: true,
      stroke: true,
      lineWidth: 6,
    });

    // laces
    var lacesGroup = new Group({
      addTo: shoe,
      translate: { z: 3 },
    });
    var shoeLace = new Shape({
      path: [ { x: -1 }, { x: 1 } ],
      scale: { x: 2 },
      addTo: lacesGroup,
      translate: { y: -2 },
      color: blueDark,
      lineWidth: 1,
    });
    shoeLace.copy({
      translate: { y: -4 },
    });
    // HACK, add invisible shape so laces better render on top
    new Shape({
      rendering: false,
      addTo: lacesGroup,
      translate: { y: 4 },
    });

    // soles
    new RoundedRect({
      width: 6,
      height: 13,
      radius: 3,
      addTo: shoe,
      translate: { z: -3.5 },
      // rotate: { x: TAU/4 },
      lineWidth: 1,
      fill: true,
      color: blueDark,
    });
  });

  var torsoX = 6 / quarterTurn;
  var torso = new Shape({
    path: [
      { x: -torsoX },
      { x:  torsoX },
    ],
    addTo: dude,
    translate: { y: -59, z: 6 },
    color: navy,
    lineWidth: 16,
  });

  var shoulderX = torsoX + 1.5;
  var rightShoulder = new Shape({
    path: [
      { y: 0 },
      { y: 14 },
    ],
    addTo: torso,
    translate: { x: -shoulderX, y: -3 },
    rotate: { x: TAU/16, z: TAU/8 },
    lineWidth: 10,
    color: navy,
  });

  var leftShoulder = rightShoulder.copy({
    translate: { x: shoulderX, y: -3 },
    rotate: { x: -TAU*3/16, z: -TAU/32 },
    color: midnight,
  });

  var rightArm = new Shape({
    path: [
      { y: 0 },
      { y: 14 },
    ],
    addTo: rightShoulder,
    translate: { y: 16 },
    rotate: {  x: -2.12, z: 0 },
    lineWidth: 8,
    color: skinMedium,
  });

  var leftArm = rightArm.copy({
    addTo: leftShoulder,
    color: skinDark,
    rotate: { x: -TAU/4, z: TAU/8 },
  });

  var rightHand = new Shape({
    addTo: rightArm,
    translate: { x: -0.5, y: 14, z: -1 },
    lineWidth: 10,
    color: skinMedium,
  });

  // left hand
  rightHand.copy({
    addTo: leftArm,
    color: skinDark,
  });

  // jacketZip
  var jacketZipScale = torso.lineWidth/2;
  new Shape({
    path: [
      { z: 0, y: -1 },
      { arc: [
        { z: -1, y: -1 },
        { z: -1, y: 0 },
      ]},
    ],
    scale: { z: jacketZipScale, y: jacketZipScale },
    addTo: torso,
    rotate: { x: TAU/32 },
    color: sky,
    closed: false,
    lineWidth: 0.5,
  });

  var neckY = -torso.lineWidth/2;
  var neck = new Shape({
    path: [ { y: neckY }, { y: neckY - 4 } ],
    addTo: torso,
    // translate: { y: }
    rotate: { x: -TAU/16, y: -TAU*3/16 },
    lineWidth: 6,
    color: skinMedium,
  });
  // chin
  var chin = new Shape({
    addTo: neck,
    translate: { y: neckY - 5, z: -2 },
    lineWidth: 8,
    color: skinMedium,
  });
  // forehead
  var forehead = new Ellipse({
    width: 2,
    height: 2,
    addTo: chin,
    translate: { y: -4 },
    lineWidth: 4,
    color: skinMedium,
  });
  // hair big
  new Shape({
    path: [
      { y: 0 },
      { y: -7 },
    ],
    addTo: chin,
    translate: { x: -2, y: -2, z: 3 },
    lineWidth: 4,
    color: auburn,
  });
  // hair small
  new Shape({
    path: [
      { y: 0 },
      { y: -6 },
    ],
    addTo: chin,
    translate: { x: 1.25, y: -2, z: 3 },
    lineWidth: 2.5,
    color: red,
  });
  // smile
  semiCircle.copy({
    addTo: chin,
    translate: { y: -1.5, z: -3 },
    scale: { x: 1.5, y: 1.5 },
    fill: true,
    lineWidth: 0.5,
    color: white,
  });
  // eyes
  var eye = semiCircle.copy({
    addTo: forehead,
    translate: { x: -1, y: 0.5, z: -2 },
    scale: { x: 0.5, y: -0.5 },
    closed: false,
    color: midnight,
    lineWidth: 0.38,
    fill: false,
  });
  eye.copy({
    translate: { x: 1, y: 0.5, z: -2 },
  });

  var ear = new Ellipse({
    width: 1.5,
    height: 1.5,
    addTo: forehead,
    translate: { x: 3.5, y: 1, z: 1 },
    rotate: { y: TAU/8 },
    lineWidth: 1,
    color: skinMedium,
    fill: true,
  });
  ear.copy({
    translate: { x: -3.5, y: 1, z: 1 },
    rotate: { y: -TAU/8 },
  });

})();

// lady
( function() {

  var lady = new Anchor({
    addTo: ground,
    translate: { x : -24, z: 12 },
  });

  var hips = new Shape({
    addTo: lady,
    translate: { y: -38 },
    lineWidth: 14,
    color: navy,
  });

  var torsoAnchor = new Anchor({
    addTo: hips,
    rotate: { x: TAU/8 },
  });

  var torso = new Rect({
    width: 1,
    height: 5,
    addTo: torsoAnchor,
    translate: { y: -9 },
    lineWidth: 8,
    color: beigeLight,
  });

  // ----- lady head ----- //

  var neck = new Shape({
    path: [ {}, { y: -5 }],
    addTo: torso,
    translate: { y: -7 },
    lineWidth: 4,
    color: skinLight,
  });

  var collar = new RoundedRect({
    width: 3,
    height: 5,
    radius: 1.5,
    addTo: neck,
    translate: { x: 1, y: 2, z: -0 },
    rotate: { x: TAU/4, z: TAU/8 },
    color: white,
    fill: true,
  });
  collar.copy({
    translate: { x: -1, y: 2, z: -0 },
    rotate: { x: TAU/4, z: -TAU/8 },
  });

  var head = new Anchor({
    addTo: neck,
    translate: { y: -6 },
    rotate: { x: -TAU/8 },
  });
  var faceGroup = new Group({
    addTo: head,
  });
  // hair cap
  new Shape({
    lineWidth: 11,
    translate: { y: -1 },
    addTo: faceGroup,
    color: midnight,
  })
  // face
  new Shape({
    path: [
      { x: 1, y: 0 },
      { arc: [
        { x: 1, y: 1 },
        { x: 0, y: 1 },
      ]},
      { arc: [
        { x: -1, y: 1 },
        { x: -1, y: 0 },
      ]},
      { x: 1, y: 0 },
    ],
    scale: { x: 2, y: 2 },
    addTo: faceGroup,
    // translate: { y: 1 },
    lineWidth: 5,
    rotate: { y: TAU/4, z: TAU/8 },

    fill: true,
    color: skinLight,
    closed: false,
  });

  // glasses
  var glasses = new Group({
    addTo: head,
    translate: { y: -1, z: -5 },
  });

  var lens = new Ellipse({
    width: 4,
    height: 4,
    addTo: glasses,
    translate: { x: -2.25 },
    stroke: false,
    fill: true,
    color: '#603',
  });
  lens.copy({
    translate: { x: 2.25 },
  });

  var glassesRim = lens.copy({
    stroke: true,
    fill: false,
    lineWidth: 1,
    color: auburn,
  });
  glassesRim.copy({
    translate: { x: 2.25 },
  });

  // long locks
  // new RoundedRect({
  //   width: 8,
  //   height: 12,
  //   radius: 4,
  //   addTo: head,
  //   translate: { y: 1, x: 4.5 },
  //   rotate: { y: TAU/4 },
  //   fill: true,
  //   color: midnight,
  //   lineWidth: 2,
  // });

  // ----- lady arms ----- //

  var leftWrist = { z: -12, y: -12 };

  var leftArm = new Shape({
    path: [
      { z: 0, y: 0 },
      { z: -12, y: 0 },
      leftWrist,
      // hack for z-sort probs
      { move: [{ x: 16, z: 16 } ]},
    ],
    addTo: torso,
    translate: { x: 4, y: -3 },
    closed: false,
    color: skinMedium,
    lineWidth: 4,
  });

  // leftHand
  var leftHand = new Shape({
    path: [ { x: -1, z: 0.5 } ],
    addTo: leftArm,
    translate: leftWrist,
    color: skinMedium,
    lineWidth: 6,
  });

  var phoneAnchor = new Anchor({
    addTo: leftHand,
    translate: { x: -2, y: -0, z: 4 },
    rotate: { x: -TAU/8 },
  });

  var phoneBack = new Group({
    addTo: phoneAnchor,
  });
  var phoneFront = new Group({
    addTo: phoneAnchor,
    translate: { z: 0.5 },
  });
  // back phone panel
  var phonePanel = new RoundedRect({
    width: 4,
    height: 8,
    radius: 1,
    addTo: phoneBack,
    lineWidth: 0.5,
    color: bluePale,
    fill: true,
  });
  // phone logo dot
  new Ellipse({
    width: 1.25,
    height: 1.25,
    addTo: phoneBack,
    translate: { y: -1 },
    fill: true,
    stroke: false,
    color: sky,
  });
  // phone camera dot
  new Shape({
    path: [
      // z-sort hack
      { move: [{ z: -8 }]},
      { move: [{ z: 0 }]},
      {},
    ],
    addTo: phoneBack,
    translate: { x: -1, y: -3 },
    color: midnight,
    lineWidth: 0.5,
  });

  // phone front
  phonePanel.copy({
    addTo: phoneFront,
    color: midnight,
  });

  var rightWrist = { y: 24 };

  var rightArm = leftArm.copy({
    path: [
      { y: 0 },
      rightWrist,
    ],
    translate: { x: -4, y: -3 },
    rotate: { z: TAU/16, x: -TAU/32 },
    color: skinLight,
  });

  var rightHandPosition = new Vector3( rightWrist ).add({ x: -0.5, z: 1 });

  var rightHand = leftHand.copy({
    path: [{}],
    addTo: rightArm,
    translate: rightHandPosition,
    color: skinLight,
  });

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
  scene.rotate.y += isRotating ? +TAU/150 : 0;

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


document.querySelector('.reset-button').onclick = function() {
  scene.rotate.set( sceneStartRotation );
};
