// -------------------------- Rect -------------------------- //

var Rect = Shape.subclass();

Rect.optionKeys = Rect.optionKeys.concat([
  'width',
  'height',
]);

var protoCreate = Rect.prototype.create;

Rect.prototype.create = function( options ) {
  options.path = getRectPath( options );
  protoCreate.call( this, options );
};

function getRectPath( options ) {
  var w = ( options.width || 1 ) / 2;
  var h = ( options.height || 1 ) / 2;
  var path = [
    { x: -w, y: -h },
    { x:  w, y: -h },
    { x:  w, y:  h },
    { x: -w, y:  h },
  ];
  return path;
}
