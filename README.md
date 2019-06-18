# Zdog

_Round, flat, designer-friendly pseudo-3D engine_

View complete documentation and live demos at [zzz.dog](https://zzz.dog).

## Install

### Download

+ [zdog.dist.min.js](https://unpkg.com/zdog@1/dist/zdog.dist.min.js) minified, or
+ [zdog.dist.js](https://unpkg.com/zdog@1/dist/zdog.dist.js) un-minified

### CDN

Link directly to Zdog JS on [unpkg](https://unpkg.com).

``` html
<script src="https://unpkg.com/zdog@1/dist/zdog.dist.min.js"></script>
```

### Package managers

npm: `npm install zdog`

Bower: `bower install zdog`

## Hello world demo

Create 3D models with Zdog by adding shapes. See [Getting started](https://zzz.dog/getting-started) for a walk-through of this demo.

``` js
let isSpinning = true;

let illo = new Zdog.Illustration({
  element: '.zdog-canvas',
  zoom: 4,
  dragRotate: true,
  // stop spinning when drag starts
  onDragStart: function() {
    isSpinning = false;
  },
});

// circle
new Zdog.Ellipse({
  addTo: illo,
  diameter: 20,
  translate: { z: 10 },
  stroke: 5,
  color: '#636',
});

// square
new Zdog.Rect({
  addTo: illo,
  width: 20,
  height: 20,
  translate: { z: -10 },
  stroke: 3,
  color: '#E62',
  fill: true,
});

function animate() {
  illo.rotate.y += isSpinning ? 0.03 : 0;
  illo.updateRenderGraph();
  requestAnimationFrame( animate );
}
animate();
```

## About Zdog

Hi, [Dave here](https://desandro.com). I wanted to make a video game. I needed a 3D engine, but most engines were too powerful and complex for me. I made Zdog so I could design and display simple 3D models without a lot of overhead.

Zdog is directly inspired by [Dogz](https://en.wikipedia.org/wiki/Petz), a virtual pet game by P.F. Magic released in 1995. It used flat 2D circle sprites to render the Dogz’ models, but in a 3D scene. [See Dogz playthrough video here.](https://www.youtube.com/watch?v=6lKSn_cHw5k) Dogz were fully animated in real time, running, flopping, scratching (on Windows 3.1!). It was remarkable.

Zdog uses the same principle. It renders all shapes using the 2D drawing APIs in either `<canvas>` or `<svg>`. Spheres are actually dots. Toruses are actually circles. Capsules are actually thick lines. It’s a simple, but effective trick. The underlying 3D math comes from [Rotating 3D Shapes](https://www.khanacademy.org/computing/computer-programming/programming-games-visualizations/programming-3d-shapes/a/rotating-3d-shapes) by [Peter Collingridge](https://petercollingridge.appspot.com/3D-tutorial/rotating-objects).

Zdog is pronounced "Zee-dog" in American parlance or "Zed-dog" in British.

### Beta!

Zdog v1 is a beta-release, of sorts. This is my first time creating a 3D engine, so I probably got some stuff wrong. Expect lots of changes for v2. Provide input and select new features on the [Zdog issue tracker on GitHub](https://github.com/metafizzy/zdog/issues).

### More Zdog resources

Other people's stuff:

+ [Zfont](https://jaames.github.io/zfont/) - Text plugin for Zdog
+ [vue-zdog](https://github.com/AlexandreBonaventure/vue-zdog) - Vue wrapper for Zdog
+ [zDogPy](https://github.com/gferreira/zdogpy) - Python port of Zdog for DrawBot
+ [Made with Zdog CodePen Collection](https://codepen.io/collection/DzdGMe/)
+ [Made with Zdog on Twitter](https://twitter.com/i/moments/1135000612356206592)

My stuff:

+ [Zdog demos on CodePen](https://github.com/metafizzy/zdog-demos), source code at [zdog-demos](https://github.com/metafizzy/zdog-demos)
+ [zdog-docs](https://github.com/metafizzy/zdog-docs) - Docs site source code

---

Licensed MIT. Made by Metafizzy 🌈🐻
