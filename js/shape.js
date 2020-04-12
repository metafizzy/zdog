/**
 * Shape
 */

( function( root, factory ) {
  // module definition
  if ( typeof module == 'object' && module.exports ) {
    // CommonJS
    module.exports = factory( require('./boilerplate'), require('./vector'),
        require('./path-command'), require('./anchor') );
  } else {
    // browser global
    var Zdog = root.Zdog;
    Zdog.Shape = factory( Zdog, Zdog.Vector, Zdog.PathCommand, Zdog.Anchor );
  }
}( this, function factory( utils, Vector, PathCommand, Anchor ) {

var Shape = Anchor.subclass({
  stroke: 1,
  fill: false,
  color: '#333',
  closed: true,
  visible: true,
  path: [ {} ],
  front: { z: 1 },
  backface: true,
});

Shape.prototype.create = function( options ) {
  Anchor.prototype.create.call( this, options );
  this.updatePath();
  // front
  this.front = new Vector( options.front || this.front );
  this.renderFront = new Vector( this.front );
  this.renderNormal = new Vector();
};

var actionNames = [
  'move',
  'line',
  'bezier',
  'arc',
];

Shape.prototype.updatePath = function() {
  this.setPath();
  this.updatePathCommands();
};

// place holder for Ellipse, Rect, etc.
Shape.prototype.setPath = function() {};

// parse path into PathCommands
Shape.prototype.updatePathCommands = function() {
  var previousPoint;
  this.pathCommands = this.path.map( function( pathPart, i ) {
    // pathPart can be just vector coordinates -> { x, y, z }
    // or path instruction -> { arc: [ {x0,y0,z0}, {x1,y1,z1} ] }
    var keys = Object.keys( pathPart );
    var method = keys[0];
    var points = pathPart[ method ];
    // default to line if no instruction
    var isInstruction = keys.length == 1 && actionNames.indexOf( method ) != -1;
    if ( !isInstruction ) {
      method = 'line';
      points = pathPart;
    }
    // munge single-point methods like line & move without arrays
    var isLineOrMove = method == 'line' || method == 'move';
    var isPointsArray = Array.isArray( points );
    if ( isLineOrMove && !isPointsArray ) {
      points = [ points ];
    }

    // first action is always move
    method = i === 0 ? 'move' : method;
    // arcs require previous last point
    var command = new PathCommand( method, points, previousPoint );
    // update previousLastPoint
    previousPoint = command.endRenderPoint;
    return command;
  } );
};

// ----- update ----- //

Shape.prototype.reset = function() {
  this.renderOrigin.set( this.origin );
  this.renderFront.set( this.front );
  // reset command render points
  this.pathCommands.forEach( function( command ) {
    command.reset();
  } );
};

Shape.prototype.transform = function( translation, rotation, scale ) {
  // calculate render points backface visibility & cone/hemisphere shapes
  this.renderOrigin.transform( translation, rotation, scale );
  this.renderFront.transform( translation, rotation, scale );
  this.renderNormal.set( this.renderOrigin ).subtract( this.renderFront );
  // transform points
  this.pathCommands.forEach( function( command ) {
    command.transform( translation, rotation, scale );
  } );
  // transform children
  this.children.forEach( function( child ) {
    child.transform( translation, rotation, scale );
  } );
};

Shape.prototype.updateSortValue = function() {
  // sort by average z of all points
  // def not geometrically correct, but works for me
  var pointCount = this.pathCommands.length;
  var firstPoint = this.pathCommands[0].endRenderPoint;
  var lastPoint = this.pathCommands[ pointCount - 1 ].endRenderPoint;
  // ignore the final point if self closing shape
  var isSelfClosing = pointCount > 2 && firstPoint.isSame( lastPoint );
  if ( isSelfClosing ) {
    pointCount -= 1;
  }

  var sortValueTotal = 0;
  for ( var i = 0; i < pointCount; i++ ) {
    sortValueTotal += this.pathCommands[i].endRenderPoint.z;
  }
  this.sortValue = sortValueTotal/pointCount;
};

// ----- render ----- //

Shape.prototype.render = function( ctx, renderer ) {
  var length = this.pathCommands.length;
  if ( !this.visible || !length ) {
    return;
  }
  // do not render if hiding backface
  this.isFacingBack = this.renderNormal.z > 0;
  if ( !this.backface && this.isFacingBack ) {
    return;
  }
  if ( !renderer ) {
    throw new Error( 'Zdog renderer required. Set to ' + renderer );
  }
  // render dot or path
  var isDot = length == 1;
  if ( renderer.isCanvas && isDot ) {
    this.renderCanvasDot( ctx, renderer );
  } else {
    this.renderPath( ctx, renderer );
  }
};

var TAU = utils.TAU;
// Safari does not render lines with no size, have to render circle instead
Shape.prototype.renderCanvasDot = function( ctx ) {
  var lineWidth = this.getLineWidth();
  if ( !lineWidth ) {
    return;
  }
  ctx.fillStyle = this.getRenderColor();
  var point = this.pathCommands[0].endRenderPoint;
  ctx.beginPath();
  var radius = lineWidth/2;
  ctx.arc( point.x, point.y, radius, 0, TAU );
  ctx.fill();
};

Shape.prototype.getLineWidth = function() {
  if ( !this.stroke ) {
    return 0;
  }
  if ( this.stroke == true ) {
    return 1;
  }
  return this.stroke;
};

Shape.prototype.getRenderColor = function() {
  // use backface color if applicable
  var isBackfaceColor = typeof this.backface == 'string' && this.isFacingBack;
  var color = isBackfaceColor ? this.backface : this.color;
  return color;
};

Shape.prototype.renderPath = function( ctx, renderer ) {
  var elem = this.getRenderElement( ctx, renderer );
  var isTwoPoints = this.pathCommands.length == 2 &&
    this.pathCommands[1].method == 'line';
  var isClosed = !isTwoPoints && this.closed;
  var color = this.getRenderColor();

  renderer.renderPath( ctx, elem, this.pathCommands, isClosed );
  renderer.stroke( ctx, elem, this.stroke, color, this.getLineWidth() );
  renderer.fill( ctx, elem, this.fill, color );
  renderer.end( ctx, elem );
};

var svgURI = 'http://www.w3.org/2000/svg';

Shape.prototype.getRenderElement = function( ctx, renderer ) {
  if ( !renderer.isSvg ) {
    return;
  }
  if ( !this.svgElement ) {
    // create svgElement
    this.svgElement = document.createElementNS( svgURI, 'path' );
    this.svgElement.setAttribute( 'stroke-linecap', 'round' );
    this.svgElement.setAttribute( 'stroke-linejoin', 'round' );
  }
  return this.svgElement;
};

return Shape;

} ) );
