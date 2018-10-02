/* globals red, blue, navy, gold, white */

// -------------------------- makeBuilding -------------------------- //

function makeBuilding( options ) {

  var wallX = options.width/2;
  var wallY = options.height;
  var wallZ = options.depth/2;

  // collect walls
  var building = {};

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
      color: isSouth ? red : gold,
    });

    var windowColor = isSouth ? navy : red;
    var windowProperty = isSouth ? 'southWindows' : 'northWindows';
    handleWindows( options, windowProperty, wallGroup, windowColor );

    var wallProperty = isSouth ? 'southWall' : 'northWall';
    building[ wallProperty ] = wallGroup;

  });

  // east/west wall
  [ true, false ].forEach( function( isWest ) {
    var wallGroup = new Group({
      addTo: options.addTo,
      translate: { x: isWest ? -wallX : wallX },
      rotate: { y: TAU/4 },
    });

    var wallPath = [
      { x: -wallZ, y: -wallY }
    ];

    if ( options.gable == 'ew' ) {
      wallPath.push({ x: 0, y: -wallY - wallZ });
    }

    wallPath = wallPath.concat([
      { x: wallZ, y: -wallY },
      { x: wallZ, y: 0 },
      { x: -wallZ, y: 0 },
    ]);

    // wall
    new Shape({
      path: wallPath,
      addTo: wallGroup,
      color: isWest ? blue : white,
    });

    var windowColor = isWest ? navy : blue;
    var windowProperty = isWest ? 'westWindows' : 'eastWindows';
    handleWindows( options, windowProperty, wallGroup, windowColor );

    var wallProperty = isWest ? 'westWall' : 'eastWall';
    building[ wallProperty ] = wallGroup;
  });


  var roofMakers = {
    ns: function() {
      var y0 = -wallY - wallX;
      var roofPanel = new Shape({
        path: [
          { x: 0, y: y0, z: -wallZ },
          { x: 0, y: y0, z: wallZ },
          { x: wallX, y: -wallY, z: wallZ },
          { x: wallX, y: -wallY, z: -wallZ },
        ],
        addTo: options.addTo,
        color: gold,
      });
      roofPanel.copy({
        scale: { x: -1 },
        color: navy,
      });
    },

    ew: function() {
      var y0 = -wallY - wallZ;
      var xA = options.isChurch ? -wallX + 8 : -wallX;
      var roofPanel = new Shape({
        path: [
          { z: 0, y: y0, x: xA },
          { z: 0, y: y0, x: wallX },
          { z: wallZ, y: -wallY, x: wallX },
          { z: wallZ, y: -wallY, x: xA },
        ],
        addTo: options.addTo,
        color: red,
      });
      roofPanel.copy({
        path: [
          { z: 0, y: y0, x: -wallX },
          { z: 0, y: y0, x: wallX },
          { z: wallZ, y: -wallY, x: wallX },
          { z: wallZ, y: -wallY, x: -wallX },
        ],
        scale: { z: -1 },
        color: navy,
      });
    },
  };

  var roofMaker = roofMakers[ options.gable ];
  if ( roofMaker ) {
    roofMaker();
  }

  return building;
}

function handleWindows( options, windowProperty, wallGroup, color ) {
  var windowOption = options[ windowProperty ];
  if ( !windowOption ) {
    return;
  }

  var columns = windowOption[0];
  var rows = windowOption[1];
  // var windowPaths = [];
  for ( var row=0; row < rows; row++ ) {
    for ( var col=0; col < columns; col++ ) {
      var x = ( col - (columns-1)/2 ) * 6;
      var y = -options.height + (row + 0.75) * 8;
      var windowPath = [
        { x: x + -1, y: y + -2 },
        { x: x +  1, y: y + -2 },
        { x: x +  1, y: y +  2 },
        { x: x + -1, y: y +  2 },
      ];
      new Shape({
        path: windowPath,
        addTo: wallGroup,
        color: color,
      });
    }
  }
}
