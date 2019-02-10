// -------------------------- demo -------------------------- //

var canvas = document.querySelector('canvas');
var w = 48;
var h = 48;
var minWindowSize = Math.min( window.innerWidth, (window.innerHeight - 200) );
var zoom = Math.floor( minWindowSize / w );
// var zoom = 6;
canvas.width = w * zoom;
canvas.height = h * zoom;
var TAU = Zdog.TAU;

var isRotating = false;

var illo = new Zdog.Illustration({
  canvas: canvas,
  zoom: zoom,
  rotate: { x: TAU * (35/360), y: TAU/8 },
  dragRotate: true,
  onDragStart: function() {
    isRotating = false;
  },
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

  var rotor = new Zdog.Anchor({
    addTo: illo,
    rotate: rotation,
  });

  var anchor = new Zdog.Anchor({
    addTo: rotor,
    translate: { z: -8 },
  });
  
  panelAnchors.push( anchor );

  var panel = new Zdog.RoundedRect({
    width: 16,
    height: 16,
    cornerRadius: 3,
    addTo: anchor,
    stroke: false,
    fill: true,
    color: colors[i],
  });

  panels.push( panel );

  var outline = panel.copy({
    visible: false,
    stroke: 1,
    fill: false,
    color: 'black',
  });

  outlines.push( outline );

});

// -- animate --- //

illo.ctx.globalCompositeOperation = 'multiply';

function animate() {
  illo.updateRenderGraph();
  requestAnimationFrame( animate );
  illo.rotate.y += isRotating ? +TAU/150 : 0;
}

animate();

// ----- animation ----- //

var animateFrame;

function animation( duration, onFrame ) {

  var start = now();

  animateFrame = function() {
    var ellasped = now() - start;
    // HACK, should be 1
    var t = Math.min( ellasped / duration, 0.999 ); // 0 -> 1;
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
    var easeT = Zdog.easeInOut( t, 3 );
    panelAnchors.forEach( function( panelAnchor ) {
      panelAnchor.translate.z = Zdog.lerp( -8, -11, easeT );
    });
    illo.rotate.x = Zdog.lerp( TAU/4, TAU * (35/360), easeT );
    illo.rotate.y = Zdog.lerp( -TAU/2, TAU/8, easeT );
  });
}

startAnimation();

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
    outline.visible = event.target.checked;
  });
};

// set initial
changeOutline( outlineCheckbox.checked );

function changeOutline( isRendering ) {
  outlines.forEach( function( outline ) {
    outline.visible = isRendering;
  });
}
