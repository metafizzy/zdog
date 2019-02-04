/**
 * Box composite shape
 */

( function( root, factory ) {
  // universal module definition
  var depends = [ './utils', './anchor', './shape', './rect' ];
  /* globals define, module, require */
  if ( typeof define == 'function' && define.amd ) {
    // AMD
    define( depends, factory );
  } else if ( typeof module == 'object' && module.exports ) {
    // CommonJS
    module.exports = factory.apply( root, depends.map( require ) );
  } else {
    // browser global
    var Zdog = root.Zdog;
    Zdog.Box = factory( Zdog, Zdog.Anchor, Zdog.Shape, Zdog.Rect );
  }
}( this, function factory( utils, Anchor, Shape, Rect ) {

var boxDefaults = utils.extend( {
  width: 1,
  height: 1,
  depth: 1,
  front: true,
  back: true,
  left: true,
  right: true,
  top: true,
  bottom: true,
}, Shape.defaults );
// default fill
boxDefaults.fill = true;
delete boxDefaults.path;

var Box = Anchor.subclass( boxDefaults );

var TAU = utils.TAU;

Box.prototype.create = function( options ) {
  Anchor.prototype.create.call( this, options );
  this.updatePath();
};

Box.prototype.updatePath = function() {
  this.setFace( 'front', {
    width: this.width,
    height: this.height,
    translate: { z: this.depth/2 },
  });
  this.setFace( 'back', {
    width: this.width,
    height: this.height,
    translate: { z: -this.depth/2 },
    rotate: { y: TAU/2 },
  });
  this.setFace( 'left', {
    width: this.depth,
    height: this.height,
    translate: { x: -this.width/2 },
    rotate: { y: -TAU/4 },
  });
  this.setFace( 'right', {
    width: this.depth,
    height: this.height,
    translate: { x: this.width/2 },
    rotate: { y: TAU/4 },
  });
  this.setFace( 'top', {
    width: this.width,
    height: this.depth,
    translate: { y: -this.height/2 },
    rotate: { x: -TAU/4 },
  });
  this.setFace( 'bottom', {
    width: this.width,
    height: this.depth,
    translate: { y: this.height/2 },
    rotate: { x: -TAU/4 },
  });
  
};

Box.prototype.setFace = function( faceName, options ) {
  var property = this[ faceName ];
  var face = this[ faceName + 'Face' ];
  // remove if false
  if ( !property ) {
    if ( face ) {
      this.removeChild( face );
    }
    return;
  }
  // update & add face
  utils.extend( options, {
    // set color from option, i.e. `front: '#19F'`
    color: typeof property == 'string' ? property : this.color,
    stroke: this.stroke,
    fill: this.fill,
    backface: this.backface,
    front: this.front,
    visible: this.visible,
  });
  if ( face ) {
    // update previous
    face.setOptions( options );
  } else {
    // create new
    face = this[ faceName + 'Face' ] = new Rect( options );
  }
  face.updatePath();
  this.addChild( face );
};

return Box;

}));
