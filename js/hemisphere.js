/**
 * Hemisphere composite shape
 */

( function( root, factory ) {
  // universal module definition
  var depends = [ './utils', './ellipse' ];
  /* globals define, module, require */
  if ( typeof define == 'function' && define.amd ) {
    // AMD
    define( depends, factory );
  } else if ( typeof module == 'object' && module.exports ) {
    // CommonJS
    module.exports = factory.apply( root, depends.map( require ) );
  } else {
    // browser global
    var Zdog = root.Zdog;
    Zdog.Hemisphere = factory( Zdog, Zdog.Ellipse );
  }
}( this, function factory( utils, Ellipse ) {

var Hemisphere = Ellipse.subclass({
  fill: true,
});

var TAU = utils.TAU;

Hemisphere.prototype.render = function( ctx, renderer ) {
  this.renderDome( ctx, renderer );
  // call super
  Ellipse.prototype.render.apply( this, arguments );
};

Hemisphere.prototype.renderDome = function( ctx, renderer ) {
  if ( !this.visible ) {
    return;
  }
  var elem = this.getDomeRenderElement( ctx, renderer );
  var contourAngle = Math.atan2( this.renderNormal.y, this.renderNormal.x );
  var domeRadius = this.diameter/2 * this.renderNormal.magnitude();
  var x = this.renderOrigin.x;
  var y = this.renderOrigin.y;

  if ( renderer.isCanvas ) {
    // canvas
    var startAngle = contourAngle + TAU/4;
    var endAngle = contourAngle - TAU/4;
    ctx.beginPath();
    ctx.arc( x, y, domeRadius, startAngle, endAngle );
  } else if ( renderer.isSvg ) {
    // svg
    contourAngle = (contourAngle - TAU/4) / TAU * 360;
    this.domeSvgElement.setAttribute( 'd', 'M ' + (-domeRadius) + ',0 A ' +
      domeRadius + ',' + domeRadius + ' 0 0 1 ' + domeRadius  + ',0' );
    this.domeSvgElement.setAttribute( 'transform',
      'translate(' + x + ',' + y + ' ) rotate(' + contourAngle + ')' );
  }

  renderer.stroke( ctx, elem, this.stroke, this.color, this.getLineWidth() );
  renderer.fill( ctx, elem, this.fill, this.color );
  renderer.end( ctx, elem );
};

var svgURI = 'http://www.w3.org/2000/svg';

Hemisphere.prototype.getDomeRenderElement = function( ctx, renderer ) {
  if ( !renderer.isSvg ) {
    return;
  }
  if ( !this.domeSvgElement ) {
    // create svgElement
    this.domeSvgElement = document.createElementNS( svgURI, 'path');
    this.domeSvgElement.setAttribute( 'stroke-linecap', 'round' );
    this.domeSvgElement.setAttribute( 'stroke-linejoin', 'round' );
  }
  return this.domeSvgElement;
};

return Hemisphere;

}));
