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
    return tp.map(x => x / det);
  }

  /**
   * Possible values of a point map:
   *   [x, y, width, height] => We use 3 points top-left, top-right, bottom-left
   *   [x, y] => image size is used for width and height with the above rule
   *   [vector, vector, vector] => provided points are used
   */
  function parsePointMap(img, map) {
    if (!Array.isArray(map) || !map.length) {
      map = [0, 0, img.width, img.height];
    }
    if (typeof(map[0]) == "number") {
      if (map.length < 4) {
        let tmp = map;
        map = [0, 0, img.width, img.height];
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
  function Texture(img, options ) {
    this.id = idCounter++;
    this.isTexture = true;
    this.img = img;

    options = options || { }
    this.src = parsePointMap(img, options.src);
    this.dst = parsePointMap(img, options.dst);

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
      this.pattern = ctx.createPattern(this.img, "repeat");
    }
    // pattern.setTransform is not supported in IE,
    // so transform the context instead
    ctx.transform(...this.getMatrix());
    return this.pattern;
  };

  const svgURI = 'http://www.w3.org/2000/svg';
  Texture.prototype.getSvgFill = function(svg) {
    if (!this.svgPattern) {
      this.svgPattern = document.createElementNS( svgURI, 'pattern');
      this.svgPattern.setAttribute("id", "texture_" + this.id);
      this.svgPattern.setAttribute("width", this.img.width);
      this.svgPattern.setAttribute("height", this.img.height);
      this.svgPattern.setAttribute("patternUnits", "userSpaceOnUse");

      let img = document.createElementNS( svgURI, 'image');
      img.setAttribute("href", this.img.src);
      this.svgPattern.appendChild(img);

      this.defs = document.createElementNS(svgURI, 'defs' );
      this.defs.appendChild(this.svgPattern);

    }
    this.svgPattern.setAttribute("patternTransform", `matrix(${this.getMatrix().join(' ')})`);
    svg.appendChild( this.defs );
    return `url(#texture_${this.id})`;
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
    return new Texture(this.img, this);
  };

  return Texture;
} ) );
