/* globals Polygon: true */

// -------------------------- Polygon -------------------------- //

var Polygon = Shape.subclass({
  sides: 3,
  radius: 0.5,
});

Polygon.prototype.setPath = function() {
  this.path = [];
  for ( var i=0; i < this.sides; i++ ) {
    var theta = i/this.sides * TAU - TAU/4;
    var x = Math.cos( theta ) * this.radius;
    var y = Math.sin( theta ) * this.radius;
    this.path.push({ x: x, y: y });
  }
};
