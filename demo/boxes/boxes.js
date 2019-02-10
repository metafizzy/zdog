// -------------------------- demo -------------------------- //

var canvas = document.querySelector('canvas');
var w = 9;
var h = 9;
var minWindowSize = Math.min( window.innerWidth - 20 , window.innerHeight - 20 );
var zoom = Math.floor( minWindowSize / w );
canvas.width = w * zoom;
canvas.height = h * zoom;
var isRotating = true;
var TAU = Zdog.TAU;
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

var illo = new Zdog.Illustration({
  canvas: canvas,
  zoom: zoom,
  rotate: initRotate,
  dragRotate: true,
  onDragStart: function() {
    isRotating = false;
  },
});

// -- illustration shapes --- //

var model = new Zdog.Anchor({
  addTo: illo,
});

function addBox( options ) {
  var boxOptions = {
    addTo: model,
    stroke: false,
    top: yellow,
    back: gold,
    left: orange,
    right: orange,
    front: garnet,
    bottom: eggplant,
  };
  Zdog.extend( boxOptions, options );

  new Zdog.Box( boxOptions );
}

// top
addBox({
  bottom: false,
  translate: { y: -1 },
});
// bottom
addBox({
  top: false,
  translate: { y: 1 },
});
// front
addBox({
  back: false,
  translate: { z: 1 },
});
// back
addBox({
  front: false,
  translate: { z: -1 },
});
// left
addBox({
  right: false,
  translate: { x: -1 },
});
// right
addBox({
  left: false,
  translate: { x: 1 },
});

var dot = new Zdog.Shape({
  addTo: model,
  translate: { y: -2 },
  stroke: 1,
  color: gold,
});
dot.copy({
  translate: { y: 2 },
  color: gold,
});
dot.copy({
  translate: { x: -2 },
  color: yellow,
});
dot.copy({
  translate: { x: 2 },
  color: garnet,
});
dot.copy({
  translate: { z: -2 },
  color: orange,
});
dot.copy({
  translate: { z: 2 },
  color: eggplant,
});

// -- animate --- //

var t = 0;

function animate() {
  if ( isRotating ) {
    var turn = Math.floor( t % 4 );
    var theta = Zdog.easeInOut( t%1, 3 ) * TAU;
    if ( turn === 0  || turn == 2 ) {
      model.rotate.y = theta;
    } else if ( turn == 1 ) {
      model.rotate.x = theta;
    } else if ( turn == 3 ) {
      model.rotate.z = theta;
    }
    t += 1/150;
  }

  illo.updateRenderGraph();
  requestAnimationFrame( animate );
}

animate();

