// -------------------------- demo -------------------------- //

var canvas = document.querySelector('canvas');
var w = 12;
var h = 12;
var minWindowSize = Math.min( window.innerWidth - 20 , window.innerHeight - 20 );
var zoom = Math.floor( minWindowSize / w );
canvas.width = w * zoom;
canvas.height = h * zoom;
var isRotating = true;
// colors
// var white = 'white';
var yellow = '#ED0';
var gold = '#EA0';
var orange = '#E62';
var garnet = '#C25';
// var navy = '#369';
// var denim = '#345';
var eggplant = '#636';

var initRotate = { x: (35/360) * TAU, y: TAU/8 };

var illo = new Illo({
  canvas: canvas,
  zoom: zoom,
  rotate: initRotate,
  dragRotate: true,
  onDragStart: function() {
    isRotating = false;
  },
});

// -- illustration shapes --- //

function addBox( options ) {
  var boxOptions = {
    addTo: illo,
    stroke: false,
    top: yellow,
    back: gold,
    left: orange,
    right: orange,
    front: garnet,
    bottom: eggplant,
  };
  extend( boxOptions, options );

  new Box( boxOptions );
}

// top
addBox({
  height: 2,
  bottom: false,
  translate: { y: -1.5 },
});
// bottom
addBox({
  height: 2,
  top: false,
  translate: { y: 1.5 },
});
// front
addBox({
  depth: 2,
  back: false,
  translate: { z: 1.5 },
});
// back
addBox({
  depth: 2,
  front: false,
  translate: { z: -1.5 },
});
// left
addBox({
  width: 2,
  right: false,
  translate: { x: -1.5 },
});
// right
addBox({
  width: 2,
  left: false,
  translate: { x: 1.5 },
});


// -- animate --- //

var t = 0;

function animate() {
  if ( isRotating ) {
    illo.rotate.y = easeInOut( t%1, 4 ) * TAU + initRotate.y;
    t += 1/150;
  }
  illo.updateGraph();
  illo.renderGraph();
  requestAnimationFrame( animate );
}

animate();

