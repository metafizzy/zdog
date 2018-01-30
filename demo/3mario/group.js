/* jshint browser: true, devel: true, unused: true, undef: true */

function Group( properties ) {
  this.shapes = [];
  // extend properties
  for ( var propName in properties ) {
    this[ propName ] = properties[ propName ];
  }

  if ( this.addTo ) {
    this.addTo.push( this );
  }
}

Group.prototype.update = function() {
  var args = arguments;
  var sortValueTotal = 0;
  this.shapes.forEach( function( shape ) {
    shape.update.apply( shape, args );
    sortValueTotal += shape.sortValue;
  });
  this.sortValue = sortValueTotal / this.shapes.length;
};

Group.prototype.render = function() {
  var args = arguments;
  this.shapes.forEach( function( shape ) {
    shape.render.apply( shape, args );
  });
};

Group.prototype.push = function( item ) {
  this.shapes.push( item );
};
