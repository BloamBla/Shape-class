const DEFAULT_OPTIONS = {width: 800, height: 600};

class Transformer {
  static getCoordinatesForCircle(x, y, radius, zoom = 1, test = false) {
    return new Promise((resolve, reject) => {
      const url = test === true ? './base/' : '';
      const circleTransformerWorker = new Worker(`${url}workers/transformer-for-circle.js`);
      const msg = [x, y, radius, zoom];
      circleTransformerWorker.postMessage(msg);
      circleTransformerWorker.onmessage = (newMsg) => {
        newMsg.data ? resolve(newMsg.data) : reject('some error');
      };
    });
  }

  static getCoordinatesForSquare(x, y, side, angle = 0, zoom = 1, test = false) {
    return new Promise((resolve, reject) => {
      const url = test === true ? './base/' : '';
      const squareTransformerWorker = new Worker(`${url}workers/transformer-for-square.js`);
      const msg = [x, y, side, angle, zoom];
      squareTransformerWorker.postMessage(msg);
      squareTransformerWorker.onmessage = (newMsg) => {
        newMsg.data ? resolve(newMsg.data) : reject('some error');
      };
    });
  }
}

class DrawCanvas {
  constructor(options = DEFAULT_OPTIONS) {
    this.canvas = document.createElement('canvas');
    this.canvas.width = options.width;
    this.canvas.height = options.height;
    this.canvas.style.position = 'absolute';
    this.canvas.style.border = '1px solid black';
    document.body.appendChild(this.canvas);
    this.canvasContext = this.canvas.getContext('2d');
  }

  draw(callback) {
    this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.canvasContext.beginPath();
    callback(this.canvasContext);
    this.canvasContext.closePath();
    this.canvasContext.stroke();
  };
}

class Shape extends DrawCanvas {
  constructor(coordinates, options = DEFAULT_OPTIONS) {
    super(options);
    this.defaultCoordinates = coordinates;
    this.currentCoordinates = coordinates;
    this.zoom = 1;
    this.draw(context => {
      for (const elem of this.currentCoordinates) {
        context.lineTo(elem.x, elem.y);
      }
    });
  }

  reDraw(newCoordinates) {
    this.currentCoordinates = newCoordinates;
    this.draw(context => {
      for (let i = 0; i < newCoordinates.length; i++) {
        context.lineTo(newCoordinates[i].x, newCoordinates[i].y);
      }
    });
  }

  scale(newZoom) {
    this.zoom = newZoom;
    this.draw(context => {
      for (let i = 0; i < this.currentCoordinates.length; i++) {
        context.lineTo(this.currentCoordinates[i].x * this.zoom,
          this.currentCoordinates[i].y * this.zoom);
      }
    });
  }

  reset() {
    this.currentCoordinates = this.defaultCoordinates;
    this.zoom = 1;
    this.draw(context => {
      for (const elem of this.currentCoordinates) {
        context.lineTo(elem.x, elem.y);
      }
    });
  }
}

class ShapeSquare extends Shape {
  constructor(x, y, side, angle = 0, options = DEFAULT_OPTIONS) {
    super([], options);
    this.defaultValues = {angle, side, x, y};
    this.x = x;
    this.y = y;
    this.side = side;
    this.angle = angle;
    this.zoom = 1;
    this.defaultCoordinates = [];
    this.currentCoordinates = [];
    this.test = !!options.test;
    (async () => {
      const coordinates = await Transformer.getCoordinatesForSquare(x, y, side, angle, this.zoom, this.test);
      this.defaultCoordinates = coordinates;
      this.currentCoordinates = coordinates;
      this.draw(context => {
        for (const elem of coordinates) {
          context.lineTo(elem.x, elem.y);
        }
      });
    })();
  }

  reDraw(newX, newY, newSide, newAngle = 0) {
    this.x = newX;
    this.y = newY;
    this.side = newSide;
    this.angle = newAngle;
    (async () => {
      const coordinates = await Transformer.getCoordinatesForSquare(newX, newY, newSide, newAngle, this.zoom, this.test);
      this.currentCoordinates = coordinates;
      super.reDraw(coordinates);
    })();
  }

  scale(newZoom) {
    (async () => {
      const coordinates = await Transformer.getCoordinatesForSquare(this.x, this.y, this.side, this.angle, newZoom, this.test);
      this.currentCoordinates = coordinates;
      this.zoom = newZoom;
      super.reDraw(coordinates);
    })();
  }

  reset() {
    this.x = this.defaultValues.x;
    this.y = this.defaultValues.y;
    this.side = this.defaultValues.side;
    this.angle = this.defaultValues.angle;
    this.zoom = 1;
    this.currentCoordinates = this.defaultCoordinates;
    super.reset();
  }
}

class ShapeCircle extends Shape {
  constructor(x, y, radius, options = DEFAULT_OPTIONS) {
    super([], options);
    this.defaultValues = {x, y, radius};
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.zoom = 1;
    this.currentCoordinates = [];
    this.defaultCoordinates = [];
    this.test = !!options.test;
    (async () => {
      const coordinates = await Transformer.getCoordinatesForCircle(x, y, radius, this.zoom, this.test);
      this.defaultCoordinates = coordinates;
      this.currentCoordinates = coordinates;
      this.draw(context => {
        for (const elem of coordinates) {
          context.lineTo(elem.x, elem.y);
        }
      });
    })();
  }

  reDraw(newX, newY, newRadius) {
    this.x = newX;
    this.y = newY;
    this.radius = newRadius;
    (async () => {
      const coordinates = await Transformer.getCoordinatesForCircle(this.x, this.y, this.radius, this.zoom, this.test);
      this.currentCoordinates = coordinates;
      super.reDraw(coordinates);
    })();
  }

  scale(newZoom) {
    this.zoom = newZoom;
    (async () => {
      const coordinates = await Transformer.getCoordinatesForCircle(this.x, this.y, this.radius, this.zoom, this.test);
      this.currentCoordinates = coordinates;
      super.reDraw(coordinates);
    })();
  }

  reset() {
    this.x = this.defaultValues.x;
    this.y = this.defaultValues.y;
    this.radius = this.defaultValues.radius;
    this.zoom = 1;
    this.currentCoordinates = this.defaultCoordinates;
    super.reset();
  }
}

class Circle extends DrawCanvas {
  constructor(x, y, radius, options = DEFAULT_OPTIONS) {
    super(options);
    this.defaultValues = {x, y, radius};
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.zoom = 1;
    this.draw(context => {
      context.arc(x, y, radius, 0, 360 * Math.PI / 180);
    });
  }

  reDraw(newX, newY, newRadius) {
    this.x = newX;
    this.y = newY;
    this.radius = newRadius;
    this.draw(context => {
      context.arc(newX * this.zoom, newY * this.zoom, newRadius * this.zoom, 0, 360 * Math.PI / 180);
    });
  }

  scale(newZoom) {
    this.zoom = newZoom;
    this.draw(context => {
      context.arc(this.x, this.y, this.radius * newZoom, 0, 360 * Math.PI / 180);
    });
  }

  reset() {
    this.x = this.defaultValues.x;
    this.y = this.defaultValues.y;
    this.radius = this.defaultValues.radius;
    this.zoom = 1;
    this.draw(context => {
      context.arc(this.x, this.y, this.radius, 0, 360 * Math.PI / 180);
    });
  }
}

class Square extends DrawCanvas {
  constructor(x, y, side, options = DEFAULT_OPTIONS) {
    super(options);
    this.defaultValues = {x, y, side};
    this.x = x;
    this.y = y;
    this.side = side;
    this.zoom = 1;
    this.draw(context => {
      context.rect(x, y, side, side);
    });
  }

  reDraw(newX, newY, newSide) {
    this.x = newX;
    this.y = newY;
    this.side = newSide;
    this.draw(context => {
      context.rect(newX, newY, newSide * this.zoom, newSide * this.zoom);
    });
  }

  scale(newZoom) {
    this.zoom = newZoom;
    this.draw(context => {
      context.rect(this.x, this.y, this.side * newZoom, this.side * newZoom);
    });
  }

  reset() {
    this.x = this.defaultValues.x;
    this.y = this.defaultValues.y;
    this.side = this.defaultValues.side;
    this.zoom = 1;
    this.draw(context => {
      context.rect(this.x, this.y, this.side, this.side);
    });
  }
}

let sqr, shpSqr, crcl, shpCrcl, x, y, radius, side, angle, width, height;

function debounce(callback, awaitTime) {
  let timer = null;
  return () => {
    this.context = this;
    this.arguments;
    this.func = () => {
      callback.apply(this.context, this.arguments);
      timer = null;
    };
    if(timer) {
      clearInterval(timer);
    }
    timer = setTimeout(this.func, awaitTime);
  };
}

function throttle(callback, awaitTime) {
  let closed = false;
  return () => {
    if(closed === false) {
      closed = true;
      this.context = this;
      this.arguments = arguments;
      this.func = () => {
        callback.apply(this.context, this.arguments);
        setTimeout(() => {closed = false;}, awaitTime);
      };
      this.func();
    }
  };
}

const someDebounceFunc = debounce(() => {
  x = 200 + Math.floor(Math.random() * 100);
  y = 200 + Math.floor(Math.random() * 100);
  radius = Math.floor(Math.random() * 200);
  side = Math.floor(Math.random() * 200);
  angle = Math.floor(Math.random() * 360);
  width = 500 + Math.floor(Math.random() * 300);
  height = 500 + Math.floor(Math.random() * 300);

  shpSqr = new ShapeSquare(x, y, side, angle, {width, height});
  shpCrcl = new ShapeCircle(x, y, radius, {width, height});
  sqr = new Square(x, y, side, {width, height});
  crcl = new Circle(x, y, radius, {width, height});

  console.log('debounce');
}, 1000);

const someThrottleFunc = throttle(() => {
    x = 200 + Math.floor(Math.random() * 100);
    y = 200 + Math.floor(Math.random() * 100);
    radius = Math.floor(Math.random() * 200);
    side = Math.floor(Math.random() * 200);
    angle = Math.floor(Math.random() * 360);
    width = 500 + Math.floor(Math.random() * 300);
    height = 500 + Math.floor(Math.random() * 300);

    shpSqr = new ShapeSquare(x, y, side, angle, {width, height});
    shpCrcl = new ShapeCircle(x, y, radius, {width, height});
    sqr = new Square(x, y, side, {width, height});
    crcl = new Circle(x, y, radius, {width, height});

  console.log('throttle');
}, 1000);

function someFunc() {
  setTimeout(someThrottleFunc);
  setTimeout(someThrottleFunc, 250);
  setTimeout(someThrottleFunc, 500);
  setTimeout(someThrottleFunc, 750);
  setTimeout(someThrottleFunc, 1000);
  setTimeout(someThrottleFunc, 1250);
  setTimeout(someThrottleFunc, 1500);
  setTimeout(someThrottleFunc, 1750);
  setTimeout(someThrottleFunc, 2000);
  setTimeout(someThrottleFunc, 2250);
  setTimeout(someThrottleFunc, 2500);
  setTimeout(someThrottleFunc, 2750);
  setTimeout(someThrottleFunc, 3000);
  setTimeout(someThrottleFunc, 3250);

  setTimeout(someDebounceFunc);
  setTimeout(someDebounceFunc, 250);
  setTimeout(someDebounceFunc, 500);
  setTimeout(someDebounceFunc, 750);
  setTimeout(someDebounceFunc, 1000);
  setTimeout(someDebounceFunc, 1250);
  setTimeout(someDebounceFunc, 1500);
  setTimeout(someDebounceFunc, 1750);
  setTimeout(someDebounceFunc, 2000);
  setTimeout(someDebounceFunc, 2250);
  setTimeout(someDebounceFunc, 2500);
  setTimeout(someDebounceFunc, 2750);
  setTimeout(someDebounceFunc, 3000);
  setTimeout(someDebounceFunc, 3250);
}

window.addEventListener('DOMContentLoaded', someFunc);
