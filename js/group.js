// -------------------------- Group -------------------------- //

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
  'updateSort',
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

Group.prototype.update = Shape.prototype.update;

Group.prototype.reset = function() {};

Group.prototype.transform = function( translation, rotation, scale ) {
  // transform children
  this.children.forEach( function( child ) {
    child.transform( translation, rotation, scale );
  });
};

Group.prototype.updateSortValue = function() {
  var sortValueTotal = 0;
  this.checkFlatGraph();
  this.flatGraph.forEach( function( item ) {
    item.updateSortValue();
    sortValueTotal += item.sortValue;
  });
  // average sort value of all points
  // def not geometrically correct, but works for me
  this.sortValue = sortValueTotal / this.flatGraph.length;

  if ( this.updateSort ) {
    this.flatGraph.sort( function( a, b ) {
      return b.sortValue - a.sortValue;
    });
  }
};

// ----- render ----- //

Group.prototype.render = function( ctx ) {
  this.checkFlatGraph();
  this.flatGraph.forEach( function( item ) {
    item.render( ctx );
  });
};

// do not include children, group handles rendering & sorting internally
Group.prototype.getFlatGraph = function() {
  return [ this ];
};


Group.prototype.checkFlatGraph = function() {
  if ( !this.flatGraph ) {
    this.updateFlatGraph();
  }
};

Group.prototype.updateFlatGraph = function() {
  this.flatGraph = this.getChildFlatGraph();
};

// get flat graph only used for group
// do not include in parent flatGraphs
Group.prototype.getChildFlatGraph = function() {
  // do not include self
  var flatGraph = [];
  this.children.forEach( function( child ) {
    var childFlatGraph = child.getFlatGraph();
    flatGraph = flatGraph.concat( childFlatGraph );
  });
  return flatGraph;
};
