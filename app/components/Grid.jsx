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

  scale: function(points, c) {
    var scl = this.state.size / 200;
    return _.reduce(points, function(r, p, key) {
      r[key] = {
        x: p.x * scl + c.x,
        y: p.y * scl + c.y
      };
      return r;
    }, {});
  },

  getPattern: function(c, p, noise, cnt) {
    var {colors, pattern} = this.state;
    if (!pattern) {
      return;
    }
    var t = 0;
    if (c.r % 2) {
      t = 180;
    }
    var lines = [];
    for (var i = 0; i < pattern.length; i++) {
      var line = this.scale(pattern[i], c);
      for (var j = 0; j < this.patternSetting[this.state.type].c; j++) {

        var n = noise[(cnt * (i + 1 + j ) ) % noise.length];
        //if (n < .7) {TODO add slider for this
        var n1 = noise[(cnt * (i + 1 * j ) ) % noise.length];

        var stroke = colors ? colors[Math.floor((colors.length) * n1)] : '';
        var rotation = this.patternSetting[this.state.type].d * j + t;

        lines.push(
          this.path(line, c, rotation, stroke, n),
          this.path(line, c, rotation, stroke, n, true)
        );
        //}

      }
    }

    return lines;
  },

  line: function(p1, p2, center, rotation, stroke, noise, isMirrored) {
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

  randomPoint: function(p, noise) {
    var angle = noise * Math.PI * 4;
    var rad = noise * this.state.distortion;
    return {x: p.x + Math.cos(angle) * rad, y: p.y + Math.sin(angle) * rad};
  },

  path: function(line, center, rotation, stroke, noise, isMirrored) {
    var tr = 'rotate(' + rotation + ' ' + (center.x) + ' ' + (center.y) + ')';
    if (isMirrored) {
      tr += 'translate(' + 2 * (center.x) + ') scale(-1, 1)';
    }
    var {p1, p2, c1, c2} = line;

    c1 = this.randomPoint((c1 || p1), noise);
    c2 = this.randomPoint((c2 || p2), noise);

    var d = ['M', p1.x, p1.y, 'C', c1.x, c1.y, c2.x, c2.y, p2.x, p2.y].join(' ');
    /* jshint ignore:start */
    return <path
      transform={tr}
      stroke={stroke}
      strokeWidth={this.state.strokeWidth * noise}
      strokeOpacity={.3 + this.state.opacity * noise}
      strokeLinecap="round"
      d={d}/>
    /* jshint ignore:end */
  },

  grid: function() {
    var type = this.state.type;
    var gridData = geom.grid[type](this.state);
    var noise = perlin.generatePerlinNoise(gridData.length, 20, {octaveCount: 5, amplitude: 5});
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

