/* jshint browser: true, devel: true, unused: true, undef: true */
/* globals Vector3 */

function PathAction( method, points ) {
  this.method = method;
  this.points = points.map( mapVectorPoint );
  this.renderPoints = points.map( mapVectorPoint );
}

function mapVectorPoint( point ) {
  return new Vector3( point );
}

PathAction.prototype.reset = function() {
  // reset renderPoints back to orignal points position
  var points = this.points;
  this.renderPoints.forEach( function( renderPoint, i ) {
    var point = points[i];
    renderPoint.set( point );
  });
};

PathAction.prototype.transform = function( translation, rotation ) {
  this.renderPoints.forEach( function( renderPoint ) {
    renderPoint.rotate( rotation );
    renderPoint.add( translation );
  });
};

PathAction.prototype.render = function( ctx ) {
  this[ this.method ]( ctx );
};

PathAction.prototype.move = function( ctx ) {
  var point = this.renderPoints[0];
  ctx.moveTo( point.x, point.y );
};

PathAction.prototype.line = function( ctx ) {
  var point = this.renderPoints[0];
  ctx.lineTo( point.x, point.y );
};

PathAction.prototype.bezier = function( ctx ) {
  var cp0 = this.renderPoints[0];
  var cp1 = this.renderPoints[1];
  var endPoint = this.renderPoints[2];
  ctx.bezierCurveTo( cp0.x, cp0.y, cp1.x, cp1.y, endPoint.x, endPoint.y );
};
