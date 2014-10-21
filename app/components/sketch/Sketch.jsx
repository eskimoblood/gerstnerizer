/** @jsx React.DOM */

require('../../styles/sketch.scss');
require('../../styles/flaticon.css');

var React = require('react');
var Fluxxor = require("fluxxor");
var FluxChildMixin = Fluxxor.FluxChildMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;
var RandomLines = require('./RandomLines');
var _ = require('lodash');
var geom = require('../../geom/index');
var Lines = require('./Lines');
var Slider = require("../Slider");
var cx = require('react/addons').addons.classSet;


var Bacon = require('baconjs');

var Sketch = React.createClass({

  mixins: [FluxChildMixin, StoreWatchMixin("Grid")],

  getStateFromFlux: function() {
    var flux = this.getFlux();
    var state = flux.store("Grid").getState();
    var {type, pattern, rasterSize} = state;
    var grid = geom.grid[type]({
      columns: 1, rows: 1, size: 200
    });
    var vertices = grid[0].points;
    return {
      type: type,
      vertices: vertices,
      center: grid,
      grid: geom.sketchRaster[type](vertices, rasterSize),
      lines: pattern,
      preview: null
    };
  },


  initDrawLine: function() {
    var pair = start => end => {
      return {
        preview: {
          start: start,
          end: end
        }
      }
    };
    var startPoints = this.mouseDown
      .filter(e => !e.altKey && !e.metaKey)
      .filter(() => !_.find(this.state.lines, 'selected'))
      .map(this.getNearestPoint);

    var lines = startPoints.flatMapLatest(point =>
        this.mouseUp.map(this.getNearestPoint).map(pair(point)).take(1)
    );

    var linePreview = startPoints.flatMapLatest(point =>
        this.mouseMove.map(this.getNearestPoint).map(pair(point)).takeUntil(this.mouseUp).mapEnd(null)
    ).toProperty(null);

    linePreview.onValue((state) => this.setState(state));
    lines.onValue(this.endLine);

  },

  initBezierTool: function() {
    var sub = (p1, p2) => ({x: p1.x - p2.x, y: p1.y - p2.y});
    var add = (p1, p2) => ({x: p1.x + p2.x, y: p1.y + p2.y});
    var findC = (line, point) => line.p1.x === point.x && line.p1.y === point.y ? 'c1' : 'c2';
    var setMissing = (line, type) => {
      type = type === 'c1' ? 'c2' : 'c1';
      if (!line[type]) {
        line[type] = type === 'c1' ? line.p2 : line.p1;
      }
    };
    var setC = (line, startPoint, offset) => {
      var type = findC(line, startPoint);
      line[type] = add(offset, startPoint);
      setMissing(line, type);
    };

    var findLine = this.mouseUp
      .filter(e => e.metaKey)
      .map(this.getOffset)
      .map(this.findLine);

    findLine
      .filter(line => {
        return !line
      }).onValue(() => {
        this.state.lines.forEach(line => line.selected = false);
        this.forceUpdate();
      });

    var selectedLine = findLine.filter(line => !!line);


    selectedLine.onValue(line => {
      this.state.lines.forEach(line => line.selected = false);
      line.selected = true;
      this.forceUpdate();
    });

    var startBezier = selectedLine.flatMapLatest(line =>
        this.mouseDown
          .map(e => {
            var offset = this.getOffset(e);
            console.log('mouseDown');
            line = _.find(this.state.lines, 'selected');
            return {
              point: geom.nearestPoint([line.p1, line.p2], this.getOffset(e)),
              line: line,
              offset: offset
            }
          })
    );

    var setBezier = startBezier.flatMapLatest(arg =>
        this.mouseMove
          .map(this.getOffset)
          .map(o => sub(o, arg.offset))
          .map(o => ({offset: o, line: arg.line, startPoint: arg.point}))
          .takeUntil(this.mouseUp)
          .mapEnd(null)
    );

    setBezier.onValue(e => {
      if (!e)return;
      var type = findC(e.line, e.startPoint);
      e.line[type] = add(e.offset, e.startPoint);
      setMissing(e.line, type);
      this.forceUpdate();
    });

    startBezier.flatMapLatest(e => this.mouseUp).onValue(e => this.change(this.state.lines))

  },

  findLine: function(pos) {
    return _.find(this.state.lines, (line => geom.distanceToLine(pos.x, pos.y, line) < 3));
  },

  componentDidMount: function() {
    this.mouseUp = new Bacon.Bus();
    this.mouseMove = new Bacon.Bus();
    this.mouseDown = new Bacon.Bus();

    this.initDrawLine();
    this.initBezierTool();

    this.mouseUp
      .filter(e => e.altKey)
      .onValue(this.removeLine.bind(this));
  },

  render: function() {
    var translate = '';
    var {type, preview, vertices, grid, lines,startPoint, previewEndPoint} = this.state;
    if (type === 'hex') {
      translate = 'translate(-75, -45)';
    }
    var step = type === 'hex' ? 2 : 1;
    var classes = cx({
      sketch: true,
      preview: !!preview
    });
    /* jshint ignore:start */
    return <div>
      <svg className={classes} onMouseDown={this.startLine} onMouseUp={this.endPreview} onMouseMove={this.updatePreview} >
        <g transform={translate} >
          <polygon points={vertices} />
          {grid.map((c, i) => <circle cx={c.x} cy={c.y} r="1" key={'p_' + i}/>)}
          <Lines lines={lines} preview={preview}/>
        </g>
      </svg>
      <Slider type="rasterSize" min="2" max="20" step={step}/>
      <button onClick={this.clear}>Clear</button>
      <RandomLines grid={grid}/>
    </div>;
    /* jshint ignore:end */
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

  getNearestPoint: function(e) {
    return geom.nearestPoint(this.state.grid, this.getOffset(e));
  },

  startLine: function(e) {
    this.mouseDown.push(e)
  },

  updatePreview: function(e) {
    this.mouseMove.push(e)
  },

  endPreview: function(e) {
    this.mouseUp.push(e)
  },

  change: function(lines) {
    this.getFlux().actions.changeSettings({pattern: lines});
  },

  endLine: function(state) {
    this.state.lines.push({p1: state.preview.start, p2: state.preview.end});
    this.change(this.state.lines);
  },

  clear: function() {
    this.change([]);
  },

  removeLine: function(e) {
    var offset = this.getOffset(e);

    var lines = this.state.lines.filter(function(line) {
      return geom.distanceToLine(offset.x, offset.y, line) > 3;
    }, this);

    this.change(lines);
  }

});

module.exports = Sketch;