// -------------------------- demo -------------------------- //

var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
var w = 48;
var h = 48;
var minWindowSize = Math.min( window.innerWidth, (window.innerHeight - 200) );
var zoom = Math.floor( minWindowSize / w );
// var zoom = 6;
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

var scene = new Anchor({
  rotate: { x: TAU * (35/360), y: TAU/8 },
});

var red = '#E21';
var blue = '#19F';
var gold = '#EA0';
var green = '#6C6';
var magenta = '#E2A';

// -- illustration shapes --- //

var colors = [ red, blue, gold, magenta, green ];

var panelAnchors = [];
var panels = [];
var outlines = [];

[
  { y: 0 },
  { y: TAU/4 },
  { y: TAU/2 },
  { y: TAU * 3/4 },
  { x: TAU/4 },
].forEach( function( rotation, i ) {

  var rotor = new Anchor({
    addTo: scene,
    rotate: rotation,
  });

  var anchor = new Anchor({
    addTo: rotor,
    translate: { z: -8 },
  });
  
  panelAnchors.push( anchor );

  var panel = new RoundedRect({
    width: 16,
    height: 16,
    radius: 3,
    addTo: anchor,
    stroke: false,
    fill: true,
    color: colors[i],
  });

  panels.push( panel );

  var outline = panel.copy({
    rendering: false,
    stroke: true,
    fill: false,
    lineWidth: 1,
    color: 'black',
  });

  outlines.push( outline );

});

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
ctx.globalCompositeOperation = 'multiply';

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


// ----- animation ----- //

var animateFrame;

function animation( duration, onFrame ) {

  var start = now();

  animateFrame = function() {
    var ellasped = now() - start;
    var t = Math.min( ellasped / duration, 1 ); // 0 -> 1;
    onFrame( t );
    if ( ellasped < duration ) {
      requestAnimationFrame( animateFrame );
    }
  };

  animateFrame();
}

function now() {
  return ( new Date() ).getTime();
}

function startAnimation() {
  animation( 2000, function( t ) {
    // var negT = 1 - t;
    // var easeT = 1 - negT * negT * negT;
    var easeT = easeInOut( t );
    panelAnchors.forEach( function( panelAnchor ) {
      panelAnchor.translate.z = lerp( -8, -11, easeT );
    });
    scene.rotate.x = lerp( TAU/4, TAU * (35/360), easeT );
    scene.rotate.y = lerp( -TAU/2, TAU/8, easeT );
  });
}

startAnimation();

function easeInOut( i ) {
  // i = i % 1;
  var isFirstHalf = i < 0.5;
  var i1 = isFirstHalf ? i : 1 - i;
  i1 = i1 / 0.5;
  // make easing steeper with more multiples
  var i2 = i1 * i1 * i1;
  i2 = i2 / 2;
  return isFirstHalf ? i2 : i2*-1 + 1;
}

// ----- more inputs ----- //

var fillP = document.querySelector('.fill-p');
fillP.onchange = function( event ) {
  changePanelColor( event.target.value );
};

// set initial
changePanelColor( fillP.querySelector(':checked').value );

function changePanelColor( value )  {
  panels.forEach( function( panel, i ) {
    if ( value == 'gray' ) {
      panel.color = '#888';
    } else if ( value == 'clear' ) {
      panel.color = 'transparent';
    } else {
      panel.color = colors[i];
    }
  });
}

var outlineCheckbox = document.querySelector('.outline-checkbox');
outlineCheckbox.onchange = function( event ) {
  outlines.forEach( function( outline ) {
    outline.rendering = event.target.checked;
  });
};

// set initial
changeOutline( outlineCheckbox.checked );

function changeOutline( isRendering ) {
  outlines.forEach( function( outline ) {
    outline.rendering = isRendering;
  });
}