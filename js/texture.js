/**
 * Texture
 */
( function( root, factory ) {
    // module definition
    if ( typeof module == 'object' && module.exports ) {
      // CommonJS
      module.exports = factory(require('./vector'));
    } else {
      // browser global
      var Zdog = root.Zdog;
      Zdog.Texture = factory(Zdog.Vector);
    }
  }( this, function factory(Vector) {

  /**
   * Calculates the inverse of the matrix:
   *  | x1 x2 x3 |
   *  | y1 y2 y3 |
   *  |  1  1  1 |
   */
  function inverse(x1, y1, x2, y2, x3, y3) {
    let tp = [
      y2 - y3, x3 - x2, x2*y3 - x3*y2,
      y3 - y1, x1 - x3, x3*y1 - x1*y3,
      y1 - y2, x2 - x1, x1*y2 - x2*y1];
    let det = tp[2] + tp[5] + tp[8];
    return tp.map(function(x) { return x / det;});
  }

  function parsePointMap(size, map) {
    if (!Array.isArray(map) || !map.length) {
      map = [0, 0, size[0], size[1]];
    }
    if (typeof(map[0]) == "number") {
      if (map.length < 4) {
        let tmp = map;
        map = [0, 0, size[0], size[1]];
        for (let i = 0; i < tmp.length; i++) {
          map[i] = tmp[i];
        }
      }
      return [
          new Vector({x:map[0], y:map[1], z:1}),
          new Vector({x:map[0] + map[2], y:map[1], z:1}),
          new Vector({x:map[0], y:map[1] + map[3], z:1})
        ];
    } else {
      return [new Vector(map[0]), new Vector(map[1]), new Vector(map[2])];
    }
  }

  var idCounter = 0;

  const optionKeys = [
    'img',
    'linearGrad',
    'radialGrad',
    'colorStops',
    'src',
    'dst'
  ]

  /**
   * Creates a tecture map. Possible options:
   *    img: Image object to be used as texture
   *    linearGrad: [x1, y1, x2, y2]  Array defining the linear gradient
   *    radialGrad: [x0, y0, r0, x1, y1, r1] Array defining the radial gradient
   *    colorStops: [offset1, color1, offset2, color2...] Array defining the color
   *                stops for the gradient, offset must be in range [0, 1]
   *
   *    src: <surface definition> Represents the surface for the texture. Above
   *         gradient definition should be represented in this coordinate space
   *    dst: <surface definition> Represents the surface of the object. This allows
   *         keeping the texture definition independent of the surface definition
   *
   *   <surface definition> Can be represented in one of the following ways:
   *     [x, y, width, height] => We use 3 points top-left, top-right, bottom-left
   *     [x, y] => image/gradient size is used for width and height with the above rule
   *     [vector, vector, vector] => provided points are used
   */
  function Texture(options) {
    this.id = idCounter++;
    this.isTexture = true;

    options = options || { }
    for (var key in options ) {
      if (optionKeys.indexOf( key ) != -1 ) {
        this[key] = options[key];
      }
    }

    var size;
    if (options.img) {
      size = [options.img.width, options.img.height];
    } else if (options.linearGrad) {
      size = [Math.abs(options.linearGrad[2] - options.linearGrad[0]), Math.abs(options.linearGrad[3] - options.linearGrad[1])];
    } else if (options.radialGrad) {
      size = [Math.abs(options.radialGrad[3] - options.radialGrad[0]), Math.abs(options.radialGrad[4] - options.radialGrad[1])];
    } else {
      throw "One of [img, linearGrad, radialGrad] is required";
    }
    if (size[0] == 0) size[0] = size[1];
    if (size[1] == 0) size[1] = size[0];

    this.src = parsePointMap(size, options.src);
    this.dst = parsePointMap(size, options.dst);

    this.srcInverse = inverse(
      this.src[0].x, this.src[0].y,
      this.src[1].x, this.src[1].y,
      this.src[2].x, this.src[2].y);
    this.p1 = new Vector();
    this.p2 = new Vector();
    this.p3 = new Vector();
    this.matrix = [0, 0, 0, 0, 0, 0];
  };

  Texture.prototype.getMatrix = function() {
    let m = this.matrix;
    let inverse = this.srcInverse;
    m[0] = this.p1.x * inverse[0] + this.p2.x * inverse[3] + this.p3.x * inverse[6];
    m[1] = this.p1.y * inverse[0] + this.p2.y * inverse[3] + this.p3.y * inverse[6];
    m[2] = this.p1.x * inverse[1] + this.p2.x * inverse[4] + this.p3.x * inverse[7];
    m[3] = this.p1.y * inverse[1] + this.p2.y * inverse[4] + this.p3.y * inverse[7];
    m[4] = this.p1.x * inverse[2] + this.p2.x * inverse[5] + this.p3.x * inverse[8];
    m[5] = this.p1.y * inverse[2] + this.p2.y * inverse[5] + this.p3.y * inverse[8];
    return m;
  }

  Texture.prototype.getCanvasFill = function(ctx) {
    if (!this.pattern) {
      if (this.img) {
        this.pattern = ctx.createPattern(this.img, "repeat");
      } else {
        this.pattern = this.linearGrad
          ? ctx.createLinearGradient.apply(ctx, this.linearGrad)
          : ctx.createRadialGradient.apply(ctx, this.radialGrad);
        if (this.colorStops) {
          for (var i = 0; i < this.colorStops.length; i+=2) {
            this.pattern.addColorStop(this.colorStops[i], this.colorStops[i+1]);
          }
        }
      }
    }
    // pattern.setTransform is not supported in IE,
    // so transform the context instead
    ctx.transform.apply(ctx, this.getMatrix());
    return this.pattern;
  };

  const svgURI = 'http://www.w3.org/2000/svg';
  Texture.prototype.getSvgFill = function(svg) {
    if (!this.svgPattern) {
      if (this.img) {
        this.svgPattern = document.createElementNS( svgURI, 'pattern');
        this.svgPattern.setAttribute("width", this.img.width);
        this.svgPattern.setAttribute("height", this.img.height);
        this.svgPattern.setAttribute("patternUnits", "userSpaceOnUse");
        this.attrTransform = "patternTransform";

        let img = document.createElementNS( svgURI, 'image');
        img.setAttribute("href", this.img.src);
        this.svgPattern.appendChild(img);
      } else {
        var type, vals, keys;
        if (this.linearGrad) {
          type = "linearGradient";
          vals = this.linearGrad;
          keys = ["x1", "y1", "x2", "y2"]
        } else {
          type = "radialGradient";
          vals = this.radialGrad;
          keys = ["fx", "fy", "fr", "cx", "cy", "r"]
        }
        this.svgPattern = document.createElementNS( svgURI, type);
        for (var i = 0; i < keys.length; i++) {
          this.svgPattern.setAttribute(keys[i], vals[i]);
        }

        if (this.colorStops) {
          for (var i = 0; i < this.colorStops.length; i+=2) {
            let colorStop = document.createElementNS(svgURI, 'stop' );
            colorStop.setAttribute("offset", this.colorStops[i]);
            colorStop.setAttribute("style", "stop-color:" + this.colorStops[i+1]);
            this.svgPattern.appendChild(colorStop);
          }
        }
        this.svgPattern.setAttribute("gradientUnits", "userSpaceOnUse");
        this.attrTransform = "gradientTransform";
      }
      this.svgPattern.setAttribute("id", "texture_" + this.id);
      this._svgUrl = 'url(#texture_' + this.id + ')';

      this.defs = document.createElementNS(svgURI, 'defs' );
      this.defs.appendChild(this.svgPattern);
    }

    this.svgPattern.setAttribute(this.attrTransform, 'matrix(' + this.getMatrix().join(' ') + ')');
    svg.appendChild( this.defs );
    return this._svgUrl;
  }

  // ----- update ----- //
  Texture.prototype.reset = function() {
    this.p1.set(this.dst[0]);
    this.p2.set(this.dst[1]);
    this.p3.set(this.dst[2]);
  };

  Texture.prototype.transform = function( translation, rotation, scale ) {
    this.p1.transform(translation, rotation, scale);
    this.p2.transform(translation, rotation, scale);
    this.p3.transform(translation, rotation, scale);
  };

  Texture.prototype.clone = function() {
    return new Texture(this);
  };

  return Texture;
} ) );
