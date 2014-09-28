/** @jsx React.DOM */
require("../styles/slider.scss");
require("../styles/layout.scss");
require('../styles/flaticon.css');

var React = require('react');
var Fluxxor = require("fluxxor");
var FluxChildMixin = Fluxxor.FluxChildMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;


Slider = React.createClass({

  mixins: [FluxChildMixin, StoreWatchMixin('Grid')],

  getStateFromFlux: function() {
    var flux = this.getFlux();
    return {value: flux.store("Grid").getState()[this.props.type]};
  },

  render: function() {
    console.log(this.state.value);
    var className = 'slider align-center glyph-icon flaticon-' + this.props.type;
    return <div className={className}>
      <input
      min={this.props.min}
      max={this.props.max}
      type="range"
      step={this.props.step || 1}
      onChange={this.onChange.bind(this, true)}
      onMouseUp={this.onChange.bind(this, false)}
      defaultValue={this.state.value}/>
      <span>{this.state.value}</span>
    </div>
  },

  onChange: function(isPreview, e) {
    var value = {};
    console.log(isPreview);
    value[this.props.type] = parseFloat(e.target.value);
    this.getFlux().actions.changeSettings(value, isPreview);
  }
});

module.exports = Slider;