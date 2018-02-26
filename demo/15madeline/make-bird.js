function makeBird( options ) {

  var spin = options.spin || 0;

  var arrow = new Shape({
    rendering: false,
    addTo: options.addTo,
    scale: { x: 2/3, y: 2/3, z: 2/3 },
    rotate: { z: spin },
  });

  var bird = new Group({
    addTo: arrow,
    translate: { x: 87 },
    rotate: { x: spin },
  });

  // bird body
  new Shape({
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
    lineWidth: 3,
    color: options.color,
    fill: true,
  });

  // bird head
  new Shape({
    translate: { x: 4, y: -1 },
    addTo: bird,
    lineWidth: 4,
    color: options.color,
  });
  
  // beak
  new Shape({
    path: [
      { x: 0, y: -1 },
      { x: 3, y: 0 },
      { x: 0, y: 1 },
    ],
    addTo: bird,
    translate: { x: 5, y: -1 },
    lineWidth: 1,
    color: options.color,
    fill: true,
  });

  // tail feather
  new Shape({
    path: [
      { x: -3, z: -2 },
      { x:  0, z:  0 },
      { x: -3, z:  2 },
    ],
    addTo: bird,
    translate: { x: -4, y: 0 },
    lineWidth: 2,
    color: options.color,
    fill: true,
  });
  
  var wing = new Shape({
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
    lineWidth: 1,
    color: options.color,
    fill: true,
  });

  wing.copy({
    translate: { z: 1.5},
    scale: { z: -1 },
    rotate: { x: -TAU/8 },
  });

}
