/** @jsx React.DOM */

var React = require("react");
var Fluxxor = require("fluxxor");
var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

var keymaster = require('keymaster');
window.React = React;
// render top-level react component
var Slider = require("./components/Slider");
var Grid = require("./components/Grid");
var Sketch = require("./components/Sketch");
var TypeSelector = require('./components/TypeSelector');

var Application = React.createClass({

  mixins: [FluxMixin, StoreWatchMixin("Grid")],

  keyDown: function() {
    console.log(arguments);
  },

  getStateFromFlux: function() {
    var flux = this.getFlux();
    return flux.store("Grid").getState();
  },

  componentDidMount: function() {
    keymaster('ctrl+z, ⌘+z', this.undo)
    keymaster('ctrl+shift+z, ⌘+⇧+z', this.redo)
  },

  undo: function() {
    this.getFlux().actions.undo();
  },

  redo: function() {
    this.getFlux().actions.redo();
  },

  componentWillUnmount: function() {
    keymaster.unbind('esc', this.onClose)
  },

  render: function() {
    var step = this.state.type === 'hex' ? 2 : 1;
    return <div className="row" onKeyDown={this.keyDown}>
      <div className="sidebar">
        <Slider type="columns" min="0" max="40"/>
        <Slider type="rows" min="0" max="40"/>
        <Slider type="size" min="0" max="200"/>
        <TypeSelector />
        <Sketch />
        <Slider type="rasterSize" min="2" max="20" step={step}/>
      </div>
      <Grid />

    </div>
  }

});
module.exports = Application;
