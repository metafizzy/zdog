/**
 * Boilerplate & utils
 */

( function( root, factory ) {
  // universal module definition
  /* globals define, module */
  if ( typeof define == 'function' && define.amd ) {
    // AMD
    define( factory );
  } else if ( typeof module == 'object' && module.exports ) {
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

Zdog.lerp = function( a, b, t ) {
  return ( b - a ) * t + a;
};

Zdog.modulo = function( num, div ) {
  return ( ( num % div ) + div ) % div;
};

var powerMultipliers = {
  2: function( i ) {
    return i * i;
  },
  3: function( i ) {
    return i * i * i;
  },
  4: function( i ) {
    return i * i * i * i;
  },
  5: function( i ) {
    return i * i * i * i * i;
  }
};

Zdog.easeInOut = function( i, power ) {
  if ( power == 1 ) {
    return i;
  }
  var powerMultiplier = powerMultipliers[ power ] || powerMultipliers[2];

  i = i % 1;
  var isFirstHalf = i < 0.5;
  var slope = isFirstHalf ? i : 1 - i;
  slope = slope / 0.5;
  // make easing steeper with more multiples
  var curve = powerMultiplier( slope );
  curve = curve / 2;
  return isFirstHalf ? curve : 1 - curve;
};

return Zdog;

}));
