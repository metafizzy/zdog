/* browser: true, undef: true, unused: true */

( function() {

  var canvas = document.createElement('canvas');
  canvas.width = 20;
  canvas.height = 20;
  var ctx = canvas.getContext('2d');
  ctx.lineWidth = 10;
  ctx.lineCap = 'round';
  ctx.strokeStyle = '#19F';
  ctx.beginPath();
  ctx.moveTo( 10, 10 );
  ctx.lineTo( 10, 10 );
  ctx.stroke();
  // document.body.appendChild( canvas );
  var imgData = ctx.getImageData( 9, 9, 1, 1 );
  var expectedData = [ 17, 153, 255, 255 ];
  var isLineDotSupported = true;
  for ( var i=0; i < imgData.data.length; i++ ) {
    var datamMatch = imgData.data[i] == expectedData[i];
    isLineDotSupported = isLineDotSupported && datamMatch;
    if ( !isLineDotSupported ) {
      break;
    }
  }
  window.isLineDotSupported = isLineDotSupported;

})();
