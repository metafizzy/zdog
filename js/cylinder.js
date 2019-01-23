/* globals Cylinder: true */

// -------------------------- Cylinder -------------------------- //

var Cylinder = Group.subclass({
  diameter: 1,
  length: 1,
  color: '#333',
  baseColor: undefined,
  fill: true,
  stroke: true,
  lineWidth: 1,
  updateSort: true,
});

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
    lineWidth: this.lineWidth,
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

Cylinder.prototype.renderRing = function( ctx ) {
  ctx.strokeStyle = this.color;
  // apply scale
  ctx.lineWidth = this.diameter * this.renderNormal.magnitude();
  ctx.lineCap = 'butt'; // nice

  ctx.beginPath();
  ctx.moveTo( this.frontOrigin.x, this.frontOrigin.y );
  ctx.lineTo( this.backOrigin.x, this.backOrigin.y );
  ctx.stroke();

  ctx.lineCap = 'round'; // reset
};
