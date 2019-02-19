/**
 * PathCommand
 */

( function( root, factory ) {
  // universal module definition
  /* globals define, module, require */
  if ( typeof define == 'function' && define.amd ) {
    // AMD
    define( [ './vector' ], factory );
  } else if ( typeof module == 'object' && module.exports ) {
    // CommonJS
    module.exports = factory( require('./vector') );
  } else {
    // browser global
    var Zdog = root.Zdog;
    Zdog.PathCommand = factory( Zdog.Vector );
  }
}( this, function factory( Vector ) {

function PathCommand( method, points, previousPoint ) {
  this.method = method;
  this.points = points.map( mapVectorPoint );
  this.renderPoints = points.map( mapVectorPoint );
  this.previousPoint = previousPoint;
  this.endRenderPoint = this.renderPoints[ this.renderPoints.length - 1 ];
  // arc actions come with previous point & corner point
  // but require bezier control points
  if ( method == 'arc' ) {
    this.controlPoints = [ new Vector(), new Vector() ];
  }
}

function mapVectorPoint( point ) {
  return new Vector( point );
}

PathCommand.prototype.reset = function() {
  // reset renderPoints back to orignal points position
  var points = this.points;
  this.renderPoints.forEach( function( renderPoint, i ) {
    var point = points[i];
    renderPoint.set( point );
  });
};

PathCommand.prototype.transform = function( translation, rotation, scale ) {
  this.renderPoints.forEach( function( renderPoint ) {
    renderPoint.transform( translation, rotation, scale );
  });
};

PathCommand.prototype.render = function( ctx ) {
  this[ this.method ]( ctx );
};

PathCommand.prototype.move = function( ctx ) {
  var point = this.renderPoints[0];
  ctx.moveTo( point.x, point.y );
};

PathCommand.prototype.line = function( ctx ) {
  var point = this.renderPoints[0];
  ctx.lineTo( point.x, point.y );
};

PathCommand.prototype.bezier = function( ctx ) {
  var cp0 = this.renderPoints[0];
  var cp1 = this.renderPoints[1];
  var end = this.renderPoints[2];
  ctx.bezierCurveTo( cp0.x, cp0.y, cp1.x, cp1.y, end.x, end.y );
};

PathCommand.prototype.arc = function( ctx ) {
  var prev = this.previousPoint;
  var corner = this.renderPoints[0];
  var end = this.renderPoints[1];
  var cp0 = this.controlPoints[0];
  var cp1 = this.controlPoints[1];
  cp0.set( prev ).lerp( corner, 9/16 );
  cp1.set( end ).lerp( corner, 9/16 );
  ctx.bezierCurveTo( cp0.x, cp0.y, cp1.x, cp1.y, end.x, end.y );
};

PathCommand.prototype.renderSvg = function() {
  return this[ this.method + 'Svg' ]();
};

PathCommand.prototype.moveSvg = function() {
  var point = this.renderPoints[0];
  return 'M' + point.x + ',' + point.y;
};

PathCommand.prototype.lineSvg = function() {
  var point = this.renderPoints[0];
  return 'L' + point.x + ',' + point.y;
};

PathCommand.prototype.bezierSvg = function() {
  var cp0 = this.renderPoints[0];
  var cp1 = this.renderPoints[1];
  var end = this.renderPoints[2];
  return 'C' + [ cp0.x, cp0.y, cp1.x, cp1.y, end.x, end.y ].join(' ');
};

PathCommand.prototype.arcSvg = function() {
  var prev = this.previousPoint;
  var corner = this.renderPoints[0];
  var end = this.renderPoints[1];
  var cp0 = this.controlPoints[0];
  var cp1 = this.controlPoints[1];
  cp0.set( prev ).lerp( corner, 9/16 );
  cp1.set( end ).lerp( corner, 9/16 );
  return 'C' + [ cp0.x, cp0.y, cp1.x, cp1.y, end.x, end.y ].join(' ');
};

return PathCommand;

}));
