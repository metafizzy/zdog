// -------------------------- demo -------------------------- //

var illoElem = document.querySelector('.illo');
var w = 128;
var h = 128;
var minWindowSize = Math.min( window.innerWidth, (window.innerHeight - 60) );
var zoom = Math.floor( minWindowSize / w );
illoElem.setAttribute( 'width', w * zoom );
illoElem.setAttribute( 'height', h * zoom );

var isSpinning = true;
var TAU = Zdog.TAU;
var sceneStartRotation = { y: -TAU/8 };

var illo = new Zdog.Illustration({
  element: illoElem,
  zoom: zoom,
  rotate: sceneStartRotation,
  dragRotate: true,
  onDragStart: function() {
    isSpinning = false;
  },
});

var quarterTurn = Math.sin( TAU/8 );

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

// -- models --- //

var ground = new Zdog.Anchor({
  addTo: illo,
  translate: { y: 56 },
});

// ----- dude ----- //

( function() {

  var dude = new Zdog.Anchor({
    addTo: ground,
    translate: { x : -24, z: -12 },
  });

  var hipX = ( 8 / quarterTurn ) / 2;
  var hips = new Zdog.Shape({
    path: [
      { x: -hipX },
      { x:  hipX },
    ],
    addTo: dude,
    translate: { y: -49 },
    rotate: { x: TAU/16 },
    stroke: 8,
    color: beigeLight,
  });

  // right thigh
  var rightThigh = new Zdog.Shape({
    path: [
      { y: 0 },
      { y: 18 },
    ],
    addTo: hips,
    translate: { x: -hipX },
    stroke: 8,
    color: beigeLight,
  });
  // right tight line
  var rightThighLine = rightThigh.copy({
    addTo: rightThigh,
    translate: { x: -4 },
    color: white,
    stroke: 0.5,
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

  var rightAnkle = new Zdog.Shape({
    path: [
      { y: 3 },
      { y: 4 },
    ],
    addTo: rightShin,
    translate: shinEnd,
    color: skinMedium,
    stroke: 6,
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
    rotate: { x: -TAU/4 - hips.rotate.x },
    color: beigeDark,
  });
  // left shin line
  leftShin.copy({
    addTo: leftShin,
    translate: { x: 4 },
    rotate: {},
    color: beigeLight,
    stroke: rightThighLine.stroke,
  });

  var leftAnkle = rightAnkle.copy({
    addTo: leftShin,
    color: skinDark,
  });

  // shoes
  [ true, false ].forEach( function( isRight ) {
    var shoeAngleX = isRight ? -TAU/16 : -hips.rotate.x;
    var shoe = new Zdog.RoundedRect({
      width: 2,
      height: 10,
      cornerRadius: 2,
      addTo: isRight ? rightAnkle : leftAnkle,
      translate: { y: 6, z: 4 },
      rotate: { x: -TAU/4 - shoeAngleX },
      color: isRight ? white : offWhite,
      fill: true,
      stroke: 6,
    });

    // laces
    var lacesGroup = new Zdog.Group({
      addTo: shoe,
      translate: { z: -3 },
    });
    var shoeLace = new Zdog.Shape({
      path: [ { x: -1 }, { x: 1 } ],
      scale: { x: 2 },
      addTo: lacesGroup,
      translate: { y: -2 },
      color: blueDark,
      stroke: 1,
    });
    shoeLace.copy({
      translate: { y: -4 },
    });
    // HACK, add invisible shape so laces better render on top
    new Zdog.Shape({
      visible: false,
      addTo: lacesGroup,
      translate: { y: 4 },
    });

    // soles
    new Zdog.RoundedRect({
      width: 6,
      height: 13,
      cornerRadius: 3,
      addTo: shoe,
      translate: { z: 3.5 },
      // rotate: { x: -TAU/4 },
      stroke: 1,
      fill: true,
      color: blueDark,
    });
  });

  var torsoX = 6 / quarterTurn;
  var torso = new Zdog.Shape({
    path: [
      { x: -torsoX },
      { x:  torsoX },
    ],
    addTo: dude,
    translate: { y: -59, z: -6 },
    color: navy,
    stroke: 16,
  });

  var shoulderX = torsoX + 1.5;
  var rightShoulder = new Zdog.Shape({
    path: [
      { y: 0 },
      { y: 14 },
    ],
    addTo: torso,
    translate: { x: -shoulderX, y: -3 },
    rotate: { x: -TAU/16, z: TAU/8 },
    stroke: 10,
    color: navy,
  });

  var leftShoulder = rightShoulder.copy({
    translate: { x: shoulderX, y: -3 },
    rotate: { x: TAU*3/16, z: -TAU/32 },
    color: midnight,
  });

  var rightArm = new Zdog.Shape({
    path: [
      { y: 0 },
      { y: 14 },
    ],
    addTo: rightShoulder,
    translate: { y: 16 },
    rotate: {  x: 2.12, z: -0 },
    stroke: 8,
    color: skinMedium,
  });

  var leftArm = rightArm.copy({
    addTo: leftShoulder,
    color: skinDark,
    rotate: { x: TAU/4, z: TAU/8 },
  });

  var rightHand = new Zdog.Shape({
    addTo: rightArm,
    translate: { x: -0.5, y: 14, z: 1 },
    stroke: 10,
    color: skinMedium,
  });

  // left hand
  rightHand.copy({
    addTo: leftArm,
    color: skinDark,
  });

  // jacketZip
  new Zdog.Ellipse({
    addTo: torso,
    diameter: torso.stroke,
    quarters: 1,
    rotate: { y: TAU/4, x: -TAU/32 },
    color: sky,
    stroke: 0.5,
  });

  var neckY = -torso.stroke/2;
  var neck = new Zdog.Shape({
    path: [ { y: neckY }, { y: neckY - 4 } ],
    addTo: torso,
    // translate: { y: }
    rotate: { x: TAU/16, y: TAU*3/16 },
    stroke: 6,
    color: skinMedium,
  });
  // chin
  var chin = new Zdog.Shape({
    addTo: neck,
    translate: { y: neckY - 5, z: 2 },
    stroke: 8,
    color: skinMedium,
  });
  // forehead
  var forehead = new Zdog.Ellipse({
    diameter: 2,
    addTo: chin,
    translate: { y: -4 },
    stroke: 4,
    color: skinMedium,
  });
  // hair big
  new Zdog.Shape({
    path: [
      { y: -1 },
      { y: -7 },
    ],
    addTo: chin,
    translate: { x: -2, y: -2, z: -3 },
    stroke: 4,
    color: auburn,
  });
  // hair small
  new Zdog.Shape({
    path: [
      { y: 0 },
      { y: -6 },
    ],
    addTo: chin,
    translate: { x: 1.25, y: -2, z: -3 },
    stroke: 2.5,
    color: red,
  });
  // hair back
  new Zdog.Ellipse({
    diameter: 3,
    addTo: chin,
    translate: { y: -4, z: -4 },
    stroke: 4,
    color: auburn,
  });
  // smile
  new Zdog.Ellipse({
    addTo: chin,
    quarters: 2,
    translate: { y: -1.5, z: 3 },
    rotate: { z: TAU/4 },
    scale: 3,
    fill: true,
    stroke: 0.5,
    color: white,
    closed: true,
  });
  // eyes
  var eye = new Zdog.Ellipse({
    addTo: forehead,
    quarters: 2,
    scale: 1,
    translate: { x: -1, y: 0.5, z: 2 },
    rotate: { z: -TAU/4 },
    closed: false,
    color: midnight,
    stroke: 0.38,
    fill: false,
  });
  eye.copy({
    translate: { x: 1, y: 0.5, z: 2 },
  });

  var ear = new Zdog.Ellipse({
    diameter: 1.5,
    addTo: forehead,
    translate: { x: 3.5, y: 1, z: -1 },
    rotate: { y: -TAU/8 },
    stroke: 1,
    color: skinMedium,
    fill: true,
  });
  ear.copy({
    translate: { x: -3.5, y: 1, z: -1 },
    rotate: { y: TAU/8 },
  });

})();

// lady
( function() {

  var lady = new Zdog.Anchor({
    addTo: ground,
    translate: { x : 24, z: 12 },
  });

  var hips = new Zdog.Shape({
    addTo: lady,
    translate: { y: -38 },
    stroke: 15,
    color: navy,
  });

  var torsoAnchor = new Zdog.Anchor({
    addTo: hips,
    rotate: { x: -TAU/8 },
  });

  var torso = new Zdog.Rect({
    width: 1,
    height: 5,
    addTo: torsoAnchor,
    translate: { y: -9 },
    stroke: 8,
    color: beigeLight,
  });

  // ----- lady head ----- //

  var neck = new Zdog.Shape({
    path: [ {}, { y: -2 }],
    addTo: torso,
    translate: { y: -7 },
    stroke: 4,
    color: skinLight,
  });

  var collar = new Zdog.RoundedRect({
    width: 3,
    height: 5,
    cornerRadius: 1.5,
    addTo: neck,
    translate: { x: 1, y: 2, z: 0 },
    rotate: { x: -TAU/4, z: TAU/8 },
    color: white,
    fill: true,
  });
  collar.copy({
    translate: { x: -1, y: 2, z: 0 },
    rotate: { x: -TAU/4, z: -TAU/8 },
  });

  var head = new Zdog.Anchor({
    addTo: neck,
    translate: { y: -6 },
    rotate: { x: TAU/8 },
  });
  // var faceGroup = new Zdog.Group({
  //   addTo: head,
  // });
  // hair cap
  new Zdog.Hemisphere({
    addTo: head,
    diameter: 11,
    color: midnight,
    stroke: 1.5,
    translate: { y: -1 },
    rotate: { x: TAU/8 * 3, y: 0 },
  });
  // face
  new Zdog.Hemisphere({
    addTo: head,
    diameter: 9,
    color: skinLight,
    backface: midnight,
    stroke: 0.5,
    translate: { y: -0.95 },
    rotate: { x: TAU/8 * 3, y: TAU/2 },
  });
  // smile
  new Zdog.Ellipse({
    addTo: head,
    diameter: 3,
    quarters: 1,
    translate: { y: 0.5, z: 4 },
    rotate: { z: TAU * 3/8 },
    color: skinDark,
    closed: false,
    stroke: 0.5,
  });

  // hair locks
  new Zdog.RoundedRect({
    width: 6,
    height: 10,
    cornerRadius: 3,
    addTo: head,
    translate: { y: 2, x: 4.5, z: -2 },
    rotate: { y: TAU/4 },
    fill: true,
    color: midnight,
    stroke: 2,
  });
  // hairLock.copy({
  //   translate: { y: 8, x: 4.5, z: -2 },
  // });


  // glasses
  var glasses = new Zdog.Group({
    addTo: head,
    translate: { y: -1, z: 5 },
  });

  var lens = new Zdog.Ellipse({
    diameter: 4,
    addTo: glasses,
    translate: { x: -2.5 },
    stroke: false,
    fill: true,
    color: '#603',
  });
  lens.copy({
    translate: { x: 2.5 },
  });

  var glassesRim = lens.copy({
    stroke: 1,
    fill: false,
    color: auburn,
  });
  glassesRim.copy({
    translate: { x: 2.5 },
  });



  // ----- lady arms ----- //

  var leftWrist = { z: 14, y: -14 };

  var leftArm = new Zdog.Shape({
    path: [
      { z: -0, y: 0 },
      { z: 12, y: -2 }, // elbow
      leftWrist,
      // hack for z-sort probs
      { move: { x: 16, z: -16 } },
    ],
    addTo: torso,
    translate: { x: 5, y: -3 },
    closed: false,
    color: skinMedium,
    stroke: 4,
  });

  // leftHand
  var leftHand = new Zdog.Shape({
    path: [ { x: -1, z: -0.5 } ],
    addTo: leftArm,
    translate: leftWrist,
    color: skinMedium,
    stroke: 6,
  });

  var phoneAnchor = new Zdog.Anchor({
    addTo: leftHand,
    translate: { x: -2, y: -0, z: -4 },
    rotate: { x: TAU/8 },
  });

  var phoneBack = new Zdog.Group({
    addTo: phoneAnchor,
  });
  var phoneFront = new Zdog.Group({
    addTo: phoneAnchor,
    translate: { z: -0.5 },
  });
  // back phone panel
  var phonePanel = new Zdog.RoundedRect({
    width: 4,
    height: 8,
    cornerRadius: 1,
    addTo: phoneBack,
    stroke: 0.5,
    color: bluePale,
    fill: true,
  });
  // phone logo dot
  new Zdog.Ellipse({
    diameter: 1.25,
    addTo: phoneBack,
    translate: { y: -1 },
    fill: true,
    stroke: false,
    color: sky,
  });
  // phone camera dot
  new Zdog.Shape({
    addTo: phoneBack,
    translate: { x: -1, y: -3 },
    color: midnight,
    stroke: 0.5,
  });

  // z-sort hack
  new Zdog.Shape({
    path: [ { z: 16 } ],
    addTo: phoneBack,
    visible: false,
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
    rotate: { z: TAU/16, x: TAU/32 },
    color: skinLight,
  });

  var rightHandPosition = new Zdog.Vector( rightWrist ).add({ x: -0.5, z: -1 });

  var rightHand = leftHand.copy({
    path: [{}],
    addTo: rightArm,
    translate: rightHandPosition,
    color: skinLight,
  });

  var suitCase = new Zdog.Anchor({
    addTo: rightHand,
    translate: { y: 12 },
    rotate: { y: TAU/4 }
  });

  var suitCaseFrontPanel = new Zdog.RoundedRect({
    addTo: suitCase,
    width: 24,
    height: 14,
    cornerRadius: 2,
    translate: { z: 3 },
    color: '#848',
    fill: true,
  });
  suitCaseFrontPanel.copy({
    translate: { z: -3 },
    color: '#606',
  });

  var suitCaseTopPanel = new Zdog.Rect({
    addTo: suitCase,
    width: 20,
    height: 5,
    translate: { y: -7 },
    rotate: { x: TAU/4 },
    stroke: 0.5,
    fill: true,
    color: '#606',
  });
  suitCaseTopPanel.copy({
    translate: { y: 7 },
  });
  var suitCaseSidePanel = suitCaseTopPanel.copy({
    width: 5,
    height: 10,
    translate: { x: 12 },
    rotate: { y: TAU/4 },
  });
  suitCaseSidePanel.copy({
    translate: { x: -12 },
  });
  // suit case filler
  new Zdog.Rect({
    addTo: suitCase,
    width: 20,
    height: 10,
    stroke: 4,
    color: '#606',
  });
  // suit case handle
  var suitCaseHandle = new Zdog.Shape({
    addTo: suitCase,
    path: [
      {},
      { arc: [
        { x: 1, y: 0 },
        { x: 1, y: 1 },
      ]},
      { x: 1, y: 3 },
    ],
    translate: { x: 3, y: -11 },
    stroke: 1.5,
    color: midnight,
    closed: false,
  });
  suitCaseHandle.copy({
    scale: { x: -1 },
    translate: { x: -3, y: -11 },
  });

  // ---- leg ---- //

  // left leg
  var leftAnkle = { y: 28 };
  var leftLeg = new Zdog.Shape({
    addTo: hips,
    path: [ { y: 0 }, leftAnkle ],
    translate: { x: 3.5, y: 4, z: 0 },
    stroke: 7,
    rotate: { x: -TAU/8 },
    color: midnight,
  });

  // right thigh
  var rightKnee = { y: 16 };
  var rightThigh = new Zdog.Shape({
    addTo: hips,
    path: [ { y: 0 }, rightKnee ],
    translate: { x: -3.5, y: 4, z: 0 },
    stroke: 7,
    rotate: { x: TAU/8 },
    color: navy,
  });
  // rightShin
  var rightAnkle = { y: 10 };
  var rightShin = new Zdog.Shape({
    addTo: rightThigh,
    path: [ { y: 0 }, rightAnkle ],
    translate: rightKnee,
    stroke: 7,
    rotate: { x: -TAU/8 },
    color: navy,
  });

  // lady feet
  var rightFoot = new Zdog.Shape({
    addTo: rightShin,
    path: [ { y: 2 }, { y: 8 } ],
    translate: rightAnkle,
    stroke: 4,
    color: skinLight,
  });
  // heel
  new Zdog.Shape({
    addTo: rightFoot,
    path: [ { x: -1 }, { x: 1 } ],
    translate: { y: 5, z: -3 },
    stroke: 4,
    color: beigeLight,
  });
  // sole edge
  var soleEdge = new Zdog.Shape({
    addTo: rightFoot,
    path: [
      { x: -2, z: -2 },
      { arc: [
        { x: -2, z: -2, y: 5 },
        { x: 0, z: 2, y: 5 }
      ]},
    ],
    translate: { y: 6 },
    stroke: 2,
    fill: false,
    closed: false,
    color: beigeLight,
  });
  soleEdge.copy({
    scale: { x: -1 },
  });

  // heel spike
  new Zdog.Shape({
    addTo: rightFoot,
    path: [ {}, { y: 5 } ],
    translate: { y: 6, z: -4 },
    stroke: 2,
    color: beigeLight,
  });
  rightFoot.copyGraph({
    addTo: leftLeg,
    translate: leftAnkle,
    color: skinMedium,
  });

})();

( function() {
  

  // big puff
  var cloud = new Zdog.Shape({
    addTo: illo,
    translate: { x: 34, y: -26, z: -20 },
    rotate: { y: -sceneStartRotation.y },
    stroke: 16,
    color: white,
  });

  // left small puff
  var smallPuff = new Zdog.Shape({
    addTo: cloud,
    translate: { x: -9, y: 4, z: 4 },
    stroke: 8,
    color: white,
  });
  smallPuff.copy({
    translate: { x: 9, y: 5, z: 6 },
    stroke: 10,
  });

  var disk = new Zdog.RoundedRect({
    addTo: cloud,
    width: 26,
    height: 12,
    cornerRadius: 6,
    translate: { x: -6, y: 7, z: 4 },
    rotate: { x: TAU/4 },
    stroke: 3,
    color: white,
    fill: true,
  });
  disk.copy({
    translate: { x: 6, y: 9, z: 8 },
  });

  // sun
  new Zdog.Shape({
    addTo: cloud,
    translate: { x: -13, y: 0, z: -14 },
    stroke: 8,
    color: beigeLight,
  });

})();

// -- animate --- //

var t = 0;
var tSpeed = 1/240;

function animate() {
  // update
  if ( isSpinning ) {
    t += tSpeed;
    var theta = Zdog.easeInOut( t % 1 ) * TAU;
    illo.rotate.y = -theta + sceneStartRotation.y;
  }

  illo.updateRenderGraph();
  requestAnimationFrame( animate );
}

animate();

// ----- inputs ----- //

document.querySelector('.reset-button').onclick = function() {
  illo.rotate.set( sceneStartRotation );
};
