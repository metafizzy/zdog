function BokehShape( options ) {
  this.create( options );
  this.bokehSize = options.bokehSize || 5;
  this.bokehLimit = options.bokehLimit || 64;
}

BokehShape.prototype = Object.create( Shape.prototype );

BokehShape.prototype.updateBokeh = function() {
  // bokeh 0 -> 1
  this.bokeh = Math.abs( this.sortValue ) / this.bokehLimit;
  this.bokeh = Math.max( 0, Math.min( 1, this.bokeh ) );
  return this.bokeh;
};

BokehShape.prototype.getBokehStroke = function() {
  return this.stroke + this.bokehSize * this.bokeh * this.bokeh;
};

BokehShape.prototype.getBokehAlpha = function() {
  var revBokeh = 1 - this.bokeh;
  revBokeh *= revBokeh;
  return revBokeh * 0.8 + 0.2;
};



// Safari does not render lines with no size, have to render circle instead
BokehShape.prototype.renderDot = function( ctx ) {
  this.updateBokeh();
  ctx.globalAlpha = this.getBokehAlpha();
  ctx.fillStyle = this.color;
  var point = this.pathDirections[0].endRenderPoint;
  ctx.beginPath();
  var radius = this.getBokehStroke()/2;
  ctx.arc( point.x, point.y, radius, 0, TAU );
  ctx.fill();
  ctx.globalAlpha = 1;
};

BokehShape.prototype.renderPath = function( ctx ) {
  this.updateBokeh();
  ctx.globalAlpha = this.getBokehAlpha();
  // set render properties
  ctx.fillStyle = this.color;
  ctx.strokeStyle = this.color;
  ctx.lineWidth = this.getBokehStroke();

  // render points
  ctx.beginPath();
  this.pathDirections.forEach( function( direction ) {
    direction.render( ctx );
  });
  var isTwoPoints = this.pathDirections.length == 2 &&
    this.pathDirections[1].method == 'line';
  if ( !isTwoPoints && this.closed ) {
    ctx.closePath();
  }
  if ( this.stroke ) {
    ctx.stroke();
  }
  if ( this.fill ) {
    ctx.fill();
  }
  ctx.globalAlpha = 1;
};