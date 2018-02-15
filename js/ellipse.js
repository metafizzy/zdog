// -------------------------- Ellipse -------------------------- //

function Ellipse( options ) {
  options = this.setPath( options );
  // always keep open
  // fixes overlap bug when lineWidth is greater than radius
  options.closed = false;
  this.create( options );
}

Ellipse.prototype = Object.create( Shape.prototype );
Ellipse.prototype.constructor = Ellipse;

Ellipse.prototype.setPath = function( options ) {
  var w = options.width/2;
  var h = options.height/2;
  options.path = [
    { x: 0, y: -h },
    { arc: [ // top right
      { x: w, y: -h },
      { x: w, y: 0 },
    ]},
    { arc: [ // bottom right
      { x: w, y: h },
      { x: 0, y: h },
    ]},
    { arc: [ // bottom left
      { x: -w, y: h },
      { x: -w, y: 0 },
    ]},
    { arc: [ // bottom left
      { x: -w, y: -h },
      { x: 0, y: -h },
    ]},
  ];
  return options;
};
