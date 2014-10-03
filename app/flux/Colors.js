var Fluxxor = require('fluxxor');

var Grid = Fluxxor.createStore({
  initialize: function() {

    this.state = [];

    this.bindActions(
      'COLORS_CHANGED', this.change,
      'LOADING_COLORS', this.loading
    );
  },

  change: function(colors) {
    this.state = {colors: colors};
    this.emit('change');
  },

  loading: function() {
    this.state = {loading: true, colors:[]};
    this.emit('change');
  },

  getState: function() {
    return this.state;
  }
});

module.exports = Grid;