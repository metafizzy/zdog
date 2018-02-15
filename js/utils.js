/* jshint unused: false */
/* globals TAU: true */

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
