/* jshint unused: false */
/* globals makeWindow */

// translate
// width,
// height
// depth
// nsWindows: function() {}
// ewWindows: function() {}
// gable: flat, ew, ns, slantS, slandN

// colors
var white = 'white';
var southWall = white;
var westWall = '#CDE';
var eastWall = '#8AD';
var roof = '#06B';
var northWall = roof;
// var navy = '#037';
// var midnight = '#024';

function makeBuilding( options ) {

  var wallX = options.width/2;
  var wallY = options.height;
  var wallZ = options.depth/2;

  // south/noth walls
  [ true, false ].forEach( function( isSouth ) {
    var wallTZ = isSouth ? -wallZ : wallZ;
    var wallGroup = new Group({
      addTo: options.addTo,
      translate: { z: wallTZ },
    });

    var wallPath = [
      { x: -wallX, y: -wallY }
    ];

    if ( options.gable == 'ns' ) {
      wallPath.push({ x: 0, y: -wallY - wallX });
    }

    wallPath = wallPath.concat([
      { x: wallX, y: -wallY },
      { x: wallX, y: 0 },
      { x: -wallX, y: 0 },
    ]);

    // wall
    new Shape({
      path: wallPath,
      addTo: wallGroup,
      color: isSouth ? southWall : northWall,
    });

    makeWindows( options.nsWindows, wallGroup, options.width, isSouth );

  });

  [ true, false ].forEach( function( isWest ) {
    var wallGroup = new Group({
      addTo: options.addTo,
      translate: { x: isWest ? -wallX : wallX },
      rotate: { y: TAU/4 },
    });

    // wall
    new Rect({
      width: options.depth,
      height: options.height,
      addTo: wallGroup,
      color: isWest ? westWall : eastWall,
      translate: { y: -options.height/2 },
    });

    makeWindows( options.ewWindows, wallGroup, options.depth, isWest );

  });

  // roof
  if ( options.gable == 'ns' ) {
    var y0 = -wallY - wallX;
    var roofPanel = new Shape({
      path: [
        { x: 0, y: y0, z: -wallZ },
        { x: 0, y: y0, z: wallZ },
        { x: wallX, y: -wallY, z: wallZ },
        { x: wallX, y: -wallY, z: -wallZ },
      ],
      addTo: options.addTo,
      color: roof,
    });
    roofPanel.copy({
      scale: { x: -1 },
    });
  }


}


function makeWindows( windowMaker, wallGroup, size, isPositive ) {
  if ( !windowMaker ) {
    return;
  }

  var windowCount = Math.floor( size / 3 ) - 1;
  for ( var i=0; i < windowCount; i++ ) {
    var windowX = (i )*4 - ( windowCount-1 ) * 2 ;
    windowMaker( windowX, wallGroup, isPositive );
  }

}