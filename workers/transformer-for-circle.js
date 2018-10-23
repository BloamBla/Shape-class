self.onmessage = (msg) => {
  const [x, y, radius, zoom] = msg.data;
  const coordinates = [];
  const DEGREES_IN_CIRCLE = 360;
  this.radius = radius * zoom;
  coordinates[0] = {x, y: y - this.radius};
  for (let i = 1; i < DEGREES_IN_CIRCLE; i++) {
    coordinates[i] = {
      x: ((coordinates[i - 1].x + (2 * Math.PI * this.radius / 360) - coordinates[0].x) * Math.cos(Math.PI / 180) -
        (coordinates[i - 1].y - coordinates[0].y) * Math.sin(Math.PI / 180)) + coordinates[0].x,
      y: ((coordinates[i - 1].x + (2 * Math.PI * this.radius / 360) - coordinates[0].x) * Math.sin(Math.PI / 180) +
        (coordinates[i - 1].y - coordinates[0].y) * Math.cos(Math.PI / 180)) + coordinates[0].y,
    };
  }
  self.postMessage(coordinates !== [] ? coordinates : 'coordinates is empty!');
};
