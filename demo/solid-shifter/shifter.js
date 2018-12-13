var navy = '#369';
// var red = '#E21';
var green = '#692';
var egg = '#FED';
var ochre = '#E83';

[ Shape, Rect, Ellipse, Cylinder, Cone ].forEach( function( ItemClass ) {
  ItemClass.defaults.fill = true;
  ItemClass.defaults.stroke = false;
});


// triangle
var isoTriangle = new Shape({
  path: [
    { x: 1, y: 1 },
    { x: -1, y: 1  },
    { x: 0, y: -1 },
  ],
  color: egg,
});

function Shifter( options ) {

  var shifterAnchor = this.anchor = new Anchor( options );

  this.pyramid = ( function() {
    var pyramid = new Group({
      addTo: shifterAnchor,
      rendering: false,
      // translate: { x: -3, y: -3 },
      updateSort: true,
    });

    var base = new Rect({
      addTo: pyramid,
      width: 2,
      height: 2,
      translate: { y: 1 },
      rotate: { x: -TAU/4 },
      color: navy,
    });


    var triangle = new Shape({
      addTo: base,
      path: [
        { x: 1, y: -1, z: 0 },
        { x: -1, y: -1, z: 0  },
        { x: 0, y: 0, z: -2 },
      ],
      color: ochre,
    });
    triangle.copy({
      rotate: { z: TAU/4 },
    });
    triangle.copy({
      rotate: { z: TAU/2 },
    });
    triangle.copy({
      rotate: { z: TAU * 3/4 },
    });

    return pyramid;
  })();

  // cylinder 1
  this.cylinder1 = new Cylinder({
    addTo: shifterAnchor,
    rendering: false,
    radius: 1,
    length: 2,
    // translate: { x: 0, y: -3 },
    rotate: { y: TAU/4 },
    color: navy,
    baseColor: egg,
  });

  // cone 1
  // isoTriangle.copy({
  //   translate: { x: 3, y: -3, z: -2 },
  //   color: green,
  // });

  this.cone = ( function() {
    var anchor = new Group({
      addTo: shifterAnchor,
      rendering: false,
      // translate: { x: 3, y: -3 },
      updateSort: true,
    });

    new Cone({
      addTo: anchor,
      radius: 1,
      height: 2,
      rotate: { x: TAU/4 },
      translate: { y: 1 },
      color: ochre,
      baseColor: egg,
    });

    return anchor;
  })();

  // triangular prism

  this.prism = ( function() {
    var prism = new Group({
      addTo: shifterAnchor,
      rendering: false,
      // translate: { x: -3, y: 0 },
      updateSort: true,
    });

    var triangle = isoTriangle.copy({
      addTo: prism,
      scale: { y: -1 },
      rotate: { y: TAU/4 },
      translate: { x: -1 },
      color: ochre,
    });
    triangle.copy({
      translate: { x: 1 },
    });

    var angleFace = new Shape({
      addTo: prism,
      path: [
        { x: -1, y: -1, z: 1 },
        { x:  1, y: -1, z: 1 },
        { x:  1, y:  1, z: 0 },
        { x: -1, y:  1, z: 0 },
      ],
      color: navy,
    });
    angleFace.copy({
      scale: { z: -1 },
    });

    // base
    new Rect({
      addTo: prism,
      width: 2,
      height: 2,
      rotate: { x: TAU/4 },
      translate: { y: -1 },
      color: green,
    });

    return prism;
  })();

  // eccentric cylinder, triangle contour

  this.triCylinder = ( function() {
    var cylinder = new Group({
      addTo: shifterAnchor,
      rendering: false,
      // translate: { x: 3 },
    });

    isoTriangle.copy({
      translate: {},
      addTo: cylinder,
      color: ochre,
    });

    var tilt = Math.atan(1/2);

    var capAnchor = new Anchor({
      addTo: cylinder,
      translate: { x: -0.5 },
      rotate: { y: TAU/4 },
    });


    // left outside cap
    var cap = new Ellipse({
      addTo: capAnchor,
      width: 2,
      height: 2,
      color: egg,
      rotate: { x: tilt },
      scale: { y: 1/Math.cos( tilt ) },
      backfaceVisible: false,
    });
    cap.copy({ // left inside cap
      rotate: { y: TAU/2, x: tilt },
      color: ochre,
    });

    capAnchor.copyGraph({
      translate: { x: 0.5 },
      rotate: { y: -TAU/4 },
    });

    return cylinder;
  })();

  this.cylinder2 = this.cylinder1.copy({
    translate: {},
    rendering: false,
    rotate: { x: TAU/4 },
  });

}

Shifter.prototype.update = function( t ) {

  var turn = Math.floor( t % 6 );

  var easeT = easeInOut( t, 4 ) * TAU/4;
  this.pyramid.rotate.x = easeT;
  this.cylinder1.rotate.y = easeT + TAU/4;
  this.cone.rotate.x = easeT + TAU/4;
  this.prism.rotate.y = easeT + TAU/4;
  this.cylinder2.rotate.x = easeT + TAU/4;
  this.triCylinder.rotate.y = easeT + TAU/4;

  if ( turn === 0 ) {
    this.triCylinder.rendering = false;
    this.pyramid.rendering = true;
  } else if ( turn == 1) {
    this.pyramid.rendering = false;
    this.cylinder1.rendering = true;
  } else if ( turn == 2 ) {
    this.cylinder1.rendering = false;
    this.cone.rendering = true;
  } else if ( turn == 3 ) {
    this.cone.rendering = false;
    this.prism.rendering = true;
  } else if ( turn == 4 ) {
    this.prism.rendering = false;
    this.cylinder2.rendering = true;
  } else if ( turn == 5 ) {
    this.cylinder2.rendering = false;
    this.triCylinder.rendering = true;
  }
};
