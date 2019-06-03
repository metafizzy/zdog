// zdog-demo.js
document.addEventListener("DOMContentLoaded", function(event) {
  // Set width and height attributes of SVG
  let canvas = document.getElementsByClassName("zdog-canvas")[0];
  canvas.setAttribute("width", canvas.getBoundingClientRect().width);
  canvas.setAttribute("height", canvas.getBoundingClientRect().height);

  // Set illo zoom based on this size
  let zoomScale = Math.min(
    canvas.getBoundingClientRect().width,
    canvas.getBoundingClientRect().height
  );
  let illo = new Zdog.Illustration({
    // Set canvas with selector
    element: ".zdog-canvas",
    scale: (23 * zoomScale) / 250 //0.04*zoomScale,
  });

  // Coords for each pixel, if we were to plot this in 2D
  let coords = [
    { y: -2, x: -1 },
    { y: -2, x: 3 },
    { y: -1, x: -2 },
    { y: -1, x: -1 },
    { y: -1, x: 0 },
    { y: -1, x: 2 },
    { y: 0, x: -3 },
    { y: 0, x: -2 },
    { y: 0, x: -1 },
    { y: 0, x: 0 },
    { y: 0, x: 1 },
    { y: 1, x: -2 },
    { y: 1, x: -1 },
    { y: 1, x: 0 },
    { y: 1, x: 2 },
    { y: 2, x: -1 },
    { y: 2, x: 3 }
  ];

  let boxes = [];

  // Create a new box per coord
  coords.forEach(() => {
    boxes.push(
      new Zdog.Box({
        addTo: illo,
        color: "#fff",
        translate: { x: 0, y: 0 },
        stroke: 1,
        backface: "#000"
      })
    );
  });

  // Grow and disperse boxes on entry
  boxes.forEach((box, index) => {
    anime({
      targets: box,
      scale: {
        value: 1,
        duration: 650,
        easing: "easeInOutSine"
      }
    });
    anime({
      targets: box.translate,
      x: {
        value: coords[index].x,
        duration: 800,
        easing: "easeInOutSine"
      },
      y: {
        value: coords[index].y,
        duration: 800,
        easing: "easeInOutSine"
      }
    });
  });

  // Rotate pixel art into position, then add a periodic flip along the Y axis
  anime({
    targets: illo.rotate,
    // autoplay: false,
    x: {
      value: Zdog.TAU / 6,
      duration: 800,
      easing: "easeInOutSine"
    },
    y: {
      value: -Zdog.TAU,
      duration: 800,
      easing: "easeInOutSine"
    },
    z: {
      value: (-9 * Zdog.TAU) / 16,
      duration: 800,
      easing: "easeInOutSine"
    },
    complete: function() {
      anime({
        targets: illo.rotate,
        delay: 1500,
        loop: true,
        x: {
          value: 0 * Zdog.TAU + Zdog.TAU / 6,
          duration: 1600,
          easing: "easeInOutQuint"
        },
        y: {
          value: 1 * Zdog.TAU - Zdog.TAU,
          duration: 1600,
          easing: "easeInOutCubic"
        },
        z: {
          value: Zdog.TAU * 0 + (-9 * Zdog.TAU) / 16,
          duration: 1600,
          easing: "easeInOutCubic"
        }
      });
    }
  });

  // When we hit a key, move the boxes randomly up or down. R (keycode 114) to reset.
  window.addEventListener("keypress", function(e) {
    boxes
      .map(() => (e.keyCode == 114 ? 0 : anime.random(-2, 2)))
      .map((value, index) => {
        anime({
          targets: boxes[index].translate,
          z: {
            value: value,
            duration: 100,
            easing: "easeInOutCubic"
          }
        });
      });
  });

  // update & render
  function animate() {
    illo.updateRenderGraph();

    // animate next frame
    requestAnimationFrame(animate);
  }
  // start animation
  animate();
});
