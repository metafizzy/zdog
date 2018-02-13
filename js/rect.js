/* globals Shape */

function Rect( options ) {
  options = this.setPath( options );
  this.create( options );
}

Rect.prototype = Object.create( Shape.prototype );
Rect.prototype.constructor = Rect;

Rect.prototype.setPath = function( options ) {
  var w = options.width/2;
  var h = options.height/2;
  options.path = [
    { x: -w, y: -h },
    { x:  w, y: -h },
    { x:  w, y:  h },
    { x: -w, y:  h },
  ];
  return options;
};
