/**
 * Anchor
 */

( function( root, factory ) {
  // module definition
  if ( typeof module == 'object' && module.exports ) {
    // CommonJS
    module.exports = factory( require('./boilerplate'), require('./vector'),
        require('./canvas-renderer'), require('./svg-renderer') );
  } else {
    // browser global
    var Zdog = root.Zdog;
    Zdog.Anchor = factory( Zdog, Zdog.Vector, Zdog.CanvasRenderer,
        Zdog.SvgRenderer );
  }
}( this, function factory( utils, Vector, CanvasRenderer, SvgRenderer ) {

var TAU = utils.TAU;
var onePoint = { x: 1, y: 1, z: 1 };

function Anchor( options ) {
  this.create( options || {} );
}

Anchor.prototype.create = function( options ) {
  this.children = [];
  // set defaults & options
  utils.extend( this, this.constructor.defaults );
  this.setOptions( options );

  // transform
  this.translate = new Vector( options.translate );
  this.rotate = new Vector( options.rotate );
  this.scale = new Vector( onePoint ).multiply( this.scale );
  // origin
  this.origin = new Vector();
  this.renderOrigin = new Vector();

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
    if ( optionKeys.indexOf( key ) != -1 ) {
      this[ key ] = options[ key ];
    }
  }
};

Anchor.prototype.addChild = function( shape ) {
  if ( this.children.indexOf( shape ) != -1 ) {
    return;
  }
  shape.remove(); // remove previous parent
  shape.addTo = this; // keep parent reference
  this.children.push( shape );
};

Anchor.prototype.removeChild = function( shape ) {
  var index = this.children.indexOf( shape );
  if ( index != -1 ) {
    this.children.splice( index, 1 );
  }
};

Anchor.prototype.remove = function() {
  if ( this.addTo ) {
    this.addTo.removeChild( this );
  }
};

// ----- update ----- //

Anchor.prototype.update = function() {
  // update self
  this.reset();
  // update children
  this.children.forEach( function( child ) {
    child.update();
  } );
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
  } );
};

Anchor.prototype.updateGraph = function() {
  this.update();
  this.updateFlatGraph();
  this.flatGraph.forEach( function( item ) {
    item.updateSortValue();
  } );
  // z-sort
  this.flatGraph.sort( Anchor.shapeSorter );
};

Anchor.shapeSorter = function( a, b ) {
  return a.sortValue - b.sortValue;
};

// custom getter to check for flatGraph before using it
Object.defineProperty( Anchor.prototype, 'flatGraph', {
  get: function() {
    if ( !this._flatGraph ) {
      this.updateFlatGraph();
    }
    return this._flatGraph;
  },
  set: function( graph ) {
    this._flatGraph = graph;
  },
} );

Anchor.prototype.updateFlatGraph = function() {
  this.flatGraph = this.getFlatGraph();
};

// return Array of self & all child graph items
Anchor.prototype.getFlatGraph = function() {
  var flatGraph = [ this ];
  return this.addChildFlatGraph( flatGraph );
};

Anchor.prototype.addChildFlatGraph = function( flatGraph ) {
  this.children.forEach( function( child ) {
    var childFlatGraph = child.getFlatGraph();
    Array.prototype.push.apply( flatGraph, childFlatGraph );
  } );
  return flatGraph;
};

Anchor.prototype.updateSortValue = function() {
  this.sortValue = this.renderOrigin.z;
};

// ----- render ----- //

Anchor.prototype.render = function() {};

// TODO refactor out CanvasRenderer so its not a dependency within anchor.js
Anchor.prototype.renderGraphCanvas = function( ctx ) {
  if ( !ctx ) {
    throw new Error( 'ctx is ' + ctx + '. ' +
      'Canvas context required for render. Check .renderGraphCanvas( ctx ).' );
  }
  this.flatGraph.forEach( function( item ) {
    item.render( ctx, CanvasRenderer );
  } );
};

Anchor.prototype.renderGraphSvg = function( svg ) {
  if ( !svg ) {
    throw new Error( 'svg is ' + svg + '. ' +
      'SVG required for render. Check .renderGraphSvg( svg ).' );
  }
  this.flatGraph.forEach( function( item ) {
    item.render( svg, SvgRenderer );
  } );
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
  utils.extend( itemOptions, options );
  var ItemClass = this.constructor;
  return new ItemClass( itemOptions );
};

Anchor.prototype.copyGraph = function( options ) {
  var clone = this.copy( options );
  this.children.forEach( function( child ) {
    child.copyGraph({
      addTo: clone,
    });
  } );
  return clone;
};

Anchor.prototype.normalizeRotate = function() {
  this.rotate.x = utils.modulo( this.rotate.x, TAU );
  this.rotate.y = utils.modulo( this.rotate.y, TAU );
  this.rotate.z = utils.modulo( this.rotate.z, TAU );
};

// ----- subclass ----- //

function getSubclass( Super ) {
  return function( defaults ) {
    // create constructor
    function Item( options ) {
      this.create( options || {} );
    }

    Item.prototype = Object.create( Super.prototype );
    Item.prototype.constructor = Item;

    Item.defaults = utils.extend( {}, Super.defaults );
    utils.extend( Item.defaults, defaults );
    // create optionKeys
    Item.optionKeys = Super.optionKeys.slice( 0 );
    // add defaults keys to optionKeys, dedupe
    Object.keys( Item.defaults ).forEach( function( key ) {
      if ( !Item.optionKeys.indexOf( key ) != 1 ) {
        Item.optionKeys.push( key );
      }
    } );

    Item.subclass = getSubclass( Item );

    return Item;
  };
}

Anchor.subclass = getSubclass( Anchor );

return Anchor;

} ) );
