// -------------------------- Vector3 -------------------------- //

function Vector3( position ) {
  this.set( position );
}

Vector3.prototype.set = function( pos ) {
  pos = Vector3.sanitize( pos );
  this.x = pos.x;
  this.y = pos.y;
  this.z = pos.z;
  return this;
};

Vector3.prototype.rotate = function( rotation ) {
  if ( !rotation ) {
    return;
  }
  this.rotateZ( rotation.z );
  this.rotateY( rotation.y );
  this.rotateX( rotation.x );
  return this;
};

Vector3.prototype.rotateZ = function( angle ) {
  rotateProperty( this, angle, 'x', 'y' );
};

Vector3.prototype.rotateX = function( angle ) {
  rotateProperty( this, angle, 'y', 'z' );
};

Vector3.prototype.rotateY = function( angle ) {
  rotateProperty( this, angle, 'x', 'z' );
};

function rotateProperty( vec, angle, propA, propB ) {
  if ( angle % TAU === 0 ) {
    return;
  }
  var cos = Math.cos( angle );
  var sin = Math.sin( angle );
  var a = vec[ propA ];
  var b = vec[ propB ];
  vec[ propA ] = a*cos - b*sin;
  vec[ propB ] = b*cos + a*sin;
}

Vector3.prototype.add = function( vec ) {
  if ( !vec ) {
    return;
  }
  vec = Vector3.sanitize( vec );
  this.x += vec.x;
  this.y += vec.y;
  this.z += vec.z;
  return this;
};

Vector3.prototype.multiply = function( vec ) {
  if ( !vec ) {
    return;
  }
  vec = Vector3.sanitize( vec );
  this.x *= vec.x;
  this.y *= vec.y;
  this.z *= vec.z;
  return this;
};

Vector3.prototype.transform = function( translation, rotation, scale ) {
  this.multiply( scale );
  this.rotate( rotation );
  this.add( translation );
};

Vector3.prototype.lerp = function( vec, t ) {
  this.x = lerp( this.x, vec.x, t );
  this.y = lerp( this.y, vec.y, t );
  this.z = lerp( this.z, vec.z, t );
  return this;
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
