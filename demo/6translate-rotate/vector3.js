/* jshint browser: true, devel: true, unused: true, undef: true */

// -- Pseudo Vector3 class -- //

function Vector3( position ) {
  this.set( position );
}

Vector3.prototype.set = function( pos ) {
  pos = Vector3.sanitize( pos );
  this.x = pos.x;
  this.y = pos.y;
  this.z = pos.z;
};

Vector3.prototype.rotate = function( rotation ) {
  // rotate Z
  var rZSin = Math.sin( rotation.z );
  var rZCos = Math.cos( rotation.z );
  var x1 = this.x*rZCos - this.y*rZSin;
  var y1 = this.y*rZCos + this.x*rZSin;
  var z1 = this.z;

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

  this.x = x3;
  this.y = y3;
  this.z = z3;
};

Vector3.prototype.translate = function( translation ) {
  translation = Vector3.sanitize( translation );
  this.x += translation.x;
  this.y += translation.y;
  this.z += translation.z;
};

// ----- utils ----- //

// add missing properties
Vector3.sanitize = function( vec ) {
  vec = vec || {};
  vec.x = vec.x || 0;
  vec.y = vec.y || 0;
  vec.z = vec.z || 0;
  return vec;
};
