fetch('zdog.json')
  .then(function( res ) {
    return res.json();
  })
  .then(function(model) {
    // ----- variables ----- //
    var sceneSize = 100;
    var TAU = Zdog.TAU;
    var initRotate = { x: 20/360 * TAU, y: -50/360 * TAU };

    // ----- model ----- //
    var illo = new Zdog.Illustration({
      element: '.illo',
      rotate: initRotate,
      dragRotate: true,
      resize: 'fullscreen',
      importGraph: model,
      onResize: function( width, height ) {
        this.zoom = Math.floor( Math.min( width, height ) * 2 / sceneSize ) / 2;
      },
    });

    // ----- animate ----- //

    function animate() {
      illo.updateRenderGraph();
      requestAnimationFrame(animate);
    }

    animate();
});
