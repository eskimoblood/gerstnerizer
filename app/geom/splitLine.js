module.exports = function splitLines(line, steps) {
  var startX = line.x1;
  var stepsX = (line.x2 - startX) / steps;
  var startY = line.y1;
  var stepsY = (line.y2 - startY) / steps;

  if (steps === 0) {
    return {x: line.x1, y: line.y1};
  }
  var points = [];
  for (var i = 0; i <= steps; i++) {
    points.push({
      x: startX + stepsX * i,
      y: startY + stepsY * i
    });
  }
  return points
};