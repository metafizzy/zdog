/*!
 * Zdog v0.1.0
 * Round, flat, designer-friendly pseudo-3D engine
 * Licensed MIT
 * https://zzz.dog
 * Copyright 2019 Metafizzy
 */

( function( root, factory ) {
  // module definition
  var depends = [
    './utils',
    './canvas-renderer',
    './svg-renderer',
    './vector',
    './anchor',
    './path-command',
    './shape',
    './group',
    './rect',
    './rounded-rect',
    './ellipse',
    './polygon',
    './hemisphere',
    './cylinder',
    './cone',
    './box',
  ];
  if ( typeof module == 'object' && module.exports ) {
    /* globals module, require */ // CommonJS
    module.exports = factory.apply( root, depends.map( require ) );
  }
})( this, function factory( Zdog ) {

  if ( typeof define == 'function' && define.amd ) {
    /* globals define */ // AMD
    define( 'zdog', function() {
      return Zdog;
    });
  }

  return Zdog;
});
