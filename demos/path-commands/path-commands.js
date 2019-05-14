// ----- variables ----- //

var eggplant = '#636';

// ----- model ----- //

var illo = new Zdog.Illustration({
  element: '.illo',
  zoom: 5,
  dragRotate: true,
});

// lines
new Zdog.Shape({
  addTo: illo,
  path: [
    { x: -6, y: -6 },
    { x:  6, y: -6 },
    { x: -6, y:  6 },
    { x:  6, y:  6 },
  ],
  translate: { x: -12, y: -12 },
  closed: false,
  color: eggplant,
  stroke: 2,
});

// move
new Zdog.Shape({
  addTo: illo,
  path: [
    { x: -6, y: -6 },
    { x:  6, y: -6 },
    { move: { x: -6, y:  6 } },
    { x:  6, y:  6 },
  ],
  translate: { x: 12, y: -12 },
  closed: false,
  color: eggplant,
  stroke: 2,
});

// arc
new Zdog.Shape({
  addTo: illo,
  path: [
    { x: -6, y: -6 }, // start
    { arc: [
      { x:  2, y: -6 }, // corner
      { x:  2, y:  2 }, // end point
    ]},
    { arc: [ // start next arc from last end point
      { x:  2, y:  6 }, // corner
      { x:  6, y:  6 }, // end point
    ]},
  ],
  translate: { x: -12, y: 12 },
  closed: false,
  color: eggplant,
  stroke: 2,
});

// bezier
new Zdog.Shape({
  addTo: illo,
  path: [
    { x: -6, y: -6 }, // start
    { bezier: [
      { x:  2, y: -6 }, // start control point
      { x:  2, y:  6 }, // end control point
      { x:  6, y:  6 }, // end control point
    ]},
  ],
  translate: { x: 12, y: 12 },
  closed: false,
  color: eggplant,
  stroke: 2,
});

// ----- animate ----- //

function animate() {
  illo.updateRenderGraph();
  requestAnimationFrame( animate );
}

animate();
