var distanceToPoint = require('./distanceToPoint');
module.exports = function nearestPoint(points, offset) {

  var dist = Number.MAX_SAFE_INTEGER;
  var point;

  points.forEach(function(p) {
    var d = distanceToPoint(p, offset);
    if (d < dist) {
      point = p;
      dist = d;
    }
  });

  return {point: point, dist: dist};

};