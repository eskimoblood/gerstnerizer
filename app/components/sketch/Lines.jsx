/** @jsx React.DOM */

var React = require('react');

var Example = React.createClass({

  render: function() {
    /* jshint ignore:start */
    return <g>
    {this.props.preview.state ? <line
    x1={this.props.preview.s.x}
    y1={this.props.preview.s.y}
    x2={this.props.preview.e.x}
    y2={this.props.preview.e.y} /> : null}
    {this.props.lines.map(function(line) {
      return <line
      x1={line[0].x}
      y1={line[0].y}
      x2={line[1].x}
      y2={line[1].y} />
    })}</g>;
    /* jshint ignore:end */
  }
});

module.exports = Example;