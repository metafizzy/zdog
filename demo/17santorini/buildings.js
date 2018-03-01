/* globals makeBuilding */

function oneStoryBuilding( options ) {

  var anchor = new Shape({
    rendering: false,
    addTo: options.addTo,
    translate: options.translate,
  });

  var isNS = options.gable == 'ns';

  var buildOptions = {
    width: isNS ? 8 : 10,
    height: 8,
    depth: isNS ? 10 : 8,
    gable: options.gable,
    addTo: anchor,
  };

  // single window
  buildOptions[ options.gable + 'Windows'] = [ { x: 0 } ];
  // two windows on long side
  var oppositeSide = isNS ? 'ew' : 'ns';
  buildOptions[ oppositeSide + 'Windows'] = [
    { x: -2 },
    { x: 2 },
  ];

  makeBuilding( buildOptions );

}

function twoStoryBuilding( options ) {

  var anchor = new Shape({
    rendering: false,
    addTo: options.addTo,
    translate: options.translate,
  });

  var isNS = options.gable == 'ns';

  var buildOptions = {
    width: isNS ? 8 : 10,
    height: 14,
    depth: isNS ? 10 : 8,
    gable: options.gable,
    addTo: anchor,
  };

  // single column
  buildOptions[ options.gable + 'Windows'] = [
    { x: 0, y: -5 },
    { x: 0, y: -11 },
  ];
  // two windows on long side
  var oppositeSide = isNS ? 'ew' : 'ns';
  buildOptions[ oppositeSide + 'Windows'] = [
    { x: -2, y: -5 },
    { x: 2, y: -5 },
    { x: -2, y: -11 },
    { x: 2, y: -11 },
  ];

  makeBuilding( buildOptions );

}


function oneStorySlanter( options ) {

  var anchor = new Shape({
    rendering: false,
    addTo: options.addTo,
    translate: options.translate,
  });

  makeBuilding({
    width: 14,
    height: 8,
    depth: 6,
    gable: options.gable,
    addTo: anchor,
    nsWindows: [
      { x: -4 },
      { x: 0 },
      { x: 4 },
    ],
    ewWindows: [
      { x: 0 }
    ],
  });

}