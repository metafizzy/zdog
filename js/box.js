/**
 * Box composite shape
 */

( function( root, factory ) {
  // module definition
  if ( typeof module == 'object' && module.exports ) {
    // CommonJS
    module.exports = factory( require('./boilerplate'), require('./anchor'),
        require('./shape'), require('./rect') );
  } else {
    // browser global
    var Zdog = root.Zdog;
    Zdog.Box = factory( Zdog, Zdog.Anchor, Zdog.Shape, Zdog.Rect );
  }
}( this, function factory( utils, Anchor, Shape, Rect ) {

// ----- BoxRect ----- //

var BoxRect = Rect.subclass();
// prevent double-creation in parent.copyGraph()
// only create in Box.create()
BoxRect.prototype.copyGraph = function() {};

// ----- Box ----- //

var TAU = utils.TAU;
var faceNames = [
  'frontFace',
  'rearFace',
  'leftFace',
  'rightFace',
  'topFace',
  'bottomFace',
];

var boxDefaults = utils.extend( {}, Shape.defaults );
delete boxDefaults.path;
faceNames.forEach( function( faceName ) {
  boxDefaults[ faceName ] = true;
} );
utils.extend( boxDefaults, {
  width: 1,
  height: 1,
  depth: 1,
  fill: true,
} );

var Box = Anchor.subclass( boxDefaults );

/* eslint-disable no-self-assign */
Box.prototype.create = function( options ) {
  Anchor.prototype.create.call( this, options );
  this.updatePath();
  // HACK reset fill to trigger face setter
  this.fill = this.fill;
};

Box.prototype.updatePath = function() {
  // reset all faces to trigger setters
  faceNames.forEach( function( faceName ) {
    this[ faceName ] = this[ faceName ];
  }, this );
};
/* eslint-enable no-self-assign */

faceNames.forEach( function( faceName ) {
  var _faceName = '_' + faceName;
  Object.defineProperty( Box.prototype, faceName, {
    get: function() {
      return this[ _faceName ];
    },
    set: function( value ) {
      this[ _faceName ] = value;
      this.setFace( faceName, value );
    },
  } );
} );

Box.prototype.setFace = function( faceName, value ) {
  var rectProperty = faceName + 'Rect';
  var rect = this[ rectProperty ];
  // remove if false
  if ( !value ) {
    this.removeChild( rect );
    return;
  }
  // update & add face
  var options = this.getFaceOptions( faceName );
  options.color = typeof value == 'string' ? value : this.color;

  if ( rect ) {
    // update previous
    rect.setOptions( options );
  } else {
    // create new
    rect = this[ rectProperty ] = new BoxRect( options );
  }
  rect.updatePath();
  this.addChild( rect );
};

Box.prototype.getFaceOptions = function( faceName ) {
  return {
    frontFace: {
      width: this.width,
      height: this.height,
      translate: { z: this.depth / 2 },
    },
    rearFace: {
      width: this.width,
      height: this.height,
      translate: { z: -this.depth / 2 },
      rotate: { y: TAU/2 },
    },
    leftFace: {
      width: this.depth,
      height: this.height,
      translate: { x: -this.width / 2 },
      rotate: { y: -TAU/4 },
    },
    rightFace: {
      width: this.depth,
      height: this.height,
      translate: { x: this.width / 2 },
      rotate: { y: TAU/4 },
    },
    topFace: {
      width: this.width,
      height: this.depth,
      translate: { y: -this.height / 2 },
      rotate: { x: -TAU/4 },
    },
    bottomFace: {
      width: this.width,
      height: this.depth,
      translate: { y: this.height / 2 },
      rotate: { x: TAU/4 },
    },
  }[ faceName ];
};

// ----- set face properties ----- //

var childProperties = [ 'color', 'stroke', 'fill', 'backface', 'front',
  'visible' ];
childProperties.forEach( function( property ) {
  // use proxy property for custom getter & setter
  var _prop = '_' + property;
  Object.defineProperty( Box.prototype, property, {
    get: function() {
      return this[ _prop ];
    },
    set: function( value ) {
      this[ _prop ] = value;
      faceNames.forEach( function( faceName ) {
        var rect = this[ faceName + 'Rect' ];
        var isFaceColor = typeof this[ faceName ] == 'string';
        var isColorUnderwrite = property == 'color' && isFaceColor;
        if ( rect && !isColorUnderwrite ) {
          rect[ property ] = value;
        }
      }, this );
    },
  } );
} );

return Box;

} ) );
