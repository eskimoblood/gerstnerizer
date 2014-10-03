module.exports = function(points, offset) {

  var dist = Number.MAX_SAFE_INTEGER;
  var point;

  points.forEach(function(p) {
    var d = Math.sqrt(Math.pow(p.x - offset.x, 2) + Math.pow(p.y - offset.y, 2));
    if (d < dist) {
      point = p;
      dist = d;
    }
  });

  return point;

};