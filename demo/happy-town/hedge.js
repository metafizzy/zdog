function hedge( options ) {
  var anchor = new Zdog.Anchor({
    addTo: options.addTo,
    translate: options.translate,
  });

  var ball = new Zdog.Shape({
    path: [ { y: 0 }, { y: -1 } ],
    addTo: anchor,
    translate: { y: -2.5 },
    stroke: 5,
    color: options.color || navy,
  });

  ball.copy({
    stroke: 4,
    translate: { y: -5 },
  });

  ball.copy({
    stroke: 2.5,
    translate: { y: -7.5 },
  });
}
