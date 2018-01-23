/* jshint browser: true, unused: true, undef: true */

// *~*~*~* Bless this mess *~*~*~* // 

var TAU = Math.PI * 2;
var RT2 = Math.sqrt(2);
var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
var w = 48;
var h = 64;
var zoom = 8;
var canvasWidth = canvas.width = w * zoom;
var canvasHeight = canvas.height = h * zoom;
// colors
var colors = {
  fur: '#EA0',
  eye: '#333',
  inner: 'white',
  cloth: '#F18',
  armor: '#804',
};

var angleY = 0;
var rYCos, rYSin;
var persp = 0.5;


// -- Shape class -- //

// collection of shapes
var shapes = [];

function Shape( props ) {
  this.x = props.x;
  this.y = props.y;
  this.z = props.z;
  this.render = props.render;
  // add to collection
  shapes.push( this );
}

Shape.prototype.update = function() {
  var rzx = rYSin * -this.z;
  var rzy = rYCos * -this.z;
  var zx = this.x * rYCos;
  var zy = this.x * -rYSin;
  this.rendZ = rzy + zy;
  this.rendX = rzx + zx + w/2;
  this.rendY = this.rendZ * persp + this.y;
};

// -- VerticalRect class -- // 

function VerticalRect( props ) {
  this.x = props.x;
  this.y = props.y;
  this.z = props.z;
  this.width = props.width;
  this.height = props.height;
  this.render = props.render;
  this.points = {
    a: {},
    b: {},
    c: {},
    d: {},
  };
  // add to collection
  shapes.push( this );
}

VerticalRect.prototype.update = function() {
  var rzx = rYSin * -this.z;
  var rzy = rYCos * -this.z;
  var zx = this.x * rYCos;
  var zy = this.x * -rYSin;
  this.rendZ = rzy + zy;
  this.rendX = rzx + zx + w/2;
  this.rendY = this.rendZ * persp + this.y;
  var x1 = this.x - this.width/2;
  var y1 = this.y - this.height/2;
  var x2 = this.x + this.width/2;
  var y2 = this.y + this.height/2;
  this.points.a.x = projectX( x1, y1, this.z );
  this.points.a.y = projectY( x1, y1, this.z );
  this.points.b.x = projectX( x2, y1, this.z );
  this.points.b.y = projectY( x2, y1, this.z );
  this.points.c.x = projectX( x2, y2, this.z );
  this.points.c.y = projectY( x2, y2, this.z );
  this.points.d.x = projectX( x1, y2, this.z );
  this.points.d.y = projectY( x1, y2, this.z );
};

function projectX( x, y, z ) {
  var rzx = rYSin * -z;
  var zx = x * rYCos;
  return rzx + zx + w/2;
}

function projectY( x, y, z ) {
  var rzy = rYCos * -z;
  var zy = x * -rYSin;
  var rendZ =  rzy + zy;
  return rendZ * persp + y;
}

// -- illustration shapes --- //

// body center
new Shape({
  x: 0,
  y: 43,
  z: 0,
  render: function() {
    ctx.strokeStyle = colors.inner;
    ctx.lineWidth = 12;
    line( this.rendX, this.rendY-2,
      this.rendX, this.rendY+2 );
  },
});

// head circle
new Shape({
  x: 0,
  y: 24,
  z: 0,
  render: function() {
    ctx.fillStyle = colors.fur;
    circle( this.rendX, this.rendY, 16 );
  },
});

// left eye
new Shape({
  x: -8,
  y: 24,
  z: -8*RT2,
  render: function() {
    ctx.strokeStyle = colors.eye;
    ctx.lineWidth = 4;
    line( this.rendX, this.rendY-2,
      this.rendX, this.rendY+2 );
  },
});

// right eye
new Shape({
  x: 8,
  y: 24,
  z: -8*RT2,
  render: function() {
    ctx.strokeStyle = colors.eye;
    ctx.lineWidth = 4;
    line( this.rendX, this.rendY-2,
      this.rendX, this.rendY+2 );
  },
});

// left ear
new Shape({
  x: -9,
  y: 18,
  z: 5,
  render: function() {
    ctx.strokeStyle = colors.fur;
    ctx.lineWidth = 14;
    line( this.rendX, this.rendY-4,
      this.rendX, this.rendY+4 );
  },
});

// right ear
new Shape({
  x: 9,
  y: 18,
  z: 5,
  render: function() {
    ctx.strokeStyle = colors.fur;
    ctx.lineWidth = 14;
    line( this.rendX, this.rendY-4,
      this.rendX, this.rendY+4 );
  },
});

// left inner ear
// new Shape({
//   x: -10,
//   y: 16,
//   z: 0,
//   render: function() {
//     ctx.strokeStyle = colors.inner;
//     ctx.lineWidth = 6;
//     line( this.rendX, this.rendY-2,
//       this.rendX, this.rendY+2 );
//   },
// });

// // right inner ear
// new Shape({
//   x: 10,
//   y: 16,
//   z: 0,
//   render: function() {
//     ctx.strokeStyle = colors.inner;
//     ctx.lineWidth = 6;
//     line( this.rendX, this.rendY-2,
//       this.rendX, this.rendY+2 );
//   },
// });



// left shoulder
new Shape({
  x: 12,
  y: 40,
  z: 2,
  render: function() {
    ctx.strokeStyle = colors.armor;
    ctx.lineWidth = 8;
    line( this.rendX, this.rendY-1,
      this.rendX, this.rendY+1 );
  },
});

// right shoulder
new Shape({
  x: -12,
  y: 40,
  z: 2,
  render: function() {
    ctx.strokeStyle = colors.armor;
    ctx.lineWidth = 8;
    line( this.rendX, this.rendY-1,
      this.rendX, this.rendY+1 );
  },
});

// left arm
new Shape({
  x: 12,
  y: 44,
  z: 2,
  render: function() {
    ctx.strokeStyle = colors.fur;
    ctx.lineWidth = 8;
    line( this.rendX, this.rendY-1,
      this.rendX, this.rendY+1 );
  },
});

// right arm
new Shape({
  x: -12,
  y: 44,
  z: 2,
  render: function() {
    ctx.strokeStyle = colors.fur;
    ctx.lineWidth = 8;
    line( this.rendX, this.rendY-1,
      this.rendX, this.rendY+1 );
  },
});

// left hand
new Shape({
  x: -11,
  y: 47,
  z: 1,
  render: function() {
    ctx.fillStyle = colors.armor;
    circle( this.rendX, this.rendY, 5 );
  },
});

// right hand
new Shape({
  x: 11,
  y: 47,
  z: 1,
  render: function() {
    ctx.fillStyle = colors.armor;
    circle( this.rendX, this.rendY, 5 );
  },
});

// left foot
new Shape({
  x: -6,
  y: 50,
  z: 0,
  render: function() {
    ctx.strokeStyle = colors.armor;
    ctx.lineWidth = 8;
    line( this.rendX, this.rendY-2,
      this.rendX, this.rendY+2 );
  },
});

// right foot
new Shape({
  x: 6,
  y: 50,
  z: 0,
  render: function() {
    ctx.strokeStyle = colors.armor;
    ctx.lineWidth = 8;
    line( this.rendX, this.rendY-2,
      this.rendX, this.rendY+2 );
  },
});

// front left robe1
// new Shape({
//   x: -8,
//   y: 40,
//   z: -8,
//   render: function() {
//     ctx.strokeStyle = colors.cloth;
//     ctx.lineWidth = 4;
//     line( this.rendX, this.rendY-8,
//         this.rendX, this.rendY+8)
//   },
// });

// // front right robe1
// new Shape({
//   x: 8,
//   y: 40,
//   z: -8,
//   render: function() {
//     ctx.strokeStyle = colors.cloth;
//     ctx.lineWidth = 4;
//     line( this.rendX, this.rendY-8,
//         this.rendX, this.rendY+8)
//   },
// });

// front robe
new VerticalRect({
  x: 0,
  y: 42,
  z: -8,
  width: 14,
  height: 10,
  render: function() {
    ctx.strokeStyle = colors.cloth;
    ctx.fillStyle = colors.cloth;
    ctx.lineJoin = 'round';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo( this.points.a.x, this.points.a.y );
    ctx.lineTo( this.points.b.x, this.points.b.y );
    ctx.lineTo( this.points.c.x, this.points.c.y );
    ctx.lineTo( this.points.d.x, this.points.d.y );
    ctx.lineTo( this.points.a.x, this.points.a.y );
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
  },
});

// back robe
new VerticalRect({
  x: 0,
  y: 42,
  z: 8,
  width: 14,
  height: 10,
  render: function() {
    ctx.strokeStyle = colors.cloth;
    ctx.fillStyle = colors.cloth;
    ctx.lineJoin = 'round';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo( this.points.a.x, this.points.a.y );
    ctx.lineTo( this.points.b.x, this.points.b.y );
    ctx.lineTo( this.points.c.x, this.points.c.y );
    ctx.lineTo( this.points.d.x, this.points.d.y );
    ctx.lineTo( this.points.a.x, this.points.a.y );
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
  },
});


// -- animate --- //


function animate() {
  update();
  render();
  requestAnimationFrame( animate );
}

animate();

// -- update -- //

function update() {
  // rotate
  angleY += TAU/180;
  rYCos = Math.cos( angleY );
  rYSin = Math.sin( angleY );
  // perspective sort
  shapes.sort( function( a, b ) {
    return ( b.y - b.rendZ ) - ( a.y - a.rendZ );
  });
  // render shapes
  shapes.forEach( function( shape ) {
    shape.update();
  });
}

// -- render -- //


  ctx.lineCap = 'round';

function render() {
  ctx.clearRect( 0, 0, canvasWidth, canvasHeight );

  ctx.save();
  ctx.scale( zoom, zoom );

  shapes.forEach( function( shape ) {
    shape.render();
  });
  
  ctx.restore();
}

// -- basic shapes -- //

function circle( x, y, r ) {
  ctx.beginPath();
  ctx.arc( x, y, r, 0, TAU );
  ctx.fill();
  ctx.closePath();
}

function line( x1, y1, x2, y2 ) {
  ctx.beginPath();
  ctx.moveTo( x1, y1 );
  ctx.lineTo( x2, y2 );
  ctx.stroke();
  ctx.closePath();
}
