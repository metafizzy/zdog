/* jshint browser: true, devel: true, unused: true, undef: true */
/* globals Vector3 */

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
  // default to zero point

  var length = this.points && this.points.length;
  if ( !length ) {
    this.points = [ {} ];
  }
  this.points = this.points || [];
  // convert plain ol' object to Vector3 object
  // points are relative position
  this.points = this.points.map( mapVectorPoint );
  // renderPoint are absolute for rendering
  this.renderPoints = this.points.map( mapVectorPoint );
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

function mapVectorPoint( point ) {
  return new Vector3( point );
}

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
  // reset renderPoints back to orignal points position
  this.renderPoints.forEach( function( renderPoint, i ) {
    var point = this.points[i];
    renderPoint.set( point );
  }, this );
};

Shape.prototype.transform = function( translation, rotation ) {
  // transform points
  this.renderPoints.forEach( function( renderPoint ) {
    renderPoint.rotate( rotation );
    renderPoint.add( translation );
  });
  // transform children
  this.children.forEach( function( child ) {
    child.transform( translation, rotation );
  });
};

Shape.prototype.updateSortValue = function() {
  var sortValueTotal = 0;
  this.renderPoints.forEach( function( point ) {
    sortValueTotal += point.z;
  });
  // average sort value of all points
  // def not geometrically correct, but works for me
  this.sortValue = sortValueTotal / this.points.length;
};

// ----- render ----- //

Shape.prototype.render = function( ctx ) {
  if ( !this.rendering ) {
    return;
  }
  var length = this.points.length;
  if ( !length ) {
    return;
  }
  // set render properties
  ctx.fillStyle = this.color;
  ctx.strokeStyle = this.color;
  ctx.lineWidth = this.lineWidth;

  // render points
  ctx.beginPath();
  this.renderPoints.forEach( function( renderPoint, i ) {
    // moveTo first point, lineTo others
    var renderMethod = i ? 'lineTo' : 'moveTo';
    ctx[ renderMethod ]( renderPoint.x, renderPoint.y );
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
