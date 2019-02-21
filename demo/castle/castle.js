// -------------------------- demo -------------------------- //

var illoElem = document.querySelector('.illo');
var w = 24;
var h = 24;
var minWindowSize = Math.min( window.innerWidth - 20, window.innerHeight - 40 );
var zoom = Math.floor( minWindowSize / w );
illoElem.setAttribute( 'width', w * zoom );
illoElem.setAttribute( 'height', h * zoom );

[ Zdog.Shape, Zdog.Rect ].forEach( function( ItemClass ) {
  ItemClass.defaults.fill = true;
  // ItemClass.defaults.stroke = true;
  ItemClass.defaults.backface = false;
  ItemClass.defaults.stroke = 1/zoom;
});

var white = 'white';
var black = '#333';
var isRotating = true;
var TAU = Zdog.TAU;
var initRotate = { y: TAU/4 };

var illo = new Zdog.Illustration({
  element: illoElem,
  zoom: zoom,
  rotate: initRotate,
  dragRotate: true,
  onDragStart: function() {
    isRotating = false;
  },
});

// -- illustration shapes --- //

function makeWall( options ) {
  var rotor = new Zdog.Anchor({
    addTo: illo,
    rotate: options.rotate,
  });

  // rotor
  var wall = new Zdog.Anchor({
    addTo: rotor,
    translate: { z: 4 },
  });

  var topBlock = new Zdog.Anchor({
    addTo: wall,
    translate: { x: -4, y: -4 },
  });

  // side faces
  var face = new Zdog.Rect({
    addTo: topBlock,
    width: 2,
    height: 2,
    translate: { z: 1 },
    color: options.outside,
  });
  face.copy({
    translate: { x: -1 },
    rotate: { y: TAU/4 },
    color: options.left,
  });
  face.copy({
    translate: { x: 1 },
    rotate: { y: -TAU/4 },
    color: options.right,
  });
  face.copy({
    translate: { z: -1 },
    rotate: { y: TAU/2 },
    color: options.inside,
  });
  // top
  face.copy({
    translate: { y: -1 },
    rotate: { x: TAU/4 },
    color: black,
  });

  topBlock.copyGraph({
    translate: { x:  0, y: -4 },
  });

  var topTile = new Zdog.Rect({
    addTo: wall,
    width: 2,
    height: 2,
    color: black,
    rotate: { x: TAU/4 },
    translate: { x: -2, y: -3 },
  });
  topTile.copy({
    translate: { x:  2, y: -3 }
  });

  // outside arch

  // outside arch
  var arch = new Zdog.Shape({
    addTo: wall,
    path: [
      { x: 0, y: -3 },
      { x: 3, y: -3 },
      { x: 3, y:  2 },
      { arc: [
        { x: 3, y: -1 },
        { x: 0, y: -1 }
      ]},
    ],
    translate: { z: 1 },
    color: options.outside,
  });
  arch.copy({
    scale: { x: -1 },
  });


  // inside arch
  arch.copy({
    translate: { z: -1 },
    rotate: { y: TAU/2 },
    color: options.inside,
  });
  arch.copy({
    translate: { z: -1 },
    rotate: { y: TAU/2 },
    scale: { x: -1 },
    color: options.inside,
  });

  // outside columns
  var outsideColumn = new Zdog.Rect({
    addTo: wall,
    width: 2,
    height: 8,
    translate: { x: -4, y: 1, z: 1 },
    color: options.outside,
  });
  outsideColumn.copy({
    translate: { x: 4, y: 1, z: 1 },
  });

  var insideColumn = new Zdog.Rect({
    addTo: wall,
    width: 2,
    height: 3,
    translate: { x: -3, y: 3.5 },
    rotate: { y: -TAU/4 },
    color: options.right,
  });
  insideColumn.copy({
    translate: { x:  3, y: 3.5 },
    rotate: { y: TAU/4 },
    color: options.left,
  });

  // under arch, quarter arc
  var underArch = new Zdog.Shape({
    addTo: wall,
    path: [
      { x:  3, y:  2 },
      { arc: [
        { x: 3, y: -1 },
        { x: 0, y: -1 }
      ]},
      { x: 0, y: -1, z: -2 },
      { arc: [
        { x: 3, y: -1, z: -2 },
        { x: 3, y: 2, z: -2 },
      ]},
    ],
    translate: { z: 1 },
    backface: true,
    color: options.left,
  });
  underArch.copyGraph({
    scale: { x: -1 },
    color: options.right,
  });

  // feet soles
  new Zdog.Rect({
    addTo: wall,
    width: 2,
    height: 2,
    translate: { x: -4, y: 5, z: 0 },
    rotate: { x: -TAU/4 },
    color: white,
  });

}

makeWall({
  rotate: {},
  outside: white,
  inside: black,
  left: white,
  right: black,
});

makeWall({
  rotate: { y: -TAU/4 },
  outside: black,
  inside: white,
  left: white,
  right: black,
});

makeWall({
  rotate: { y: -TAU/2 },
  outside: black,
  inside: white,
  left: black,
  right: white,
});

makeWall({
  rotate: { y: TAU * -3/4 },
  outside: white,
  inside: black,
  left: black,
  right: white,
});


// -- animate --- //

var t = 0;
var tSpeed = 1/105;

// var keyframes = [
//   { x: -1/4, y: -1/4 },
//   { x: -35/350, y: 1/8 },
//   { x: 0, y: 2/4 },
//   { x: -35/350, y: 5/8 },
//   { x: -1/4, y: 3/4 },
// ];

var keyframes = [
  { x: 0, y: 1/4 },
  { x: -35/350, y: 5/8 },
  { x: -1/4, y: 3/4 },
  { x: -35/350, y: 9/8 },
  { x: 0, y: 5/4 },
];

function animate() {
  // update
  if ( isRotating ) {
    var easeT = Zdog.easeInOut( t, 4 );
    var turnLimit = keyframes.length - 1;
    var turn = Math.floor( t % turnLimit );
    var keyframeA = keyframes[ turn ];
    var keyframeB = keyframes[ turn + 1 ];
    illo.rotate.x = Zdog.lerp( keyframeA.x * TAU, keyframeB.x * TAU, easeT );
    illo.rotate.y = Zdog.lerp( keyframeA.y * TAU, keyframeB.y * TAU, easeT );
    t += tSpeed;
  }

  illo.updateGraph();

  // render
  illo.renderGraph();
  requestAnimationFrame( animate );
}

animate();

