describe('Classes testing', () => {
  let sqr, crcl, shape, x, y, radius, side, angle, width, height, test;

  beforeEach(function () {
    test = true;

    x = 200 + Math.floor(Math.random() * 100);
    y = 200 + Math.floor(Math.random() * 100);
    radius = Math.floor(Math.random() * 200);
    side = Math.floor(Math.random() * 200);
    angle = Math.floor(Math.random() * 360);
    width = 500 + Math.floor(Math.random() * 300);
    height = 500 + Math.floor(Math.random() * 300);
  });

  it('Transformer should be defined', () => {
    expect(Transformer).toBeDefined();
  });

  it('Shape should be instance of DrawCanvas', () => {
    expect(Shape).toBeDefined();
    shape = new Shape([{x, y}, {x: x + x, y: y + y}]);
    expect(shape instanceof Shape).toEqual(true);
    expect(shape instanceof DrawCanvas).toEqual(true);
  });

  it('ShapeSquare should be instance of Shape and DrawCanvas', () => {
    expect(ShapeSquare).toBeDefined();
    sqr = new ShapeSquare(x, y, side, angle, {width, height, test});
    expect(sqr instanceof ShapeSquare).toEqual(true);
    expect(sqr instanceof Shape).toEqual(true);
    expect(sqr instanceof DrawCanvas).toEqual(true);
  });

  it('ShapeSquare default values and coordinates should be correct', (done) => {
    expect(ShapeSquare).toBeDefined();
    sqr = new ShapeSquare(x, y, side, angle, {width, height, test});
    const sqrDefVal = sqr.defaultValues;
    const sqrExpectedVal = {angle, side, x, y};
    expect(sqrDefVal.x).toBe(sqrExpectedVal.x);
    expect(sqrDefVal.y).toBe(sqrExpectedVal.y);
    expect(sqrDefVal.side).toBe(sqrExpectedVal.side);
    expect(sqrDefVal.angle).toBe(sqrExpectedVal.angle);



    const msg = [x, y, side, angle, 1];
    const worker = new Worker('./base/workers/transformer-for-square.js');
    worker.onmessage = (result) => {
      const coordinates = [
        {x, y},
        {x: x + side * 1, y},
        {x: x + side * 1, y: y + side * 1},
        {x, y: y + side * 1},
      ];
      const turnedCoordinates = [];
      turnedCoordinates.push({x, y});
      for (let i = 1; i < coordinates.length; i++) {
        turnedCoordinates.push({
          x: ((coordinates[i].x - coordinates[0].x) * Math.cos(angle * Math.PI / 180) -
            (coordinates[i].y - coordinates[0].y) * Math.sin(angle * Math.PI / 180)) + turnedCoordinates[0].x,
          y: ((coordinates[i].x - coordinates[0].x) * Math.sin(angle * Math.PI / 180) +
            (coordinates[i].y - coordinates[0].y) * Math.cos(angle * Math.PI / 180)) + turnedCoordinates[0].y,
        });
      }
      expect(result.data).toEqual(turnedCoordinates);
      done();
    };

    worker.postMessage(msg);
  });

  it('ShapeCircle should be instance of Shape and DrawCanvas', () => {
    expect(ShapeCircle).toBeDefined();
    crcl = new ShapeCircle(x, y, radius, {width, height, test});
    expect(crcl instanceof ShapeCircle).toEqual(true);
    expect(crcl instanceof Shape).toEqual(true);
    expect(crcl instanceof DrawCanvas).toEqual(true);
  });

  it('ShapeCircle default values and coordinates should be correct', (done) => {
    expect(ShapeCircle).toBeDefined();
    crcl = new ShapeCircle(x, y, radius, {width, height, test});
    const crclDefVal = crcl.defaultValues;
    const crclExpectedVal = {x, y, radius};
    expect(crclDefVal.x).toBe(crclExpectedVal.x);
    expect(crclDefVal.y).toBe(crclExpectedVal.y);
    expect(crclDefVal.radius).toBe(crclExpectedVal.radius);

    const msg = [x, y, radius, 1];
    const worker = new Worker('./base/workers/transformer-for-circle.js');
    worker.onmessage = (result) => {
      const coordinates = [];
      const DEGREES_IN_CIRCLE = 360;
      coordinates[0] = {x, y: y - radius};
      for (let i = 1; i < DEGREES_IN_CIRCLE; i++) {
        coordinates[i] = {
          x: ((coordinates[i - 1].x + (2 * Math.PI * radius / 360) - coordinates[0].x) * Math.cos(Math.PI / 180) -
            (coordinates[i - 1].y - coordinates[0].y) * Math.sin(Math.PI / 180)) + coordinates[0].x,
          y: ((coordinates[i - 1].x + (2 * Math.PI * radius / 360) - coordinates[0].x) * Math.sin(Math.PI / 180) +
            (coordinates[i - 1].y - coordinates[0].y) * Math.cos(Math.PI / 180)) + coordinates[0].y,
        };
      }
      expect(result.data).toEqual(coordinates);
      done();
    };

    worker.postMessage(msg);
  });

  it('Circle should be instance of DrawCanvas', () => {
    expect(Circle).toBeDefined();
    let circle = new Circle(x, y, radius);
    expect(circle instanceof Circle).toEqual(true);
    expect(circle instanceof DrawCanvas).toEqual(true);
  });

  it('Square should be instance of DrawCanvas', () => {
    expect(Square).toBeDefined();
    let square = new Square(x, y, radius);
    expect(square instanceof Square).toEqual(true);
    expect(square instanceof DrawCanvas).toEqual(true);
  });
});
