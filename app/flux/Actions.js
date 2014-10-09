var jsonp = require('jsonp');

module.exports = {
  changeSettings: function(value, isPreview) {
    this.dispatch((isPreview ? 'SETTING_PREVIEW' : 'SETTING_CHANGED'), value);
  },
  undo: function() {
    this.dispatch('SETTING_UNDO');
  },
  redo: function() {
    this.dispatch('SETTING_REDO');
  },

  setPattern: function(pattern) {
    this.dispatch('SETTING_CHANGED', {pattern: pattern});
  },

  addLine: function(line) {
    this.dispatch('ADD_LINE', line);
  },

  removeLines: function(lines) {
    this.dispatch('REMOVE_LINES', lines);
  },

  loadColors: function(value) {
    var url = 'http://www.colourlovers.com/api/palettes?format=json&numResults=39&keywords=' + value;
    this.dispatch('LOADING_COLORS');
    jsonp(url, {param: 'jsonCallback'}, function(err, response) {
      if (err) {
        return;
      }
      this.dispatch('COLORS_CHANGED', response.map(function(palette) {
        return palette.colors;
      }));
    }.bind(this));
  }
};

