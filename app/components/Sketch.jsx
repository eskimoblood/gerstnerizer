/** @jsx React.DOM */

require('../styles/sketch.scss');

var React = require('react');
var Fluxxor = require("fluxxor");
var FluxChildMixin = Fluxxor.FluxChildMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;
var _ = require('lodash');
var geom = require('../geom');

var Sketch = React.createClass({

  mixins: [FluxChildMixin, StoreWatchMixin("Grid")],

  getStateFromFlux: function() {
    var flux = this.getFlux();
    var state = flux.store("Grid").getState();
    var type = state.type;
    var grid = geom.grid[type]({
      columns: 1, rows: 1, size: 200
    });
    var vertices = grid[0].points;

    return {
      type: type,
      vertices: vertices,
      center: grid,
      grid: geom.sketchRaster[type](vertices, state.rasterSize),
      lines: state.pattern
    }
  },

  render: function() {
    var translate = '';
    if (this.state.type === 'hex') {
      translate = 'translate(-75, -45)'
    }

    return <svg className="sketch" onMouseDown={this.startLine} onMouseUp={this.endLine}>
      <g transform={translate}>
        <polygon points={this.state.vertices} />
      {this.state.grid.map(function(c, i) {
        var key = 'p_' + i;
        return <circle cx={c.x} cy={c.y} r="1" key={key}/>
      })}
      {this.state.lines.map(function(line) {
        return <line
        x1={line[0].x}
        y1={line[0].y}
        x2={line[1].x}
        y2={line[1].y} />
      })}
      </g>
    </svg>
  },

  getOffset: function(e) {
    var node = this.getDOMNode();
    var x = e.clientX - node.offsetLeft;
    var y = e.clientY - node.offsetTop;

    if (this.state.type === 'hex') {
      x += 75;
      y += 45;
    }
    return {x: x, y: y};
  },
  startLine: function(e) {
    if (e.altKey) {
      return;
    }
    this.startPoint = geom.nearestPoint(this.state.grid, this.getOffset(e))
  },

  endLine: function(e) {
    var lines = this.state.lines;
    if (e.altKey) {
      lines = this.removeLine(e, lines);
    } else {
      var endPoint = geom.nearestPoint(this.state.grid, this.getOffset(e));
      lines.push([this.startPoint, endPoint]);
    }
    this.getFlux().actions.setPattern(lines);
  },

  removeLine: function(e, lines) {
    var offset = this.getOffset(e)

    return lines.filter(function(line) {
      return geom.distanceToLine(offset.x, offset.y, line[0].x, line[0].y, line[1].x, line[1].y) > 5;
    }, this)
  }

});

module.exports = Sketch;