var canvas = document.querySelector('canvas');
var illoSize = 72;
var zoom = 6;
canvas.width = canvas.height = illoSize * zoom;
var TAU = Zdog.TAU;


var illo = new Zdog.Illustration({
  canvas: canvas,
  zoom: zoom,
  dragRotate: true,
});

// -- illustration shapes --- //

var rect1 = new Zdog.Rect({
  width: 12,
  height: 16,
  translate: { z: -6 },
  // rotate: { z: 1 },
  stroke: 2,
  // fill: true,
  color: '#08D',
  addTo: illo,
});

var moon1 = new Zdog.Shape({
  path: [
    { z: 0 },
    { z: 6 }
  ],
  translate: { y: -11 },
  stroke: 3,
  color: 'white',
  addTo: rect1,
});

new Zdog.Rect({
  width: 12,
  height: 8,
  translate: { y: 8 },
  rotate: { x: TAU/4 },
  stroke: 2,
  fill: true,
  color: '#E21',
  addTo: illo,
});

new Zdog.Shape({
  path: [
    { y: -6, z: 4 },
    { y:  6, z: 4 },
    { y:  6, z: 0 },
    { y: -6, z: 0 },
  ],
  stroke: 1,
  fill: true,
  color: '#F80',
  addTo: illo,
});

// -- animate --- //

var rZSpeed = 0;

function animate() {
  // rotate
  moon1.rotate.y += 0.03;
  rect1.rotate.z -= 0.02;
  illo.rotate.z += rZSpeed;
  // update & render
  illo.updateRenderGraph();
  requestAnimationFrame( animate );
}

animate();

// ----- inputs ----- //

document.querySelector('.toggle-z-rotation-button').onclick = function() {
  rZSpeed = rZSpeed ? 0 : TAU/360;
};
