/* jshint unused: false */

function makeMadeline( camera, isGood, colors, rotation ) {

  var rotor = new Shape({
    rendering: false,
    addTo: camera,
    rotate: rotation,
  });

  var body = new Shape({
    rendering: false,
    addTo: rotor,
    rotate: { x: TAU/8 },
    translate: { z: 48 },
  });

  var head = new Shape({
    rendering: false,
    addTo: body,
    translate: { y: -11, z: 2 },
    rotate: { x: -TAU/8 },
  });

  // face
  var face = new Ellipse({
    width: 6,
    height: 6,
    addTo: head,
    translate: { z: -4 },
    lineWidth: 8,
    color: colors.skin,
  });

  var eyeGroup = new Group({
    addTo: face,
    translate: { z: -face.lineWidth/2 + 0.5 },
  });


  // eyes
  [ -1, 1 ].forEach( function( xSide ) {
    var eyeX = 3.5*xSide;

    // eye
    var eyeWhite = new Ellipse({
      width: 1,
      height: 1,
      addTo: eyeGroup,
      color: colors.eye,
      translate: { x: eyeX },
      lineWidth: 2,
      fill: true,
    });

    // eye brow
    new Shape({
      path: [
        { x: -1, y: 0 },
        { arc: [
          { x: -1, y: -1 },
          { x: 0, y: -1 }
        ]},
        { arc: [
          { x: 1, y: -1 },
          { x: 1, y: 0 }
        ]},
      ],
      addTo: eyeGroup,
      translate: { x: eyeX, y: -3 },
      scale: { x: 1.5, y: 0.6 },
      rotate: { z: -0.1*xSide },
      color: colors.hair,
      lineWidth: 1,
      fill: true,
    });


  });


  // hair ball
  new Shape({
    path: [
      { x: -1 },
      { x: 1 },
      { z: 4 },
    ],
    addTo: head,
    translate: { y: -4, z: 1 },
    lineWidth: 18,
    color: colors.hair,
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
    color: colors.hair,
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
    color: colors.hair,
  });

  // trail locks

  var trailLock = new Shape({
    path: [
      { y: -4, z: 0 },
      { bezier: [
        { y: -10, z: 14 },
        { y: 0, z: 16 },
        { y: 0, z: 26 }
      ]},
    ],
    addTo: head,
    translate: { z: 4, y: 0 },
    lineWidth: 10,
    color: colors.hair,
    closed: false,
  });

  trailLock.copy({
    translate: { x: -3, z: 4 },
    rotate: { z: -TAU/8 },
    lineWidth: 8,
  });
  trailLock.copy({
    translate: { x: 3, z: 4 },
    rotate: { z: TAU/8 },
    lineWidth: 8,
  });
  trailLock.copy({
    translate: { y: 2 },
    // rotate: { z: TAU/2 },
    scale: { y: 0.5 },
    lineWidth: 8,
  });

  // ----- torso ----- //

  // 2nd rib
  var torsoRib = new Ellipse({
    width: 12,
    height: 10,
    addTo: body,
    rotate: { x: TAU/4 },
    translate: { y: -1 },
    lineWidth: 6,
    color: colors.parkaLight,
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
    color: colors.parkaDark,
  });
  // waist
  new Ellipse({
    width: 10,
    height: 8,
    addTo: body,
    rotate: { x: TAU/4 },
    translate: { y: 11 },
    lineWidth: 4,
    color: colors.tight,
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
      color: colors.parkaLight,
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
      color: colors.parkaDark,
    });

    // hand
    new Shape({
      addTo: elbowJoint,
      translate: { y: 9, z: -1 },
      lineWidth: 8,
      color: colors.skin,
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
      translate: { x: 4*xSide, y: 13 },
      lineWidth: 8,
      color: colors.tight,
    });

    var shin = new Shape({
      path: [ { y: 0 }, { y: 8 } ],
      addTo: thigh,
      lineWidth: 6,
      translate: knee,
      color: colors.tight,
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
    color: colors.tight,
  });

}
