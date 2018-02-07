// x, y, z
// renderPosition: { x, y, z }

function Point( position ) {
  this.set( position );
  this.renderPosition = new Vector3( position );
}

// inherit from Vector3 for x, y, z
Point.prototype = Object.create( Vector3.prototype );

Point.prototype.reset = function() {
  // reset render position back to absolute position
  this.renderPosition.set( this );
};

Point.prototype.rotate = function( rotation ) {
  this.renderPosition.rotate( rotation );
};

Point.prototype.translate = function( translation ) {
  this.renderPosition.add( translation );
};
