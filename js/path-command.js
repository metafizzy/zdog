/**
 * PathCommand
 */

( function( root, factory ) {
  // module definition
  if ( typeof module == 'object' && module.exports ) {
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
  this.renderPoints = points.map( mapNewVector );
  this.previousPoint = previousPoint;
  this.endRenderPoint = this.renderPoints[ this.renderPoints.length - 1 ];
  // arc actions come with previous point & corner point
  // but require bezier control points
  if ( method == 'arc' ) {
    this.controlPoints = [ new Vector(), new Vector() ];
  }
}

function mapVectorPoint( point ) {
  if ( point instanceof Vector ) {
    return point;
  } else {
    return new Vector( point );
  }
}

function mapNewVector( point ) {
  return new Vector( point );
}

PathCommand.prototype.reset = function() {
  // reset renderPoints back to orignal points position
  var points = this.points;
  this.renderPoints.forEach( function( renderPoint, i ) {
    var point = points[i];
    renderPoint.set( point );
  } );
};

PathCommand.prototype.transform = function( translation, rotation, scale ) {
  this.renderPoints.forEach( function( renderPoint ) {
    renderPoint.transform( translation, rotation, scale );
  } );
};

PathCommand.prototype.render = function( ctx, elem, renderer ) {
  return this[ this.method ]( ctx, elem, renderer );
};

PathCommand.prototype.move = function( ctx, elem, renderer ) {
  return renderer.move( ctx, elem, this.renderPoints[0] );
};

PathCommand.prototype.line = function( ctx, elem, renderer ) {
  return renderer.line( ctx, elem, this.renderPoints[0] );
};

PathCommand.prototype.bezier = function( ctx, elem, renderer ) {
  var cp0 = this.renderPoints[0];
  var cp1 = this.renderPoints[1];
  var end = this.renderPoints[2];
  return renderer.bezier( ctx, elem, cp0, cp1, end );
};

var arcHandleLength = 9/16;

PathCommand.prototype.arc = function( ctx, elem, renderer ) {
  var prev = this.previousPoint;
  var corner = this.renderPoints[0];
  var end = this.renderPoints[1];
  var cp0 = this.controlPoints[0];
  var cp1 = this.controlPoints[1];
  cp0.set( prev ).lerp( corner, arcHandleLength );
  cp1.set( end ).lerp( corner, arcHandleLength );
  return renderer.bezier( ctx, elem, cp0, cp1, end );
};

return PathCommand;

} ) );
