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

Cylinder.prototype.setPath = function() {
  // path commands will be overwritten in render
  this.path = [ {}, {} ];
};

Cylinder.prototype.render = function( ctx ) {
  if ( !this.visible ) {
    return;
  }
  // render tube
  ctx.strokeStyle = this.color;
  // apply scale
  ctx.lineWidth = this.diameter * this.renderNormal.magnitude() +
    this.getLineWidth();
  ctx.lineCap = 'butt'; // nice
  var front = this.frontBase.renderOrigin;
  var rear = this.rearBase.renderOrigin;

  ctx.beginPath();
  ctx.moveTo( front.x, front.y );
  ctx.lineTo( rear.x, rear.y );
  ctx.stroke();

  ctx.lineCap = 'round'; // reset
};

var svgURI = 'http://www.w3.org/2000/svg';

Cylinder.prototype.renderSvg = function( svg ) {
  if ( !this.visible ) {
    return;
  }
  // create svgElement
  if ( !this.svgElement ) {
    this.svgElement = document.createElementNS( svgURI, 'path');
  }

  // render tube
  this.svgElement.setAttribute( 'stroke', this.color );
  // apply scale
  var strokeWidth = this.diameter * this.renderNormal.magnitude() +
    this.getLineWidth();
  this.svgElement.setAttribute( 'stroke-width', strokeWidth );
  var front = this.frontBase.renderOrigin;
  var rear = this.rearBase.renderOrigin;

  var dValue = [  'M', front.x, front.y, 'L', rear.x, rear.y ].join(' ');
  this.svgElement.setAttribute( 'd', dValue );

  svg.appendChild( this.svgElement );
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
