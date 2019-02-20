( function() {

var SvgRenderer = { isSvg: true };

SvgRenderer.begin = function() {};

SvgRenderer.move = function( svg, elem, point ) {
  return 'M' + point.x + ',' + point.y;
};

SvgRenderer.line = function( svg, elem, point ) {
  return 'L' + point.x + ',' + point.y;
};

SvgRenderer.bezier = function( svg, elem, cp0, cp1, end ) {
  return 'C' + cp0.x + ',' + cp0.y + ' ' + cp1.x + ',' + cp1.y + 
    ' ' + end.x + ',' + end.y;
};

SvgRenderer.closePath = function(/* elem */) {
  return 'Z';
};

SvgRenderer.setPath = function( svg, elem, pathValue ) {
  elem.setAttribute( 'd', pathValue );
};

SvgRenderer.stroke = function( svg, elem, isStroke, color, lineWidth ) {
  if ( !isStroke ) {
    return;
  }
  elem.setAttribute( 'stroke', color );
  elem.setAttribute( 'stroke-width', lineWidth );
};

SvgRenderer.fill = function( svg, elem, isFill, color ) {
  var fillColor = isFill ? color : 'none';
  elem.setAttribute( 'fill', fillColor );
};

SvgRenderer.end = function( svg, elem ) {
  svg.appendChild( elem );
};

Zdog.SvgRenderer = SvgRenderer;

})();
