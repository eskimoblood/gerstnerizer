/** @jsx React.DOM */

require('../styles/flaticon.css');
require('../styles/typeSelector.scss');
var React = require('react');
var Fluxxor = require("fluxxor");
var FluxChildMixin = Fluxxor.FluxChildMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;


var TypeSelector = React.createClass({

  mixins: [FluxChildMixin, StoreWatchMixin("Grid")],

  getInitialState: function() {
    return {};
  },

  getStateFromFlux: function() {
    var flux = this.getFlux();
    return flux.store("Grid").getState();
  },

  render: function() {
    return <div className="type-selector row">
      {['triangle', 'rect', 'hex'].map(function(i) {
        var className = 'glyph-icon flaticon-' + i;
        if (this.state.type === i) {
          className += ' active';
        }
        return <div onClick={this.onClick.bind(null, i)} data-type="hex" className={className} key={i}></div>
      }, this)}
    </div>
  },

  onClick: function(type) {
    this.getFlux().actions.changeSettings({type: type});
  }
});

module.exports = TypeSelector;