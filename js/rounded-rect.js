/**
 * RoundedRect
 */

( function( root, factory ) {
  // universal module definition
  /* globals define, module, require */
  if ( typeof define == 'function' && define.amd ) {
    // AMD
    define( [ './shape' ], factory );
  } else if ( typeof module == 'object' && module.exports ) {
    // CommonJS
    module.exports = factory( require('./shape') );
  } else {
    // browser global
    var Zdog = root.Zdog;
    Zdog.RoundedRect = factory( Zdog.Shape );
  }
}( this, function factory( Shape ) {

var RoundedRect = Shape.subclass({
  width: 1,
  height: 1,
  radius: 0.25,
  closed: false,
});

RoundedRect.prototype.setPath = function() {
  var xA = this.width / 2;
  var yA = this.height / 2;
  var shortSide = Math.min( xA, yA );
  var radius = Math.min( this.radius, shortSide );
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

  this.path = path;
};

return RoundedRect;

}));
