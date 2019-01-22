/* globals Shape: true */

// -------------------------- Shape -------------------------- //

var Shape = Anchor.subclass({
  stroke: true,
  fill: false,
  color: '#333',
  lineWidth: 1,
  closed: true,
  visible: true,
  path: [ {} ],
  front: { z: 1 },
  backface: true,
});

Shape.prototype.create = function( options ) {
  Anchor.prototype.create.call( this, options );
  this.updatePath(); // hook for Rect, Ellipse, & other subclasses
  this.updatePathDirections();

  // front
  this.front = new Vector3( options.front || this.front );
  this.renderFront = new Vector3( this.front );
  this.renderNormal = new Vector3();
};

var actionNames = [
  'move',
  'line',
  'bezier',
  'arc',
];

// place holder for Ellipse, Rect, etc.
Shape.prototype.updatePath = function() {};

// parse path into PathDirections
Shape.prototype.updatePathDirections = function() {
  var previousPoint;
  this.pathDirections = this.path.map( function( pathPart, i ) {
    // pathPart can be just vector coordinates -> { x, y, z }
    // or path instruction -> { arc: [ {x0,y0,z0}, {x1,y1,z1} ] }
    var keys = Object.keys( pathPart );
    var method = keys[0];
    var points = pathPart[ method ];
    // default to line if no instruction
    var isInstruction = keys.length == 1 && actionNames.includes( method );
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
    var direction = new PathDirection( method, points, previousPoint );
    // update previousLastPoint
    previousPoint = direction.endRenderPoint;
    return direction;
  });
};

// ----- update ----- //

Shape.prototype.reset = function() {
  this.renderOrigin.set( this.origin );
  this.renderFront.set( this.front );
  // reset direction render points
  this.pathDirections.forEach( function( direction ) {
    direction.reset();
  });
};

Shape.prototype.transform = function( translation, rotation, scale ) {
  // calculate render points backface visibility & cone/hemisphere shapes
  this.renderOrigin.transform( translation, rotation, scale );
  this.renderFront.transform( translation, rotation, scale );
  this.renderNormal.set( this.renderOrigin ).subtract( this.renderFront );
  // transform points
  this.pathDirections.forEach( function( direction ) {
    direction.transform( translation, rotation, scale );
  });
  // transform children
  this.children.forEach( function( child ) {
    child.transform( translation, rotation, scale );
  });
};


Shape.prototype.updateSortValue = function() {
  var sortValueTotal = 0;
  this.pathDirections.forEach( function( direction ) {
    sortValueTotal += direction.endRenderPoint.z;
  });
  // average sort value of all points
  // def not geometrically correct, but works for me
  this.sortValue = sortValueTotal / this.pathDirections.length;
};

// ----- render ----- //

Shape.prototype.render = function( ctx ) {
  var length = this.pathDirections.length;
  if ( !this.visible || !length ) {
    return;
  }
  // do not render if hiding backface
  this.isFacingBack = this.renderNormal.z > 0;
  if ( !this.backface && this.isFacingBack ) {
    return;
  }
  // render dot or path
  var isDot = length == 1;
  if ( isDot ) {
    this.renderDot( ctx );
  } else {
    this.renderPath( ctx );
  }
};

// Safari does not render lines with no size, have to render circle instead
Shape.prototype.renderDot = function( ctx ) {
  ctx.fillStyle = this.getRenderColor();
  var point = this.pathDirections[0].endRenderPoint;
  ctx.beginPath();
  var radius = this.lineWidth/2;
  ctx.arc( point.x, point.y, radius, 0, TAU );
  ctx.fill();
};

Shape.prototype.getRenderColor = function() {
  // use backface color if applicable
  var isBackfaceColor = typeof this.backface == 'string' && this.isFacingBack;
  var color = isBackfaceColor ? this.backface : this.color;
  return color;
};

Shape.prototype.renderPath = function( ctx ) {
  // set render properties
  var color = this.getRenderColor();
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.lineWidth = this.lineWidth;

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
};
