function BGShape() {
  return Shape.apply( this, arguments );
}

BGShape.prototype = Object.create( Shape.prototype );

BGShape.prototype.render = function() {
  if ( this.sortValue < 0 ) {
    return;
  }
  Shape.prototype.render.apply( this, arguments );
};
