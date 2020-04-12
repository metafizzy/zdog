/**
 * Group
 */

( function( root, factory ) {
  // module definition
  if ( typeof module == 'object' && module.exports ) {
    // CommonJS
    module.exports = factory( require('./anchor') );
  } else {
    // browser global
    var Zdog = root.Zdog;
    Zdog.Group = factory( Zdog.Anchor );
  }
}( this, function factory( Anchor ) {

var Group = Anchor.subclass({
  updateSort: false,
  visible: true,
});

// ----- update ----- //

Group.prototype.updateSortValue = function() {
  var sortValueTotal = 0;
  this.flatGraph.forEach( function( item ) {
    item.updateSortValue();
    sortValueTotal += item.sortValue;
  } );
  // average sort value of all points
  // def not geometrically correct, but works for me
  this.sortValue = sortValueTotal / this.flatGraph.length;

  if ( this.updateSort ) {
    this.flatGraph.sort( Anchor.shapeSorter );
  }
};

// ----- render ----- //

Group.prototype.render = function( ctx, renderer ) {
  if ( !this.visible ) {
    return;
  }

  this.flatGraph.forEach( function( item ) {
    item.render( ctx, renderer );
  } );
};

// actual group flatGraph only used inside group
Group.prototype.updateFlatGraph = function() {
  // do not include self
  var flatGraph = [];
  this.flatGraph = this.addChildFlatGraph( flatGraph );
};

// do not include children, group handles rendering & sorting internally
Group.prototype.getFlatGraph = function() {
  return [ this ];
};

return Group;

} ) );
