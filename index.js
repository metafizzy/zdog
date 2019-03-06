/*!
 * Zdog v0.1.0
 * Round, flat, designer-friendly pseudo-3D engine
 * Licensed MIT
 * https://zzz.dog
 * Copyright 2019 Metafizzy
 */

( function( root, factory ) {
  // universal module definition
  /* globals define, module, require */
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
  if ( typeof define == 'function' && define.amd ) {
    // AMD
    define( depends, factory );
  } else if ( typeof module == 'object' && module.exports ) {
    // CommonJS
    module.exports = factory.apply( root, depends.map( require ) );
  }
})( window, function factory( Zdog ) {
  return Zdog;
});
