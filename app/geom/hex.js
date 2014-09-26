module.exports = function hex(settings) {
  var grid = [];
  var height = settings.size;
  var width = Math.sqrt(3) / 2 * height;
  var vert = 3 / 4 * height;

  for (var i = 0; i < settings.columns; i++) {
    for (var j = 0; j < settings.rows; j++) {
      var x = width + i * width + (j % 2) * width / 2;
      var y = vert + j * vert;
      var points = calcPoints(x, y, height / 2);
      grid.push({
        x: x,
        y: y,
        points: points
      });
    }
  }
  return grid;
};

function calcPoints(x, y, r) {
  var points = [];
  for (var i = 0; i < 6; i++) {
    var angle =  Math.PI / 3 * (i + 0.5);
    points.push(
      x + r * Math.cos(angle),
      y + r * Math.sin(angle)
    );
  }
  return points;
}