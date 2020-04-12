// ----- setup ----- //

var sceneSize = 56;
var isSpinning = true;
var TAU = Zdog.TAU;

var offWhite = '#FED';
var yellow = '#ED0';
var gold = '#EA0';
var orange = '#E62';
var garnet = '#C25';
var eggplant = '#636';

// enable fill, disable stroke for all defaults
[ Zdog.Rect, Zdog.Shape, Zdog.Ellipse ].forEach( function( Item ) {
  Item.defaults.fill = true;
  Item.defaults.stroke = false;
} );

var initRotate = { y: TAU/8 };
var turnRatio = 1 / Math.sin( TAU/8 );

var illo = new Zdog.Illustration({
  element: '.illo',
  rotate: initRotate,
  // stretch looks circular at 1/8 turn
  scale: { x: turnRatio, z: turnRatio },
  dragRotate: true,
  resize: 'fullscreen',
  onDragStart: function() {
    isSpinning = false;
  },
  onResize: function( width, height ) {
    this.zoom = Math.floor( Math.min( width, height ) / sceneSize );
  },
});

// ----- model ----- //

var house = new Zdog.Anchor({
  addTo: illo,
  translate: { x: -2, y: 2, z: 8 },
});

var frontGroup = new Zdog.Group({
  addTo: house,
  translate: { z: 5 },
});
// front wall
new Zdog.Rect({
  addTo: frontGroup,
  width: 14,
  height: 14,
  color: garnet,
});

var frontWindow = new Zdog.Rect({
  addTo: frontGroup,
  width: 2,
  height: 4,
  translate: { x: -4, y: -3 },
  color: eggplant,
});
frontWindow.copy({
  translate: { y: -3 },
});
frontWindow.copy({
  translate: { x: 4, y: -3 },
});
frontWindow.copy({
  translate: { x: -4, y: 3 },
});
// door
new Zdog.Shape({
  addTo: frontGroup,
  path: [
    { x: -2, y: 3 },
    { x: -2, y: -1 },
    { arc: [
      { x: -2, y: -3 },
      { x: 0, y: -3 },
    ] },
    { arc: [
      { x: 2, y: -3 },
      { x: 2, y: -1 },
    ] },
    { x: 2, y: 3 },
  ],
  translate: { x: 2, y: 4 },
  color: eggplant,
});

// backWall
var backGroup = frontGroup.copyGraph({
  translate: { z: -5 },
  rotate: { y: TAU/2 },
});

backGroup.children.forEach( function( child, i ) {
  // orange windows, yellow wall
  child.color = i ? orange : yellow;
} );

var rightGroup = new Zdog.Group({
  addTo: house,
  translate: { x: 7 },
  rotate: { y: -TAU/4 },
});
// right wall
new Zdog.Shape({
  addTo: rightGroup,
  path: [
    { x: -5, y:  7 },
    { x: -5, y: -7 },
    { x:  0, y: -12 },
    { x:  5, y: -7 },
    { x:  5, y:  7 },
  ],
  width: 10,
  height: 14,
  color: offWhite,
});

var sideWindow = frontWindow.copy({
  addTo: rightGroup,
  translate: { x: -2, y: -3 },
  color: gold,
});
sideWindow.copy({
  translate: { x:  2, y: -3 },
});
sideWindow.copy({
  translate: { x:  2, y:  3 },
});
sideWindow.copy({
  translate: { x: -2, y:  3 },
});

// porthole
new Zdog.Ellipse({
  addTo: rightGroup,
  width: 2,
  height: 2,
  translate: { y: -8 },
  color: gold,
});

var leftGroup = rightGroup.copyGraph({
  translate: { x: -7 },
  rotate: { y: TAU/4 },
});

leftGroup.children.forEach( function( child, i ) {
  // eggplant windows, yellow wall
  child.color = i ? eggplant : orange;
} );

// front roof
var frontRoof = new Zdog.Shape({
  addTo: house,
  path: [
    { x: -7, y:  -7, z: 5 },
    { x: -7, y: -12, z: 0 },
    { x:  7, y: -12, z: 0 },
    { x:  7, y:  -7, z: 5 },
  ],
  color: eggplant,
});

frontRoof.copy({
  scale: { z: -1 },
  color: garnet,
});

// floor
new Zdog.Rect({
  addTo: house,
  width: 14,
  height: 10,
  translate: { y: 7 },
  rotate: { x: TAU/4 },
  color: eggplant,
});

house.copyGraph({
  translate: house.translate.copy().multiply( -1 ),
});

// ----- animate ----- //

var ticker = 0;
var cycleCount = 240;

function animate() {
  if ( isSpinning ) {
    var progress = ticker/cycleCount;
    var tween = Zdog.easeInOut( progress % 1, 3 );
    illo.rotate.y = tween * TAU + initRotate.y;
    ticker++;
  }
  illo.updateRenderGraph();
  requestAnimationFrame( animate );
}

animate();

