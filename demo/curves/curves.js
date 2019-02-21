var illoElem = document.querySelector('.illo');
var w = 72;
var h = 72;
var zoom = 6;
illoElem.setAttribute( 'width', w * zoom );
illoElem.setAttribute( 'height', h * zoom );
// colors

var illo = new Zdog.Illustration({
  element: illoElem,
  zoom: zoom,
  dragRotate: true,
});

// -- illustration shapes --- //

// rectangle with curve
new Zdog.Shape({
  path: [
    { x: -6, y: -8 },
    { bezier: [
      { x:  0, y: -12, z: -5 },
      { x:  0, y: -4 },
      { x:  6, y: -8 },
    ]},
    { x:  6, y:  8 },
    { bezier: [
      { x:  0, y: 8, z: -5 },
      { x:  0, y: 8, z: 5 },
      { x:  -6, y: 8 },
    ]},
    { x: -6, y:  8 },
  ],
  addTo: illo,
  stroke: 2,
  color: '#19F',
});

// quarter circle
new Zdog.Shape({
  path: [
    { x: 10, y: 0 },
    { arc: [
      { x: 20, y: 0 },
      { x: 20, y: 10 }
    ]},
    { x: 10, y: 10 }
  ],
  addTo: illo,
  stroke: 2,
  color: '#A00',
});

// -- animate --- //

function animate() {
  illo.updateRenderGraph();
  requestAnimationFrame( animate );
}

animate();
