// -------------------------- Cone -------------------------- //

var Cone = Group.subclass({
  radius: 0.5,
  height: 1,
  color: '#333',
  outsideColor: undefined,
  insideColor: undefined,
  fill: true,
  stroke: true,
  lineWidth: 1,
  updateSort: true,
});

Cone.prototype.create = function( options ) {
  // call super
  Group.prototype.create.apply( this, arguments );
  // composite shape, create child shapes
  this.tip = new Shape({
    rendering: false,
    translate: { z: -this.height },
    addTo: this,
  });
  // outside face
  var face = new Ellipse({
    width: this.radius * 2,
    height: this.radius * 2,
    addTo: this,
    color: this.outsideColor || this.color,
    lineWidth: this.lineWidth,
    stroke: this.stroke,
    fill: this.fill,
    backfaceHidden: true,
  });
  // inside face
  face.copy({
    color: this.insideColor || this.color,
    rotate: { y: TAU/2 },
  });

  new Shape({
    path: [ { z: 0}, { z: -this.height } ],
    addTo: this,
    color: '#19F',
    lineWidth: 0.5,
  });

  // used for calculating contour angle
  this.renderNormal = face.renderNormal;
  this.tipRenderPoint = this.tip.pathActions[0].endRenderPoint;
};

Cone.prototype.render = function( ctx ) {
  Group.prototype.render.call( this, ctx );
  this.renderCone( ctx );
};

Cone.prototype.renderCone = function( ctx ) {
  var tipDX = this.tip.renderOrigin.x - this.renderOrigin.x;
  var tipDY = this.tip.renderOrigin.y - this.renderOrigin.y;
  var normalX = this.renderNormal.x;
  var normalY = this.renderNormal.y;
  var renderAngle = Math.atan2( normalY, normalX );

  var tipDistance = Math.sqrt( tipDX * tipDX + tipDY * tipDY );
  var normalDistance = Math.sqrt( normalX * normalX + normalY * normalY );
  // console.log( normalDistance );
  // eccentricity
  var eccenAngle = Math.acos( normalDistance );
  var eccen = Math.sin( eccenAngle );
  // var eccen
  // console.log( this.radius * Math.sin( eccenAngle ) < tipDistance );
  var isTipVisible = this.radius * eccen < tipDistance;
  // console.log( isTipVisible );
  if ( !isTipVisible ) {
    return;
  }

  var projectTip = new Vector3( this.renderOrigin );
  var tipAngle = renderAngle + TAU/2;
  var projectLength = tipDistance / eccen;
  projectTip.x += Math.cos( tipAngle ) * projectLength;
  projectTip.y += Math.sin( tipAngle ) * projectLength;

  ctx.fillStyle = 'hsla(210, 100%, 50%, 0.5)';
  ctx.beginPath();
  ctx.arc( projectTip.x, projectTip.y, 0.5, 0, TAU );
  ctx.fill();

  ctx.strokeStyle = 'hsla(210, 100%, 50%, 0.5)';
  ctx.lineWidth = 0.2;
  ctx.beginPath();
  ctx.arc( this.renderOrigin.x, this.renderOrigin.y, this.radius, 0, TAU );
  ctx.stroke();


  var projectAngle = Math.acos( this.radius / projectLength );

  var circleTangent = new Vector3({
    x: Math.cos( projectAngle ),
    y: Math.sin( projectAngle ),
  });
  circleTangent.multiply({ x: this.radius, y: this.radius });
  ellipseTangent = new Vector3( circleTangent )
    .multiply({ x: eccen });
  circleTangent.rotate({ z: tipAngle });
  ellipseTangent.rotate({ z: tipAngle });
  // console.log( tangent.x, tangent.y );
  circleTangent.add( this.renderOrigin );
  ellipseTangent.add( this.renderOrigin );

  var projectTangentXA = this.renderOrigin.x + Math.cos( projectAngle + tipAngle ) * this.radius;
  var projectTangentYA = this.renderOrigin.y + Math.sin( projectAngle + tipAngle ) * this.radius;

  var projectTangentXB = this.renderOrigin.x + Math.cos( -projectAngle + tipAngle ) * this.radius;
  var projectTangentYB = this.renderOrigin.y + Math.sin( -projectAngle + tipAngle ) * this.radius;

  // ctx.beginPath();
  // ctx.moveTo( projectTangentXA, projectTangentYA );
  // ctx.lineTo( projectTip.x, projectTip.y );
  // ctx.lineTo( projectTangentXB, projectTangentYB );
  // ctx.stroke();

  ctx.beginPath();
  ctx.lineTo( projectTip.x, projectTip.y );
  ctx.lineTo( circleTangent.x, circleTangent.y );
  ctx.stroke();

  ctx.beginPath();
  ctx.lineTo( this.tip.renderOrigin.x, this.tip.renderOrigin.y );
  ctx.lineTo( ellipseTangent.x, ellipseTangent.y );
  ctx.stroke();

  // var projectTangentX = Math.sin( projectAngle ) * this.radius;
  // var projectTangentY = Math.cos( projectAngle ) * this.radius * -1;
  // var tangentY = projectTangentY * eccen;

  // var ratio = distance / this.height;
  // console.log( renderDistance / normalDistance );
  // var startAngle = contourAngle + TAU/4;
  // var endAngle = contourAngle - TAU/4;

  // var outsideColor = '#19F';
  // ctx.strokeStyle = ctx.fillStyle = outsideColor;
  // ctx.lineWidth = 0.5;
  // ctx.beginPath();
  // ctx.moveTo( this.tip.renderOrigin.x , this.tip.renderOrigin.y );
  // ctx.lineTo( this.renderOrigin.x, this.renderOrigin.y );
  // ctx.stroke();
  //
  // if ( this.stroke ) {
  //   ctx.stroke();
  // }
  // if ( this.fill ) {
  //   ctx.fill();
  // }
};