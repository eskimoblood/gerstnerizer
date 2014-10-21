/** @jsx React.DOM */

var React = require('react');

var Example = React.createClass({

  render: function() {
    /* jshint ignore:start */
    var {preview, lines} = this.props;
    return <g>
    {!!preview ? <line
      x1={preview.start.x}
      y1={preview.start.y}
      x2={preview.end.x}
      y2={preview.end.y} /> : null}
    {lines.map(function(line) {
      var {p1, p2} = line;
      var isPoint = p1.x === p2.x && p1.y === p2.y;

      if (isPoint) {
        return <circle cx={p1.x} cy={p1.y} r="4"/>;
      }
      if (line.c1 && line.c2) {
        var {c1, c2} = line;
        var d = ['M', p1.x, p1.y, 'C', c1.x, c1.y, c2.x, c2.y, p2.x, p2.y].join(' ');
        return <g>
          {!!preview ? <g>
            <line
              strokeWidth="0.5"
              x1={p1.x}
              y1={p1.y}
              x2={c1.x}
              y2={c1.y} />
            <line
              strokeWidth="0.5"
              x1={p2.x}
              y1={p2.y}
              x2={c2.x}
              y2={c2.y} />
          </g> : null}
          <line
            strokeWidth="0.5"
            x1={p1.x}
            y1={p1.y}
            x2={c1.x}
            y2={c1.y} />
          <line
            strokeWidth="0.5"
            x1={p2.x}
            y1={p2.y}
            x2={c2.x}
            y2={c2.y} />
          <path
            strokeWidth={line.selected ? 2 : 1}
            d={d}/>
        </g>
      }
      return <line
        strokeWidth={line.selected ? 2 : 1}
        x1={p1.x}
        y1={p1.y}
        x2={p2.x}
        y2={p2.y} />
    })}</g>;
    /* jshint ignore:end */
  }
});

module.exports = Example;