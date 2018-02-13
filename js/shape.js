/* jshint browser: true, devel: true, unused: true, undef: true */
/* globals Vector3, PathAction, TAU */

// -------------------------- Shape -------------------------- //

function Shape( options ) {
  this.create( options );
}

Shape.prototype.create = function( options ) {
  // default
  extend( this, Shape.defaults );
  // set options
  setOptions( this, options );

  this.updatePathActions();

  // transform
  this.translate = Vector3.sanitize( this.translate );
  this.rotate = Vector3.sanitize( this.rotate );
  this.scale = extend( { x: 1, y: 1, z: 1 }, this.scale );
  this.scale = Vector3.sanitize( this.scale );
  // children
  this.children = [];
  if ( this.addTo ) {
    this.addTo.addChild( this );
  }
};

Shape.defaults = {
  stroke: true,
  fill: false,
  color: 'black',
  lineWidth: 1,
  closed: true,
  rendering: true,
  path: [ {} ],
};

var optionKeys = Object.keys( Shape.defaults ).concat([
  'rotate',
  'translate',
  'scale',
  'addTo',
  'width',
  'height',
]);

function setOptions( shape, options ) {
  for ( var key in options ) {
    if ( optionKeys.includes( key ) ) {
      shape[ key ] = options[ key ];
    }
  }
}

var actionNames = [
  'move',
  'line',
  'bezier',
  'arc',
];

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

Shape.prototype.addChild = function( shape ) {
  this.children.push( shape );
};

// ----- update ----- //

Shape.prototype.update = function() {
  // update self
  this.reset();
  // update children
  this.children.forEach( function( child ) {
    child.update();
  });
  this.transform( this.translate, this.rotate, this.scale );
};

Shape.prototype.reset = function() {
  // reset pathAction render points
  this.pathActions.forEach( function( pathAction ) {
    pathAction.reset();
  });
};

Shape.prototype.transform = function( translation, rotation, scale ) {
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

// return Array of self & all child shapes
Shape.prototype.getShapes = function() {
  var shapes = [ this ];
  this.children.forEach( function( child ) {
    var childShapes = child.getShapes();
    shapes = shapes.concat( childShapes );
  });
  return shapes;
};

Shape.prototype.copy = function( options ) {
  // copy options
  var shapeOptions = {};
  optionKeys.forEach( function( key ) {
    shapeOptions[ key ] = this[ key ];
  }, this );
  // add set options
  setOptions( shapeOptions, options );
  var ShapeClass = this.constructor;
  return new ShapeClass( shapeOptions );
};


// ----- utils ----- //

function extend( a, b ) {
  for ( var prop in b ) {
    a[ prop ] = b[ prop ];
  }
  return a;
}
