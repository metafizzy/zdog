// ----- setup ----- //

var sceneSize = 24;
var TAU = Zdog.TAU;

var illo = new Zdog.Illustration({
  element: '.illo',
  rotate: { x: TAU * -35/360, y: TAU * 1/8 },
  dragRotate: true,
  resize: 'fullscreen',
  onResize: function( width, height ) {
    this.zoom = Math.floor( Math.min( width, height ) / sceneSize );
  },
});

// ----- model ----- //

var cube = new Zdog.Anchor({
  addTo: illo,
  scale: 4,
});

var oneUnit = new Zdog.Vector({ x: 1, y: 1 });

var side = new Zdog.Anchor({
  addTo: cube,
  translate: { z: 1 },
});

var dot = new Zdog.Shape({
  addTo: side,
  translate: oneUnit.copy(),
  stroke: 1,
  color: 'white',
});

dot.copy({ translate: { x: -1, y:  1 } });
dot.copy({ translate: { x:  1, y: -1 } });
dot.copy({ translate: { x: -1, y: -1 } });

// more dots
dot.copy({ translate: { x:  1 } });
dot.copy({ translate: { x: -1 } });
dot.copy({ translate: { y: -1 } });
dot.copy({ translate: { y:  1 } });

side.copyGraph({
  translate: { z: -1 },
});

var midDot = dot.copy({
  addTo: cube,
});

midDot.copy({ translate: { x: -1, y:  1 }} );
midDot.copy({ translate: { x:  1, y: -1 }} );
midDot.copy({ translate: { x: -1, y: -1 }} );


// ----- animate ----- //

var keyframes = [
  { x: 0, y: 0, z: 0 },
  { x: 0, y: 0, z: TAU/4 },
  { x: -TAU/4, y: 0, z: TAU/4 },
  { x: -TAU/4, y: 0, z: TAU/2 },
];

var ticker = 0;
var cycleCount = 75;
var turnLimit = keyframes.length - 1;

function animate() {
  var progress = ticker / cycleCount;
  var tween = Zdog.easeInOut( progress % 1, 4 );
  var turn = Math.floor( progress % turnLimit );
  var keyA = keyframes[ turn ];
  var keyB = keyframes[ turn + 1 ];
  cube.rotate.x = Zdog.lerp( keyA.x, keyB.x, tween );
  cube.rotate.y = Zdog.lerp( keyA.y, keyB.y, tween );
  cube.rotate.z = Zdog.lerp( keyA.z, keyB.z, tween );
  ticker++;

  illo.updateRenderGraph();
  requestAnimationFrame( animate );
}

animate();

