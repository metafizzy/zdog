/* jshint browser: true, devel: true, unused: true, undef: true */
/* globals Vector3 */

function PathAction( method, points, previousPoint ) {
  this.method = method;
  this.points = points.map( mapVectorPoint );
  this.renderPoints = points.map( mapVectorPoint );
  this.previousPoint = previousPoint;
  // arc actions come with previous point & corner point
  // but require bezier control points
  if ( method == 'arc' ) {
    this.controlPoints = [ new Vector3(), new Vector3() ];
  }
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
  var end = this.renderPoints[2];
  ctx.bezierCurveTo( cp0.x, cp0.y, cp1.x, cp1.y, end.x, end.y );
};

PathAction.prototype.arc = function( ctx ) {
  var prev = this.previousPoint;
  var corner = this.renderPoints[0];
  var end = this.renderPoints[1];
  var cp0 = this.controlPoints[0];
  var cp1 = this.controlPoints[1];
  cp0.set( prev ).lerp( corner, 9/16 );
  cp1.set( end ).lerp( corner, 9/16 );
  ctx.bezierCurveTo( cp0.x, cp0.y, cp1.x, cp1.y, end.x, end.y );
};
