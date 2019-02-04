/**
 * Cylinder composite shape
 */

( function( root, factory ) {
  // universal module definition
  var depends = [ './utils', './shape', './group', './ellipse' ];
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
    Zdog.Cylinder = factory( Zdog, Zdog.Shape, Zdog.Group, Zdog.Ellipse );
  }
}( this, function factory( utils, Shape, Group, Ellipse ) {

var Cylinder = Group.subclass({
  diameter: 1,
  length: 1,
  color: '#333',
  baseColor: undefined,
  fill: true,
  stroke: 1,
  updateSort: true,
});

var TAU = utils.TAU;

Cylinder.prototype.create = function(/* options */) {
  // call super
  Group.prototype.create.apply( this, arguments );
  // composite shape, create child shapes
  var baseZ = this.length/2;
  // front outside base
  var frontBase = new Ellipse({
    diameter: this.diameter,
    addTo: this,
    translate: { z: baseZ },
    rotate: { y: TAU/2 },
    color: this.color,
    stroke: this.stroke,
    fill: this.fill,
    backface: this.baseColor || true,
  });
  // back outside base
  var backBase = frontBase.copy({
    translate: { z: -baseZ },
    rotate: { y: 0 },
  });

  // used for rendering ring
  this.frontOrigin = frontBase.renderOrigin;
  this.backOrigin = backBase.renderOrigin;
  this.renderNormal = frontBase.renderNormal;
};

Cylinder.prototype.render = function( ctx ) {
  if ( !this.visible ) {
    return;
  }
  this.renderRing( ctx );
  Group.prototype.render.call( this, ctx );
};

Cylinder.prototype.getLineWidth = Shape.prototype.getLineWidth;

Cylinder.prototype.renderRing = function( ctx ) {
  ctx.strokeStyle = this.color;
  // apply scale
  ctx.lineWidth = this.diameter * this.renderNormal.magnitude() + this.getLineWidth();
  ctx.lineCap = 'butt'; // nice

  ctx.beginPath();
  ctx.moveTo( this.frontOrigin.x, this.frontOrigin.y );
  ctx.lineTo( this.backOrigin.x, this.backOrigin.y );
  ctx.stroke();

  ctx.lineCap = 'round'; // reset
};

return Cylinder;

}));
