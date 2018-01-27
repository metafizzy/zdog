/* jshint browser: true, devel: true, unused: true, undef: true */
/* globals Vector3, shapes */

// -- Shape class -- //



function Shape( properties ) {
  // default
  this.stroke = true;
  this.fill = false;
  this.lineWidth = 1;
  this.closed = true;
  // extend properties
  for ( var propName in properties ) {
    this[ propName ] = properties[ propName ];
  }
  // convert plain ol' object to Vector3 object
  this.points = this.points.map( function( point ) {
    return new Vector3( point.x, point.y, point.z );
  });

  // add to collection
  shapes.push( this );
}

Shape.prototype.update = function( angleX, angleY, angleZ ) {
  var sortValueTotal = 0;
  this.points.forEach( function( point ) {
    point.update( angleX, angleY, angleZ );
    sortValueTotal += point.renderZ;
  });

  // average sort value of all points
  // def not geometrically correct, but works for me
  this.sortValue = sortValueTotal / this.points.length;
};

Shape.prototype.render = function( ctx ) {
  // set default color
  ctx.fillStyle = this.color;
  ctx.strokeStyle = this.color;
  // set any render properties
  ctx.lineWidth = this.lineWidth;
  if ( this.lineCap ) {
    ctx.lineCap = this.lineCap;
  }

  // render points
  ctx.beginPath();
  this.points.forEach( function( point, i ) {
    // moveTo first point, lineTo others
    var renderMethod = i ? 'lineTo' : 'moveTo';
    ctx[ renderMethod ]( point.renderX, point.renderY );
    // console.log( renderMethod, point.renderX, point.renderY );
  });
  // close path by return to first point
  var length = this.points.length;
  var isOnePoint = length == 1;
  var isClosed = this.closed && length > 2;
  if ( isOnePoint || isClosed ) {
    var point0 = this.points[0];
    ctx.lineTo( point0.renderX, point0.renderY );
  }
  if ( this.stroke ) {
    ctx.stroke();
  }
  if ( this.fill ) {
    ctx.fill();
  }
  // debugger;
  ctx.closePath();
};
