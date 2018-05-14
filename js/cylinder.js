/* globals Cylinder: true */

// -------------------------- Cylinder -------------------------- //

var Cylinder = Group.subclass({
  radius: 0.5,
  length: 1,
  color: '#333',
  baseColor: undefined,
  fill: true,
  stroke: true,
  lineWidth: 1,
  updateSort: true,
});

Cylinder.prototype.create = function() {
  // call super
  Group.prototype.create.apply( this, arguments );
  // composite shape, create child shapes
  var baseZ = this.length/2;
  var base, frontBase, backBase;
  // front outside base
  base = frontBase = new Ellipse({
    width: this.radius * 2,
    height: this.radius * 2,
    addTo: this,
    translate: { z: -baseZ },
    rotate: { y: TAU/2 },
    color: this.color,
    lineWidth: this.lineWidth,
    stroke: this.stroke,
    fill: this.fill,
    backfaceVisible: this.baseColor ? false : true,
  });
  // back outside base
  backBase = base.copy({
    translate: { z: baseZ },
    rotate: { y: 0 },
  });

  if ( this.baseColor ) {
    // front inside base
    base.copy({
      rotate: { y: 0 },
      color: this.baseColor
    });
    // back inside base
    base.copy({
      translate: { z: baseZ },
      rotate: { y: TAU/2 },
      color: this.baseColor
    });
  }

  // used for rendering ring
  this.frontOrigin = frontBase.renderOrigin;
  this.backOrigin = backBase.renderOrigin;
};

Cylinder.prototype.render = function( ctx ) {
  this.renderRing( ctx );
  Group.prototype.render.call( this, ctx );
};

Cylinder.prototype.renderRing = function( ctx ) {
  ctx.strokeStyle = this.color;
  ctx.lineWidth = this.radius * 2;
  ctx.lineCap = 'butt'; // nice

  ctx.beginPath();
  ctx.moveTo( this.frontOrigin.x, this.frontOrigin.y );
  ctx.lineTo( this.backOrigin.x, this.backOrigin.y );
  ctx.stroke();

  ctx.lineCap = 'round'; // reset
};
