function hedge( options ) {
  var anchor = new Shape({
    rendering: false,
    addTo: options.addTo,
    translate: options.translate,
  });

  var ball = new Shape({
    path: [ { y: 0 }, { y: -1 } ],
    lineWidth: 5,
    addTo: anchor,
    translate: { y: -2.5 },
    stroke: true,
    color: options.color || navy,
  });

  ball.copy({
    lineWidth: 4,
    translate: { y: -5 },
  });

  ball.copy({
    lineWidth: 2.5,
    translate: { y: -7.5 },
  });
}
