// -------------------------- demo -------------------------- //

var illoElem = document.querySelector('.illo');
var w = 72;
var h = 72;
var minWindowSize = Math.min( window.innerWidth, window.innerHeight );
var zoom = Math.min( 6, Math.floor( minWindowSize / w ) );
illoElem.setAttribute( 'width', w * zoom );
illoElem.setAttribute( 'height', h * zoom );

var isSpinning = true;
var TAU = Zdog.TAU;

var illo = new Zdog.Illustration({
  element: illoElem,
  zoom: zoom,
  dragRotate: true,
  onDragStart: function() {
    isSpinning = false;
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
var head = new Zdog.Shape({
  addTo: illo,
  translate: { y: -12, z: 1 },
  color: colors.skin,
  stroke: 23,
});

// nose
new Zdog.Shape({
  addTo: head,
  translate: { y: 5, z: 13 },
  color: colors.skin,
  stroke: 7,
});



// chin
var chin = new Zdog.Shape({
  addTo: head,
  path: [
    { x: -5, y: 6, z: 4 },
    { x: 0, y: 8.5, z: 6 }
  ],
  color: colors.skin,
  stroke: 10,
});
chin.copy({
  scale: { x: -1 },
});

// mouth
new Zdog.Shape({
  path: [
    { x: -3, y: -3 },
    { x: -1, y: -1 },
    { x:  1, y: -1 },
    { x:  3, y: -3 },
  ],
  translate: { y: 12, z: 9 },
  color: colors.cloth,
  fill: true,
  stroke: 2,
  addTo: head,
});


var hat = new Zdog.Anchor({
  addTo: head,
  translate: { y: -8 },
});

// hat front
var hatFrontA = new Zdog.Vector({ x: -8, y: 0, z: 5 });
var hatFrontB = new Zdog.Vector({ x: -4, y: -3, z: 7 });
var hatFrontC = hatFrontB.copy().multiply({ x: -1 });
var hatFrontD = hatFrontA.copy().multiply({ x: -1 });

// hat front
new Zdog.Shape({
  path: [
    hatFrontA,
    hatFrontB,
    hatFrontC,
    hatFrontD,
  ],
  color: colors.cloth,
  closed: false,
  fill: false,
  stroke: 11,
  addTo: hat,
});

var hatTopFront = new Zdog.Vector({ x: 10, y: 1, z: 5 });
var hatTopBackA = new Zdog.Vector({ x: 7, y: 3, z: -10 });
var hatTopBackB = hatTopBackA.copy().multiply({ x: -1 });

// hat top
new Zdog.Shape({
  path: [
    hatTopFront.copy().multiply({ x: -1 }),
    hatTopFront,
    hatTopBackA,
    hatTopBackB,
  ],
  color: colors.cloth,
  fill: true,
  stroke: 9,
  addTo: hat,
});
// hat top back
new Zdog.Shape({
  path: [
    hatTopBackA,
    hatTopBackB,
  ],
  color: colors.cloth,
  stroke: 9,
  addTo: hat,
});

// hat top side
var hatTopSide = new Zdog.Shape({
  path: [
    hatTopFront,
    hatTopBackA,
  ],
  color: colors.cloth,
  stroke: 9,
  addTo: hat,
});
hatTopSide.copy({
  scale: { x: -1 },
});


// hat top cover
new Zdog.Shape({
  path: [
    { x: -3, y:  0, z: -8 },
    { x:  3, y:  0, z: -8 },
    { x:  3, y: -3, z: 4 },
    { x: -3, y: -3, z: 4 },
  ],
  color: colors.cloth,
  stroke: 6,
  addTo: hat,
});

// hat brim
// brim has left & right side
var hatBrim = new Zdog.Shape({
  path: [
    { x: 10, y: 4, z: -0 },
    { x: 8, y: 4, z: 5 },
    { x: 0, y: 2, z: 9 },
    { x: 0, y: 1, z: 2 },
  ],
  translate: { z: 7 },
  color: colors.cloth,
  fill: true,
  stroke: 4,
  addTo: hat,
});
hatBrim.copy({
  scale: { x: -1 },
});

// eyes pupil
var eye = new Zdog.Shape({
  path: [
    { y: 2 },
    { y: 4 },
  ],
  translate: { x: 5, z: 9 },
  color: colors.eye,
  stroke: 3,
  addTo: head,
});
eye.copy({
  translate: { x: -5, z: 9 },
});

var brow = new Zdog.Shape({
  path: [
    { x: 3, y: 0, z: -0 },
    { x: 1.5, y: -0.5, z: 1 },
    { x: 0, y: 0, z: 1 },
  ],
  translate: { x: 4, y: -1.5, z: 9 },
  color: colors.hair,
  closed: false,
  stroke: 2.5,
  addTo: head,
});
brow.copy({
  scale: { x: -1 },
  translate: { x: -4, y: -1.5, z: 9 },
});

var mustache = new Zdog.Group({
  addTo: head,
  translate: { y: 6.5, z: 10 },
});
// mustache line
new Zdog.Shape({
  path: [
    { x: 2, y: 1, z: 1.5 },
    { x: 6.5, y: 0, z: -0 },
  ],
  color: colors.hair,
  stroke: 3,
  addTo: mustache,
});
// mustache sections
var mustacheSection = new Zdog.Shape({
  translate: { x: 1.75, y: 1.5, z: 1 },
  color: colors.hair,
  stroke: 4,
  addTo: mustache,
});
mustacheSection.copy({
  translate: { x: 4.5, y: 1, z: 0.75 }
});

mustache.copyGraph({
  scale: { x: -1 },
});

var sideburns = new Zdog.Shape({
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
  stroke: 3,
  addTo: head,
});
sideburns.copy({
  translate: sideburns.translate.copy().multiply({ x: -1 }),
});

var ear = new Zdog.Shape({
  path: [
    { x: 0, y:  0, z: -0 },
    { x: 0, y: -4, z: -0 },
    { x: 1, y: -4, z: -2 },
    { x: 0, y:  0, z: -1 },
  ],
  translate: { x: 10, y: 4, z: -2 },
  color: colors.skin,
  fill: true,
  stroke: 4,
  addTo: head,
});
ear.copy({
  scale: { x: -1 },
  translate: ear.translate.copy().multiply({ x: -1 }),
});

var sideHair = new Zdog.Anchor({
  addTo: head,
});

// hair side panel
new Zdog.Shape({
  path: [
    { x: 4, y: -7,   z: -1 },
    { x: 3, y:  0,   z: -0 },
    { x: 0, y:  0,   z: -5 },
    { x: 2, y: -6.5, z: -6 },
  ],
  translate: { x: 5, y: 7, z: -5 },
  color: colors.hair,
  fill: true,
  stroke: 3,
  addTo: sideHair,
});
// hair balls
var hairBall = new Zdog.Shape({
  translate: { x: 6, y: 8, z: -8 },
  color: colors.hair,
  stroke: 6,
  addTo: sideHair,
});
hairBall.copy({
  translate: { x: 2, y: 8, z: -10 },
});

sideHair.copyGraph({
  scale: { x: -1 },
});

// hair back panel
new Zdog.Shape({
  path: [
    { x:  5, y:  0,   z: -0 },
    { x:  6, y: -6.5, z: -1 },
    { x: -6, y: -6.5, z: -1 },
    { x: -5, y:  0,   z: -0 },
  ],
  translate: { y: 7, z: -10 },
  color: colors.hair,
  fill: true,
  stroke: 3,
  addTo: head,
});


var body = new Zdog.Shape({
  translate: { x: 0, y: 10, z: 1 },
  color: colors.overalls,
  stroke: 20,
  addTo: illo,
});

// right arm
var rightShoulder = { x: -8, y: -8, z: -3 };
var rightWrist = new Zdog.Vector({ x: -14, y: -17, z: -0 });
new Zdog.Shape({
  path: [
    rightShoulder,
    rightWrist,
  ],
  color: colors.cloth,
  stroke: 8,
  addTo: body,
});

// right hand
new Zdog.Shape({
  path: [
    { x: -17, y: -23, z: 1 },
  ],
  color: colors.white,
  stroke: 12,
  addTo: body,
});

// left arm
var leftShoulder = { x: 6, y: -7, z: -4 };
var leftElbow = { x: 8, y: -4, z: -8 };
new Zdog.Shape({
  path: [
    leftShoulder,
    leftElbow,
  ],
  color: colors.cloth,
  stroke: 8,
  addTo: body,
});
new Zdog.Shape({
  path: [
    leftElbow,
    { x: 12, y: -2, z: -9 },
  ],
  color: colors.cloth,
  stroke: 8,
  addTo: body,
});
// left hand
new Zdog.Shape({
  path: [
    { x: 17, y: 1, z: -8 },
  ],
  color: colors.white,
  stroke: 12,
  addTo: body,
});

new Zdog.Shape({
  path: [
    leftShoulder,
    rightShoulder,
  ],
  color: colors.cloth,
  stroke: 8,
  addTo: body,
});

// right leg
var rightLeg = new Zdog.Shape({
  path: [
    { y:  4, z: 2 },
    { y: 10, z: 1 },
    { y: 12, z: -0 }
  ],
  translate: { x: -5 },
  closed: false,
  color: colors.overalls,
  stroke: 10,
  addTo: body,
});

var shoe = new Zdog.Rect({
  addTo: rightLeg,
  width: 4,
  height: 7,
  translate: { y: 15.5, z: -4 },
  fill: true,
  color: colors.leather,
  stroke: 6,
});

// toe ball
new Zdog.Shape({
  addTo: shoe,
  translate: { y: 3, z: 2.5 },
  color: colors.leather,
  stroke: 11,
});

// left leg
var leftLeg = new Zdog.Shape({
  path: [
    { y: 4, z: 2 },
    { y: 2, z: 7 },
    { y: 3, z: 11 },
  ],
  translate: { x: 5 },
  closed: false,
  color: colors.overalls,
  stroke: 10,
  addTo: body,
});

shoe.copyGraph({
  addTo: leftLeg,
  translate: { y: 2, z: 18 },
  rotate: { x: TAU * (160/360) },
});

// -- animate --- //

function animate() {
  illo.rotate.y += isSpinning ? -0.05 : 0;
  illo.updateRenderGraph();
  requestAnimationFrame( animate );
}

animate();

