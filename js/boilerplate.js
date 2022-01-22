/*!
 * Zdog v1.1.3
 * Round, flat, designer-friendly pseudo-3D engine
 * Licensed MIT
 * https://zzz.dog
 * Copyright 2020 Metafizzy
 */

/**
 * Boilerplate & utils
 */

( function( root, factory ) {
  // module definition
  if ( typeof module == 'object' && module.exports ) {
    // CommonJS
    module.exports = factory();
  } else {
    // browser global
    root.Zdog = factory();
  }
}( this, function factory() {

var Zdog = {};

Zdog.TAU = Math.PI * 2;

Zdog.extend = function( a, b ) {
  for ( var prop in b ) {
    a[ prop ] = b[ prop ];
  }
  return a;
};

Zdog.lerp = function( a, b, alpha ) {
  return ( b - a ) * alpha + a;
};

Zdog.modulo = function( num, div ) {
  return ( ( num % div ) + div ) % div;
};

var powerMultipliers = {
  2: function( a ) {
    return a * a;
  },
  3: function( a ) {
    return a * a * a;
  },
  4: function( a ) {
    return a * a * a * a;
  },
  5: function( a ) {
    return a * a * a * a * a;
  },
};

Zdog.easeInOut = function( alpha, power ) {
  if ( power == 1 ) {
    return alpha;
  }
  alpha = Math.max( 0, Math.min( 1, alpha ) );
  var isFirstHalf = alpha < 0.5;
  var slope = isFirstHalf ? alpha : 1 - alpha;
  slope /= 0.5;
  // make easing steeper with more multiples
  var powerMultiplier = powerMultipliers[ power ] || powerMultipliers[2];
  var curve = powerMultiplier( slope );
  curve /= 2;
  return isFirstHalf ? curve : 1 - curve;
};

return Zdog;

} ) );
