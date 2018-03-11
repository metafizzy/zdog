// -------------------------- RoundedRect -------------------------- //

var RoundedRect = Shape.subclass({
  width: 1,
  height: 1,
  radius: 0.25,
  closed: false,
});

var protoCreate = RoundedRect.prototype.create;

RoundedRect.prototype.create = function( options ) {
  options.path = getRoundedRectPath( options );
  protoCreate.call( this, options );
};

function getRoundedRectPath( options ) {
  var xA = options.width / 2;
  var yA = options.height / 2;
  var shortSide = Math.min( xA, yA );
  var radius = Math.min( options.radius, shortSide );
  var xB = xA - radius;
  var yB = yA - radius;
  var path = [
    // top right corner
    { x: xB, y: -yA },
    { arc: [
      { x: xA, y: -yA },
      { x: xA, y: -yB },
    ]},
  ];
  // bottom right corner
  if ( yB ) {
    path.push({ x: xA, y: yB });
  }
  path.push({ arc: [
    { x: xA, y:  yA },
    { x: xB, y:  yA },
  ]});
  // bottom left corner
  if ( xB ) {
    path.push({ x: -xB, y: yA });
  }
  path.push({ arc: [
    { x: -xA, y:  yA },
    { x: -xA, y:  yB },
  ]});
  // top left corner
  if ( yB ) {
    path.push({ x: -xA, y: -yB });
  }
  path.push({ arc: [
    { x: -xA, y: -yA },
    { x: -xB, y: -yA },
  ]});

  // back to top right corner
  if ( xB ) {
    path.push({ x: xB, y: -yA });
  }

  return path;
}
