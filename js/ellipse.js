/* globals Ellipse: true */

// -------------------------- Ellipse -------------------------- //

var Ellipse = Shape.subclass({
  width: 1,
  height: 1,
  quarters: 4,
  closed: false,
});

Ellipse.prototype.updatePath = function() {
  var x = this.width / 2;
  var y = this.height / 2;
  this.path = [
    { x: 0, y: -y },
    { arc: [ // top right
      { x: x, y: -y },
      { x: x, y: 0 },
    ]}
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
