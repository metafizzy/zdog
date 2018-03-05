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
