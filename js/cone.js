/**
 * Cone composite shape
 */

( function( root, factory ) {
  // universal module definition
  var depends = [ './utils', './vector', './shape', './group', './ellipse' ];
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
    Zdog.Cone = factory( Zdog, Zdog.Vector, Zdog.Shape,
      Zdog.Group, Zdog.Ellipse );
  }
}( this, function factory( utils, Vector, Shape, Group, Ellipse ) {

var Cone = Group.subclass({
  diameter: 1,
  length: 1,
  color: '#333',
  baseColor: undefined,
  fill: true,
  stroke: 1,
  updateSort: true,
});

var TAU = utils.TAU;

Cone.prototype.create = function(/* options */) {
  // call super
  Group.prototype.create.apply( this, arguments );
  // composite shape, create child shapes
  this.apex = new Shape({
    visible: false,
    translate: { z: this.length },
    addTo: this,
  });
  // outside base
  var base = new Ellipse({
    diameter: this.diameter,
    addTo: this,
    color: this.color,
    stroke: this.stroke,
    fill: this.fill,
    backface: this.baseColor || true,
  });

  // used for calculating contour angle
  this.renderNormal = base.renderNormal;
  // vectors used for calculation
  this.renderApex = new Vector();
  this.tangentA = new Vector();
  this.tangentB = new Vector();
};

Cone.prototype.render = function( ctx ) {
  if ( !this.visible ) {
    return;
  }
  this.renderCone( ctx );
  Group.prototype.render.call( this, ctx );
};

Cone.prototype.getLineWidth = Shape.prototype.getLineWidth;

Cone.prototype.renderCone = function( ctx ) {
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
    return;
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
  // render
  ctx.beginPath();
  ctx.moveTo( tangentA.x, tangentA.y );
  ctx.lineTo( this.apex.renderOrigin.x, this.apex.renderOrigin.y );
  ctx.lineTo( tangentB.x, tangentB.y );

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

return Cone;

}));
