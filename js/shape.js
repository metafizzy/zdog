/* globals Shape: true */

// -------------------------- Shape -------------------------- //

var Shape = Anchor.subclass({
  stroke: true,
  fill: false,
  color: '#333',
  lineWidth: 1,
  closed: true,
  rendering: true,
  path: [ {} ],
  front: { z: 1 },
  backfaceVisible: true,
});

Shape.prototype.create = function( options ) {
  Anchor.prototype.create.call( this, options );
  this.updatePath(); // hook for Rect, Ellipse, & other subclasses
  this.updatePathActions();

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

// parse path into PathActions
Shape.prototype.updatePathActions = function() {
  var previousPoint;
  this.pathActions = this.path.map( function( pathPart, i ) {
    // pathPart can be just vector coordinates -> { x, y, z }
    // or path instruction -> { arc: [ {x0,y0,z0}, {x1,y1,z1} ] }
    var keys = Object.keys( pathPart );
    var method = keys[0];
    var points = pathPart[ method ];
    var isInstruction = keys.length === 1 && actionNames.includes( method ) &&
      Array.isArray( points );

    if ( !isInstruction ) {
      method = 'line';
      points = [ pathPart ];
    }

    // first action is always move
    method = i === 0 ? 'move' : method;
    // arcs require previous last point
    var pathAction = new PathAction( method, points, previousPoint );
    // update previousLastPoint
    previousPoint = pathAction.endRenderPoint;
    return pathAction;
  });
};

// ----- update ----- //

Shape.prototype.reset = function() {
  this.renderOrigin.set( this.origin );
  this.renderFront.set( this.front );
  // reset pathAction render points
  this.pathActions.forEach( function( pathAction ) {
    pathAction.reset();
  });
};

Shape.prototype.transform = function( translation, rotation, scale ) {
  // calculate render points backface visibility & cone/hemisphere shapes
  this.renderOrigin.transform( translation, rotation, scale );
  this.renderFront.transform( translation, rotation, scale );
  this.renderNormal.set( this.renderOrigin ).subtract( this.renderFront );
  // transform points
  this.pathActions.forEach( function( pathAction ) {
    pathAction.transform( translation, rotation, scale );
  });
  // transform children
  this.children.forEach( function( child ) {
    child.transform( translation, rotation, scale );
  });
};


Shape.prototype.updateSortValue = function() {
  var sortValueTotal = 0;
  this.pathActions.forEach( function( pathAction ) {
    sortValueTotal += pathAction.endRenderPoint.z;
  });
  // average sort value of all points
  // def not geometrically correct, but works for me
  this.sortValue = sortValueTotal / this.pathActions.length;
};

// ----- render ----- //

Shape.prototype.render = function( ctx ) {
  var length = this.pathActions.length;
  if ( !this.rendering || !length ) {
    return;
  }
  // do not render if hiding backface
  var isFacingBack = this.renderNormal.z > 0;
  if ( !this.backfaceVisible && isFacingBack ) {
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
  ctx.fillStyle = this.color;
  var point = this.pathActions[0].endRenderPoint;
  ctx.beginPath();
  var radius = this.lineWidth/2;
  ctx.arc( point.x, point.y, radius, 0, TAU );
  ctx.fill();
};

Shape.prototype.renderPath = function( ctx ) {
  // set render properties
  ctx.fillStyle = this.color;
  ctx.strokeStyle = this.color;
  ctx.lineWidth = this.lineWidth;

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
};
