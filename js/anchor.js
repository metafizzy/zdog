// -------------------------- Anchor -------------------------- //

function Anchor( options ) {
  this.create( options );
}

Anchor.prototype.create = function( options ) {
  // set defaults & options
  extend( this, this.constructor.defaults );
  options = options || {};
  this.setOptions( options );

  // transform
  this.translate = new Vector3( options.translate );
  this.rotate = new Vector3( options.rotate );
  // scale
  if ( typeof options.scale == 'number' ) {
    this.scale = Vector3.sanitize( {}, options.scale );
  } else {
    this.scale = Vector3.sanitize( options.scale, 1 );
  }
  this.scale = new Vector3( this.scale );

  // origin
  this.origin = new Vector3();
  this.renderOrigin = new Vector3();
  // children
  this.children = [];
  if ( this.addTo ) {
    this.addTo.addChild( this );
  }
};

Anchor.defaults = {};

Anchor.optionKeys = Object.keys( Anchor.defaults ).concat([
  'rotate',
  'translate',
  'scale',
  'addTo',
]);

Anchor.prototype.setOptions = function( options ) {
  var optionKeys = this.constructor.optionKeys;

  for ( var key in options ) {
    if ( optionKeys.includes( key ) ) {
      this[ key ] = options[ key ];
    }
  }
};

Anchor.prototype.addChild = function( shape ) {
  this.children.push( shape );
};

// ----- update ----- //

Anchor.prototype.update = function() {
  // update self
  this.reset();
  // update children
  this.children.forEach( function( child ) {
    child.update();
  });
  this.transform( this.translate, this.rotate, this.scale );
};

Anchor.prototype.reset = function() {
  this.renderOrigin.set( this.origin );
};

Anchor.prototype.transform = function( translation, rotation, scale ) {
  this.renderOrigin.transform( translation, rotation, scale );
  // transform children
  this.children.forEach( function( child ) {
    child.transform( translation, rotation, scale );
  });
};


Anchor.prototype.updateGraph = function() {
  this.update();
  this.checkFlatGraph();
  this.flatGraph.forEach( function( item ) {
    item.updateSortValue();
  });
  // z-sort
  this.flatGraph.sort( shapeSorter );
};

Anchor.prototype.checkFlatGraph = function() {
  if ( !this.flatGraph ) {
    this.updateFlatGraph();
  }
};

Anchor.prototype.updateFlatGraph = function() {
  this.flatGraph = this.getFlatGraph();
};

// return Array of self & all child graph items
Anchor.prototype.getFlatGraph = function() {
  var flatGraph = [ this ];
  this.children.forEach( function( child ) {
    var childFlatGraph = child.getFlatGraph();
    flatGraph = flatGraph.concat( childFlatGraph );
  });
  return flatGraph;
};

Anchor.prototype.updateSortValue = function() {
  this.sortValue = this.renderOrigin.z;
};

// ----- render ----- //

Anchor.prototype.render = function() {};

Anchor.prototype.renderGraph = function( ctx ) {
  if ( !ctx ) {
    throw new Error( 'ctx is ' + ctx + '. ' +
      'Canvas context required for render. Check .renderGraph( ctx ).' );
  }
  this.checkFlatGraph();
  this.flatGraph.forEach( function( item ) {
    item.render( ctx );
  });
};

// ----- misc ----- //

Anchor.prototype.copy = function( options ) {
  // copy options
  var itemOptions = {};
  var optionKeys = this.constructor.optionKeys;
  optionKeys.forEach( function( key ) {
    itemOptions[ key ] = this[ key ];
  }, this );
  // add set options
  extend( itemOptions, options );
  var ItemClass = this.constructor;
  return new ItemClass( itemOptions );
};

Anchor.prototype.copyGraph = function( options ) {
  var clone = this.copy( options );
  this.children.forEach( function( child ) {
    child.copyGraph({
      addTo: clone,
    });
  });
  return clone;
};

Anchor.prototype.normalizeRotate = function() {
  this.rotate.x = modulo( this.rotate.x, TAU );
  this.rotate.y = modulo( this.rotate.y, TAU );
  this.rotate.z = modulo( this.rotate.z, TAU );
};

// ----- subclass ----- //

function getSubclass( Super ) {
  return function( defaults ) {
    // create constructor
    function Item( options ) {
      this.create( options );
    }

    Item.prototype = Object.create( Super.prototype );
    Item.prototype.constructor = Item;

    Item.defaults = extend( {}, Super.defaults );
    extend( Item.defaults, defaults );
    // create optionKeys
    Item.optionKeys = Super.optionKeys.slice(0);
    // add defaults keys to optionKeys, dedupe
    Object.keys( Item.defaults ).forEach( function( key ) {
      if ( !Item.optionKeys.includes( key ) ) {
        Item.optionKeys.push( key );
      }
    });

    Item.subclass = getSubclass( Item );

    return Item;
  };
}

Anchor.subclass = getSubclass( Anchor );
