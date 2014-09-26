module.exports = function triangle(settings) {
  var grid = [];
  var height = Math.sqrt(3) / 2 * settings.size;
  var width = settings.size / 2;
  var r = Math.sqrt(3) / 3 * settings.size;

  for (var i = 0; i < settings.columns; i++) {
    for (var j = 0; j < settings.rows; j++) {
      var offset = (j + i) % 2 ? r : height - r;
      var x = width + i * width;
      var y = height + j * height - offset;
      var points = calcPoints(x, y, r, j + (i % 2));

      grid.push({
        x: x,
        y: y,
        points: points,
        r: j + (i % 2)
      });
    }
  }
  return grid;
};

function calcPoints(x, y, r, d) {
  var points = [];
  for (var i = 0; i < 3; i++) {
    var angle = 2 * Math.PI / 3 * i - Math.PI / 2 - Math.PI * (d % 2);
    points.push(
      x + r * Math.cos(angle),
      y + r * Math.sin(angle)
    );
  }

  return points;
}