module.exports = function hex(settings) {
  var grid = [];
  var size = settings.size;
  var halfSize = size / 2;

  for (var i = 0; i < settings.columns; i++) {
    for (var j = 0; j < settings.rows; j++) {
      var x = i * size;
      var y = j * size;
      grid.push({
        x: x + halfSize,
        y: y + halfSize,
        points: [
          x, y,
          x + size, y,
          x + size, y + size,
          x, y + size
        ]
      });
    }
  }
  return grid;
};

