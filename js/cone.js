/**
 * Cone composite shape
 */

( function( root, factory ) {
  // module definition
  if ( typeof module == 'object' && module.exports ) {
    // CommonJS
    module.exports = factory( require('./boilerplate'), require('./vector'),
        require('./path-command'), require('./anchor'), require('./ellipse') );
  } else {
    // browser global
    var Zdog = root.Zdog;
    Zdog.Cone = factory( Zdog, Zdog.Vector, Zdog.PathCommand,
        Zdog.Anchor, Zdog.Ellipse );
  }
}( this, function factory( utils, Vector, PathCommand, Anchor, Ellipse ) {

var Cone = Ellipse.subclass({
  length: 1,
  fill: true,
});

var TAU = utils.TAU;

Cone.prototype.create = function( /* options */) {
  // call super
  Ellipse.prototype.create.apply( this, arguments );
  // composite shape, create child shapes
  this.apex = new Anchor({
    addTo: this,
    translate: { z: this.length },
  });

  // vectors used for calculation
  this.renderApex = new Vector();
  this.renderCentroid = new Vector();
  this.tangentA = new Vector();
  this.tangentB = new Vector();

  this.surfacePathCommands = [
    new PathCommand( 'move', [ {} ] ), // points set in renderConeSurface
    new PathCommand( 'line', [ {} ] ),
    new PathCommand( 'line', [ {} ] ),
  ];
};

Cone.prototype.updateSortValue = function() {
  // center of cone is one third of its length
  this.renderCentroid.set( this.renderOrigin )
    .lerp( this.apex.renderOrigin, 1/3 );
  this.sortValue = this.renderCentroid.z;
};

Cone.prototype.render = function( ctx, renderer ) {
  this.renderConeSurface( ctx, renderer );
  Ellipse.prototype.render.apply( this, arguments );
};

Cone.prototype.renderConeSurface = function( ctx, renderer ) {
  if ( !this.visible ) {
    return;
  }
  this.renderApex.set( this.apex.renderOrigin )
    .subtract( this.renderOrigin );

  var scale = this.renderNormal.magnitude();
  var apexDistance = this.renderApex.magnitude2d();
  var normalDistance = this.renderNormal.magnitude2d();
  // eccentricity
  var eccenAngle = Math.acos( normalDistance/scale );
  var eccen = Math.sin( eccenAngle );
  var radius = this.diameter / 2 * scale;
  // does apex extend beyond eclipse of face
  var isApexVisible = radius * eccen < apexDistance;
  if ( !isApexVisible ) {
    return;
  }
  // update tangents
  var apexAngle = Math.atan2( this.renderNormal.y, this.renderNormal.x ) +
      TAU/2;
  var projectLength = apexDistance/eccen;
  var projectAngle = Math.acos( radius/projectLength );
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

  this.setSurfaceRenderPoint( 0, tangentA );
  this.setSurfaceRenderPoint( 1, this.apex.renderOrigin );
  this.setSurfaceRenderPoint( 2, tangentB );

  // render
  var elem = this.getSurfaceRenderElement( ctx, renderer );
  renderer.renderPath( ctx, elem, this.surfacePathCommands );
  renderer.stroke( ctx, elem, this.stroke, this.color, this.getLineWidth() );
  renderer.fill( ctx, elem, this.fill, this.color );
  renderer.end( ctx, elem );
};

var svgURI = 'http://www.w3.org/2000/svg';

Cone.prototype.getSurfaceRenderElement = function( ctx, renderer ) {
  if ( !renderer.isSvg ) {
    return;
  }
  if ( !this.surfaceSvgElement ) {
    // create svgElement
    this.surfaceSvgElement = document.createElementNS( svgURI, 'path' );
    this.surfaceSvgElement.setAttribute( 'stroke-linecap', 'round' );
    this.surfaceSvgElement.setAttribute( 'stroke-linejoin', 'round' );
  }
  return this.surfaceSvgElement;
};

Cone.prototype.setSurfaceRenderPoint = function( index, point ) {
  var renderPoint = this.surfacePathCommands[ index ].renderPoints[0];
  renderPoint.set( point );
};

return Cone;

} ) );
