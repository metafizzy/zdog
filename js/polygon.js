/**
 * Shape
 */

( function( root, factory ) {
  // module definition
  if ( typeof module == 'object' && module.exports ) {
    // CommonJS
    module.exports = factory( require('./boilerplate'), require('./shape') );
  } else {
    // browser global
    var Zdog = root.Zdog;
    Zdog.Polygon = factory( Zdog, Zdog.Shape );
  }
}( this, function factory( utils, Shape ) {

var Polygon = Shape.subclass({
  sides: 3,
  radius: 0.5,
});

var TAU = utils.TAU;

Polygon.prototype.setPath = function() {
  this.path = [];
  for ( var i = 0; i < this.sides; i++ ) {
    var theta = i / this.sides * TAU - TAU/4;
    var x = Math.cos( theta ) * this.radius;
    var y = Math.sin( theta ) * this.radius;
    this.path.push({ x: x, y: y });
  }
};

return Polygon;

} ) );
