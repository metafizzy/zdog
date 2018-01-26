/* jshint browser: true, devel: true, unused: true, undef: true */

// var persp = 0.5;

// -- Pseudo Vector3 class -- //

function Vector3( x, y, z ) {
  this.x = x;
  this.y = y;
  this.z = z;
}

Vector3.prototype.update = function( angleX, angleY, angleZ ) {
  // rotate Z
  var rZSin = Math.sin( angleZ );
  var rZCos = Math.cos( angleZ );
  var x1 = this.x*rZCos - this.y*rZSin;
  var y1 = this.y*rZCos + this.x*rZSin;
  var z1 = this.z;

  // rotate Y
  var rYSin = Math.sin( angleY );
  var rYCos = Math.cos( angleY );
  var x2 = x1*rYCos - z1*rYSin;
  var y2 = y1;
  var z2 = z1*rYCos + x1*rYSin;

  // rotateX
  var rXSin = Math.sin( angleX );
  var rXCos = Math.cos( angleX );
  var x3 = x2;
  var y3 = y2*rXCos - z2*rXSin;
  var z3 = z2*rXCos + y2*rXSin;

  this.renderX = x3;
  this.renderY = y3;
  this.renderZ = z3;
};
