/**
 * Hemisphere composite shape
 */

( function( root, factory ) {
  // universal module definition
  var depends = [ './utils', './ellipse' ];
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
    Zdog.Hemisphere = factory( Zdog, Zdog.Ellipse );
  }
}( this, function factory( utils, Ellipse ) {

var Hemisphere = Ellipse.subclass({
  fill: true,
});

var TAU = utils.TAU;

Hemisphere.prototype.render = function( ctx ) {
  this.renderDome( ctx );
  // call super
  Ellipse.prototype.render.apply( this, arguments );
};

Hemisphere.prototype.renderDome = function( ctx ) {
  if ( !this.visible ) {
    return;
  }
  var contourAngle = Math.atan2( this.renderNormal.y, this.renderNormal.x );
  var startAngle = contourAngle + TAU/4;
  var endAngle = contourAngle - TAU/4;

  ctx.beginPath();
  var x = this.renderOrigin.x;
  var y = this.renderOrigin.y;
  // apply scale
  var domeRadius = this.diameter/2 * this.renderNormal.magnitude();
  ctx.arc( x, y, domeRadius, startAngle, endAngle );
  ctx.closePath();
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

return Hemisphere;

}));
