// -------------------------- demo -------------------------- //

var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
var w = 80;
var h = 80;
var minWindowSize = Math.min( window.innerWidth, window.innerHeight );
var zoom = Math.min( 7, Math.floor( minWindowSize / w ) );
var pixelRatio = window.devicePixelRatio || 1;
zoom *= pixelRatio;
var canvasWidth = canvas.width = w * zoom;
var canvasHeight = canvas.height = h * zoom;
// set canvas screen size
if ( pixelRatio > 1 ) {
  canvas.style.width = canvasWidth / pixelRatio + 'px';
  canvas.style.height = canvasHeight / pixelRatio + 'px';
}

var isRotating = true;

var camera = new Anchor();

// -- illustration shapes --- //

// cylinder
( function() {

  var layers = 5;
  var slices = 8;
  var radius = 10;
  var layerHeight = 4;
  var sector = TAU/slices;

  var anchor = new Anchor({
    addTo: camera,
    translate: { x: radius*2 },
  });

  for ( var layerIndex=0; layerIndex < layers; layerIndex++ ) {
    var layerY = (layerIndex - layers/2) * layerHeight;
    // var color = layerColors[ layerIndex ];
    var lum = Math.round( (layerIndex+0.5)/layers * 50 + 25 );
    for ( var sliceIndex=0; sliceIndex < slices; sliceIndex++ ) {
      var x = Math.sin( sector/2 ) * radius;
      var z = Math.cos( sector/2 ) * radius;
      var hue = Math.round( sliceIndex/slices * 360 );
      new Shape({
        path: [
          { x: -x, y: 0, z: -z },
          { x:  x, y: 0, z: -z },
          { x:  x, y: layerHeight, z: -z },
          { x: -x, y: layerHeight, z: -z },
        ],
        addTo: anchor,
        translate: { y: layerY },
        rotate: { y: sector*sliceIndex },
        color: 'hsl(' + hue + ', 100%, ' + lum + '%)',
        fill: true,
        lineWidth: 0.5,
      });
    }
  }

})();

// cone sphere
( function() {

  var layers = 6;
  var slices = 6;
  var radius = 10;
  var sector = TAU/slices;

  var anchor = new Anchor({
    addTo: camera,
    translate: { y: -radius*2 },
  });

  function getPythagX( y ) {
    return Math.sqrt( 1 - y*y );
  }


  var xTan = Math.tan( sector/2 );

  for ( var layerIndex=0; layerIndex < layers; layerIndex++ ) {
    var lum = Math.round( (layerIndex+0.5)/layers * 80 + 10 );
    for ( var sliceIndex=0; sliceIndex < slices; sliceIndex++ ) {
      var y0 = -1 + layerIndex/layers * 2;
      var y1 = -1 + (layerIndex+1)/layers * 2;
      var z0 = getPythagX( y0 );
      var z1 = getPythagX( y1 );
      var xSin = Math.sin( sector/2 );
      var x0 = z0 * xTan;
      var x1 = z1 * xTan;

      var hue = Math.round( sliceIndex/slices * 360  + 40);
      new Shape({
        path: [
          { x: -x0, y: y0, z: -z0 },
          { x:  x0, y: y0, z: -z0 },
          { x:  x1, y: y1, z: -z1 },
          { x: -x1, y: y1, z: -z1 },
        ],
        addTo: anchor,
        // translate: { y: layerY },
        rotate: { y: sector*sliceIndex },
        scale: radius,
        color: 'hsl(' + hue + ', 100%, ' + lum + '%)',
        fill: true,
        stroke: false,
      });
    }
  }

})();

// round sphere
( function() {

  var layers = 6;
  var slices = 6;
  var radius = 10;
  var sector = TAU/slices;

  var anchor = new Anchor({
    addTo: camera,
    translate: { x: -radius*2 },
  });

  function getPythagX( y ) {
    return Math.sqrt( 1 - y*y );
  }

  function getLayerY( layerIndex ) {
    var theta = -1 + layerIndex/layers;
    theta *= TAU/2;
    return Math.cos( theta );
  }

  var xTan = Math.tan( sector/2 );

  for ( var layerIndex=0; layerIndex < layers; layerIndex++ ) {
    var lum = Math.round( (layerIndex+0.5)/layers * 80 + 10 );
    for ( var sliceIndex=0; sliceIndex < slices; sliceIndex++ ) {
      var y0 = getLayerY( layerIndex );
      var y1 = getLayerY( layerIndex+1 );
      var z0 = getPythagX( y0 );
      var z1 = getPythagX( y1 );
      var x0 = z0 * xTan;
      var x1 = z1 * xTan;

      var hue = Math.round( sliceIndex/slices * 360  + 40);
      new Shape({
        path: [
          { x: -x0, y: y0, z: -z0 },
          { x:  x0, y: y0, z: -z0 },
          { x:  x1, y: y1, z: -z1 },
          { x: -x1, y: y1, z: -z1 },
        ],
        addTo: anchor,
        // translate: { y: layerY },
        rotate: { y: sector*sliceIndex },
        scale: radius,
        color: 'hsl(' + hue + ', 100%, ' + lum + '%)',
        fill: true,
        stroke: false,
        // lineWidth: 0.5,
      });
    }
  }

})();

// -- animate --- //

function animate() {
  update();
  render();
  requestAnimationFrame( animate );
}

animate();

// -- update -- //

function update() {
  camera.rotate.y += isRotating ? +TAU/150 : 0;

  // rotate
  camera.updateGraph();
}

// -- render -- //

function render() {
  ctx.clearRect( 0, 0, canvasWidth, canvasHeight );
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  ctx.save();
  ctx.scale( zoom, zoom );
  ctx.translate( w/2, h/2 );

  camera.renderGraph( ctx );

  ctx.restore();
}

// ----- inputs ----- //

// click drag to rotate
var dragStartAngleX, dragStartAngleY;

new Dragger({
  startElement: canvas,
  onPointerDown: function() {
    isRotating = false;
    dragStartAngleX = camera.rotate.x;
    dragStartAngleY = camera.rotate.y;
  },
  onPointerMove: function( pointer, moveX, moveY ) {
    var angleXMove = moveY / canvasWidth * TAU;
    var angleYMove = moveX / canvasWidth * TAU;
    camera.rotate.x = dragStartAngleX + angleXMove;
    camera.rotate.y = dragStartAngleY + angleYMove;
  },
});
