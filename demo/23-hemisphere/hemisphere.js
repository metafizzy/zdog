function hemisphere( options ) {
  var group = new Group({
    addTo: options.addTo,
    rotate: options.rotate,
    translate: options.translate,
    scale: options.scale,
    updateSort: true,
  });

  // inside face
  var face = new Ellipse({
    width: options.size,
    height: options.size,
    addTo: group,
    color: options.insideColor || options.color,
    lineWidth: options.lineWidth,
    stroke: options.stroke,
    fill: options.fill,
    backfaceHidden: true,
  });
  // outside face
  var outsideColor = options.outsideColor || options.color;
  face.copy({
    color: options.outsideColor || options.color,
    rotate: { y: TAU/2 },
  });

  // ----- dome ----- //

  group.render = function( ctx ) {
    // render dome
    var contourAngle = Math.atan2( face.renderNormal.y, face.renderNormal.x );
    var startAngle = contourAngle + TAU/4;
    var endAngle = contourAngle - TAU/4;

    ctx.strokeStyle = ctx.fillStyle = outsideColor;
    ctx.lineWidth = options.lineWidth;
    ctx.beginPath();
    var x = group.renderOrigin.x;
    var y = group.renderOrigin.y;
    ctx.arc( x, y, options.size/2, startAngle, endAngle );
    ctx.closePath();
    if ( options.stroke ) {
      ctx.stroke();
    }
    if ( options.fill ) {
      ctx.fill();
    }

    Group.prototype.render.call( this, ctx );
  };
}
