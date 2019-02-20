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

Hemisphere.prototype.render = function( ctx ) {
  this.renderDome( ctx );
  // call super
  Ellipse.prototype.render.apply( this, arguments );
};

Hemisphere.prototype.renderSvg = function( svg ) {
  this.renderDomeSvg( svg );
  // call super
  Ellipse.prototype.renderSvg.apply( this, arguments );
};

Hemisphere.prototype.renderDome = function( ctx ) {
  if ( !this.visible ) {
    return;
  }
  var contourAngle = Math.atan2( this.renderNormal.y, this.renderNormal.x );
  var startAngle = contourAngle + TAU/4;
  var endAngle = contourAngle - TAU/4;

  ctx.beginPath();
  var x = this.renderOrigin.x;
  var y = this.renderOrigin.y;
  // apply scale
  var domeRadius = this.diameter/2 * this.renderNormal.magnitude();
  ctx.arc( x, y, domeRadius, startAngle, endAngle );
  ctx.closePath();
  if ( this.stroke ) {
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.getLineWidth();
    ctx.stroke();
  }
  if ( this.fill ) {
    ctx.fillStyle = this.color;
    ctx.fill();
  }
};


var svgURI = 'http://www.w3.org/2000/svg';

Hemisphere.prototype.renderDomeSvg = function( svg ) {
  if ( !this.visible ) {
    return;
  }

  if ( !this.domeSvgElement ) {
    // create svgElement
    this.domeSvgElement = document.createElementNS( svgURI, 'path');
    this.domeSvgElement.setAttribute( 'stroke-linecap', 'round' );
    this.domeSvgElement.setAttribute( 'stroke-linejoin', 'round' );
  }

  var contourAngle = Math.atan2( this.renderNormal.y, this.renderNormal.x );
  contourAngle = (contourAngle - TAU/4) / TAU * 360;
  var domeRadius = this.diameter/2 * this.renderNormal.magnitude();
  this.domeSvgElement.setAttribute( 'd', 'M ' + (-domeRadius) + ',0 A ' +
    domeRadius + ',' + domeRadius + ' 0 0 1 ' + domeRadius  + ',0' );
  var x = this.renderOrigin.x;
  var y = this.renderOrigin.y;
  this.domeSvgElement.setAttribute( 'transform',
    'translate(' + x + ',' + y + ' ) rotate(' + contourAngle + ')' );
  if ( this.stroke ) {
    this.domeSvgElement.setAttribute( 'stroke', this.color );
    this.domeSvgElement.setAttribute( 'stroke-width', this.getLineWidth() );
  }
  // fill
  var fill = this.fill ? this.color : 'none';
  this.domeSvgElement.setAttribute( 'fill', fill );

  svg.appendChild( this.domeSvgElement );
};

return Hemisphere;

}));
