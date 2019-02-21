var BokehShape = Zdog.Shape.subclass({
  bokehSize: 5,
  bokehLimit: 64,
});

BokehShape.prototype.updateBokeh = function() {
  // bokeh 0 -> 1
  this.bokeh = Math.abs( this.sortValue ) / this.bokehLimit;
  this.bokeh = Math.max( 0, Math.min( 1, this.bokeh ) );
  return this.bokeh;
};

BokehShape.prototype.getLineWidth = function() {
  return this.stroke + this.bokehSize * this.bokeh * this.bokeh;
};

BokehShape.prototype.getBokehAlpha = function() {
  var alpha = 1 - this.bokeh;
  alpha *= alpha;
  return alpha * 0.8 + 0.2;
};

BokehShape.prototype.renderCanvasDot = function( ctx ) {
  this.updateBokeh();
  ctx.globalAlpha = this.getBokehAlpha(); // set opacity
  Zdog.Shape.prototype.renderCanvasDot.apply( this, arguments );
  ctx.globalAlpha = 1; // reset
};

BokehShape.prototype.renderPath = function( ctx, renderer ) {
  this.updateBokeh();
  // set opacity
  if ( renderer.isCanvas ) {
    ctx.globalAlpha = this.getBokehAlpha();
  }
  Zdog.Shape.prototype.renderPath.apply( this, arguments );
  // reset opacity
  if ( renderer.isCanvas ) {
    ctx.globalAlpha = 1;
  }
};
