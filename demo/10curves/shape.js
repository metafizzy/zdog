/* jshint browser: true, devel: true, unused: true, undef: true */
/* globals Vector3, PathAction */

// -- Shape class -- //

function Shape( properties ) {
  // default
  this.stroke = true;
  this.fill = false;
  this.lineWidth = 1;
  this.closed = true;
  this.rendering = true;
  // extend properties
  for ( var propName in properties ) {
    this[ propName ] = properties[ propName ];
  }

  this.updatePathActions();

  // transform
  this.translate = Vector3.sanitize( this.translate );
  this.rotate = Vector3.sanitize( this.rotate );
  // children
  this.children = [];
  if ( this.addTo ) {
    this.addTo.addChild( this );
    // delete this.addTo; // HACK for perf?
  }
}

// parse path into PathActions
Shape.prototype.updatePathActions = function() {
  if ( !this.path || !this.path.length ) {
    // empty path -> default to single zero point
    this.path = [ {} ];
  }

  this.pathActions = this.path.map( function( pathPart, i ) {
    var method;
    if ( i === 0 ) {
      // first action is alwoys move to
      method = 'move';
    } else {
      // default to lineTo if no action provided
      method = pathPart.action || 'line';
    }
    var points = pathPart.points || [ pathPart ];
    return new PathAction( method, points );
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
  this.transform( this.translate, this.rotate );
};

Shape.prototype.reset = function() {
  // reset pathAction render points
  this.pathActions.forEach( function( pathAction ) {
    pathAction.reset();
  });
};

Shape.prototype.transform = function( translation, rotation ) {
  // transform points
  this.pathActions.forEach( function( pathAction ) {
    pathAction.transform( translation, rotation );
  });
  // transform children
  this.children.forEach( function( child ) {
    child.transform( translation, rotation );
  });
};

Shape.prototype.updateSortValue = function() {
  var sortValueTotal = 0;
  this.pathActions.forEach( function( pathAction ) {
    var renderPoints = pathAction.renderPoints;
    var lastRenderPoint = renderPoints[ renderPoints.length - 1 ];
    sortValueTotal += lastRenderPoint.z;
  });
  // average sort value of all points
  // def not geometrically correct, but works for me
  this.sortValue = sortValueTotal / this.pathActions.length;
};

// ----- render ----- //

Shape.prototype.render = function( ctx ) {
  if ( !this.rendering || !this.pathActions.length ) {
    return;
  }
  // set render properties
  ctx.fillStyle = this.color;
  ctx.strokeStyle = this.color;
  ctx.lineWidth = this.lineWidth;

  // render points
  ctx.beginPath();
  this.pathActions.forEach( function( pathAction ) {
    pathAction.render( ctx );
  });
  // close path
  var isOnePoint = length == 1;
  if ( isOnePoint || this.closed  ) {
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
