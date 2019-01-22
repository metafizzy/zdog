/* globals Hemisphere: true */

// -------------------------- Hemisphere -------------------------- //

var Hemisphere = Group.subclass({
  radius: 0.5,
  color: '#333',
  baseColor: undefined,
  fill: true,
  stroke: true,
  lineWidth: 1,
});

Hemisphere.prototype.create = function(/* options */) {
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
    backface: this.baseColor || true,
  });
  // used for calculating contour angle
  this.renderNormal = base.renderNormal;
};

Hemisphere.prototype.render = function( ctx ) {
  if ( !this.visible ) {
    return;
  }
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
  // apply scale
  var domeRadius = this.radius * this.renderNormal.magnitude();
  ctx.arc( x, y, domeRadius, startAngle, endAngle );
  ctx.closePath();
  if ( this.stroke ) {
    ctx.stroke();
  }
  if ( this.fill ) {
    ctx.fill();
  }
};
