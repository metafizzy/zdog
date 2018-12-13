/* jshint unused: false */
/* globals TAU: true */

// Hi! This 3D model was built using the <canvas> 2D drawing API.
// It uses lineWidth to give the illusion of form.
// I'm working on a library to make these sort of 3D illustrations,
// But it's not ready for prime-time. Stay tuned! *~ dd ~*

// -------------------------- utils -------------------------- //

var TAU = Math.PI * 2;

function extend( a, b ) {
  for ( var prop in b ) {
    a[ prop ] = b[ prop ];
  }
  return a;
}

function lerp( a, b, t ) {
  return ( b - a ) * t + a;
}

function modulo( num, div ) {
  return ( ( num % div ) + div ) % div;
}

function getDistance1( x, y ) {
  return Math.sqrt( x * x + y * y );
}

function shapeSorter( a, b ) {
  return a.sortValue - b.sortValue;
}

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

function easeInOut( i, power ) {
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
}
