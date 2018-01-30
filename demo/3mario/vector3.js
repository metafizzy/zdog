/* jshint browser: true, devel: true, unused: true, undef: true */

// var persp = 0.5;

// -- Pseudo Vector3 class -- //

function Vector3( x, y, z ) {
  this.x = x;
  this.y = y;
  this.z = z;
}

Vector3.rotate = function( vec, rotation ) {
  // rotate Z
  var rZSin = Math.sin( rotation.z );
  var rZCos = Math.cos( rotation.z );
  var x1 = vec.x*rZCos - vec.y*rZSin;
  var y1 = vec.y*rZCos + vec.x*rZSin;
  var z1 = vec.z;

  // rotate Y
  var rYSin = Math.sin( rotation.y );
  var rYCos = Math.cos( rotation.y );
  var x2 = x1*rYCos - z1*rYSin;
  var y2 = y1;
  var z2 = z1*rYCos + x1*rYSin;

  // rotateX
  var rXSin = Math.sin( rotation.x );
  var rXCos = Math.cos( rotation.x );
  var x3 = x2;
  var y3 = y2*rXCos - z2*rXSin;
  var z3 = z2*rXCos + y2*rXSin;

  return new Vector3( x3, y3, z3 );
};

Vector3.prototype.update = function( rotation ) {
  this.renderPosition = this.getRotate( rotation );
};

Vector3.prototype.getRotate = function( rotation ) {
  return Vector3.rotate( this, rotation );
};
