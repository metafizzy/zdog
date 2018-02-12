/* jshint browser: true, devel: true, unused: true, undef: true */
/* globals Vector3 */

// -- Group class -- //

function Group( options ) {
  this.create( options );
}

Group.prototype.create = function( options ) {
  // set options
  setGroupOptions( this, options );

  // transform
  this.translate = Vector3.sanitize( this.translate );
  this.rotate = Vector3.sanitize( this.rotate );
  // children
  this.children = [];
  if ( this.addTo ) {
    this.addTo.addChild( this );
  }
};

var groupOptionKeys = [
  'rotate',
  'translate',
  'addTo',
];

function setGroupOptions( shape, options ) {
  for ( var key in options ) {
    if ( groupOptionKeys.includes( key ) ) {
      shape[ key ] = options[ key ];
    }
  }
}


Group.prototype.addChild = function( shape ) {
  this.children.push( shape );
};

// ----- update ----- //

Group.prototype.update = function() {
  // update self
  this.reset();
  // update children
  this.children.forEach( function( child ) {
    child.update();
  });
  this.transform( this.translate, this.rotate );
};

Group.prototype.reset = function() {};

Group.prototype.transform = function( translation, rotation ) {
  // transform children
  this.children.forEach( function( child ) {
    child.transform( translation, rotation );
  });
};

Group.prototype.updateSortValue = function() {
  var sortValueTotal = 0;
  this.children.forEach( function( child ) {
    child.updateSortValue();
    sortValueTotal += child.sortValue;
  });
  // TODO sort children?
  // average sort value of all points
  // def not geometrically correct, but works for me
  this.sortValue = sortValueTotal / this.children.length;
};

// ----- render ----- //

Group.prototype.render = function( ctx ) {
  this.children.forEach( function( child ) {
    child.render( ctx );
  });
};

// do not include children, group handles rendering & sorting internally
Group.prototype.getShapes = function() {
  return [ this ];
};

// ----- utils ----- //
