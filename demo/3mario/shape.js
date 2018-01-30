/* jshint browser: true, devel: true, unused: true, undef: true */
/* globals Vector3 */

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

  if ( this.addTo ) {
    this.addTo.push( this );
  }

}

Shape.prototype.update = function( rotation ) {
  var sortValueTotal = 0;
  this.points.forEach( function( point ) {
    point.update( rotation );
    sortValueTotal += point.renderPosition.z;
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
  // close path by return to first point
  var length = this.points.length;
  var isOnePoint = length == 1;
  var isClosed = this.closed && length > 2;
  if ( isOnePoint || isClosed ) {
    position = this.points[0].renderPosition;
    ctx.lineTo( position.x, position.y );
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
