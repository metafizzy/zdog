/* globals Ellipse: true */

// -------------------------- Ellipse -------------------------- //

var Ellipse = Shape.subclass({
  width: 1,
  height: 1,
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
    ]},
    { arc: [ // bottom right
      { x: x, y: y },
      { x: 0, y: y },
    ]},
    { arc: [ // bottom left
      { x: -x, y: y },
      { x: -x, y: 0 },
    ]},
    { arc: [ // bottom left
      { x: -x, y: -y },
      { x: 0, y: -y },
    ]},
  ];
};
