// -------------------------- Illo -------------------------- //

function Illo( options ) {
  // set defaults & options
  extend( this, Illo.defaults );
  extend( this, options );

  this.anchor = new Anchor({
    scale: this.scale,
    rotate: this.rotate,
    transform: this.transform,
  });
  this.setCanvas( this.canvas );
  this.setDragRotate( this.dragRotate );
}

Illo.defaults = {
  centered: true,
  zoom: 1,
  onPrerender: function() {},
  onDragStart: function() {},
  onDragMove: function () {},
};

// ----- anchor ----- //

Illo.prototype.addChild = function( item ) {
  this.anchor.addChild( item );
};

Illo.prototype.updateGraph = function() {
  this.anchor.updateGraph();
};

// ----- illo ----- //

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
  // console.log('set line cap');
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
  ctx.clearRect( 0, 0, this.width, this.height );
  ctx.save();
  if ( this.centered ) {
    ctx.translate( this.width/2, this.height/2 );
  }
  var scale = this.pixelRatio * this.zoom;
  ctx.scale( scale, scale );
  this.onPrerender( ctx );
};

Illo.prototype.render = function( item ) {
  item = item || this.anchor;
  this.prerender();
  item.renderGraph( this.ctx );
  this.postrender();
};

Illo.prototype.postrender = function () {
  this.ctx.restore();
};

Illo.prototype.setDragRotate = function( item ) {
  if ( !item ) {
    return;
  } else if ( item === true ) {
    item = this.anchor;
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

