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
var northWall = '#58C';
var navy = '#037';
var midnight = '#024';


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
    } else if ( options.gable == 'slantS' && !isSouth ) {
      wallPath.push({ x: -wallX, y: -wallY - wallZ*2 });
      wallPath.push({ x: wallX, y: -wallY - wallZ*2 });
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

    var windowColor = isSouth ? navy : midnight;
    handleWindows( options.nsWindows, wallGroup, windowColor );

    // cap border
    if ( options.gable == 'cap' ) {
      new Rect({
        width: options.width,
        height: 2,
        addTo: wallGroup,
        translate: { y: -wallY - 1 },
        color: isSouth ? roof : midnight,
      });
    }

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
    } else if ( options.gable == 'slantS' ) {
      wallPath.push({ x: wallZ, y: -wallY - wallZ*2 });
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
      color: isWest ? westWall : eastWall,
    });

    var windowColor = isWest ? navy : midnight;
    handleWindows( options.ewWindows, wallGroup, windowColor );

    // cap border
    if ( options.gable == 'cap' ) {
      new Rect({
        width: options.depth,
        height: 2,
        addTo: wallGroup,
        translate: { y: -wallY - 1 },
        color: isWest ? roof : midnight,
      });
    }

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
        color: roof,
      });
      roofPanel.copy({
        scale: { x: -1 },
      });
    },

    ew: function() {
      var y0 = -wallY - wallZ;
      var roofPanel = new Shape({
        path: [
          { z: 0, y: y0, x: -wallX },
          { z: 0, y: y0, x: wallX },
          { z: wallZ, y: -wallY, x: wallX },
          { z: wallZ, y: -wallY, x: -wallX },
        ],
        addTo: options.addTo,
        color: roof,
      });
      roofPanel.copy({
        scale: { z: -1 },
      });
    },

    slantS: function() {
      var roofY0 = -wallY;
      var roofY1 = -wallY - wallZ*2;
      new Shape({
        path: [
          { x: -wallX, y: roofY0, z: -wallZ },
          { x:  wallX, y: roofY0, z: -wallZ },
          { x:  wallX, y: roofY1, z:  wallZ },
          { x: -wallX, y: roofY1, z:  wallZ },
        ],
        addTo: options.addTo,
        color: roof,
      });
    },

    flat: function() {
      new Rect({
        width: options.width,
        height: options.depth,
        addTo: options.addTo,
        translate: { y: -wallY },
        rotate: { x: TAU/4 },
        color: roof,
      });
    },

    cap: function() {
      new Rect({
        width: options.width,
        height: options.depth,
        addTo: options.addTo,
        translate: { y: -wallY - 2 },
        rotate: { x: TAU/4 },
        color: roof,
      });
    },
  };

  var roofMaker = roofMakers[ options.gable ];
  if ( roofMaker ) {
    roofMaker();
  }

}


function handleWindows( windows, wallGroup, color ) {
  windows = windows || [];
  windows.forEach( function( windowOption ) {
    var x = windowOption.x || 0;
    var y = windowOption.y || -5;
    var height = windowOption.height || 4;
    makeWindow({
      style: windowOption.style,
      addTo: wallGroup,
      height: height,
      translate: { x: x, y: y },
      color: color,
    });
  });
}
