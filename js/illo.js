// -------------------------- Illo -------------------------- //

function Illo( options ) {
  // set defaults & options
  extend( this, Illo.defaults );
  extend( this, options );

  this.setCanvas( this.canvas );
}

Illo.defaults = {
  centered: true,
  prerender: function() {},
};

Illo.prototype.setCanvas = function( canvas ) {
  if ( typeof canvas == 'string' ) {
    // with string, query selector
    this.canvas = document.querySelector( canvas );
  } else {
    this.canvas = canvas;
  }

  // update related properties
  this.ctx = this.canvas.getContext('2d');

  this.ctx.lineCap = 'round';
  this.ctx.lineJoin = 'round';

  var pixelRatio = this.pixelRatio = window.devicePixelRatio || 1;
  // sizes
  this.width = this.canvas.width * pixelRatio;
  this.height = this.canvas.height * pixelRatio;
  // up-rez for hi-DPI devices
  if ( pixelRatio > 1 ) {
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    canvas.style.width = this.width / pixelRatio + 'px';
    canvas.style.height = this.height / pixelRatio + 'px';
  }
};

Illo.prototype.render = function( item ) {
  var ctx = this.ctx;
  ctx.clearRect( 0, 0, this.width, this.height );
  ctx.save();
  if ( this.centered ) {
    ctx.translate( this.width/2, this.height/2 );
  }
  ctx.scale( this.pixelRatio, this.pixelRatio );

  this.prerender( ctx );
  item.renderGraph( ctx );

  ctx.restore();
};

Illo.prototype.enableDragRotate = function( item, onPointerDown ) {
  var dragStartAngleX, dragStartAngleY;
  onPointerDown = onPointerDown || function() {};

  new Dragger({
    startElement: this.canvas,
    onPointerDown: function() {
      dragStartAngleX = item.rotate.x;
      dragStartAngleY = item.rotate.y;
      onPointerDown();
    },
    onPointerMove: function( pointer, moveX, moveY ) {
      var displaySize = this.width / this.pixelRatio;
      var angleXMove = moveY / displaySize * TAU;
      var angleYMove = moveX / displaySize * TAU;
      item.rotate.x = dragStartAngleX + angleXMove;
      item.rotate.y = dragStartAngleY + angleYMove;
    }.bind( this ),
  });
};
