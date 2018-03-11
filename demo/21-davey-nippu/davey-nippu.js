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
// var skinLight = '#FAA';
// var navy = '#036';
// var midnight = '#003';
//
// var auburn = '#903';
// var red = '#C33';
// var sky = '#09D';
var offWhite = '#FFD';
var white = 'white';
var blueDark = '#66C';


// -- models --- //

var ground = new Anchor({
  addTo: scene,
  translate: { y: 56 },
});

// ----- dude ----- //

( function() {

  var dude = new Group({
    addTo: ground,
    updateSort: true,
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

  var shinEnd = { y: 22 };

  var rightShin = rightThigh.copy({
    path: [
      { y: 0 },
      shinEnd,
    ],
    addTo: rightThigh,
    translate: { y: 18 },
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

  var leftShin = rightShin.copy({
    addTo: leftThigh,
    rotate: { x: TAU/4 - hips.rotate.x },
    color: beigeDark,
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
