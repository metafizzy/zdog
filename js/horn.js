/**
 * Horn composite shape
 */

( function( root, factory ) {
  // module definition
  if ( typeof module == 'object' && module.exports ) {
    // CommonJS
    module.exports = factory( require('./boilerplate'),
        require('./path-command'), require('./shape'), require('./group'),
        require('./vector') );
  } else {
    // browser global
    var Zdog = root.Zdog;
    Zdog.Horn = factory( Zdog, Zdog.PathCommand, Zdog.Shape,
        Zdog.Group, Zdog.Vector );
  }
}( this, function factory( utils, PathCommand, Shape, Group, Vector ) {

function noop() {}

// ----- HornGroup ----- //

var HornGroup = Group.subclass({
  color: '#333',
  updateSort: true,
});

HornGroup.prototype.create = function() {
  Group.prototype.create.apply( this, arguments );
  
  // vectors used for calculation
  this.renderApex = new Vector();
  this.tangentFrontA = new Vector();
  this.tangentFrontB = new Vector();
  this.tangentRearA = new Vector();
  this.tangentRearB = new Vector();
  
  this.pathCommands = [
    new PathCommand( 'move', [ {} ] ),
    new PathCommand( 'line', [ {} ] ),
	new PathCommand( 'line', [ {} ] ),
	new PathCommand( 'line', [ {} ] ),
  ];
};

HornGroup.prototype.render = function( ctx, renderer ) {
  this.renderHornSurface( ctx, renderer );
  Group.prototype.render.apply( this, arguments );
};

HornGroup.prototype.renderHornSurface = function( ctx, renderer ) {
  if ( !this.visible ) {
    return;
  }
  // render horn surface
  var elem = this.getRenderElement( ctx, renderer );
  var frontBase = this.frontBase;
  var frontDiameter = frontBase.stroke;
  var rearBase = this.rearBase;
  var rearDiameter = rearBase.stroke;
  var scale = frontBase.renderNormal.magnitude();
  var frontRadius = frontDiameter/2 * scale;
  var rearRadius = rearDiameter/2 * scale;
  
  this.renderApex.set( rearBase.renderOrigin )
    .subtract( frontBase.renderOrigin );
  
  // calculate tangents.
  var scale = frontBase.renderNormal.magnitude();
  var apexDistance = this.renderApex.magnitude2d();
  var normalDistance = frontBase.renderNormal.magnitude2d();
  // eccentricity
  var eccenAngle = Math.acos( normalDistance / scale );
  var biggerRadius =  (frontRadius > rearRadius) ? frontRadius : rearRadius;
  var eccenPercent;
  if (frontRadius == 0 || rearRadius == 0) {
	  eccenPercent = 1.0;
  } else {
	  eccenPercent = (Math.abs(frontRadius - rearRadius) / biggerRadius);
  }
  var eccen = Math.sin( eccenAngle ) * Math.sqrt(eccenPercent);
  // does apex extend beyond eclipse of face
  apexDistance = apexDistance + frontRadius/4 + rearRadius/4;
  var isApexVisible = frontRadius * eccen < apexDistance &&
                      rearRadius * eccen < apexDistance;
  if ( !isApexVisible ) {
    return;
  }
  // update tangents
  // TODO: try something more like horn_old.js updateSortValue()
  var apexAngle = Math.atan2( frontBase.renderNormal.y, frontBase.renderNormal.x ) +
      TAU/2;
  var projectFrontLength = (apexDistance + frontRadius) / eccen;
  var projectRearLength = (apexDistance + rearRadius) / eccen;
  var projectFrontAngle = Math.acos( frontRadius / projectFrontLength );
  var projectRearAngle = Math.acos( rearRadius / -projectRearLength );
  // set tangent points
  var tangentFrontA = this.tangentFrontA;
  var tangentFrontB = this.tangentFrontB;
  var tangentRearA = this.tangentRearA;
  var tangentRearB = this.tangentRearB;

  tangentFrontA.x = Math.cos( projectFrontAngle ) * frontRadius * eccen;
  tangentFrontA.y = Math.sin( projectFrontAngle ) * frontRadius;
  tangentRearA.x = Math.cos( projectRearAngle ) * rearRadius * eccen;
  tangentRearA.y = Math.sin( projectRearAngle ) * rearRadius;

  tangentFrontB.set( this.tangentFrontA );
  tangentFrontB.y *= -1;
  tangentRearB.set( this.tangentRearA );
  tangentRearB.y *= -1;

  tangentFrontA.rotateZ( apexAngle);
  tangentFrontB.rotateZ( apexAngle);
  tangentFrontA.add( frontBase.renderOrigin );
  tangentFrontB.add( frontBase.renderOrigin );
  tangentRearA.rotateZ( apexAngle + TAU/2);
  tangentRearB.rotateZ( apexAngle + TAU/2);
  tangentRearA.add( rearBase.renderOrigin );
  tangentRearB.add( rearBase.renderOrigin );
  
  
  // set path command render points
  this.pathCommands[0].renderPoints[0].set( tangentFrontA );
  this.pathCommands[1].renderPoints[0].set( tangentRearB );
  this.pathCommands[2].renderPoints[0].set( tangentRearA );
  this.pathCommands[3].renderPoints[0].set( tangentFrontB );

  if ( renderer.isCanvas ) {
    ctx.lineCap = 'butt'; // nice
  }
  renderer.renderPath( ctx, elem, this.pathCommands );
  //renderer.stroke( ctx, elem, true, '#333', 0.1 ); // remove once testing is done.
  renderer.fill( ctx, elem, true, this.color );
  renderer.end( ctx, elem );

  if ( renderer.isCanvas ) {
    ctx.lineCap = 'round'; // reset
  }
};

var svgURI = 'http://www.w3.org/2000/svg';

HornGroup.prototype.getRenderElement = function( ctx, renderer ) {
  if ( !renderer.isSvg ) {
    return;
  }
  if ( !this.svgElement ) {
    // create svgElement
    this.svgElement = document.createElementNS( svgURI, 'path');
  }
  return this.svgElement;
};

// prevent double-creation in parent.copyGraph()
// only create in Horn.create()
HornGroup.prototype.copyGraph = noop;

// ----- HornCap ----- //

var HornCap = Shape.subclass();

HornCap.prototype.copyGraph = noop;

// ----- Horn ----- //

var Horn = Shape.subclass({
  frontDiameter: 1,
  rearDiameter: 1,
  length: 1,
  frontFace: undefined,
  fill: true,
});

var TAU = utils.TAU;

Horn.prototype.create = function(/* options */) {
  // call super
  Shape.prototype.create.apply( this, arguments );
  // composite shape, create child shapes
  // HornGroup to render horn surface then bases
  this.group = new HornGroup({
    addTo: this,
    color: this.color,
    visible: this.visible,
  });
  var baseZ = this.length/2;
  var baseColor = this.backface || true;
  // front outside base
  this.frontBase = this.group.frontBase = new HornCap({
    addTo: this.group,
    translate: { z: (baseZ - this.frontDiameter/2) },
    rotate: { y: TAU/2 },
    color: this.color,
    stroke: this.frontDiameter,
    fill: this.fill,
    backface: this.frontFace || baseColor,
    visible: this.visible,
  });
  // back outside base
  this.rearBase = this.group.rearBase = new HornCap({
    addTo: this.group,
    translate: { z: (-baseZ + this.rearDiameter/2) },
    rotate: { y: 0 },
    color: this.color,
    stroke: this.rearDiameter,
    fill: this.fill,
    backface: baseColor,
    visible: this.visible,
  });
  
};

Horn.prototype.updateFrontCapDiameter = function(size) {
	this.frontBase.stroke = size;
	var baseZ = this.length/2;
	this.frontBase.translate.z = (baseZ - size/2);
}

Horn.prototype.updateRearCapDiameter = function(size) {
	this.rearBase.stroke = size;
	var baseZ = this.length/2;
	this.rearBase.translate.z = (-baseZ + size/2);
}

// Horn shape does not render anything
Horn.prototype.render = function() {};

// ----- set child properties ----- //

var childProperties = [ 'stroke', 'fill', 'color', 'visible',
                        'frontDiameter', 'rearDiameter' ];
childProperties.forEach( function( property ) {
  // use proxy property for custom getter & setter
  var _prop = '_' + property;
  Object.defineProperty( Horn.prototype, property, {
    get: function() {
      return this[ _prop ];
    },
    set: function( value ) {
      this[ _prop ] = value;
      // set property on children
      if ( this.frontBase ) {
		if (property === 'frontDiameter') {
		  this.updateFrontCapDiameter(value);
		}
		if (property === 'rearDiameter') {
		  this.updateRearCapDiameter(value);
		}
        this.frontBase[ property ] = value;
        this.rearBase[ property ] = value;
        this.group[ property ] = value;
      }
    },
  });
});

// TODO child property setter for backface, frontBaseColor, & rearBaseColor

return Horn;

}));
