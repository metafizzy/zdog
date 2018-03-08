// -------------------------- Ellipse -------------------------- //

var Ellipse = Shape.subclass({
  width: 1,
  height: 1,
  closed: false,
});

Ellipse.optionKeys = Ellipse.optionKeys.concat([
  'width',
  'height',
]);

var protoCreate = Ellipse.prototype.create;

Ellipse.prototype.create = function( options ) {
  options.path = getEllipsePath( options );
  protoCreate.call( this, options );
};

function getEllipsePath( options ) {
  var x = options.width / 2;
  var y = options.height / 2;
  var path = [
    { x: 0, y: -y },
    { arc: [ // top right
      { x: x, y: -y },
      { x: x, y: 0 },
    ]},
    { arc: [ // bottom right
      { x: x, y: y },
      { x: 0, y: y },
    ]},
    { arc: [ // bottom left
      { x: -x, y: y },
      { x: -x, y: 0 },
    ]},
    { arc: [ // bottom left
      { x: -x, y: -y },
      { x: 0, y: -y },
    ]},
  ];
  return path;
}
