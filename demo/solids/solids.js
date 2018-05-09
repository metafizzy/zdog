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

var ROOT2 = Math.sqrt(2);
var PHI = ( 1 + Math.sqrt(5) ) / 2;
var isRotating = true;
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
  // scale: 16,
});

var solids = [];

// ----- hourglass ----- //

( function() {

  var hourglass = new Anchor({
    addTo: scene,
    translate: { x: -32, y: -32 },
  });

  solids.push( hourglass );

  new Hemisphere({
    radius: 8,
    translate: { z: 8 },
    addTo: hourglass,
    color: magenta,
    baseColor: orange,
    stroke: false,
  });

  new Hemisphere({
    radius: 8,
    translate: { z: -8 },
    rotate: { y: TAU/2 },
    addTo: hourglass,
    color: violet,
    baseColor: gold,
    stroke: false,
  });

})();

// ----- sphere ----- //

( function() {

  var sphere = new Anchor({
    addTo: scene,
    translate: { x: 32, y: 32 },
  });

  solids.push( sphere );

  new Hemisphere({
    radius: 8,
    addTo: sphere,
    color: orange,
    baseColor: violet,
    stroke: false,
  });

  new Hemisphere({
    radius: 8,
    rotate: { y: TAU/2 },
    addTo: sphere,
    color: violet,
    baseColor: orange,
    stroke: false,
  });

})();

// ----- cylinder ----- //

var cylinder = new Cylinder({
  radius: 8,
  length: 16,
  addTo: scene,
  translate: { x: 0, y: -32 },
  // rotate: { x: TAU/4 },
  color: gold,
  baseColor: magenta,
  stroke: false,
});

solids.push( cylinder );

// ----- cone ----- //

var cone = new Anchor({
  addTo: scene,
  translate: { x: -32, y: 0 },
});

solids.push( cone );

new Cone({
  radius: 8,
  height: 16,
  addTo: cone,
  translate: { z: -8 },
  rotate: { y: TAU/2 },
  color: magenta,
  baseColor: gold,
  stroke: false,
});

// ----- tetrahedron ----- //

/*
( function() {

  var z = -1/ROOT2;
  var a = { x: -1, y:  0, z: -z };
  var b = { x:  1, y:  0, z: -z };
  var c = { x:  0, y: -1, z:  z };
  var d = { x:  0, y:  1, z:  z };

  var tetrahedron = new Anchor({
    addTo: scene,
    translate: { x: 0 },
    scale: 9,
  });

  solids.push( tetrahedron );

  // rotate back so pyamid pointing up
  var rotor = new Anchor({
    addTo: tetrahedron,
    // HACK fudge numbers
    translate: { y: -z/2 },
    rotate: { x: -Math.atan( -z ) },
  });

  var tetraTri = new Shape({
    path: [ a, b, c ],
    addTo: rotor,
    fill: true,
    stroke: false,
    color: magenta,
  });

   tetraTri.copy({
     path: [ a, b, d ],
     color: violet,
   });

   tetraTri.copy({
     path: [ a, c, d ],
     color: orange,
   });

   tetraTri.copy({
     path: [ b, c, d ],
     color: yellow,
   });

})();
*/

// ----- tetrahedron2 ----- //

( function() {

  var tetrahedron = new Anchor({
    addTo: scene,
    translate: { x: 0, y: 0 },
    scale: 20,
  });

  var inradius = Math.cos(TAU/6)/2;

  solids.push( tetrahedron );

  var ROOT3 = Math.sqrt(3);

  var triangle = new Polygon({
    sides: 3,
    radius: 0.5,
    addTo: tetrahedron,
    translate: { y: inradius },
    fill: true,
    stroke: false,
    color: violet,
  });


  for ( var i=0; i < 3; i++ ) {
    var rotor1 = new Anchor({
      addTo: tetrahedron,
      rotate: { y: TAU/3 * i },
    });
    var rotor2 = new Anchor({
      addTo: rotor1,
      translate: { z: inradius, y: inradius },
      rotate: { x: TAU/4 - Math.acos(1/3)  },
    });
    triangle.copy({
      addTo: rotor2,
      translate: { y: -inradius },
      color: [ magenta, orange, gold ][i],
    });
  }

  triangle.rotate.set({ x: TAU/4 });

})();

// ----- octahedron ----- //

( function() {

  var a = { x: -1, y:  0,  z:  0 };
  var b = { x:  1, y:  0,  z:  0 };
  var c = { x:  0, y: -1,  z:  0 };
  var d = { x:  0, y:  1,  z:  0 };
  var e = { x:  0, y:  0,  z: -1 };
  var f = { x:  0, y:  0,  z:  1 };

  var octahedron = new Anchor({
    addTo: scene,
    translate: { x: 32, y: 0 },
    scale: 9,
  });

  solids.push( octahedron );

  var triangle = new Shape({
    path: [ a, c, e ],
    addTo: octahedron,
    fill: true,
    stroke: false,
    color: orange,
  });

   triangle.copy({
     path: [ a, c, f ],
     color: gold,
   });

   triangle.copy({
     path: [ b, c, e ],
     color: magenta,
   });

   triangle.copy({
     path: [ b, c, f ],
     color: violet,
   });

  triangle.copy({
    path: [ a, d, e ],
    color: gold,
  });

   triangle.copy({
     path: [ a, d, f ],
     color: yellow,
   });

   triangle.copy({
     path: [ b, d, e ],
     color: orange,
   });

   triangle.copy({
     path: [ b, d, f ],
     color: magenta,
   });

})();

// ----- cube ----- //

( function() {

  var cube = new Anchor({
    addTo: scene,
    translate: { x: 32, y: -32 },
    scale: 8,
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
    translate: { x: -32, y: 32 },
    scale: 6,
  });

  solids.push( dodecahedron );

  // rotate so z axis is pointing up for y axis
  var solidRotor = new Anchor({
    addTo: dodecahedron,
    rotate: { x: -TAU/4 },
  });

  // https://en.wikipedia.org/wiki/Regular_dodecahedron#Dimensions
  var midradius = ( PHI * PHI ) / 2;

  var face = new Polygon({
    sides: 5,
    radius: 1,
    addTo: solidRotor,
    translate: { z: -midradius },
    fill: true,
    stroke: false,
    color: yellow,
  });

  face.copy({
    translate: { z: midradius },
    rotate: { z: TAU/2 },
    color: violet,
  });

  [ -1, 1 ].forEach( function( ySide ) {
    var colorWheel = [ violet, magenta, orange, gold, yellow ];

    for ( var i=0; i < 5; i++ ) {
      var rotor1 = new Anchor({
        addTo: solidRotor,
        rotate: { z: TAU/5 * (i+0.25) },
      });
      var rotor2 = new Anchor({
        addTo: rotor1,
        rotate: { y: Math.atan(2) },
      });

      face.copy({
        addTo: rotor2,
        translate: {},
        translate: { z: midradius*ySide },
        // scale: { x: -ySide },
        rotate: { z: TAU/4*-ySide },
        color: colorWheel[i],
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

function update() {
  viewRotation.y += isRotating ? +TAU/150 : 0;

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
