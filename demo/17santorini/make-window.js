/*jshint unused: false */

function makeWindow( options ) {
  var y2 = options.height - 1;

  var windowShape = new Shape( extend( options, {
    path: [
      { x: -1, y: 0 },
      { arc: [
        { x: -1, y: -1 },
        { x: 0, y: -1 },
      ]},
      { arc: [
        { x: 1, y: -1 },
        { x: 1, y: 0 },
      ]},
      { x: 1, y: y2 },
      { x: -1, y: y2 },
    ],
  }));

  return windowShape;
}
