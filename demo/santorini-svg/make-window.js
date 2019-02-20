/*jshint unused: false */

function makeWindow( options ) {
  if ( options.style == 'circle' ) {
    makeCircleWindow( options );
  } else {
    makeLongWindow( options );
  }
}

function makeCircleWindow( options ) {
  new Zdog.Ellipse( Zdog.extend( options, {
    diameter: 2,
  }));
}

function makeLongWindow( options ) {
  var y2 = options.height - 1;

  var windowShape = new Zdog.Shape( Zdog.extend( options, {
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