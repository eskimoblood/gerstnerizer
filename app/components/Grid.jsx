/** @jsx React.DOM */

require('../styles/grid.scss');

var React = require('react');
var Fluxxor = require("fluxxor");
var FluxChildMixin = Fluxxor.FluxChildMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

var geom = require('../geom');

var Example = React.createClass({

  mixins: [FluxChildMixin, StoreWatchMixin("Grid")],

  getStateFromFlux: function() {
    var flux = this.getFlux();
    return flux.store("Grid").getState();
  },

  patternSetting: {
    rect: {
      d: 90,
      c: 4
    },
    triangle: {
      d: 120,
      c: 3
    },
    hex: {
      d: 60,
      c: 6
    }
  },

  scale: function(points) {
    var scl = this.state.size / 200;
    return points.map(function(p) {
      return {
        x: p.x * scl,
        y: p.y * scl
      };
    })
  },

  getPattern: function(c, p) {
    if (!this.state.pattern) {
      return;
    }
    var t = 0;
    if (c.r % 2) {
      t = 180;
    }
    var lines = [];
    for (var i = 0; i < this.state.pattern.length; i++) {
      var points = this.scale(this.state.pattern[i]);
      for (var j = 0; j < this.patternSetting[this.state.type].c; j++) {
        var tr = 'rotate(' + (this.patternSetting[this.state.type].d * j + t) + ' ' + (c.x) + ' ' + (c.y) + ')';
        lines.push(<line transform={tr}
        x1={c.x + points[0].x - p.x}
        y1={c.y + points[0].y - p.y}
        x2={c.x + points[1].x - p.x}
        y2={c.y + points[1].y - p.y} />)
      }
    }
    return lines
  },

  grid: function() {
    var type = this.state.type;
    var gridData = geom.grid[type](this.state);
    return gridData
      .map(function(c, i) {
        return <g key={type + '_' + i}>
          <circle cx={c.x} cy={c.y} r="1"/>
          {this.getPattern(c, gridData[0])}
        </g>
      }, this);
  },

  render: function() {
    return <div className="row">
      <svg>
        <g className="grid">
          {this.grid()}
        </g>
      </svg>
    </div>;
  }
});

module.exports = Example;

