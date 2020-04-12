/**
 * Dragger
 */

( function( root, factory ) {
  // module definition
  if ( typeof module == 'object' && module.exports ) {
    // CommonJS
    module.exports = factory();
  } else {
    // browser global
    root.Zdog.Dragger = factory();
  }
}( this, function factory() {

// quick & dirty drag event stuff
// messes up if multiple pointers/touches

// check for browser window #85
var hasWindow = typeof window != 'undefined';
// event support, default to mouse events
var downEvent = 'mousedown';
var moveEvent = 'mousemove';
var upEvent = 'mouseup';
if ( hasWindow ) {
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
}

function noop() {}

function Dragger( options ) {
  this.create( options || {} );
}

Dragger.prototype.create = function( options ) {
  this.onDragStart = options.onDragStart || noop;
  this.onDragMove = options.onDragMove || noop;
  this.onDragEnd = options.onDragEnd || noop;

  this.bindDrag( options.startElement );
};

Dragger.prototype.bindDrag = function( element ) {
  element = this.getQueryElement( element );
  if ( !element ) {
    return;
  }
  // disable browser gestures #53
  element.style.touchAction = 'none';
  element.addEventListener( downEvent, this );
};

Dragger.prototype.getQueryElement = function( element ) {
  if ( typeof element == 'string' ) {
    // with string, query selector
    element = document.querySelector( element );
  }
  return element;
};

Dragger.prototype.handleEvent = function( event ) {
  var method = this[ 'on' + event.type ];
  if ( method ) {
    method.call( this, event );
  }
};

Dragger.prototype.onmousedown =
Dragger.prototype.onpointerdown = function( event ) {
  this.dragStart( event, event );
};

Dragger.prototype.ontouchstart = function( event ) {
  this.dragStart( event, event.changedTouches[0] );
};

Dragger.prototype.dragStart = function( event, pointer ) {
  event.preventDefault();
  this.dragStartX = pointer.pageX;
  this.dragStartY = pointer.pageY;
  if ( hasWindow ) {
    window.addEventListener( moveEvent, this );
    window.addEventListener( upEvent, this );
  }
  this.onDragStart( pointer );
};

Dragger.prototype.ontouchmove = function( event ) {
  // HACK, moved touch may not be first
  this.dragMove( event, event.changedTouches[0] );
};

Dragger.prototype.onmousemove =
Dragger.prototype.onpointermove = function( event ) {
  this.dragMove( event, event );
};

Dragger.prototype.dragMove = function( event, pointer ) {
  event.preventDefault();
  var moveX = pointer.pageX - this.dragStartX;
  var moveY = pointer.pageY - this.dragStartY;
  this.onDragMove( pointer, moveX, moveY );
};

Dragger.prototype.onmouseup =
Dragger.prototype.onpointerup =
Dragger.prototype.ontouchend =
Dragger.prototype.dragEnd = function( /* event */) {
  window.removeEventListener( moveEvent, this );
  window.removeEventListener( upEvent, this );
  this.onDragEnd();
};

return Dragger;

} ) );
