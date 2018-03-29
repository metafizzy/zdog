var Hemisphere = Group.subclass({
  radius: 0.5,
  color: '#333',
  outsideColor: undefined,
  insideColor: undefined,
  fill: true,
  stroke: true,
  lineWidth: 1,
});

Hemisphere.prototype.create = function( options ) {

  // call super
  Group.prototype.create.apply( this, arguments );

  // inside face
  var face = new Ellipse({
    width: this.radius * 2,
    height: this.radius * 2,
    addTo: this,
    color: this.insideColor || this.color,
    lineWidth: this.lineWidth,
    stroke: this.stroke,
    fill: this.fill,
    backfaceHidden: true,
  });
  // outside face
  face.copy({
    color: this.outsideColor || this.color,
    rotate: { y: TAU/2 },
  });
  // console.log( this.addTo );
  this.renderNormal = face.renderNormal;
};

Hemisphere.prototype.render = function( ctx ) {
  // console.log('render');
  this.renderDome( ctx );
  Group.prototype.render.call( this, ctx );
};

Hemisphere.prototype.renderDome = function( ctx ) {
  // console.log('render dome');
  // render dome
  var contourAngle = Math.atan2( this.renderNormal.y, this.renderNormal.x );
  var startAngle = contourAngle + TAU/4;
  var endAngle = contourAngle - TAU/4;

  var outsideColor = this.outsideColor || this.color;
  ctx.strokeStyle = ctx.fillStyle = outsideColor;
  ctx.lineWidth = this.lineWidth;
  ctx.beginPath();
  var x = this.renderOrigin.x;
  var y = this.renderOrigin.y;
  ctx.arc( x, y, this.radius, startAngle, endAngle );
  ctx.closePath();
  if ( this.stroke ) {
    ctx.stroke();
  }
  if ( this.fill ) {
    ctx.fill();
  }
};
