/* jshint unused: false */

var TAU = Zdog.TAU;

function makeMadeline( isGood, colors, options ) {

  var rotor = new Zdog.Anchor( options );

  var body = new Zdog.Group({
    addTo: rotor,
    rotate: { x: -TAU/8 },
    translate: { z: -48 },
    updateSort: true,
  });

  var head = new Zdog.Anchor({
    addTo: body,
    translate: { y: -11, z: -2 },
    rotate: { x: TAU/8 },
  });

  // face
  var face = new Zdog.Ellipse({
    diameter: 6,
    addTo: head,
    translate: { z: 4 },
    stroke: 8,
    color: colors.skin,
  });

  var eyeGroup = new Zdog.Group({
    addTo: face,
    translate: { z: face.stroke/2 - 0.5 },
  });


  // eyes
  [ -1, 1 ].forEach( function( xSide ) {
    // cheek blush
    if ( isGood ) {
      new Zdog.Ellipse({
        width: 2,
        height: 1.3,
        addTo: eyeGroup,
        translate: { x: 4.5*xSide, y: 3, z: -1 },
        rotate: { y: -TAU/16*xSide },
        stroke: 1,
        color: '#FA8',
        fill: true,
      });
    }

    var eyeX = 3.5*xSide;

    // eye
    new Zdog.Ellipse({
      width: 0.75,
      height: 1.5,
      addTo: eyeGroup,
      color: colors.eye,
      translate: { x: eyeX },
      stroke: 2,
      fill: true,
    });

    // eye brow
    new Zdog.Ellipse({
      addTo: eyeGroup,
      height: 3,
      width: 1.2,
      quarters: 2,
      translate: { x: eyeX, y: -3 },
      rotate: { z: -TAU/4 + 0.15*xSide * (isGood ? 1 : -1) },
      color: colors.hair,
      stroke: 1,
      fill: false,
      closed: true,
    });

  });


  // hair ball
  new Zdog.Shape({
    path: [
      { x: -1 },
      { x: 1 },
      { z: -4 },
    ],
    addTo: head,
    translate: { y: -4, z: -1 },
    stroke: 18,
    color: colors.hair,
  });

  var bang = new Zdog.Shape({
    path: [
      {},
      { arc: [
        { z: 4, y: 4 },
        { z: 0, y: 8 },
      ]},
    ],
    addTo: head,
    translate: { x: 2, y: -7.5, z: 6 },
    rotate: { x: 0.5, z: -0.5 },
    stroke: 4,
    color: colors.hair,
    closed: false,
  });
  bang.copy({
    translate: { x: 5, y: -6, z: 5 },
    rotate: { x: -0.3, z: -0.5 },
  });
  bang.copy({
    translate: { x: 5, y: -6, z: 3 },
    rotate: { y: -0.7, z: -1 },
  });

  // left side
  bang.copy({
    translate: { x: -2, y: -7.5, z: 6 },
    rotate: { x: 0, z: TAU/16*6 },
  });
  bang.copy({
    translate: { x: -5, y: -6, z: 5 },
    rotate: { x: 0, z: TAU/4 },
  });
  bang.copy({
    translate: { x: -5, y: -6, z: 3 },
    rotate: { y: 0.7, z: 1 },
  });

  // hair cover
  new Zdog.Shape({
    path: [
      { x: -3 },
      { x:  3 },
    ],
    addTo: head,
    stroke: 7,
    translate: { y: -8, z: 5 },
    color: colors.hair,
  });

  // trail locks

  var trailLock = new Zdog.Shape({
    path: [
      { y: -4, z: 0 },
      { bezier: [
        { y: -10, z: -14 },
        { y: 0, z: -16 },
        { y: 0, z: -26 }
      ]},
    ],
    addTo: head,
    translate: { z: -4, y: 0 },
    stroke: 10,
    color: colors.hair,
    closed: false,
  });

  trailLock.copy({
    translate: { x: -3, z: -4 },
    rotate: { z: -TAU/8 },
    stroke: 8,
  });
  trailLock.copy({
    translate: { x: 3, z: -4 },
    rotate: { z: TAU/8 },
    stroke: 8,
  });
  trailLock.copy({
    translate: { y: 2 },
    // rotate: { z: TAU/2 },
    scale: { y: 0.5 },
    stroke: 8,
  });

  // ----- torso ----- //

  // 2nd rib
  var torsoRib = new Zdog.Ellipse({
    width: 12,
    height: 10,
    addTo: body,
    rotate: { x: -TAU/4 },
    translate: { y: -1 },
    stroke: 6,
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
  new Zdog.Ellipse({
    width: 10,
    height: 8,
    addTo: body,
    rotate: { x: -TAU/4 },
    translate: { y: 11 },
    stroke: 4,
    color: colors.tight,
    fill: true,
  });

  // arms
  [ -1, 1 ].forEach( function( xSide ) {
    var isLeft = xSide == 1;
    // shoulder ball
    new Zdog.Shape({
      addTo: body,
      stroke: 6,
      translate: { x: 6*xSide, y: -5, z: -1 },
      color: colors.parkaLight,
    });

    var shoulderJoint = new Zdog.Anchor({
      addTo: body,
      translate: { x: 9*xSide, y: -3, z: -2 },
      rotate: isLeft ? { x: TAU/8*3, z: -TAU/32 } : { z: TAU/16*2, x: -TAU/16*2 },
    });

    // top shoulder rib
    var armRib = new Zdog.Ellipse({
      diameter: 2,
      rotate: { x: -TAU/4 },
      addTo: shoulderJoint,
      translate: { x: 0*xSide },
      stroke: 6,
      color: colors.parkaLight,
      fill: true,
    });
    armRib.copy({
      translate: { y: 4 },
    });

    var elbowJoint = new Zdog.Anchor({
      addTo: shoulderJoint,
      translate: { y: 8 },
      rotate: isLeft ? {} : { z: TAU/8 },
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
    new Zdog.Shape({
      addTo: elbowJoint,
      translate: { y: 9, z: -1 },
      stroke: 8,
      color: colors.skin,
    });

    // ----- legs ----- //
    var knee = { y: 7 };
    var thigh = new Zdog.Shape({
      path: [ { y: 0 }, knee ],
      addTo: body,
      translate: { x: 4*xSide, y: 13 },
      rotate: isLeft ? {} : { x: TAU/16*3, z: TAU/16 },
      stroke: 8,
      color: colors.tight,
    });

    var shin = new Zdog.Shape({
      path: [ { y: 0 }, { y: 8 } ],
      addTo: thigh,
      stroke: 6,
      translate: knee,
      rotate: isLeft ? {} : { x: -TAU/16*5 },
      color: colors.tight,
    });

  });

  // butt
  new Zdog.Shape({
    path: [
      { x: -3 },
      { x: 3 },
    ],
    visible: false,
    addTo: body,
    translate: { y: 11, z: -2 },
    stroke: 8,
    color: colors.tight,
  });

}
