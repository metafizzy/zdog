/**
 * Index
 */

( function( root, factory ) {
  // module definition
  if ( typeof module == 'object' && module.exports ) {
    /* globals module, require */ // CommonJS
    module.exports = factory(
      require('./boilerplate'),
      require('./canvas-renderer'),
      require('./svg-renderer'),
      require('./vector'),
      require('./anchor'),
      require('./dragger'),
      require('./illustration'),
      require('./path-command'),
      require('./shape'),
      require('./group'),
      require('./rect'),
      require('./rounded-rect'),
      require('./ellipse'),
      require('./polygon'),
      require('./hemisphere'),
      require('./cylinder'),
      require('./cone'),
      require('./box')
    );
  } else if ( typeof define == 'function' && define.amd ) {
    /* globals define */ // AMD
    define( 'zdog', [], root.Zdog );
  }
})( this, function factory( Zdog ) {

  return Zdog;

});
