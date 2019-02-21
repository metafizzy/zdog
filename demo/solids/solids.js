// -------------------------- demo -------------------------- //

var illoElem = document.querySelector('.illo');
var sceneSize = 96;
var minWindowSize = Math.min( window.innerWidth, window.innerHeight );
var zoom = Math.min( 6, Math.floor( minWindowSize / sceneSize ) );
var illoSize = sceneSize * zoom;
illoElem.setAttribute( 'width', illoSize );
illoElem.setAttribute( 'height', illoSize );

var TAU = Zdog.TAU;
var ROOT3 = Math.sqrt(3);
var ROOT5 = Math.sqrt(5);
var PHI = ( 1 + ROOT5 ) / 2;
var isRotating = true;
var t = 0;
var tSpeed = 1/180;
var viewRotation = new Zdog.Vector();

// warm colors
var eggplant = '#636';
var garnet = '#C25';
var orange = '#E62';
var gold = '#EA0';
var yellow = '#ED0';

var illo = new Zdog.Illustration({
  element: illoElem,
  zoom: zoom,
  scale: 8,
});

var solids = [];

// ----- hourglass ----- //

( function() {

  var hourglass = new Zdog.Anchor({
    addTo: illo,
    translate: { x: 0, y: -4 },
  });

  solids.push( hourglass );

  var hemi = new Zdog.Hemisphere({
    diameter: 2,
    translate: { z: -1 },
    addTo: hourglass,
    color: garnet,
    backface: orange,
    stroke: false,
  });

  hemi.copy({
    translate: { z: 1 },
    rotate: { y: TAU/2 },
    color: eggplant,
    backface: gold,
  });

})();

// ----- sphere ----- //

( function() {

  var sphere = new Zdog.Anchor({
    addTo: illo,
    translate: { x: -4, y: -4 },
  });

  solids.push( sphere );

  var hemi = new Zdog.Hemisphere({
    diameter: 2,
    addTo: sphere,
    color: orange,
    backface: eggplant,
    stroke: false,
  });

  hemi.copy({
    rotate: { y: TAU/2 },
    color: eggplant,
    backface: orange,
  });

})();

// ----- cylinder ----- //

var cylinder = new Zdog.Cylinder({
  diameter: 2,
  length: 2,
  addTo: illo,
  translate: { x: 4, y: -4 },
  // rotate: { x: TAU/4 },
  color: gold,
  backface: garnet,
  stroke: false,
});

solids.push( cylinder );

// ----- cone ----- //

var cone = new Zdog.Anchor({
  addTo: illo,
  translate: { x: -4, y: 0 },
});

solids.push( cone );

new Zdog.Cone({
  diameter: 2,
  length: 2,
  addTo: cone,
  translate: { z: 1 },
  rotate: { y: TAU/2 },
  color: garnet,
  backface: gold,
  stroke: false,
});

// ----- tetrahedron ----- //

( function() {

  var tetrahedron = new Zdog.Anchor({
    addTo: illo,
    translate: { x: 0, y: 0 },
    scale: 2.5,
  });

  var radius = 0.5;
  var inradius = Math.cos( TAU/6 ) * radius;
  var height = radius + inradius;

  solids.push( tetrahedron );

  var triangle = new Zdog.Polygon({
    sides: 3,
    radius: radius,
    addTo: tetrahedron,
    translate: { y: height/2 },
    fill: true,
    stroke: false,
    color: eggplant,
    // backface: false,
  });


  for ( var i=0; i < 3; i++ ) {
    var rotor1 = new Zdog.Anchor({
      addTo: tetrahedron,
      rotate: { y: TAU/3 * -i },
    });
    var rotor2 = new Zdog.Anchor({
      addTo: rotor1,
      translate: { z: inradius, y: height/2 },
      rotate: { x: Math.acos(1/3) * -1 + TAU/4  },
    });
    triangle.copy({
      addTo: rotor2,
      translate: { y: -inradius },
      color: [ gold, garnet, orange ][i],
    });
  }

  triangle.rotate.set({ x: -TAU/4, z: -TAU/2 });

})();

// ----- octahedron ----- //

( function() {

  var octahedron = new Zdog.Anchor({
    addTo: illo,
    translate: { x: -4, y: 4 },
    scale: 1.75,
  });

  solids.push( octahedron );

  var colorWheel = [ eggplant, garnet, orange, gold, yellow ];

  // radius of triangle with side length = 1
  var radius = ROOT3/2 * 2/3;
  var height = radius * 3/2;
  var tilt = Math.asin( 0.5 / height );

  [ -1, 1 ].forEach( function( ySide ) {
    for ( var i=0; i < 4; i++ ) {
      var rotor = new Zdog.Anchor({
        addTo: octahedron,
        rotate: { y: TAU/4 * (i + 1.5) * -1 },
      });

      var anchor = new Zdog.Anchor({
        addTo: rotor,
        translate: { z: 0.5 },
        rotate: { x: tilt * ySide },
        // scale: { y: -ySide },
      });

      new Zdog.Polygon({
        sides: 3,
        radius: radius,
        addTo: anchor,
        translate: { y: -radius/2 * ySide },
        scale: { y: ySide },
        stroke: false,
        fill: true,
        color: colorWheel[ i + 0.5 + 0.5*ySide ],
        backface: false,
      });
    }
  });


})();

// ----- cube ----- //

var cube = new Zdog.Box({
  addTo: illo,
  width: 2,
  height: 2,
  depth: 2,
  translate: { x: 4, y: 0 },
  topFace: yellow,
  frontFace: gold,
  leftFace: orange,
  rightFace: orange,
  rearFace: garnet,
  bottomFace: eggplant,
  stroke: false,
});

solids.push( cube );

// ----- dodecahedron ----- //

( function() {

  var dodecahedron = new Zdog.Anchor({
    addTo: illo,
    translate: { x: 0, y: 4 },
    scale: 0.75,
  });

  solids.push( dodecahedron );

  // https://en.wikipedia.org/wiki/Regular_dodecahedron#Dimensions
  var midradius = ( PHI * PHI ) / 2;

  // top & bottom faces
  var face = new Zdog.Polygon({
    sides: 5,
    radius: 1,
    addTo: dodecahedron,
    translate: { y: -midradius },
    rotate: { x: TAU/4 },
    fill: true,
    stroke: false,
    color: yellow,
    // backface: false,
  });

  face.copy({
    translate: { y: midradius },
    rotate: { x: -TAU/4 },
    color: eggplant,
  });


  [ -1, 1 ].forEach( function( ySide ) {


    var colorWheel = {
      '-1': [ eggplant, garnet, gold, orange, garnet ],
      1: [ yellow, gold, garnet, orange, gold ],
    }[ ySide ];

    for ( var i=0; i < 5; i++ ) {
      var rotor1 = new Zdog.Anchor({
        addTo: dodecahedron,
        rotate: { y: TAU/5 * (i) },
      });
      var rotor2 = new Zdog.Anchor({
        addTo: rotor1,
        rotate: { x: TAU/4*ySide - Math.atan(2) },
      });

      face.copy({
        addTo: rotor2,
        translate: { z: midradius },
        rotate: { z: TAU/2 },
        color: colorWheel[i],
      });
    }
  });

})();

// ----- isocahedron ----- //

( function() {

  var isocahedron = new Zdog.Anchor({
    addTo: illo,
    translate: { x: 4, y: 4 },
    scale: 1.2,
  });

  solids.push( isocahedron );

  // geometry
  // radius of triangle with side length = 1
  var faceRadius = ROOT3/2 * 2/3;
  var faceHeight = faceRadius * 3/2;
  var capApothem = 0.5 / Math.tan( TAU/10 );
  var capRadius = 0.5 / Math.sin( TAU/10 );
  var capTilt = Math.asin( capApothem / faceHeight );
  var capSagitta = capRadius - capApothem;
  var sideTilt = Math.asin( capSagitta / faceHeight );
  var sideHeight = Math.sqrt( faceHeight*faceHeight - capSagitta*capSagitta );

  // var colorWheel = [ eggplant, garnet, orange, gold, yellow ];

  [ -1, 1 ].forEach( function( ySide ) {
    var capColors = {
      '-1': [ garnet, gold, yellow, gold, orange ],
      1: [ gold, garnet, eggplant, garnet, orange ],
    }[ ySide ];

    var sideColors = {
      '-1': [ garnet, gold, yellow, orange, garnet ],
      1: [ gold, garnet, eggplant, orange, orange ],
    }[ ySide ];

    for ( var i=0; i < 5; i++ ) {
      var rotor = new Zdog.Anchor({
        addTo: isocahedron,
        rotate: { y: TAU/5 * -i },
        translate: { y: sideHeight/2 * ySide },
      });

      var capRotateX = -capTilt;
      var isYPos = ySide > 0;
      capRotateX += isYPos ? TAU/2 : 0;

      var capAnchor = new Zdog.Anchor({
        addTo: rotor,
        translate: { z: capApothem * ySide },
        rotate: { x: capRotateX },
      });

      // cap face
      var face = new Zdog.Polygon({
        sides: 3,
        radius: faceRadius,
        addTo: capAnchor,
        translate: { y: -faceRadius/2 },
        stroke: false,
        fill: true,
        color: capColors[i],
        // backface: false,
      });

      var sideRotateX = -sideTilt;
      sideRotateX += isYPos ? 0 : TAU/2;
      var sideAnchor = capAnchor.copy({
        rotate: { x: sideRotateX },
      });

      face.copy({
        addTo: sideAnchor,
        translate: { y: -faceRadius/2 },
        rotate: { y: TAU/2 },
        color: sideColors[i]
      });

    }
  });

})();

// -- animate --- //

function animate() {
  update();
  illo.renderGraph();
  requestAnimationFrame( animate );
}

animate();

function update() {
  viewRotation.y += isRotating ? +TAU/150 : 0;

  if ( isRotating ) {
    t += tSpeed;
    var theta = Zdog.easeInOut( t ) * TAU;
    var everyOtherCycle = t % 2 < 1;
    viewRotation.y = everyOtherCycle ? theta : 0;
    viewRotation.x = everyOtherCycle ? 0 : -theta;
  }

  solids.forEach( function( solid ) {
    solid.rotate.set( viewRotation );
  });

  illo.updateGraph();
}

// ----- inputs ----- //

var dragStartAngleX, dragStartAngleY;

new Zdog.Dragger({
  startElement: illoElem,
  onDragStart: function() {
    isRotating = false;
    dragStartAngleX = viewRotation.x;
    dragStartAngleY = viewRotation.y;
  },
  onDragMove: function( pointer, moveX, moveY ) {
    var angleXMove = moveY / illoSize * TAU;
    var angleYMove = moveX / illoSize * TAU;
    viewRotation.x = dragStartAngleX + angleXMove;
    viewRotation.y = dragStartAngleY + angleYMove;
  },
});
