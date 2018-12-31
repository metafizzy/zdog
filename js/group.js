/* globals Group: true */

// -------------------------- Group -------------------------- //

var Group = Anchor.subclass({
  updateSort: false,
  rendering: true,
});

// ----- update ----- //

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
    this.flatGraph.sort( shapeSorter );
  }
};

// ----- render ----- //

Group.prototype.render = function( ctx ) {
  if ( !this.rendering ) {
    return;
  }

  this.checkFlatGraph();
  this.flatGraph.forEach( function( item ) {
    item.render( ctx );
  });
};

// do not include children, group handles rendering & sorting internally
Group.prototype.getFlatGraph = function() {
  return [ this ];
};

// get flat graph only used for group
// do not include in parent flatGraphs
Group.prototype.updateFlatGraph = function() {
  // do not include self
  var flatGraph = [];
  this.children.forEach( function( child ) {
    var childFlatGraph = child.getFlatGraph();
    flatGraph = flatGraph.concat( childFlatGraph );
  });
  this.flatGraph = flatGraph;
};
