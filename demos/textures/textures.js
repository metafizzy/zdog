function loadImage(url) {
  return new Promise(r => { let i = new Image(); i.onload = (() => r(i)); i.src = url; });
}

function createIllustration(selector) {
  // ----- variables ----- //
  var isSpinning = true;

  // ----- model ----- //
  var illo = new Zdog.Illustration({
    element: selector,
    dragRotate: true,
    zoom: 1,
    onDragStart: function() {
      isSpinning = false;
    },
  });

  // ----- animate ----- //
  function animate() {
    illo.rotate.y += isSpinning ? 0.03 : 0;
    illo.updateRenderGraph();
    requestAnimationFrame( animate );
  }
  animate();
  return illo;
}

function loadForBothRenderer(img, callback) {
  callback(img, "");
  callback(img, "_svg");
}

// Coin
loadImage("coin.png").then(img => loadForBothRenderer(img, (img, suffix) => {
  new Zdog.Cylinder({
    addTo: createIllustration("#illo_coin" + suffix),
    diameter: 200,
    length: 10,
    color: "#8D5C1E",
    backface: new Zdog.Texture(img, {dst: [-100, -100, 200, 200], src:[390, 10, -380, 380]}),
    frontFace: new Zdog.Texture(img, {dst: [-100, -100, 200, 200], src:[790, 10, -380, 380]}),
    stroke: false,
  });
}));

loadImage("dice.png").then(img => loadForBothRenderer(img, (img, suffix) => {
  new Zdog.Box({
    addTo: createIllustration("#illo_box" + suffix),
    width: 120,
    height: 120,
    depth: 120,
    stroke: false,
    color: '#F00',
    frontFace: new Zdog.Texture(img, {src:[0, 0, 200, 200], dst: [-60, -60, 120, 120]}),
    rearFace: new Zdog.Texture(img, {src:[0, 200, 200, 200], dst: [-60, -60, 120, 120]}),
    leftFace: new Zdog.Texture(img, {src:[200, 0, 200, 200], dst: [-60, -60, 120, 120]}),
    rightFace: new Zdog.Texture(img, {src:[200, 200, 200, 200], dst: [-60, -60, 120, 120]}),
    topFace: new Zdog.Texture(img, {src:[400, 0, 200, 200], dst: [-60, -60, 120, 120]}),
    bottomFace: new Zdog.Texture(img, {src:[400, 200, 200, 200], dst: [-60, -60, 120, 120]}),
  });
}));


//  Tetrahedron
loadImage("tetrahedron.png").then(img => loadForBothRenderer(img, (img, suffix) => {
  var tetrahedron = new Zdog.Anchor({
    addTo: createIllustration("#illo_tetrahedron" + suffix),
    translate: { x: 0, y: 0 },
  });

  var radius = 80;
  var deg_120 = Zdog.TAU / 3;

  var depthFactor = radius * Math.sqrt(6) * 3 / 2;
  var r = -depthFactor / 12;

  var p1 = {x: 0, y : radius, z: r};
  var p2 = {x: radius * Math.sin(deg_120), y : radius * Math.cos(deg_120), z: r};
  var p3 = {x: radius * Math.sin(2 * deg_120), y : radius * Math.cos(2 * deg_120), z: r}
  var p4 = {x: 0, y: 0, z: depthFactor / 4};

  new Zdog.Shape({
    path: [p1, p2, p3, p1],
    addTo: tetrahedron,
    stroke: 1,
    color: new Zdog.Texture(img, {src:[{x:10, y: 210}, {x:210, y: 210}, {x:110, y: 36.8}], dst: [p1, p2, p3]}),
    fill: true,
  });
  new Zdog.Shape({
    path: [p1, p2, p4, p1],
    addTo: tetrahedron,
    stroke: 1,
    color: new Zdog.Texture(img, {src:[{x:210, y: 210}, {x:410, y: 210}, {x:310, y: 36.8}], dst: [p1, p2, p4]}),
    fill: true,
  });
  new Zdog.Shape({
    path: [p1, p4, p3, p1],
    addTo: tetrahedron,
    stroke: 1,
    color: new Zdog.Texture(img, {src:[{x:410, y: 210}, {x:610, y: 210}, {x:510, y: 36.8}], dst: [p1, p4, p3]}),
    fill: true,
  });
  new Zdog.Shape({
    path: [p4, p2, p3, p4],
    addTo: tetrahedron,
    stroke: 1,
    color: new Zdog.Texture(img, {src:[{x:610, y: 210}, {x:810, y: 210}, {x:710, y: 36.8}], dst: [p4, p2, p3]}),
    fill: true,
  });
}));
