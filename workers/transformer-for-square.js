self.onmessage = (msg) => {
  let [x, y, side, angle, zoom] = msg.data;
  const coordinates = [
    {x, y},
    {x: x + side * zoom, y},
    {x: x + side * zoom, y: y + side * zoom},
    {x, y: y + side * zoom},
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
  self.postMessage(turnedCoordinates !== [] ? turnedCoordinates : 'returnedCoordinates is empty!');
};
