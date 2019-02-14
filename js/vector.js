/**
 * Vector
 */

( function( root, factory ) {
  // universal module definition
  /* globals define, module, require */
  if ( typeof define == 'function' && define.amd ) {
    // AMD
    define( [ './utils' ], factory );
  } else if ( typeof module == 'object' && module.exports ) {
    // CommonJS
    module.exports = factory( require('./utils') );
  } else {
    // browser global
    var Zdog = root.Zdog;
    Zdog.Vector = factory( Zdog );
  }

}( this, function factory( utils ) {

function Vector( position ) {
  this.set( position );
}

var TAU = utils.TAU;

Vector.prototype.set = function( pos ) {
  pos = Vector.sanitize( pos );
  this.x = pos.x;
  this.y = pos.y;
  this.z = pos.z;
  return this;
};

// set coordinates without sanitizing
// vec.write({ y: 2 }) only sets y coord
Vector.prototype.write = function( pos ) {
  if ( !pos ) {
    return;
  }
  this.x = pos.x != undefined ? pos.x : this.x;
  this.y = pos.y != undefined ? pos.y : this.y;
  this.z = pos.z != undefined ? pos.z : this.z;
};

Vector.prototype.rotate = function( rotation ) {
  if ( !rotation ) {
    return;
  }
  rotation = Vector.sanitize( rotation );
  this.rotateZ( rotation.z );
  this.rotateY( rotation.y );
  this.rotateX( rotation.x );
  return this;
};

Vector.prototype.rotateZ = function( angle ) {
  rotateProperty( this, angle, 'x', 'y' );
};

Vector.prototype.rotateX = function( angle ) {
  rotateProperty( this, angle, 'y', 'z' );
};

Vector.prototype.rotateY = function( angle ) {
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

Vector.prototype.add = function( vec ) {
  if ( !vec ) {
    return;
  }
  vec = Vector.sanitize( vec );
  this.x += vec.x;
  this.y += vec.y;
  this.z += vec.z;
  return this;
};

Vector.prototype.subtract = function( vec ) {
  if ( !vec ) {
    return;
  }
  vec = Vector.sanitize( vec );
  this.x -= vec.x;
  this.y -= vec.y;
  this.z -= vec.z;
  return this;
};

Vector.prototype.multiply = function( value ) {
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
  var vec = Vector.sanitize( value, 1 );
  this.x *= vec.x;
  this.y *= vec.y;
  this.z *= vec.z;
  return this;
};

Vector.prototype.transform = function( translation, rotation, scale ) {
  this.multiply( scale );
  this.rotate( rotation );
  this.add( translation );
  return this;
};

Vector.prototype.lerp = function( vec, t ) {
  vec = Vector.sanitize( vec );
  this.x = utils.lerp( this.x, vec.x, t );
  this.y = utils.lerp( this.y, vec.y, t );
  this.z = utils.lerp( this.z, vec.z, t );
  return this;
};

Vector.prototype.magnitude = function() {
  var sum = this.x*this.x + this.y*this.y + this.z*this.z;
  return getMagnitudeSqrt( sum );
};

function getMagnitudeSqrt( sum ) {
  // PERF: check if sum ~= 1 and skip sqrt
  if ( Math.abs( sum - 1 ) < 0.00000001 ) {
    return 1;
  }
  return Math.sqrt( sum );
}

Vector.prototype.magnitude2d = function() {
  var sum = this.x*this.x + this.y*this.y;
  return getMagnitudeSqrt( sum );
};

Vector.prototype.copy = function() {
  return new Vector( this );
};

// ----- utils ----- //

// add missing properties
Vector.sanitize = function( vec, value ) {
  vec = vec || {};
  value = value || 0;
  vec.x = vec.x == undefined ? value : vec.x;
  vec.y = vec.y == undefined ? value : vec.y;
  vec.z = vec.z == undefined ? value : vec.z;
  return vec;
};

return Vector;

}));
