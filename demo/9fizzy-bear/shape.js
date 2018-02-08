/* jshint browser: true, devel: true, unused: true, undef: true */
/* globals Point, Vector3 */

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
  // convert plain ol' object to Point object
  this.points = this.points.map( function( position ) {
    return new Point( position );
  });
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
  this.points.forEach( resetEach );
};

function resetEach( item ) {
  item.reset();
}

Shape.prototype.transform = function( translation, rotation ) {
  // transform points
  this.points.forEach( function( point ) {
    point.rotate( rotation );
    point.translate( translation );
  });
  // transform children
  this.children.forEach( function( child ) {
    child.transform( translation, rotation );
  });
};

Shape.prototype.updateSortValue = function() {
  var sortValueTotal = 0;
  this.points.forEach( function( point ) {
    sortValueTotal += point.renderPosition.z;
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
  ctx.lineCap = 'round';

  // render points
  ctx.beginPath();
  var position;
  this.points.forEach( function( point, i ) {
    // moveTo first point, lineTo others
    var renderMethod = i ? 'lineTo' : 'moveTo';
    position = point.renderPosition;
    ctx[ renderMethod ]( position.x, position.y );
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
