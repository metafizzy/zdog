// ------------------------- demo ------------------------- //

var illoElem = document.querySelector('.illo');
var sceneSize = 270;
var minWindowSize = Math.min( window.innerWidth - 20 , window.innerHeight - 20 );
var zoom = Math.floor( minWindowSize / (sceneSize/2) ) / 2;
var illoSize = sceneSize * zoom;
illoElem.setAttribute( 'width', illoSize );
illoElem.setAttribute( 'height', illoSize );
var isSpinning = false;
var TAU = Zdog.TAU;
var initialRotate = new Zdog.Vector({ x: -35, y: -45 }).multiply( TAU/360 );

var illo = new Zdog.Illustration({
  element: illoElem,
  zoom: zoom,
  rotate: initialRotate,
  dragRotate: true,
  onDragStart: function() {
    isSpinning = false;
  },
});

// ----- model ----- //

var bird = new Zdog.Anchor({
  addTo: illo,
  translate: { z: -20 },
});

var letterGroup = new Zdog.Group({
  addTo: bird,
});

var R = new Zdog.Shape({
  addTo: letterGroup,
  path: [
    { x: -55, y: -55 },
    { x:  15, y: -55 },
    { arc: [
      { x: 55, y: -55 },
      { x: 55, y: -15 },
    ]},
    { bezier: [
      { x: 55, y:  0 },
      { x: 47, y: 13 },
      { x: 35, y: 20 },
    ]},
    { x: 29, y: 23 },
    { x: 50, y: 55 },
    { x: -55, y: 55 },
  ],
  rotate: { x: TAU/4 },
  color: '#F00',
  stroke: 10,
  fill: true,
});

var G = new Zdog.Shape({
  addTo: letterGroup,
  path: [
    { x: 0, y: -55 },
    { bezier: [
      { x: 18, y: -55 },
      { x: 32, y: -46 },
      { x: 40, y: -38 },
    ]},
    { x:  7, y: -5 },
    { x: 55, y: -5 },
    { x: 55, y: 53 },
    { x: 35, y: 47 },
    { bezier: [
      { x: 21, y: 52 },
      { x: 10, y: 55 },
      { x:  0, y: 55 },
    ]},
    { arc: [
      { x: -55, y: 55 },
      { x: -55, y:  0 },
    ]},
    { arc: [
      { x: -55, y: -55 },
      { x:   0, y: -55 },
    ]},
  ],
  translate: { x: -30, y: 20, z: 33 },
  rotate: { y: TAU/4 },
  color: '#0F0',
  stroke: 10,
  fill: true,
});

var B = new Zdog.Shape({
  addTo: letterGroup,
  path: [
    { x: -55, y: -55 },
    { x:  25, y: -55 },
    { arc: [
      { x: 55, y: -55 },
      { x: 55, y: -25 },
    ]},
    { bezier: [
      { x: 55, y: -13 },
      { x: 49, y:  -7 },
      { x: 42, y:  -4 },
    ]},
    { x: 35, y: 0 },
    { x: 42, y: 4 },
    { bezier: [
      { x: 49, y:  7 },
      { x: 55, y: 13 },
      { x: 55, y: 25 },
    ]},
    { arc: [
      { x: 55, y: 55 },
      { x: 25, y: 55 },
    ]},
    { x: -55, y: 55 },
  ],
  translate: { y: -10, z: 60 },
  color: '#00F',
  stroke: 10,
  fill: true,
});

var eye = new Zdog.Shape({
  addTo: bird,
  translate: { x: -60, y: -40, z: 30 },
  stroke: 18,
  color: '#111',
});

// screen blend letters
letterGroup.render = function( ctx ) {
  ctx.globalCompositeOperation = 'screen';
  Zdog.Group.prototype.render.apply( this, arguments );
};
// normal blend eye
eye.render = function( ctx ) {
  ctx.globalCompositeOperation = 'source-over';
  Zdog.Shape.prototype.render.apply( this, arguments );
};

// ----- animate ----- //

function animate() {
  illo.rotate.y += isSpinning ? +TAU/150 : 0;
  illo.updateRenderGraph();
  requestAnimationFrame( animate );
}

animate();

