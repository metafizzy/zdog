/* globals makeBuilding, lilPyramid, hedge, red, blue, navy, gold, white */

// -------------------------- demo -------------------------- //

var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
var w = 160;
var h = 160;
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

var isRotating = true;

// default to flat, filled shapes
[ Shape, Rect, Ellipse ].forEach( function( ItemClass ) {
  ItemClass.defaults.fill = true;
  ItemClass.defaults.stroke = false;
});

var camera = new Anchor({
  rotate: { y: -TAU/8 },
});

// -- illustration shapes --- //

var quarterView = 1/Math.sin(TAU/8);

// anchor
var town = new Group({
  addTo: camera,
  translate: { y: 36 },
  scale: { x: quarterView, z: quarterView },
  updateSort: true,
});

// ----- front building ----- //

var frontAnchor = new Anchor({
  addTo: town,
  translate: { x: 16, y: -4, z: -20 },
});

var frontBuilding = makeBuilding({
  width: 22,
  depth: 16,
  height: 20,
  addTo: frontAnchor,
  gable: 'ew',
  southWindows: [ 3, 1 ],
  eastWindows: [ 2, 2 ],
  westWindows: [ 2, 2 ],
  northWindows: [ 3, 2 ],
});

// east gable dot
var gableDot = new Ellipse({
  width: 2,
  height: 2,
  addTo: frontBuilding.eastWall,
  color: blue,
  translate: { y: -20 },
});
// west gable dot
gableDot.copy({
  addTo: frontBuilding.westWall,
  color: navy,
});

// south doors
var door = new Shape({
  path: [
    { x: -2.5, y: 0 },
    { x: -2.5, y: -5.5 },
    { arc: [
      { x: -2.5, y: -8 },
      { x:    0, y: -8 },
    ]},
    { arc: [
      { x:  2.5, y: -8 },
      { x:  2.5, y: -5.5 },
    ]},
    { x: 2.5, y: 0 },
  ],
  addTo: frontBuilding.southWall,
  translate: { x: -4.5 },
  color: navy,
});
door.copy({
  translate: { x: 4.5 },
});

[ -1, 1 ].forEach( function( zSide ) {
  var frontGableGroup = new Group({
    addTo: frontAnchor,
    translate: { y: -20, z: 8*zSide },
  });

  // front building gable
  new Shape({
    path: [
      { x:  0, y: -6 },
      { x: -6, y: 0 },
      { x:  6, y: 0 },
    ],
    addTo: frontGableGroup,
    translate: { y: 1 },
    color: zSide == -1 ? red : gold,
  });

  gableDot.copy({
    addTo: frontGableGroup,
    translate: { y: -2 },
    color: zSide == -1 ? navy : red,
  });

  var frontGableSide = new Shape({
    path: [
      { x: 0, y: 0, z: 0 },
      { x: 5, y: 5, z: 0 },
      { x: 0, y: 0, z: -5*zSide },
    ],
    addTo: frontAnchor,
    translate: { y: -25, z: 8*zSide },
    color: gold,
  });
  frontGableSide.copy({
    scale: { x: -1 },
    color: navy,
  });

});


// ----- left building ----- //

var leftAnchor = new Anchor({
  addTo: town,
  translate: { x: -13, y: -10, z: -23 },
});

var leftBuilding = makeBuilding({
  width: 16,
  depth: 22,
  height: 20,
  addTo: leftAnchor,
  gable: 'ns',
  southWindows: [ 2, 2 ],
  eastWindows: [ 3, 2 ],
  westWindows: [ 3, 1 ],
  northWindows: [ 2, 2 ],
});

door.copy({
  addTo: leftBuilding.westWall,
  translate: { x: -4.5 },
});
door.copy({
  addTo: leftBuilding.westWall,
  translate: { x: 4.5 },
});

// ----- cupola ----- //


var cupolaNSPanel = new Shape({
  path: [
    { x: -1, y: 0 },
    { x: 3, y: 0 },
    { x: 3, y: 9 },
    { x: -1, y: 5 },
      // HACK add point to sort in front of roof
      { move: [ { x: 8, z: -4 } ] },
  ],
  addTo: leftAnchor,
  translate: { y: -34, z: -3 },
  color: red,
});
cupolaNSPanel.copy({
  scale: { x: -1 },
});
cupolaNSPanel.copy({
  scale: { z: -1 },
  translate: { y: -34, z: 3 },
  color: gold,
});
cupolaNSPanel.copy({
  translate: { y: -34, z: 3 },
  scale: { x: -1, z: -1 },
  color: gold,
});

[ -1, 1 ].forEach( function( xSide ) {
  var group = new Group({
    addTo: leftAnchor,
    translate: { y: -34, x: 3*xSide },
  });
  // ew panel
  new Shape({
    path: [
      { z: -3, y:  0 },
      { z:  0, y: -3 },
      { z:  3, y:  0 },
      { z:  3, y:  9 },
      { z: -3, y:  9 },
      // HACK add point to sort in front of roof
      { move: [ { x: 16*xSide } ] },
    ],
    addTo: group,
    color: xSide == -1 ? blue : white,
  });
  gableDot.copy({
    addTo: group,
    translate: { y: 3 },
    rotate: { y: TAU/4 },
    color: xSide == -1 ? navy : blue,
  });
});

// cupola roof panel
var cupolaRoofPanel = new Shape({
  path: [
    { x: -3, y: -3, z:  0 },
    { x:  3, y: -3, z:  0 },
    { x:  3, y:  0, z: -3 },
    { x: -3, y:  0, z: -3 },
  ],
  addTo: leftAnchor,
  translate: { y: -34 },
  color: navy,
});
cupolaRoofPanel.copy({
  scale: { z: -1 },
  color: red,
});


// ----- left building slopes ----- //

// east slope
var leftEWSlope = new Shape({
  path: [
    { x: 0, y: 0, z: -11 },
    { x: 0, y: 0, z:  11 },
    { x: 6, y: 6, z:  11 },
    { x: 6, y: 6, z: -11 },
  ],
  addTo: leftAnchor,
  translate: { x: 8 },
  color: gold,
});
// west slope
leftEWSlope.copy({
  scale: { x: -1 },
  translate: { x: -8 },
  color: gold,
});

// south slope
new Shape({
  path: [
    { z:  0, y: 0, x: -8 },
    { z:  0, y: 0, x:  8 },
    { z: -6, y: 6, x:  8 },
    { z: -6, y: 6, x: -8 },
  ],
  addTo: leftAnchor,
  translate: { z: -11 },
  color: navy,
});

// south east corner
var leftCorner = new Shape({
  path: [
    { x: 0, y: 0, z:  0 },
    { x: 6, y: 6, z:  0 },
    { x: 0, y: 6, z: -6 },
  ],
  addTo: leftAnchor,
  translate: { x: 8, z: -11 },
  color: red,
});
// south west corner
leftCorner.copy({
  scale: { x: -1 },
  translate: { x: -8, z: -11 },
  color: blue,
});



// ----- back tower ----- //

var towerAnchor = new Anchor({
  addTo: town,
  translate: { x: -13, y: -24, z: 4 },
});

var tower = makeBuilding({
  width: 16,
  depth: 16,
  height: 28,
  addTo: towerAnchor,
  gable: 'ns',
  southWindows: [ 2, 3 ],
  eastWindows: [ 2, 2 ],
  westWindows: [ 2, 3 ],
  northWindows: [ 2, 3 ],
});

door.copy({
  addTo: tower.eastWall,
  translate: { x: 0 },
  color: blue,
});

gableDot.copy({
  addTo: tower.southWall,
  translate: { y: -29 },
  color: navy,
});

gableDot.copy({
  addTo: tower.northWall,
  translate: { y: -29 },
  color: red,
});

var towerChimney = new Shape({
  addTo: towerAnchor,
  path: [ { y: 0 }, { y: 4 } ],
  translate: { x: -2, y: -37, z: -1 },
  lineWidth: 2,
  stroke: true,
  color: navy,
});
towerChimney.copy({
  translate: { x: -2, y: -37, z: 3 },
});

// plume
new Shape({
  path: [
    { x: -3, y: 1 },
    { arc: [
      { x: -3, y: -1 },
      { x: -1, y: -1 },
    ]},
    { x:  3, y: -1 },
    { arc: [
      { x:  3, y:  1 },
      { x:  1, y:  1 },
    ]},
  ],
  addTo: towerAnchor,
  translate: { x: -2, y: -42, z: 6 },
  rotate: { y: TAU/4 },
  stroke: true,
  lineWidth: 2,
  color: blue
});

// ----- tower slopes ----- //

// big east slope
var towerEWSlope = new Shape({
  path: [
    { x: 0, y: 0, z: -1 },
    { x: 0, y: 0, z:  1 },
    { x: 1, y: 1, z:  1 },
    { x: 1, y: 1, z: -1 },
  ],
  addTo: towerAnchor,
  translate: { x: 8 },
  // size by scaling
  scale: { x: 20, y: 20, z: 8 },
  color: gold,
});

// south slope down to left building
var towerNSSLope = new Shape({
  path: [
    { z: 0, y: 0, x: -1 },
    { z: 0, y: 0, x:  1 },
    { z: 1, y: 1, x:  1 },
    { z: 1, y: 1, x: -1 },
  ],
  addTo: towerAnchor,
  translate: { z: -8 },
  scale: { x: 8, y: 14, z: -8 },
  color: navy,
});

// south east corner
new Shape({
  path: [
    { x: 0, y: 0, z: 0 },
    { x: 20, y: 20, z: 0 },
    { x: 6, y: 20, z: -8 },
    { x: 0, y: 14, z: -8 },
  ],
  addTo: towerAnchor,
  translate: { x: 8, z: -8 },
  color: red,
});

// north slope
towerNSSLope.copy({
  translate: { z: 8 },
  scale: { x: 8, y: 20, z: 7 },
  color: gold,
});

// north east corner
new Shape({
  path: [
    { x: 0, y: 0, z: 0 },
    { x: 20, y: 20, z: 0 },
    { x: 0, y: 20, z: 7 },
  ],
  addTo: towerAnchor,
  translate: { x: 8, z: 8 },
  color: gold,
});

// west slope
towerEWSlope.copy({
  scale: { x: -12, y: 20, z: 8 },
  translate: { x: -8 },
  color: gold,
});

// north west corner
new Shape({
  path: [
    { x: 0, y: 0, z: 0 },
    { x: -12, y: 20, z: 0 },
    { x: 0, y: 20, z: 7 },
  ],
  addTo: towerAnchor,
  translate: { x: -8, z: 8 },
  color: red,
});

// south west corner back to left building
new Shape({
  path: [
    { x: 0, y: 0, z: 0 },
    { x: -12, y: 20, z: 0 },
    { x: -6, y: 20, z: -8 },
    { x: 0, y: 14, z: -8 },
  ],
  addTo: towerAnchor,
  translate: { x: -8, z: -8 },
  color: blue,
});

// ----- church ----- //

var churchAnchor = new Anchor({
  addTo: town,
  translate: { x: -5, y: -4, z: 27 },
});

var church = makeBuilding({
  isChurch: true, // special flag for roof
  width: 22,
  depth: 16,
  height: 28,
  addTo: churchAnchor,
  gable: 'ew',
  southWindows: [ 3, 2 ],
  eastWindows: [ 2, 2 ],
  northWindows: [ 3, 2 ],
});

door.copy({
  addTo: church.westWall,
  translate: { x: -3.5 },
});
door.copy({
  addTo: church.westWall,
  translate: { x: 3.5 },
});

// big circle window
new Ellipse({
  width: 8,
  height: 8,
  addTo: church.westWall,
  translate: { y: -22 },
  color: navy,
});

// ----- bell tower ----- //

( function() {

  var bellTowerAnchor = new Anchor({
    addTo: churchAnchor,
    translate: { x: -7, y: -36, z: 4 },
  });

  // tower ledge
  new Rect({
    width: 8,
    height: 8,
    addTo: bellTowerAnchor,
    translate: { y: -12 },
    rotate: { x: TAU/4 },
    color: navy,
  });

  var wallColors = [ red, white, gold, blue ];
  var accentColors = [ navy, blue, red, navy ];
  var roofColors = [ navy, gold, red, navy ];

  for ( var i=0; i < 4; i++ ) {
    var wallAnchor = new Anchor({
      addTo: bellTowerAnchor,
      rotate: { y: TAU/4 * i },
    });
    var bottomWallGroup = new Group({
      addTo: wallAnchor,
      translate: { z: -4 }
    });

    var wallColor = wallColors[i];
    var accentColor = accentColors[i];
    var roofColor = roofColors[i];

    // bottom wall
    new Rect({
      width: 8,
      height: 12,
      addTo: bottomWallGroup,
      translate: { y: -6 },
      color: wallColor,
    });
    // circle cut-out
    new Ellipse({
      width: 4,
      height: 4,
      addTo: bottomWallGroup,
      translate: { y: -4 },
      color: accentColor,
    });
    // top stripe
    new Rect({
      width: 8,
      height: 2,
      addTo: bottomWallGroup,
      translate: { y: -9 },
      color: accentColor,
    });

    var topWallGroup = new Group({
      addTo: wallAnchor,
      translate: { y: -12, z: -3 },
    });
    // top wall
    new Rect({
      width: 6,
      height: 7,
      addTo: topWallGroup,
      translate: { y: -3.5 },
      color: wallColor,
    });
    // top window
    new Rect({
      width: 2,
      height: 5,
      addTo: topWallGroup,
      translate: { y: -2.5 },
      color: accentColor,
    });

    // roof
    new Shape({
      path: [
        { x:  0, y: 0, z:  0 },
        { x: -3, y: 6, z: -3 },
        { x:  3, y: 6, z: -3 },
      ],
      addTo: wallAnchor,
      translate: { y: -25 },
      color: roofColor,
    });
  }

  // roof connectors
  // south, white side
  new Shape({
    path: [
      { z: -4, y:  0 },
      { z:  4, y: -1 },
      { z:  4, y:  8 },
    ],
    addTo: bellTowerAnchor,
    translate: { x: 4 },
    color: white,
  });
  // east gold side
  var connector = new Rect({
    width: 8,
    height: 10,
    addTo: bellTowerAnchor,
    translate: { z: 4, y: 4 },
    color: gold,
  });
  // north blue side
  connector.copy({
    translate: { x: -4, y: 4 },
    rotate: { y: TAU/4 },
    color: blue,
  });

})();

// ----- hill ----- //

new Shape({
  path: [
    { x:  0, y: 2 },
    { x:  10, y: 2 },
    { bezier: [
      { x: 14, y: 2 },
      { x: 20, y: 10 },
      { x: 24, y: 10 },
    ]},
    { x: 30, y: 10 },
    { arc: [
      { x: 34, y: 10 },
      { x: 34, y: 14 },
    ]},
    // bring it back into hill
    { x: 14, y: 14, z: 0 },
  ],
  addTo: town,
  translate: { x: -6, y: -20, z: 12 },
  lineWidth: 4,
  stroke: true,
  color: gold,
});

// ----- lil pyramids ----- //

// front in front of left building
lilPyramid({
  addTo: town,
  translate: { x: 6, z: -35, y: -4 },
});

// behind left building

lilPyramid({
  addTo: town,
  translate: { x: -34, z: -20, y: -4 },
});


// front right
lilPyramid({
  addTo: town,
  translate: { x: 35, z: -8, y: -4 },
});

lilPyramid({
  addTo: town,
  translate: { x: 31, z: 2, y: -4 },
});
// in front of church
lilPyramid({
  addTo: town,
  translate: { x: 22, z: 28, y: -4 },
});

// ----- hedges ----- //

// to right of front building
hedge({
  addTo: town,
  translate: { x: 24, y: -4, z: -4 },
});

// right of church
hedge({
  addTo: town,
  translate: { x: -4, y: -4, z: 42 },
});
// in between tower & church
hedge({
  addTo: town,
  translate: { x: -30, y: -4, z: 18 },
  // color: gold,
});

hedge({
  addTo: town,
  translate: { x: 9, y: -4, z: 17 },
  // color: gold,
});


// ----- sun ----- //

new Shape({
  addTo: town,
  translate: { x: -6, y: -52, z: 42 },
  lineWidth: 6,
  stroke: true,
  color: gold,
});

// ----- sky particles ----- //

// dot above left building
var skyDot = new Shape({
  translate: { x: -3, y: -48, z: -42 },
  addTo: town,
  lineWidth: 2,
  stroke: true,
  color: white,
});

// in front of church
skyDot.copy({
  translate: { x: 30, y: -28, z: 28 },
});

var skyDiamond = new Shape({
  path: [
    { x:  0, y: -1 },
    { x:  1, y:  0 },
    { x:  0, y:  1 },
    { x: -1, y:  0 },
  ],
  addTo: town,
  translate: { x: -27, y: -45, z: -29 },
  scale: 0.75,
  stroke: true,
  lineWidth: 0.5,
  color: white,
});
skyDiamond.copy({
  rotate: { y: TAU/4 },
});

var skyDiamond2 = skyDiamond.copy({
  translate: { x: 8, y: -34, z: 42 },
});
skyDiamond2.copy({
  rotate: { y: TAU/4, },
});

var skyStar = new Shape({
  path: [
    { x: 0, y: -1 },
    { arc: [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
    ]},
    { arc: [
      { x: 0, y: 0 },
      { x: 0, y: 1 },
    ]},
    { arc: [
      { x: 0, y: 0 },
      { x: -1, y: 0 },
    ]},
    { arc: [
      { x: 0, y: 0 },
      { x: 0, y: -1 },
    ]},
  ],
  addTo: town,
  translate: { x: -39, y: -51, z: -12 },
  scale: 1.5,
  stroke: true,
  lineWidth: 1,
  color: white,
});
skyStar.copy({
  rotate: { y: TAU/4 },
});

// up front
var skyStar2 = skyStar.copy({
  translate: { x: 29, y: -42, z: -30 },
  color: white,
});
skyStar2.copy({
  rotate: { y: TAU/4 },
});

// ----- clouds ----- //

var cloud = new Shape({
  path: [
    { x: -1, y: 0 },
    { arc: [
      { x: -1, y: -1 },
      { x: 0, y: -1 },
    ]},
    { arc: [
      { x: 1, y: -1 },
      { x: 1, y: 0 },
    ]},
  ],
  addTo: town,
  translate: { x: -30, y: -56, z: -10 },
  scale: 1.5,
  rotate: { y: TAU/4 },
  stroke: true,
  lineWidth: 2,
  color: white,
});
cloud.copy({
  translate: { x: -30, y: -57, z: -6 },
});
cloud.copy({
  translate: { x: -30, y: -56, z: -2 },
});

// line underneath
cloud.copy({
  path: [ { x: -1 }, { x: 1 } ],
  translate: { x: -30, y: -56, z: -6 },
  scale: { x: 2 },
});

// ----- flat earth ----- //

var flatEarth = new Ellipse({
  width: 128,
  height: 128,
  addTo: camera,
  translate: town.translate,
  rotate: { x: TAU/4 },
  lineWidth: 8,
  stroke: true,
  color: navy,
});

// ----- sky ----- //

var sky = new Group({
  addTo: camera,
  translate: town.translate,
  // translate: { y: 2 },
});

( function() {
  var topYs = [
    -64, -64, -52, -52,
    -44, -44, -36, -36,
    -44, -44, -52, -52,
    -60, -60, -52, -52,
  ];
  var bottomYs = [
    -24, -24, -16, -16,
    -8, -8, -0, -0,
    -8, -8, -16, -16,
    -24, -24, -32, -32,
  ];
  var radius = 64;
  var skyPanelCount = topYs.length;
  var angle = TAU / skyPanelCount;
  var panelWidth = Math.tan( angle/2 ) * radius * 2;
  for ( var i=0; i < skyPanelCount; i++ ) {
    var nextI = (i + 1) % skyPanelCount;
    var topYA = topYs[ i ];
    var topYB = topYs[ nextI ];
    var bottomYA = bottomYs[ i ];
    var bottomYB = bottomYs[ nextI ];
    var panelAnchor = new Anchor({
      addTo: sky,
      rotate: { y: angle * -i  + TAU/4 },
      translate: { y: 1 },
    });
    new Shape({
      path: [
        { x: -panelWidth/2, y: topYA },
        { bezier: [
          { x: 0, y: topYA },
          { x: 0, y: topYB },
          { x:  panelWidth/2, y: topYB },
        ]},
        { x:  panelWidth/2, y: bottomYB },
        { bezier: [
          { x: 0, y: bottomYB },
          { x: 0, y: bottomYA },
          { x: -panelWidth/2, y: bottomYA },
        ]},
      ],
      addTo: panelAnchor,
      translate: { z: radius },
      color: blue,
      stroke: true,
      lineWidth: 1,
      backfaceVisible: false,
    });
  }
})();

// -- animate --- //

var t = 0;
var tSpeed = 1/120;
var then = new Date() - 1/60;

function animate() {
  update();
  render();
  requestAnimationFrame( animate );
}

animate();

// -- update -- //

// i, 0->1
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
  var now = new Date();
  var delta = now - then;

  if ( isRotating ) {
    t += tSpeed * delta/60;
    var theta = easeInOut( t ) * TAU;
    var rev = 1;
    var spin = -theta * rev - TAU/8;
    var extraRotation = TAU * rev * Math.floor( ( t % 4 ) );
    camera.rotate.y = spin - extraRotation;
    var everyOtherCycle = t % 2 < 1;
    camera.rotate.x = everyOtherCycle ? 0 : ( Math.cos( theta ) * -0.5 + 0.5 ) * TAU * 1/8;
  }
  camera.normalizeRotate();

  // rotate
  camera.updateGraph();

  then = now;
}

// -- render -- //

ctx.lineCap = 'round';
ctx.lineJoin = 'round';

function render() {
  ctx.clearRect( 0, 0, canvasWidth, canvasHeight );

  ctx.save();
  ctx.scale( zoom, zoom );
  ctx.translate( w/2, h/2 );

  var isCameraXUp = camera.rotate.x > 0 && camera.rotate.x < TAU/2;

  sky.renderGraph( ctx );

  // HACK sort flat earth & town shapes manually
  if ( isCameraXUp ) {
    flatEarth.render( ctx );
  }
  town.renderGraph( ctx );
  if ( !isCameraXUp ) {
    flatEarth.render( ctx );
  }

  ctx.restore();
}

// ----- inputs ----- //

// click drag to rotate
var dragStartAngleX, dragStartAngleY;

new Dragger({
  startElement: canvas,
  onPointerDown: function() {
    isRotating = false;
    dragStartAngleX = camera.rotate.x;
    dragStartAngleY = camera.rotate.y;
  },
  onPointerMove: function( pointer, moveX, moveY ) {
    var angleXMove = moveY / canvasWidth * TAU;
    var angleYMove = moveX / canvasWidth * TAU;
    camera.rotate.x = dragStartAngleX + angleXMove;
    camera.rotate.y = dragStartAngleY + angleYMove;
  },
});

document.querySelector('.reset-button').onclick = function() {
  isRotating = false;
  camera.rotate.set({ x: 0, y: -TAU/8 });
};
