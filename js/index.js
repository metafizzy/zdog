/**
 * Index
 */

( function( root, factory ) {
  // module definition
  if ( typeof module == 'object' && module.exports ) {
    // CommonJS
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
/* eslint-disable max-params */
} )( this, function factory( Zdog, CanvasRenderer, SvgRenderer, Vector, Anchor,
    Dragger, Illustration, PathCommand, Shape, Group, Rect, RoundedRect,
    Ellipse, Polygon, Hemisphere, Cylinder, Cone, Box ) {
/* eslint-enable max-params */

      Zdog.CanvasRenderer = CanvasRenderer;
      Zdog.SvgRenderer = SvgRenderer;
      Zdog.Vector = Vector;
      Zdog.Anchor = Anchor;
      Zdog.Dragger = Dragger;
      Zdog.Illustration = Illustration;
      Zdog.PathCommand = PathCommand;
      Zdog.Shape = Shape;
      Zdog.Group = Group;
      Zdog.Rect = Rect;
      Zdog.RoundedRect = RoundedRect;
      Zdog.Ellipse = Ellipse;
      Zdog.Polygon = Polygon;
      Zdog.Hemisphere = Hemisphere;
      Zdog.Cylinder = Cylinder;
      Zdog.Cone = Cone;
      Zdog.Box = Box;

      return Zdog;
} );
