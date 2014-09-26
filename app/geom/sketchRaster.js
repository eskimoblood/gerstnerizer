var splitLine = require('./splitLine');
var _ = require('lodash');

module.exports = {
  triangle: function(points, sections) {
    var line1 = {x1: points[0], y1: points[1], x2: points[2], y2: points[3]};
    var line2 = {x1: points[0], y1: points[1], x2: points[4], y2: points[5]};

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

    var line1 = {x1: points[0], y1: points[1], x2: points[2], y2: points[3]};
    var line2 = {x1: points[6], y1: points[7], x2: points[4], y2: points[5]};

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
    if (sections % 2 === 1) {
      sections =+1;
    }

    var line1 = {x1: points[0], y1: points[1], x2: points[10], y2: points[11]};
    var line2 = {x1: points[2], y1: points[3], x2: points[4], y2: points[5]};
    var line3 = {x1: points[6], y1: points[7], x2: points[4], y2: points[5]};
    var line4 = {x1: points[8], y1: points[9], x2: points[10], y2: points[11]};


    var line1Points = splitLine(line1, sections / 2);
    var line2Points = splitLine(line2, sections / 2);
    var line3Points = splitLine(line3, sections / 2);
    var line4Points = splitLine(line4, sections / 2);

    var raster = [];
    var length = line1Points.length;
    for (var i = 0; i < length; i++) {
      raster.push(splitLine({
        x1: line1Points[i].x,
        y1: line1Points[i].y,
        x2: line2Points[i].x,
        y2: line2Points[i].y
      }, sections / 2 + i));
    }

    for (var i = 0; i < length - 1; i++) {
      raster.push(splitLine({
        x1: line3Points[i].x,
        y1: line3Points[i].y,
        x2: line4Points[i].x,
        y2: line4Points[i].y
      }, sections / 2 + i));
    }
    console.log(_.flatten(raster));
    return _.flatten(raster);
  }
};