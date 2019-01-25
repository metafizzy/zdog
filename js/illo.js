/* globals Illo: true */

// -------------------------- Illo -------------------------- //

var noop = function() {};

var Illo = Anchor.subclass({
  canvas: undefined,
  centered: true,
  zoom: 1,
  dragRotate: undefined,
  onPrerender: noop,
  onDragStart: noop,
  onDragMove: noop,
});

Illo.prototype.create = function( options ) {
  Anchor.prototype.create.call( this, options );
  this.setCanvas( this.canvas );
  this.setDragRotate( this.dragRotate );
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

Illo.prototype.prerender = function() {
  var ctx = this.ctx;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.clearRect( 0, 0, this.width, this.height );
  ctx.save();
  if ( this.centered ) {
    ctx.translate( this.width/2, this.height/2 );
  }
  var scale = this.pixelRatio * this.zoom;
  ctx.scale( scale, scale );
  this.onPrerender( ctx );
};

Illo.prototype.renderGraph = function( item ) {
  item = item || this;
  this.prerender();
  Anchor.prototype.renderGraph.call( item, this.ctx );
  this.postrender();
};

Illo.prototype.postrender = function () {
  this.ctx.restore();
};

Illo.prototype.setDragRotate = function( item ) {
  if ( !item ) {
    return;
  } else if ( item === true ) {
    item = this;
  }
  this.dragRotate = item;

  new Dragger({
    startElement: this.canvas,
    onPointerDown: this.dragStart.bind( this ),
    onPointerMove: this.dragMove.bind( this ),
  });
};

Illo.prototype.dragStart = function( pointer ) {
  this.dragStartX = this.dragRotate.rotate.x;
  this.dragStartY = this.dragRotate.rotate.y;
  this.onDragStart( pointer );
};

Illo.prototype.dragMove = function( pointer, moveX, moveY ) {
  var displaySize = this.width / this.pixelRatio;
  var rotateXMove = moveY / displaySize * TAU;
  var rotateYMove = moveX / displaySize * TAU;
  this.dragRotate.rotate.x = this.dragStartX + rotateXMove;
  this.dragRotate.rotate.y = this.dragStartY + rotateYMove;
  this.onDragMove( pointer, moveX, moveY );
};
