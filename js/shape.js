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
  this.translate = new Vector3( options.translate );
  this.rotate = new Vector3( options.rotate );
  var scale = extend( { x: 1, y: 1, z: 1 }, options.scale );
  this.scale = new Vector3( scale );
  // origin & front
  this.origin = new Vector3();
  this.front = new Vector3( options.front || this.front );
  this.renderOrigin = new Vector3();
  this.renderFront = new Vector3( this.front );
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
  front: { z: -1 },
};

var optionKeys = Object.keys( Shape.defaults ).concat([
  'rotate',
  'translate',
  'scale',
  'front',
  'addTo',
  'width',
  'height',
  'backfaceHidden',
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
  this.renderOrigin.set( this.origin );
  this.renderFront.set( this.front );
  // reset pathAction render points
  this.pathActions.forEach( function( pathAction ) {
    pathAction.reset();
  });
};

Shape.prototype.transform = function( translation, rotation, scale ) {
  // TODO, only transform these if backfaceHidden for perf?
  this.renderOrigin.transform( translation, rotation, scale );
  this.renderFront.transform( translation, rotation, scale );
  // transform points
  this.pathActions.forEach( function( pathAction ) {
    pathAction.transform( translation, rotation, scale );
  });
  // transform children
  this.children.forEach( function( child ) {
    child.transform( translation, rotation, scale );
  });
};


Shape.prototype.updateScene = function() {
  this.update();
  this.checkFlatGraph();
  this.flatGraph.forEach( function( item ) {
    item.updateSortValue();
  });
  // perspective sort
  this.flatGraph.sort( function( a, b ) {
    return b.sortValue - a.sortValue;
  });
};

Shape.prototype.checkFlatGraph = function() {
  if ( !this.flatGraph ) {
    this.updateFlatGraph();
  }
};

Shape.prototype.updateFlatGraph = function() {
  this.flatGraph = this.getFlatGraph();
};

// return Array of self & all child graph items
Shape.prototype.getFlatGraph = function() {
  var flatGraph = [ this ];
  this.children.forEach( function( child ) {
    var childFlatGraph = child.getFlatGraph();
    flatGraph = flatGraph.concat( childFlatGraph );
  });
  return flatGraph;
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
  // hide backface
  var isFacingBack = this.renderFront.z > this.renderOrigin.z;
  if ( this.backfaceHidden && isFacingBack ) {
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

Shape.prototype.renderScene = function( ctx ) {
  this.checkFlatGraph();
  this.flatGraph.forEach( function( item ) {
    item.render( ctx );
  });
};

// ----- misc ----- //

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

Shape.prototype.normalizeRotate = function() {
  this.rotate.x = modulo( this.rotate.x, TAU );
  this.rotate.y = modulo( this.rotate.y, TAU );
  this.rotate.z = modulo( this.rotate.z, TAU );
};
