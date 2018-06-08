// -------------------------- demo -------------------------- //

var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
var w = 96;
var h = 96;
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


var ROOT3 = Math.sqrt(3);
var ROOT5 = Math.sqrt(5);
var PHI = ( 1 + ROOT5 ) / 2;
var isRotating = true;
var t = 0;
var tSpeed = 1/180;
var viewRotation = new Vector3();

// warm colors
var violet = '#636';
var magenta = '#C25';
var orange = '#E62';
var gold = '#EA0';
var yellow = '#ED0';

// cool colors
// var violet = '#366';
// var magenta = '#C25';
// var orange = '#4DD';
// var gold = '#EA0';
// var yellow = '#8FF';

var scene = new Anchor({
  scale: 8,
});

var solids = [];

// ----- hourglass ----- //

( function() {

  var hourglass = new Anchor({
    addTo: scene,
    translate: { x: -4, y: -4 },
  });

  solids.push( hourglass );

  var hemi = new Hemisphere({
    radius: 1,
    translate: { z: 1 },
    addTo: hourglass,
    color: magenta,
    baseColor: orange,
    stroke: false,
  });

  hemi.copy({
    translate: { z: -1 },
    rotate: { y: TAU/2 },
    color: violet,
    baseColor: gold,
  });

})();

// ----- sphere ----- //

( function() {

  var sphere = new Anchor({
    addTo: scene,
    translate: { x: 4, y: 4 },
  });

  solids.push( sphere );

  var hemi = new Hemisphere({
    radius: 1,
    addTo: sphere,
    color: orange,
    baseColor: violet,
    stroke: false,
  });

  hemi.copy({
    rotate: { y: TAU/2 },
    color: violet,
    baseColor: orange,
  });

})();

// ----- cylinder ----- //

var cylinder = new Cylinder({
  radius: 1,
  length: 2,
  addTo: scene,
  translate: { x: 0, y: -4 },
  // rotate: { x: TAU/4 },
  color: gold,
  baseColor: magenta,
  stroke: false,
});

solids.push( cylinder );

// ----- cone ----- //

var cone = new Anchor({
  addTo: scene,
  translate: { x: -4, y: 0 },
});

solids.push( cone );

new Cone({
  radius: 1,
  height: 2,
  addTo: cone,
  translate: { z: -1 },
  rotate: { y: TAU/2 },
  color: magenta,
  baseColor: gold,
  stroke: false,
});

// ----- tetrahedron ----- //

( function() {

  var tetrahedron = new Anchor({
    addTo: scene,
    translate: { x: 0, y: 0 },
    scale: 2.5,
  });

  var radius = 0.5;
  var inradius = Math.cos( TAU/6 ) * radius;
  var height = radius + inradius;

  solids.push( tetrahedron );

  var triangle = new Polygon({
    sides: 3,
    radius: radius,
    addTo: tetrahedron,
    translate: { y: height/2 },
    fill: true,
    stroke: false,
    color: violet,
    // backfaceVisible: false,
  });


  for ( var i=0; i < 3; i++ ) {
    var rotor1 = new Anchor({
      addTo: tetrahedron,
      rotate: { y: TAU/3 * i },
    });
    var rotor2 = new Anchor({
      addTo: rotor1,
      translate: { z: -inradius, y: height/2 },
      rotate: { x: Math.acos(1/3) - TAU/4  },
    });
    triangle.copy({
      addTo: rotor2,
      translate: { y: -inradius },
      color: [ magenta, orange, gold ][i],
    });
  }

  triangle.rotate.set({ x: TAU/4, z: TAU/2 });

})();

// ----- octahedron ----- //

( function() {

  var octahedron = new Anchor({
    addTo: scene,
    translate: { x: 4, y: 0 },
    scale: 1.75,
  });

  solids.push( octahedron );

  var colorWheel = [ violet, magenta, orange, gold, yellow ];

  // radius of triangle with side length = 1
  var radius = ROOT3/2 * 2/3;
  var height = radius * 3/2;
  var tilt = Math.asin( 0.5 / height ) * -1;

  [ -1, 1 ].forEach( function( ySide ) {
    for ( var i=0; i < 4; i++ ) {
      var rotor = new Anchor({
        addTo: octahedron,
        rotate: { y: TAU/4 * i },
      });

      var anchor = new Anchor({
        addTo: rotor,
        translate: { z: -0.5 },
        rotate: { x: tilt * ySide },
        // scale: { y: -ySide },
      });

      new Polygon({
        sides: 3,
        radius: radius,
        addTo: anchor,
        translate: { y: -radius/2 * ySide },
        scale: { y: ySide },
        stroke: false,
        fill: true,
        color: colorWheel[ i + 0.5 + 0.5*ySide ],
        backfaceVisible: false,
      });
    }
  });


})();

// ----- cube ----- //

( function() {

  var cube = new Anchor({
    addTo: scene,
    translate: { x: 4, y: -4 },
    scale: 1,
  });

  solids.push( cube );

  var face = new Rect({
    width: 2,
    height: 2,
    addTo: cube,
    translate: { z: 1 },
    fill: true,
    stroke: false,
    color: magenta,
  });

  face.copy({
    translate: { z: -1 },
    color: magenta,
  });

  face.copy({
    translate: { x: -1 },
    rotate: { y: TAU/4 },
    color: gold,
  });

  face.copy({
    translate: { x: 1 },
    rotate: { y: TAU/4 },
    color: orange,
  });

  face.copy({
    translate: { y: -1 },
    rotate: { x: TAU/4 },
    color: yellow,
  });

  face.copy({
    translate: { y: 1 },
    rotate: { x: TAU/4 },
    color: violet,
  });

})();

// ----- dodecahedron ----- //

( function() {

  var dodecahedron = new Anchor({
    addTo: scene,
    translate: { x: -4, y: 4 },
    scale: 0.75,
  });

  solids.push( dodecahedron );

  // https://en.wikipedia.org/wiki/Regular_dodecahedron#Dimensions
  var midradius = ( PHI * PHI ) / 2;

  // top & bottom faces
  var face = new Polygon({
    sides: 5,
    radius: 1,
    addTo: dodecahedron,
    translate: { y: -midradius },
    rotate: { x: -TAU/4 },
    fill: true,
    stroke: false,
    color: yellow,
    // backfaceVisible: false,
  });

  face.copy({
    translate: { y: midradius },
    rotate: { x: TAU/4 },
    color: violet,
  });

  var colorWheel = [ violet, magenta, orange, gold, yellow ];

  [ -1, 1 ].forEach( function( ySide ) {

    for ( var i=0; i < 5; i++ ) {
      var rotor1 = new Anchor({
        addTo: dodecahedron,
        rotate: { y: TAU/5 * (i) },
      });
      var rotor2 = new Anchor({
        addTo: rotor1,
        rotate: { x: TAU/4*-ySide + Math.atan(2) },
      });

      face.copy({
        addTo: rotor2,
        translate: { z: -midradius },
        rotate: { z: TAU/2 },
        color: colorWheel[i],
      });
    }
  });

})();

// ----- isocahedron ----- //

( function() {

  var isocahedron = new Anchor({
    addTo: scene,
    translate: { x: 0, y: 4 },
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

  // var colorWheel = [ violet, magenta, orange, gold, yellow ];

  [ -1, 1 ].forEach( function( ySide ) {
    var capColors = {
      '-1': [ yellow, gold, orange, magenta, gold ],
      1: [ violet, magenta, orange, gold, magenta ],
    }[ ySide ];

    var sideColors = {
      '-1': [ yellow, orange, magenta, magenta, gold ],
      1: [ violet, orange, orange, gold, magenta ],
    }[ ySide ];

    for ( var i=0; i < 5; i++ ) {
      var rotor = new Anchor({
        addTo: isocahedron,
        rotate: { y: TAU/5 * i },
        translate: { y: sideHeight/2 * ySide },
      });

      var capRotateX = -capTilt;
      var isYPos = ySide > 0;
      capRotateX += isYPos ? TAU/2 : 0;

      var capAnchor = new Anchor({
        addTo: rotor,
        translate: { z: capApothem * ySide },
        rotate: { x: capRotateX },
      });

      // cap face
      var face = new Polygon({
        sides: 3,
        radius: faceRadius,
        addTo: capAnchor,
        translate: { y: -faceRadius/2 },
        stroke: false,
        fill: true,
        color: capColors[i],
        // backfaceVisible: false,
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
  render();
  requestAnimationFrame( animate );
}

animate();

// -- update -- //

function easeInOut( i ) {
  i = i % 1;
  var isFirstHalf = i < 0.5;
  var i1 = isFirstHalf ? i : 1 - i;
  i1 = i1 / 0.5;
  // make easing steeper with more multiples
  var i2 = i1 * i1;
  i2 = i2 / 2;
  return isFirstHalf ? i2 : i2*-1 + 1;
}

function update() {
  viewRotation.y += isRotating ? +TAU/150 : 0;

  if ( isRotating ) {
    t += tSpeed;
    var theta = easeInOut( t ) * TAU;
    var spin = -theta;
    var extraRotation = TAU * Math.floor( ( t % 4 ) );
    viewRotation.y = spin - extraRotation;
    var everyOtherCycle = t % 2 < 1;
    viewRotation.x = everyOtherCycle ? 0 : Math.sin( theta ) * TAU * 1/8;
  }

  solids.forEach( function( solid ) {
    solid.rotate.set( viewRotation );
  });

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
    dragStartAngleX = viewRotation.x;
    dragStartAngleY = viewRotation.y;
  },
  onPointerMove: function( pointer, moveX, moveY ) {
    var angleXMove = moveY / canvasWidth * TAU;
    var angleYMove = moveX / canvasWidth * TAU;
    viewRotation.x = dragStartAngleX + angleXMove;
    viewRotation.y = dragStartAngleY + angleYMove;
  },
});
