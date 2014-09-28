var splitLine = require('./splitLine');
var _ = require('lodash');

module.exports = {
  triangle: function(points, sections) {
    var line1 = line(points, 0, 1, 2, 3);
    var line2 = line(points, 0, 1, 4, 5);

    var line1Points = splitLine(line1, sections);
    var line2Points = splitLine(line2, sections);

    var raster = [];
    var length = line1Points.length;
    for (var i = 0; i < length; i++) {
      raster.push(splitLine({
        x1: line1Points[i].x,
        y1: line1Points[i].y,
        x2: line2Points[i].x,
        y2: line2Points[i].y
      }, i));
    }

    return _.flatten(raster);
  },

  rect: function(points, sections) {

    var line1 = line(points, 0, 1, 2, 3);
    var line2 = line(points, 6, 7, 4, 5);

    var line1Points = splitLine(line1, sections);
    var line2Points = splitLine(line2, sections);

    var raster = [];
    var length = line1Points.length;
    for (var i = 0; i < length; i++) {
      raster.push(splitLine({
        x1: line1Points[i].x,
        y1: line1Points[i].y,
        x2: line2Points[i].x,
        y2: line2Points[i].y
      }, sections));
    }

    return _.flatten(raster);
  },

  hex: function(points, sections) {

    var line1 = line(points, 0, 1, 10, 11);
    var line2 = line(points, 2, 3, 4, 5);

    var line3 = line(points, 6, 7, 4, 5);
    var line4 = line(points, 8, 9, 10, 11);

    var halfSection = sections / 2;

    var line1Points = splitLine(line1, halfSection);
    var line2Points = splitLine(line2, halfSection);
    var line3Points = splitLine(line3, halfSection);
    var line4Points = splitLine(line4, halfSection);

    var raster = [];
    var length = line1Points.length;
    for (var i = 0; i < length; i++) {
      raster.push(splitLine({
        x1: line1Points[i].x,
        y1: line1Points[i].y,
        x2: line2Points[i].x,
        y2: line2Points[i].y
      }, halfSection + i));

      if (i < length - 1) {
        raster.push(splitLine({
          x1: line3Points[i].x,
          y1: line3Points[i].y,
          x2: line4Points[i].x,
          y2: line4Points[i].y
        }, halfSection + i));

      }
    }
    return _.flatten(raster);
  }
};

function line(points, x1, y1, x2, y2) {
  return {x1: points[x1], y1: points[y1], x2: points[x2], y2: points[y2]};
}