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
  rotation = Vector3.sanitize( rotation );
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

Vector3.prototype.subtract = function( vec ) {
  if ( !vec ) {
    return;
  }
  vec = Vector3.sanitize( vec );
  this.x -= vec.x;
  this.y -= vec.y;
  this.z -= vec.z;
  return this;
};

Vector3.prototype.multiply = function( value ) {
  if ( value === undefined ) {
    return;
  }
  // multiple all values by same number
  if ( typeof value == 'number' ) {
    this.x *= value;
    this.y *= value;
    this.z *= value;
    return;
  }
  // multiply object
  var vec = Vector3.sanitize( value, 1 );
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
  vec = Vector3.sanitize( vec );
  this.x = lerp( this.x, vec.x, t );
  this.y = lerp( this.y, vec.y, t );
  this.z = lerp( this.z, vec.z, t );
  return this;
};

Vector3.prototype.magnitude = function() {
  var sum = this.x*this.x + this.y*this.y + this.z*this.z;
  // PERF: check if sum ~= 1 and skip sqrt
  if ( Math.abs( sum - 1 ) < 0.00000001 ) {
    return 1;
  }
  return Math.sqrt( sum );
};

// ----- utils ----- //

// add missing properties
Vector3.sanitize = function( vec, value ) {
  vec = vec || {};
  value = value || 0;
  vec.x = vec.x === undefined ? value : vec.x;
  vec.y = vec.y === undefined ? value : vec.y;
  vec.z = vec.z === undefined ? value : vec.z;
  return vec;
};
