// -------------------------- Hemisphere -------------------------- //

var Hemisphere = Group.subclass({
  radius: 0.5,
  color: '#333',
  baseColor: undefined,
  fill: true,
  stroke: true,
  lineWidth: 1,
});

Hemisphere.prototype.create = function( options ) {
  // call super
  Group.prototype.create.apply( this, arguments );
  // composite shape, create child shapes
  // outside base
  var base = new Ellipse({
    width: this.radius * 2,
    height: this.radius * 2,
    addTo: this,
    color: this.color,
    lineWidth: this.lineWidth,
    stroke: this.stroke,
    fill: this.fill,
    backfaceVisible: this.baseColor ? false : true,
  });
  // inside base
  if ( this.baseColor ) {
    base.copy({
      color: this.baseColor,
      rotate: { y: TAU/2 },
    });
  }
  // used for calculating contour angle
  this.renderNormal = base.renderNormal;
};

Hemisphere.prototype.render = function( ctx ) {
  this.renderDome( ctx );
  Group.prototype.render.call( this, ctx );
};

Hemisphere.prototype.renderDome = function( ctx ) {
  var contourAngle = Math.atan2( this.renderNormal.y, this.renderNormal.x );
  var startAngle = contourAngle + TAU/4;
  var endAngle = contourAngle - TAU/4;

  ctx.strokeStyle = ctx.fillStyle = this.color;
  ctx.lineWidth = this.lineWidth;
  ctx.beginPath();
  var x = this.renderOrigin.x;
  var y = this.renderOrigin.y;
  ctx.arc( x, y, this.radius, startAngle, endAngle );
  ctx.closePath();
  if ( this.stroke ) {
    ctx.stroke();
  }
  if ( this.fill ) {
    ctx.fill();
  }
};
