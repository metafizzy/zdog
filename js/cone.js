/**
 * Cone composite shape
 */

( function( root, factory ) {
  // universal module definition
  var depends = [ './utils', './vector', './anchor', './ellipse' ];
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
    Zdog.Cone = factory( Zdog, Zdog.Vector, Zdog.Anchor, Zdog.Ellipse );
  }
}( this, function factory( utils, Vector, Anchor, Ellipse ) {

var Cone = Ellipse.subclass({
  length: 1,
  fill: true,
});

var TAU = utils.TAU;

Cone.prototype.create = function(/* options */) {
  // call super
  Ellipse.prototype.create.apply( this, arguments );
  // composite shape, create child shapes
  this.apex = new Anchor({
    addTo: this,
    translate: { z: this.length },
  });

  // vectors used for calculation
  this.renderApex = new Vector();
  this.tangentA = new Vector();
  this.tangentB = new Vector();
};

Cone.prototype.render = function( ctx ) {
  if ( !this.visible ) {
    return;
  }
  this.renderConeSurfaceCanvas( ctx );
  Ellipse.prototype.render.call( this, ctx );
};

Cone.prototype.renderSvg = function( svg ) {
  if ( !this.visible ) {
    return;
  }
  this.renderConeSurfaceSvg( svg );
  Ellipse.prototype.renderSvg.call( this, svg );
};

Cone.prototype.renderConeSurfaceCanvas = function( ctx ) {
  var isApexVisible = this.updateSurfaceVectors();
  if ( !isApexVisible ) {
    return;
  }
  // render path
  ctx.beginPath();
  ctx.moveTo( this.tangentA.x, this.tangentA.y );
  ctx.lineTo( this.apex.renderOrigin.x, this.apex.renderOrigin.y );
  ctx.lineTo( this.tangentB.x, this.tangentB.y );

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

Cone.prototype.renderConeSurfaceSvg = function( svg ) {
  var isApexVisible = this.updateSurfaceVectors();
  // console.log('render cone surface svg', isApexVisible);
  if ( !isApexVisible ) {
    return;
  }
  if ( !this.surfaceSvgElement ) {
    // create svgElement
    this.surfaceSvgElement = document.createElementNS( svgURI, 'path');
    this.surfaceSvgElement.setAttribute( 'stroke-linecap', 'round' );
    this.surfaceSvgElement.setAttribute( 'stroke-linejoin', 'round' );
  }
  // render path
  var dValue = 'M' + this.tangentA.x + ',' + this.tangentA.y;
  dValue += 'L' + this.apex.renderOrigin.x + ',' + this.apex.renderOrigin.y;
  dValue += 'L' + this.tangentB.x + ',' + this.tangentB.y;
  this.surfaceSvgElement.setAttribute( 'd', dValue );
  // stroke
  if ( this.stroke ) {
    this.surfaceSvgElement.setAttribute( 'stroke', this.color );
    this.surfaceSvgElement.setAttribute( 'stroke-width', this.getLineWidth() );
  }
  // fill
  var fill = this.fill ? this.color : 'none';
  this.surfaceSvgElement.setAttribute( 'fill', fill );

  svg.appendChild( this.surfaceSvgElement );
};

Cone.prototype.updateSurfaceVectors = function() {
  this.renderApex.set( this.apex.renderOrigin )
    .subtract( this.renderOrigin );
  var scale = this.renderNormal.magnitude();
  var apexDistance = this.renderApex.magnitude2d();
  var normalDistance = this.renderNormal.magnitude2d();
  // eccentricity
  var eccenAngle = Math.acos( normalDistance / scale );
  var eccen = Math.sin( eccenAngle );
  var radius = this.diameter/2 * scale;
  // does apex extend beyond eclipse of face
  var isApexVisible = radius * eccen < apexDistance;
  if ( !isApexVisible ) {
    return false;
  }
  // update tangents
  var apexAngle = Math.atan2( this.renderNormal.y, this.renderNormal.x ) + TAU/2;
  var projectLength = apexDistance / eccen;
  var projectAngle = Math.acos( radius / projectLength );
  // set tangent points
  var tangentA = this.tangentA;
  var tangentB = this.tangentB;

  tangentA.x = Math.cos( projectAngle ) * radius * eccen;
  tangentA.y = Math.sin( projectAngle ) * radius;

  tangentB.set( this.tangentA );
  tangentB.y *= -1;

  tangentA.rotateZ( apexAngle );
  tangentB.rotateZ( apexAngle );
  tangentA.add( this.renderOrigin );
  tangentB.add( this.renderOrigin );
  return true;
};

return Cone;

}));
