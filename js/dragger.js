/**
 * Dragger
 */

( function( root, factory ) {
  // universal module definition
  /* globals define, module */
  if ( typeof define == 'function' && define.amd ) {
    // AMD
    define( factory );
  } else if ( typeof module == 'object' && module.exports ) {
    // CommonJS
    module.exports = factory();
  } else {
    // browser global
    root.Zdog.Dragger = factory();
  }
}( this, function factory() {

// quick & dirty drag event stuff
// messes up if multiple pointers/touches

// event support, default to mouse events
var downEvent = 'mousedown';
var moveEvent = 'mousemove';
var upEvent = 'mouseup';
if ( window.PointerEvent ) {
  // PointerEvent, Chrome
  downEvent = 'pointerdown';
  moveEvent = 'pointermove';
  upEvent = 'pointerup';
} else if ( 'ontouchstart' in window ) {
  // Touch Events, iOS Safari
  downEvent = 'touchstart';
  moveEvent = 'touchmove';
  upEvent = 'touchend';
}

function noop() {}

function Dragger( options ) {
  this.startElement = options.startElement;
  this.onPointerDown = options.onPointerDown || noop;
  this.onPointerMove = options.onPointerMove || noop;
  this.onPointerUp = options.onPointerUp || noop;
  
  this.startElement.addEventListener( downEvent, this );
}

Dragger.prototype.handleEvent = function( event ) {
  var method = this[ 'on' + event.type ];
  if ( method ) {
    method.call( this, event );
  }
};

Dragger.prototype.onmousedown =
Dragger.prototype.onpointerdown = function( event ) {
  this.pointerDown( event, event );
};

Dragger.prototype.ontouchstart = function( event ) {
  this.pointerDown( event, event.changedTouches[0] );
};

Dragger.prototype.pointerDown = function( event, pointer ) {
  event.preventDefault();
  this.dragStartX = pointer.pageX;
  this.dragStartY = pointer.pageY;
  window.addEventListener( moveEvent, this );
  window.addEventListener( upEvent, this );
  this.onPointerDown( pointer );
};

Dragger.prototype.ontouchmove = function( event ) {
  // HACK, moved touch may not be first
  this.pointerMove( event, event.changedTouches[0] );
};

Dragger.prototype.onmousemove =
Dragger.prototype.onpointermove = function( event ) {
  this.pointerMove( event, event );
};

Dragger.prototype.pointerMove = function( event, pointer ) {
  event.preventDefault();
  var moveX = this.dragStartX - pointer.pageX;
  var moveY = this.dragStartY - pointer.pageY;
  this.onPointerMove( pointer, moveX, moveY );
};

Dragger.prototype.onmouseup = 
Dragger.prototype.onpointerup =
Dragger.prototype.ontouchend =
Dragger.prototype.pointerUp = function( event ) {
  window.removeEventListener( moveEvent, this );
  window.removeEventListener( upEvent, this );
  this.onPointerUp( event );
};

return Dragger;

}));
