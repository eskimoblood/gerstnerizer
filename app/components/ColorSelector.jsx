/** @jsx React.DOM */

require('../styles/palette.scss');

var React = require('react');
var Fluxxor = require("fluxxor");
var FluxChildMixin = Fluxxor.FluxChildMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;
var Gradient = require('gradient');
var tinygradient = require('tinygradient');
var Loader = require('./Loader');

var Example = React.createClass({

  mixins: [FluxChildMixin, StoreWatchMixin('Colors')],

  getStateFromFlux: function() {
    var state = this.getFlux().store('Colors').getState();
    console.log(state);
    return {
      colors: state.colors,
      loading: state.loading,
      selectedPalette: this.state && this.state.selectedPalette
    };
  },

  render: function() {
    /* jshint ignore:start */
    return <div  className="palette">
      <div className="column">
        <input
        placeholder="Search for palettes"
        onChange={this.onChange}
        onFocus={this.togglePalette.bind(this, true)}
        onBlur={this.togglePalette.bind(this, false)}
        />
        {this.palettePreview()}
      </div>
        {this.colorList()}
    </div>;
    /* jshint ignore:end */
  },

  togglePalette: function(state) {
    setTimeout(function() {
      this.setState({showPalette: state});
    }.bind(this), 10);
  },


  palettePreview: function() {
    var selectedPalette = this.state.selectedPalette;
    if (!selectedPalette || !selectedPalette.length) {
      return;
    }
    /* jshint ignore:start */
    return <div className="preview" onClick={this.setPalette.bind(this, selectedPalette)}>
      {selectedPalette.map(function(color) {
        return <span style={{background: '#' + color}} />;
      })}
    </div>;
    /* jshint ignore:end */
  },

  colorList: function() {
    if (!this.state.showPalette) {
      return;
    }
    /* jshint ignore:start */
    if (this.state.loading) {
      return <ul className="loader">
        <li >
          <Loader />
        </li>
      </ul>;
    }
    /* jshint ignore:end */
    /* jshint ignore:start */
    return <ul>
    {this.state.colors.map(function(palette) {
      return <li onClick={this.setPalette.bind(this, palette)} >
            {palette.map(function(color) {
              return <span style={{background: '#' + color}} />;
            })}
      </li>
    }, this)}
    </ul>;
    /* jshint ignore:end */
  },

  setPalette: function(palette) {
    console.log(palette);
    var map = palette.map(function(c) {
      return '#' + c;
    });
    this.setState({selectedPalette: palette});
    var grad = tinygradient(map).hsv(50, 'short').map(function(c) {
      return c.toHexString();
    });
    this.getFlux().actions.changeSettings({colors: grad});
  },

  onChange: function(e) {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    var actions = this.getFlux().actions;
    this.timeout = setTimeout(actions.loadColors.bind(actions, e.target.value), 500);

  }
});

module.exports = Example;