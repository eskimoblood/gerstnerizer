/** @jsx React.DOM */

require('../styles/grid.scss');

var React = require('react');
var Fluxxor = require("fluxxor");
var FluxChildMixin = Fluxxor.FluxChildMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;
var geom = require('../geom');
var _ = require('lodash');
var perlin = require('perlin-noise');
var keymaster = require('keymaster');

var Example = React.createClass({

  mixins: [FluxChildMixin, StoreWatchMixin("Grid", 'Colors')],

  getStateFromFlux: function() {
    return this.getFlux().store("Grid").getState();
  },

  componentDidMount: function() {
    keymaster('ctrl+shift+s, ⌘+⇧+s', this.saveSvg);
  },

  saveSvg: function() {

    var url = "data:image/svg+xml;utf8," + encodeURIComponent(this.getDOMNode().innerHTML);

    var link = document.createElement("a");
    link.download = 'pattern';
    link.href = url;
    link.click();
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
    });
  },

  getPattern: function(c, p, noise, cnt) {

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
      var p1 = {x: c.x + points[0].x - p.x, y: c.y + points[0].y - p.y};
      var p2 = {x: c.x + points[1].x - p.x, y: c.y + points[1].y - p.y};

      for (var j = 0; j < this.patternSetting[this.state.type].c; j++) {

        var stroke = this.state.colors ? this.state.colors[Math.floor((this.state.colors.length - 1) * noise[(cnt * (i + 1 + j ) ) % noise.length])] : '';
        var rotation = this.patternSetting[this.state.type].d * j + t;

        lines.push(
          this.line(p1, p2, c, rotation, stroke),
          this.line(p1, p2, c, rotation, stroke, true)
        );

      }
    }

    return lines;
  },

  line: function(p1, p2, center, rotation, stroke, isMirrored) {
    var tr = 'rotate(' + rotation + ' ' + (center.x) + ' ' + (center.y) + ')';
    if (isMirrored) {
      tr += 'translate(' + 2 * (center.x) + ') scale(-1, 1)';
    }
    /* jshint ignore:start */
    return <line
    transform={tr}
    stroke={stroke}
    strokeWidth={this.state.strokeWidth}
    strokeOpacity={this.state.opacity}
    strokeLinecap="round"
    x1={p1.x}
    y1={p1.y}
    x2={p2.x}
    y2={p2.y} />
    /* jshint ignore:end */
  },

  grid: function() {
    var noise = perlin.generatePerlinNoise(20, 20, {octaveCount: 5,amplitude: 5});
    var type = this.state.type;
    var gridData = geom.grid[type](this.state);
    return gridData
      .map(function(c, i) {
        /* jshint ignore:start */
        return <g key={type + '_' + i}>
          <circle cx={c.x} cy={c.y} r="1"/>
          {this.getPattern(c, gridData[0], noise, i + 1)}
        </g>
        /* jshint ignore:end */
      }, this);
  },

  render: function() {
    /* jshint ignore:start */
    return <div className="row">
      <svg>
        <g className="grid">
          {this.grid()}
        </g>
      </svg>
    </div>;
    /* jshint ignore:end */
  }
});

module.exports = Example;

