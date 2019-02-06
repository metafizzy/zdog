/**
 * Illustration
 */

( function( root, factory ) {
  // universal module definition
  var depends = [ './utils', './anchor', './dragger' ];
  /* globals define, module, require */
  if ( typeof define == 'function' && define.amd ) {
    // AMD
    define( depends, factory );
  } else if ( typeof module == 'object' && module.exports ) {
    // CommonJS
    module.exports = factory.apply( root, depends.map( require ) );
  } else {
    // browser global
    var Zdog = root.Zdog;
    Zdog.Illustration = factory( Zdog, Zdog.Anchor, Zdog.Dragger );
  }
}( this, function factory( utils, Anchor, Dragger ) {

function noop() {}
var TAU = utils.TAU;

var Illustration = Anchor.subclass({
  canvas: undefined,
  centered: true,
  zoom: 1,
  dragRotate: undefined,
  onPrerender: noop,
  onDragStart: noop,
  onDragMove: noop,
  onDragEnd: noop,
});

utils.extend( Illustration.prototype, Dragger.prototype );

Illustration.prototype.create = function( options ) {
  Anchor.prototype.create.call( this, options );
  Dragger.prototype.create.call( this, options );
  this.setCanvas( this.canvas );
  this.setDragRotate( this.dragRotate );
};

Illustration.prototype.setCanvas = function( canvas ) {
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

Illustration.prototype.prerender = function() {
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

Illustration.prototype.renderGraph = function( item ) {
  item = item || this;
  this.prerender();
  Anchor.prototype.renderGraph.call( item, this.ctx );
  this.postrender();
};

Illustration.prototype.postrender = function () {
  this.ctx.restore();
};

Illustration.prototype.setDragRotate = function( item ) {
  if ( !item ) {
    return;
  } else if ( item === true ) {
    item = this;
  }
  this.dragRotate = item;

  this.bindDrag( this.canvas );
};

Illustration.prototype.dragStart = function(/* event, pointer */) {
  this.dragStartRX = this.dragRotate.rotate.x;
  this.dragStartRY = this.dragRotate.rotate.y;
  Dragger.prototype.dragStart.apply( this, arguments );
};

Illustration.prototype.dragMove = function( event, pointer ) {
  var moveX = this.dragStartX - pointer.pageX;
  var moveY = this.dragStartY - pointer.pageY;
  var displaySize = this.width / this.pixelRatio;
  var rotateXMove = moveY / displaySize * TAU;
  var rotateYMove = moveX / displaySize * TAU;
  this.dragRotate.rotate.x = this.dragStartRX + rotateXMove;
  this.dragRotate.rotate.y = this.dragStartRY + rotateYMove;
  Dragger.prototype.dragMove.apply( this, arguments );
};

return Illustration;

}));
