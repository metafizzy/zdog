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

BokehShape.prototype.getBokehLineWidth = function() {
  
  return this.lineWidth + this.bokehSize * this.bokeh * this.bokeh;
};

BokehShape.prototype.getBokehAlpha = function() {
  return ( 1 - this.bokeh ) * 0.7 + 0.3;
};



// Safari does not render lines with no size, have to render circle instead
BokehShape.prototype.renderDot = function( ctx ) {
  this.updateBokeh();
  ctx.globalAlpha = this.getBokehAlpha();
  ctx.fillStyle = this.color;
  var point = this.pathActions[0].endRenderPoint;
  ctx.beginPath();
  var radius = this.getBokehLineWidth()/2;
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
  ctx.lineWidth = this.getBokehLineWidth();

  // render points
  ctx.beginPath();
  this.pathActions.forEach( function( pathAction ) {
    pathAction.render( ctx );
  });
  var isTwoPoints = this.pathActions.length == 2 &&
    this.pathActions[1].method == 'line';
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