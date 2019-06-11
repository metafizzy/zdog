/**
 * Ellipse
 */

( function( root, factory ) {
  // module definition
  if ( typeof module == 'object' && module.exports ) {
    // CommonJS
    module.exports = factory( require('./shape') );
  } else {
    // browser global
    var Zdog = root.Zdog;
    Zdog.Ellipse = factory( Zdog.Shape );
  }

}( this, function factory( Shape ) {

var Ellipse = Shape.subclass({
  diameter: 1,
  width: undefined,
  height: undefined,
  quarters: 4,
  closed: false,
});
  
Ellipse.type = 'Ellipse';

Ellipse.prototype.setPath = function() {
  var width = this.width != undefined ? this.width : this.diameter;
  var height = this.height != undefined ? this.height : this.diameter;
  var x = width / 2;
  var y = height / 2;
  this.path = [
    { x: 0, y: -y },
    { arc: [ // top right
      { x: x, y: -y },
      { x: x, y: 0 },
    ]},
  ];
  // bottom right
  if ( this.quarters > 1 ) {
    this.path.push({ arc: [
      { x: x, y: y },
      { x: 0, y: y },
    ]});
  }
  // bottom left
  if ( this.quarters > 2 ) {
    this.path.push({ arc: [
      { x: -x, y: y },
      { x: -x, y: 0 },
    ]});
  }
  // top left
  if ( this.quarters > 3 ) {
    this.path.push({ arc: [
      { x: -x, y: -y },
      { x: 0, y: -y },
    ]});
  }
};

Ellipse.prototype.updateSortValue = function() {
  Shape.prototype.updateSortValue.apply( this, arguments );
  if ( this.quarters != 4 ) {
    return;
  }
  // ellipse is self closing, do not count last point twice
  var length = this.pathCommands.length;
  var lastPoint = this.pathCommands[ length - 1 ].endRenderPoint;
  this.sortValue -= lastPoint.z / length;
};

return Ellipse;

}));
