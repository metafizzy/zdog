/* jshint browser: true, devel: true, unused: true, undef: true */
/* globals rYCos, rYSin, w */

var persp = 0.5;

// -- Pseudo Vector3 class -- //

function Vector3( x, y, z ) {
  this.x = x;
  this.y = y;
  this.z = z;
}

Vector3.prototype.update = function() {
  var rzx = rYSin * -this.z;
  var rzy = rYCos * -this.z;
  var zx = this.x * rYCos;
  var zy = this.x * -rYSin;
  this.renderZ = rzy + zy;
  this.renderX = rzx + zx + w/2;
  this.renderY = this.renderZ * persp + this.y;
};
