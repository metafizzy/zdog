// -------------------------- Cylinder -------------------------- //

var Cylinder = Group.subclass({
  radius: 0.5,
  length: 1,
  color: '#333',
  outsideColor: undefined,
  insideColor: undefined,
  fill: true,
  stroke: true,
  lineWidth: 1,
  updateSort: true,
});

Cylinder.prototype.create = function() {
  // call super
  Group.prototype.create.apply( this, arguments );
  // composite shape, create child shapes
  var faceZ = this.length/2;
  // front inside face
  var face, frontInsideFace;
  face = frontInsideFace = new Ellipse({
    width: this.radius * 2,
    height: this.radius * 2,
    addTo: this,
    translate: { z: -faceZ },
    color: this.insideColor || this.color,
    lineWidth: this.lineWidth,
    stroke: this.stroke,
    fill: this.fill,
    backfaceHidden: true,
  });
  // front outisde face
  var outsideColor = this.outsideColor || this.color;
  face.copy({
    color: outsideColor,
    rotate: { y: TAU/2 },
  });
  // back inside face
  var backInsideFace = face.copy({
    translate: { z: faceZ },
    rotate: { y: TAU/2 },
  });
  // back outside face
  face.copy({
    color: outsideColor,
    translate: { z: faceZ },
  });

  // used for rendering ring
  this.frontRenderOrigin = frontInsideFace.renderOrigin;
  this.backRenderOrigin = backInsideFace.renderOrigin;
};

Cylinder.prototype.render = function( ctx ) {
  this.renderRing( ctx );
  Group.prototype.render.call( this, ctx );
};

Cylinder.prototype.renderRing = function( ctx ) {
  ctx.strokeStyle = this.outsideColor || this.color;
  ctx.lineWidth = this.radius * 2;
  ctx.lineCap = 'butt'; // nice

  ctx.beginPath();
  ctx.moveTo( this.frontRenderOrigin.x, this.frontRenderOrigin.y );
  ctx.lineTo( this.backRenderOrigin.x, this.backRenderOrigin.y );
  ctx.stroke();
};
