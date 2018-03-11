// -------------------------- Rect -------------------------- //

var Rect = Shape.subclass({
  width: 1,
  height: 1,
});

var protoCreate = Rect.prototype.create;

Rect.prototype.create = function( options ) {
  options.path = getRectPath( options );
  protoCreate.call( this, options );
};

function getRectPath( options ) {
  var x = options.width / 2;
  var y = options.height / 2;
  var path = [
    { x: -x, y: -y },
    { x:  x, y: -y },
    { x:  x, y:  y },
    { x: -x, y:  y },
  ];
  return path;
}
