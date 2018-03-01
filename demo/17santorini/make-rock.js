/* globals midnight */

// width
// depth
// height
// translate
// eastOffset
// westOffset
// northOffset
// southOffset

function makeRock( options ) {

  var x = options.width/2;
  var z = options.depth/2;
  var y = -options.height;
  var bottomWestNorth = { x: -x, y: 0, z:  z };
  var bottomEastNorth = { x:  x, y: 0, z:  z };
  var bottomEastSouth = { x:  x, y: 0, z: -z };
  var bottomWestSouth = { x: -x, y: 0, z: -z };

  var topWestX = x + ( options.westOffset || 0 );
  var topEastX = x + ( options.eastOffset || 0 );
  var topNorthZ = z + ( options.northOffset || 0 );
  var topSouthZ = z + ( options.southOffset || 0 );

  var topWestNorth = { x: -topWestX, y: y, z:  topNorthZ };
  var topEastNorth = { x:  topEastX, y: y, z:  topNorthZ };
  var topEastSouth = { x:  topEastX, y: y, z: -topSouthZ };
  var topWestSouth = { x: -topWestX, y: y, z: -topSouthZ };

  var anchor = new Shape({
    rendering: false,
    addTo: options.addTo,
    translate: options.translate,
  });

  function makeRockFace( path ) {
    new Shape({
      path: path,
      addTo: anchor,
      color: midnight,
      stroke: true,
      lineWidth: 2,
    });
  }

  // north face
  makeRockFace([
    topWestNorth,
    topEastNorth,
    bottomEastNorth,
    bottomWestNorth,
  ]);
  // south face
  makeRockFace([
    topWestSouth,
    topEastSouth,
    bottomEastSouth,
    bottomWestSouth,
  ]);
  // west face
  makeRockFace([
    topWestSouth,
    topWestNorth,
    bottomWestNorth,
    bottomWestSouth,
  ]);

  // east face
  makeRockFace([
    topEastSouth,
    topEastNorth,
    bottomEastNorth,
    bottomEastSouth,
  ]);
  // top face
  makeRockFace([
    topWestNorth,
    topEastNorth,
    topEastSouth,
    topWestSouth,
  ]);

}
