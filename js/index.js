/**
 * Index
 */

( function( root, factory ) {
  // module definition
  var depends = [
    './boilerplate',
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
