/**
 * Rect
 */

( function( root, factory ) {
  // module definition
  if ( typeof module == 'object' && module.exports ) {
    // CommonJS
    module.exports = factory( require('./shape') );
  } else {
    // browser global
    var Zdog = root.Zdog;
    Zdog.Rect = factory( Zdog.Shape );
  }
}( this, function factory( Shape ) {

var Rect = Shape.subclass({
  width: 1,
  height: 1,
});

Rect.prototype.setPath = function() {
  var x = this.width / 2;
  var y = this.height / 2;
  /* eslint key-spacing: "off" */
  this.path = [
    { x: -x, y: -y },
    { x:  x, y: -y },
    { x:  x, y:  y },
    { x: -x, y:  y },
  ];
};

return Rect;

} ) );
