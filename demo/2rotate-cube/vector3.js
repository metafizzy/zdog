/* jshint browser: true, devel: true, unused: true, undef: true */

// var persp = 0.5;

// -- Pseudo Vector3 class -- //

function Vector3( x, y, z ) {
  this.x = x;
  this.y = y;
  this.z = z;
}

Vector3.prototype.update = function( rZAngle, rYAngle ) {
  // 

  var rZSin = Math.sin( rZAngle );
  var rZCos = Math.cos( rZAngle );

  var x1 = this.x*rZCos - this.y*rZSin;
  var y1 = this.y*rZCos + this.x*rZSin;

  var rYSin = Math.sin( rYAngle );
  var rYCos = Math.cos( rYAngle );

  var x2 = x1*rYCos - this.z*rYSin;
  var z2 = this.z*rYCos + x1*rYSin;

  this.renderX = x2;
  this.renderY = y1;
  this.renderZ = z2;
};
