var canvas = document.querySelector('canvas');
var w = 72;
var h = 72;
var zoom = 6;
canvas.width = w * zoom;
canvas.height = h * zoom;

var illo = new Illo({
  canvas: canvas,
  scale: zoom,
});

// colors
var colors = {
  fur: '#EA0',
  eye: '#444',
  inner: '#FEE',
  cloak: '#F18',
  // cloak: 'hsla(0, 100%, 50%, 0.1)',
  armor: '#926',
};


// -- illustration shapes --- //

var scene = new Anchor();

// body center
new Shape({
  path: [
    { x: -3, y: 10 },
    { x: 0, y: 14 },
    { x: 3, y: 10 },
  ],
  addTo: scene,
  color: colors.inner,
  lineWidth: 13,
});

// head circle
new Shape({
  addTo: scene,
  translate: { y: -12 },
  color: colors.fur,
  lineWidth: 32,
});

// nose
var nose = new Anchor({
  addTo: scene,
  translate: { y: -7, z: 17 },
});
new Shape({
  path: [
    { x: -1 },
    { x: 1 },
  ],
  addTo: nose,
  color: colors.eye,
  lineWidth: 3,
});
new Shape({
  path: [
    { y: 0 },
    { y: 1 },
  ],
  addTo: nose,
  color: colors.eye,
  lineWidth: 3,
});

// snout
new Shape({
  path: [
    { x: -2, y: -5, z: 11 },
    { x:  2, y: -5, z: 11 },
    { x:  2, y: -3, z: 7 },
    { x: -2, y: -3, z: 7 },
  ],
  addTo: scene,
  color: colors.fur,
  lineWidth: 12,
});

// eyes
var eye = new Shape({
  path: [
    { y: -12 },
    { y: -9 },
  ],
  addTo: scene,
  translate: { x: -8, z: 11 },
  color: colors.eye,
  lineWidth: 4,
});
eye.copy({
  translate: { x: 8, z: 11 },
});


// ears
var frontEarZ = 4;
var topEarY = -30;
var earColor = colors.fur;

var earAnchor = new Anchor({
  addTo: scene,
  translate: { y: topEarY, z: frontEarZ },
});

var earA = { x: 14, y: 12, z: -4 };
var earB = { x: 14, y: 0, z: 0 };
var earC = { x: 7, y: 11, z: -14 };
var earD = { x: 10, y: 0, z: 0 };
var earE = { x: 3, y: 5, z: 0 };
// outer ear
new Shape({
  path: [ earA, earB, earC ],
  addTo: earAnchor,
  color: earColor,
  fill: true,
  lineWidth: 4,
});
new Shape({
  path: [ earB, earC, earD ],
  addTo: earAnchor,
  color: earColor,
  fill: true,
  lineWidth: 4,
});
new Shape({
  path: [ earC, earD, earE ],
  addTo: earAnchor,
  color: earColor,
  fill: true,
  lineWidth: 4,
});
// inner ear
var innerEarXShift = 4;
new Shape({
  path: [
    { x: earA.x - innerEarXShift , y: earA.y-3 },
    { x: earD.x, y: earD.y+5 },
    { x: earE.x + innerEarXShift, y: earE.y+2 },
  ],
  addTo: earAnchor,
  color: colors.inner,
  fill: true,
  lineWidth: 3,
});

earAnchor.copyGraph({
  scale: { x: -1 },
});


//var whiskerX0 = 10*xSide;
//var whiskerX1 = 17*xSide;
//var whiskerY0 = -6+yShift;
//var whiskerY1 = -2+yShift;

// whiskers
var whisker = new Shape({
  path: [
    { x: 10, y: -6 },
    { x: 10, y: -2 },
    { x: 17, y: -2 },
  ],
  addTo: scene,
  translate: { z: 6 },
  fill: true,
  color: colors.fur,
  lineWidth: 3,
});
whisker.copy({
  translate: { y: -6, z: 6 },
});
whisker.copy({
  scale: { x: -1 },
});
whisker.copy({
  scale: { x: -1 },
  translate: { y: -6, z: 6 },
});

// arms

var armAnchor = new Anchor({
  addTo: scene,
});

// shoulder
new Shape({
  path: [
    { x: 11, y: 6, z: -2 },
    { x: 12, y: 9, z: -2.5 },
  ],
  addTo: armAnchor,
  closed: true,
  color: colors.armor,
  lineWidth: 8,
});
// forearm
new Shape({
  path: [
    { x: 12, y: 12, z: -2.5 },
    { x: 12, y: 15, z: -2 },
  ],
  addTo: armAnchor,
  color: colors.fur,
  lineWidth: 8,
});
// hand
new Shape({
  path: [ { x: 11, y: 18, z: -1} ],
  addTo: armAnchor,
  color: colors.armor,
  lineWidth: 10,
});

armAnchor.copyGraph({
  scale: { x: -1 },
});

// legs
var leg = new Shape({
  path: [
    { y: 20 },
    { y: 27 },
  ],
  addTo: scene,
  translate: { x: -6 },
  color: colors.armor,
  lineWidth: 8,
});
leg.copy({
  translate: { x: 6 },
});

var cloakX0 = 8;
var cloakX1 = 5;
// var cloakX1 = 8;

var cloakY0 = 4;
var cloakY1 = 6;
var cloakY2 = 13;
var cloakY3 = 21;

var cloakZ0 = 0;
var cloakZ1 = 6;
var cloakZ2 = 8;

var cloakSide = new Anchor({
  addTo: scene,
});

// top straps
var topCloakStrap =   new Shape({
  path: [
    { x: cloakX0, y: cloakY0, z: cloakZ0 },
    { x: cloakX0, y: cloakY1, z: cloakZ1 },
    { x: cloakX1, y: cloakY1, z: cloakZ1 },
  ],
  addTo: cloakSide,
  fill: true,
  color: colors.cloak,
  lineWidth: 4,
});

topCloakStrap.copy({
  scale: { x: -1 },
});

var vNeckY = ( cloakY1+cloakY2 ) / 2;
var vNeckZ = ( cloakZ2+cloakZ1 ) / 2;
new Shape({
  path: [
    { x: -cloakX0, y: cloakY1, z: cloakZ1 },
    { x: -cloakX1, y: cloakY1, z: cloakZ1 },
    { x: 0, y: vNeckY, z: vNeckZ },
    { x: cloakX1, y: cloakY1, z: cloakZ1 },
    { x: cloakX0, y: cloakY1, z: cloakZ1 },
    { x: cloakX0, y: cloakY2, z: cloakZ2 },
    { x: -cloakX0, y: cloakY2, z: cloakZ2 },
  ],
  addTo: cloakSide,
  fill: true,
  color: colors.cloak,
  lineWidth: 4,
});
new Shape({
  path: [
    { x: -cloakX0, y: cloakY2 },
    { x: cloakX0, y: cloakY2 },
    { x: cloakX0, y: cloakY3 },
    { x: -cloakX0, y: cloakY3 },
  ],
  addTo: cloakSide,
  translate: { z: cloakZ2 },
  fill: true,
  color: colors.cloak,
  lineWidth: 4,
});

cloakSide.copyGraph({
  scale: { z: -1 },
});


// -- animate --- //


function animate() {
  scene.updateGraph();
  illo.render( scene );
  requestAnimationFrame( animate );
}

animate();

// ----- inputs ----- //

illo.enableDragRotate( scene, function() {
  isRotating = false;
});
