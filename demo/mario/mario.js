// -------------------------- demo -------------------------- //

var canvas = document.querySelector('canvas');
var w = 72;
var h = 72;
var minWindowSize = Math.min( window.innerWidth, window.innerHeight );
var zoom = Math.min( 6, Math.floor( minWindowSize / w ) );
canvas.width = w * zoom;
canvas.height = h * zoom;

var isRotating = true;

var illo = new Illo({
  canvas: canvas,
  zoom: zoom,
  dragRotate: true,
  onDragStart: function() {
    isRotating = false;
  },
});

// colors
var colors = {
  eye: '#333',
  white: '#FFF',
  hair: '#631',
  overalls: '#24D',
  cloth: '#E11',
  skin: '#FC9',
  leather: '#A63',
};

// -- illustration shapes --- //

// head
var head = new Shape({
  addTo: illo,
  translate: { y: -12, z: 1 },
  color: colors.skin,
  lineWidth: 23,
});

// nose
new Shape({
  addTo: head,
  translate: { y: 5, z: 13 },
  color: colors.skin,
  lineWidth: 7,
});



// chin
var chin = new Shape({
  addTo: head,
  path: [
    { x: -5, y: 6, z: 4 },
    { x: 0, y: 8.5, z: 6 }
  ],
  color: colors.skin,
  lineWidth: 10,
});
chin.copy({
  scale: { x: -1 },
});

// mouth
new Shape({
  path: [
    { x: -3, y: -3 },
    { x: -1, y: -1 },
    { x:  1, y: -1 },
    { x:  3, y: -3 },
  ],
  translate: { y: 12, z: 9 },
  color: colors.cloth,
  fill: true,
  lineWidth: 2,
  addTo: head,
});


var hat = new Anchor({
  addTo: head,
  translate: { y: -8 },
});

// hat front
var hatFrontA = new Vector({ x: -8, y: 0, z: 5 });
var hatFrontB = new Vector({ x: -4, y: -3, z: 7 });
var hatFrontC = hatFrontB.copy().multiply({ x: -1 });
var hatFrontD = hatFrontA.copy().multiply({ x: -1 });

// hat front
new Shape({
  path: [
    hatFrontA,
    hatFrontB,
    hatFrontC,
    hatFrontD,
  ],
  color: colors.cloth,
  closed: false,
  fill: false,
  lineWidth: 11,
  addTo: hat,
});

var hatTopFront = new Vector({ x: 10, y: 1, z: 5 });
var hatTopBackA = new Vector({ x: 7, y: 3, z: -10 });
var hatTopBackB = hatTopBackA.copy().multiply({ x: -1 });

// hat top
new Shape({
  path: [
    hatTopFront.copy().multiply({ x: -1 }),
    hatTopFront,
    hatTopBackA,
    hatTopBackB,
  ],
  color: colors.cloth,
  fill: true,
  lineWidth: 9,
  addTo: hat,
});
// hat top back
new Shape({
  path: [
    hatTopBackA,
    hatTopBackB,
  ],
  color: colors.cloth,
  lineWidth: 9,
  addTo: hat,
});

// hat top side
var hatTopSide = new Shape({
  path: [
    hatTopFront,
    hatTopBackA,
  ],
  color: colors.cloth,
  lineWidth: 9,
  addTo: hat,
});
hatTopSide.copy({
  scale: { x: -1 },
});


// hat top cover
new Shape({
  path: [
    { x: -3, y:  0, z: -8 },
    { x:  3, y:  0, z: -8 },
    { x:  3, y: -3, z: 4 },
    { x: -3, y: -3, z: 4 },
  ],
  color: colors.cloth,
  lineWidth: 6,
  addTo: hat,
});

// hat brim
// brim has left & right side
var hatBrim = new Shape({
  path: [
    { x: 10, y: 4, z: -0 },
    { x: 8, y: 4, z: 5 },
    { x: 0, y: 2, z: 9 },
    { x: 0, y: 1, z: 2 },
  ],
  translate: { z: 7 },
  color: colors.cloth,
  fill: true,
  lineWidth: 4,
  addTo: hat,
});
hatBrim.copy({
  scale: { x: -1 },
});

// eyes pupil
var eye = new Shape({
  path: [
    { y: 2 },
    { y: 4 },
  ],
  translate: { x: 5, z: 9 },
  color: colors.eye,
  lineWidth: 3,
  addTo: head,
});
eye.copy({
  translate: { x: -5, z: 9 },
});

var brow = new Shape({
  path: [
    { x: 3, y: 0, z: -0 },
    { x: 1.5, y: -0.5, z: 1 },
    { x: 0, y: 0, z: 1 },
  ],
  translate: { x: 4, y: -1.5, z: 9 },
  color: colors.hair,
  closed: false,
  lineWidth: 2.5,
  addTo: head,
});
brow.copy({
  scale: { x: -1 },
  translate: { x: -4, y: -1.5, z: 9 },
});

var mustache = new Group({
  addTo: head,
  translate: { y: 6.5, z: 10 },
});
// mustache line
new Shape({
  path: [
    { x: 2, y: 1, z: 1.5 },
    { x: 6.5, y: 0, z: -0 },
  ],
  color: colors.hair,
  lineWidth: 3,
  addTo: mustache,
});
// mustache sections
var mustacheSection = new Shape({
  translate: { x: 1.75, y: 1.5, z: 1 },
  color: colors.hair,
  lineWidth: 4,
  addTo: mustache,
});
mustacheSection.copy({
  translate: { x: 4.5, y: 1, z: 0.75 }
});

mustache.copyGraph({
  scale: { x: -1 },
});

var sideburns = new Shape({
  path: [
    { y:  0, z:  0 },
    { y: -4, z:  1.5 },
    { y: -4, z: 1 },
    { y: -1, z: 2 },
  ],
  translate: { x: 10, y: 3, z: 2 },
  color: colors.hair,
  closed: false,
  fill: true,
  lineWidth: 3,
  addTo: head,
});
sideburns.copy({
  translate: sideburns.translate.copy().multiply({ x: -1 }),
});

var ear = new Shape({
  path: [
    { x: 0, y:  0, z: -0 },
    { x: 0, y: -4, z: -0 },
    { x: 1, y: -4, z: -2 },
    { x: 0, y:  0, z: -1 },
  ],
  translate: { x: 10, y: 4, z: -2 },
  color: colors.skin,
  fill: true,
  lineWidth: 4,
  addTo: head,
});
ear.copy({
  scale: { x: -1 },
  translate: ear.translate.copy().multiply({ x: -1 }),
});

var sideHair = new Anchor({
  addTo: head,
});

// hair side panel
new Shape({
  path: [
    { x: 4, y: -7,   z: -1 },
    { x: 3, y:  0,   z: -0 },
    { x: 0, y:  0,   z: -5 },
    { x: 2, y: -6.5, z: -6 },
  ],
  translate: { x: 5, y: 7, z: -5 },
  color: colors.hair,
  fill: true,
  lineWidth: 3,
  addTo: sideHair,
});
// hair balls
var hairBall = new Shape({
  translate: { x: 6, y: 8, z: -8 },
  color: colors.hair,
  lineWidth: 6,
  addTo: sideHair,
});
hairBall.copy({
  translate: { x: 2, y: 8, z: -10 },
});

sideHair.copyGraph({
  scale: { x: -1 },
});

// hair back panel
new Shape({
  path: [
    { x:  5, y:  0,   z: -0 },
    { x:  6, y: -6.5, z: -1 },
    { x: -6, y: -6.5, z: -1 },
    { x: -5, y:  0,   z: -0 },
  ],
  translate: { y: 7, z: -10 },
  color: colors.hair,
  fill: true,
  lineWidth: 3,
  addTo: head,
});


var body = new Shape({
  translate: { x: 0, y: 10, z: 1 },
  color: colors.overalls,
  lineWidth: 20,
  addTo: illo,
});

// right arm
var rightShoulder = { x: -8, y: -8, z: -3 };
var rightWrist = new Vector({ x: -14, y: -17, z: -0 });
new Shape({
  path: [
    rightShoulder,
    rightWrist,
  ],
  color: colors.cloth,
  lineWidth: 8,
  addTo: body,
});

// right hand
new Shape({
  path: [
    { x: -17, y: -23, z: 1 },
  ],
  color: colors.white,
  lineWidth: 12,
  addTo: body,
});

// left arm
var leftShoulder = { x: 6, y: -7, z: -4 };
var leftElbow = { x: 8, y: -4, z: -8 };
new Shape({
  path: [
    leftShoulder,
    leftElbow,
  ],
  color: colors.cloth,
  lineWidth: 8,
  addTo: body,
});
new Shape({
  path: [
    leftElbow,
    { x: 12, y: -2, z: -9 },
  ],
  color: colors.cloth,
  lineWidth: 8,
  addTo: body,
});
// left hand
new Shape({
  path: [
    { x: 17, y: 1, z: -8 },
  ],
  color: colors.white,
  lineWidth: 12,
  addTo: body,
});

new Shape({
  path: [
    leftShoulder,
    rightShoulder,
  ],
  color: colors.cloth,
  lineWidth: 8,
  addTo: body,
});

// right leg
var rightLeg = new Shape({
  path: [
    { y:  4, z: 2 },
    { y: 10, z: 1 },
    { y: 12, z: -0 }
  ],
  translate: { x: -5 },
  closed: false,
  color: colors.overalls,
  lineWidth: 10,
  addTo: body,
});

var shoe = new Rect({
  addTo: rightLeg,
  width: 4,
  height: 7,
  translate: { y: 15.5, z: -4 },
  fill: true,
  color: colors.leather,
  lineWidth: 6,
});

// toe ball
new Shape({
  addTo: shoe,
  translate: { y: 3, z: 2.5 },
  color: colors.leather,
  lineWidth: 11,
});

// left leg
var leftLeg = new Shape({
  path: [
    { y: 4, z: 2 },
    { y: 2, z: 7 },
    { y: 3, z: 11 },
  ],
  translate: { x: 5 },
  closed: false,
  color: colors.overalls,
  lineWidth: 10,
  addTo: body,
});

shoe.copyGraph({
  addTo: leftLeg,
  translate: { y: 2, z: 18 },
  rotate: { x: TAU * (160/360) },
});

// -- animate --- //

function animate() {
  illo.rotate.y += isRotating ? -0.05 : 0;
  illo.updateGraph();
  illo.renderGraph();
  requestAnimationFrame( animate );
}

animate();

