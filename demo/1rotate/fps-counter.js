( function() {

var outputElem = document.createElement('div');
outputElem.style.fontFamily = 'monospace';
outputElem.style.fontSize = '20px';
outputElem.style.position = 'absolute';
outputElem.style.top = '10px';
outputElem.style.left = '10px';

var prevTickTime = new Date();
var prevUpdateTime = new Date();

var tickTimeDeltas = [];

function tick() {
  var now = new Date();
  var tickTimeDelta = now - prevTickTime;
  tickTimeDeltas.push( tickTimeDelta );

  var updateTimeDelta = now - prevUpdateTime;
  if ( updateTimeDelta > 500 ) {
    update( now );
  }
  prevTickTime = now;
  requestAnimationFrame( tick );
}

function update( now ) {
  var avgDelta = averageArray( tickTimeDeltas );
  outputElem.textContent = Math.round( 1000 / avgDelta );

  // reset
  tickTimeDeltas = [];
  prevUpdateTime = now;

}

function averageArray( ary ) {
  var sum = 0;
  for ( var i=0, len = ary.length; i < len; i++ ) {
    sum += ary[i];
  }
  return sum / len;
}

document.body.appendChild( outputElem );
tick();

})();
