var roof = '#06B';
var TAU = Zdog.TAU;

function makeDome( options ) {
  var d = options.size;
  var r = d/2;
  var domePanel = new Zdog.Shape( Zdog.extend( options, {
    path: [
      { x: -r, y: 0, z: r },
      { arc: [
        { x: -r, y: -d, z: r },
        { x:  0, y: -d, z: 0 },
      ]},
      { arc: [
        { x:  r, y: -d, z: -r },
        { x:  r, y:  0, z: -r },
      ]},
    ],
    color: roof,
  }));

  domePanel.copy({
    rotate: { y: TAU/4 },
  });
}