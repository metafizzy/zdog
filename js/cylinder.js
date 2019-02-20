/**
 * Cylinder composite shape
 */

( function( root, factory ) {
  // universal module definition
  var depends = [ './utils', './shape', './ellipse' ];
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
    Zdog.Cylinder = factory( Zdog, Zdog.Shape, Zdog.Ellipse );
  }
}( this, function factory( utils, Shape, Ellipse ) {

var Cylinder = Shape.subclass({
  diameter: 1,
  length: 1,
  frontBaseColor: undefined,
  rearBaseColor: undefined,
  fill: true,
});

var TAU = utils.TAU;

Cylinder.prototype.create = function(/* options */) {
  // call super
  Shape.prototype.create.apply( this, arguments );
  // composite shape, create child shapes
  var baseZ = this.length/2;
  var baseColor = this.backface || true;
  // front outside base
  this.frontBase = new Ellipse({
    diameter: this.diameter,
    addTo: this,
    translate: { z: baseZ },
    rotate: { y: TAU/2 },
    color: this.color,
    stroke: this.stroke,
    fill: this.fill,
    backface: this.frontBaseColor || baseColor,
    visible: this.visible,
  });
  // back outside base
  this.rearBase = this.frontBase.copy({
    translate: { z: -baseZ },
    rotate: { y: 0 },
    backface: this.rearBaseColor || baseColor,
  });
};

Cylinder.prototype.render = function( ctx, renderer ) {
  if ( !this.visible ) {
    return;
  }
  // render cylinder surface
  var elem = this.getRenderElement( ctx, renderer );

  if ( renderer.isCanvas ) {
    ctx.lineCap = 'butt'; // nice
  }
  renderer.begin( ctx, elem );
  var pathValue = renderer.move( ctx, elem, this.frontBase.renderOrigin );
  pathValue += renderer.line( ctx, elem, this.rearBase.renderOrigin );
  renderer.setPath( ctx, elem, pathValue );

  var strokeWidth = this.diameter * this.renderNormal.magnitude() +
    this.getLineWidth();
  renderer.stroke( ctx, elem, true, this.color, strokeWidth );
  renderer.end( ctx, elem );

  if ( renderer.isCanvas ) {
    ctx.lineCap = 'round'; // reset
  }
};

var svgURI = 'http://www.w3.org/2000/svg';

Cylinder.prototype.getRenderElement = function( ctx, renderer ) {
  if ( !renderer.isSvg ) {
    return;
  }
  if ( !this.svgElement ) {
    // create svgElement
    this.svgElement = document.createElementNS( svgURI, 'path');
  }
  return this.svgElement;
};

// ----- set child properties ----- //

var childProperties = [ 'stroke', 'fill', 'color', 'visible' ];
childProperties.forEach( function( property ) {
  // use proxy property for custom getter & setter
  var _prop = '_' + property;
  Object.defineProperty( Cylinder.prototype, property, {
    get: function() {
      return this[ _prop ];
    },
    set: function( value ) {
      this[ _prop ] = value;
      // set property on children
      if ( this.frontBase ) {
        this.frontBase[ property ] = value;
        this.rearBase[ property ] = value;
      }
    },
  });
});

// TODO child property setter for backface, frontBaseColor, & rearBaseColor

return Cylinder;

}));
