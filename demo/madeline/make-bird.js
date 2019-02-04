function makeBird( options ) {

  var spin = options.spin || 0;

  var arrow = new Zdog.Anchor({
    addTo: options.addTo,
    scale: 2/3,
    rotate: { z: spin },
  });

  var bird = new Zdog.Group({
    addTo: arrow,
    translate: { x: 87 },
    rotate: { x: -spin },
  });

  // bird body
  new Zdog.Shape({
    path: [
      { x: -3, y: 0 },
      { arc: [
        { x: -2, y: 1.5 },
        { x: 0, y: 1.5 },
      ]},
      { arc: [
        { x: 2, y: 1.5 },
        { x: 2, y: 0 },
      ]},
    ],
    addTo: bird,
    translate: { x: 0.5 },
    stroke: 3,
    color: options.color,
    fill: true,
  });

  // bird head
  new Zdog.Shape({
    translate: { x: 4, y: -1 },
    addTo: bird,
    stroke: 4,
    color: options.color,
  });
  
  // beak
  new Zdog.Shape({
    path: [
      { x: 0, y: -1 },
      { x: 3, y: 0 },
      { x: 0, y: 1 },
    ],
    addTo: bird,
    translate: { x: 5, y: -1 },
    stroke: 1,
    color: options.color,
    fill: true,
  });

  // tail feather
  new Zdog.Shape({
    path: [
      { x: -3, z: -2 },
      { x:  0, z:  0 },
      { x: -3, z:  2 },
    ],
    addTo: bird,
    translate: { x: -4, y: 0 },
    stroke: 2,
    color: options.color,
    fill: true,
  });
  
  var wing = new Zdog.Shape({
    path: [
      { x: 3, y: 0 },
      { x: -1, y: -9 },
      { arc: [
        { x: -5, y: -4 },
        { x: -3, y: 0 },
      ]},
    ],
    addTo: bird,
    translate: { z: -1.5},
    rotate: { x: TAU/8 },
    stroke: 1,
    color: options.color,
    fill: true,
  });

  wing.copy({
    translate: { z: 1.5},
    scale: { z: -1 },
    rotate: { x: -TAU/8 },
  });

}
