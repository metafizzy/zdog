/**
 * Vector
 */

( function( root, factory ) {
  // module definition
  if ( typeof module == 'object' && module.exports ) {
    // CommonJS
    module.exports = factory( require('./boilerplate') );
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

// 'pos' = 'position'
Vector.prototype.set = function( pos ) {
  this.x = pos && pos.x || 0;
  this.y = pos && pos.y || 0;
  this.z = pos && pos.z || 0;
  return this;
};

// set coordinates without sanitizing
// vec.write({ y: 2 }) only sets y coord
Vector.prototype.write = function( pos ) {
  if ( !pos ) {
    return this;
  }
  this.x = pos.x != undefined ? pos.x : this.x;
  this.y = pos.y != undefined ? pos.y : this.y;
  this.z = pos.z != undefined ? pos.z : this.z;
  return this;
};

Vector.prototype.rotate = function( rotation ) {
  if ( !rotation ) {
    return;
  }
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
  if ( !angle || angle % TAU === 0 ) {
    return;
  }
  var cos = Math.cos( angle );
  var sin = Math.sin( angle );
  var a = vec[ propA ];
  var b = vec[ propB ];
  vec[ propA ] = a * cos - b * sin;
  vec[ propB ] = b * cos + a * sin;
}

Vector.prototype.isSame = function( pos ) {
  if ( !pos ) {
    return false;
  }
  return this.x === pos.x && this.y === pos.y && this.z === pos.z;
};

Vector.prototype.add = function( pos ) {
  if ( !pos ) {
    return this;
  }
  this.x += pos.x || 0;
  this.y += pos.y || 0;
  this.z += pos.z || 0;
  return this;
};

Vector.prototype.subtract = function( pos ) {
  if ( !pos ) {
    return this;
  }
  this.x -= pos.x || 0;
  this.y -= pos.y || 0;
  this.z -= pos.z || 0;
  return this;
};

Vector.prototype.multiply = function( pos ) {
  if ( pos == undefined ) {
    return this;
  }
  // multiple all values by same number
  if ( typeof pos == 'number' ) {
    this.x *= pos;
    this.y *= pos;
    this.z *= pos;
  } else {
    // multiply object
    this.x *= pos.x != undefined ? pos.x : 1;
    this.y *= pos.y != undefined ? pos.y : 1;
    this.z *= pos.z != undefined ? pos.z : 1;
  }
  return this;
};

Vector.prototype.transform = function( translation, rotation, scale ) {
  this.multiply( scale );
  this.rotate( rotation );
  this.add( translation );
  return this;
};

Vector.prototype.lerp = function( pos, alpha ) {
  this.x = utils.lerp( this.x, pos.x || 0, alpha );
  this.y = utils.lerp( this.y, pos.y || 0, alpha );
  this.z = utils.lerp( this.z, pos.z || 0, alpha );
  return this;
};

Vector.prototype.magnitude = function() {
  var sum = this.x * this.x + this.y * this.y + this.z * this.z;
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
  var sum = this.x * this.x + this.y * this.y;
  return getMagnitudeSqrt( sum );
};

Vector.prototype.copy = function() {
  return new Vector( this );
};

return Vector;

} ) );
