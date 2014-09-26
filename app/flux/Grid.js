var Fluxxor = require('fluxxor');
var Immutable = require('immutable');
var _ = require('lodash');

var Grid = Fluxxor.createStore({
  initialize: function() {

    this.state = Immutable.Map({
      rows: 10,
      columns: 10,
      size: 100,
      rasterSize: 10,
      type: 'rect',
      pattern: []
    });

    this.undoStack = Immutable.Vector(this.state);
    this.redoStack = Immutable.Vector();

    this.bindActions(
      'SETTING_CHANGED', this.change,
      'SETTING_PREVIEW', this.preview,
      'SETTING_UNDO', this.undo,
      'SETTING_REDO', this.redo
    );
  },

  change: function(value) {
    if (value.rasterSize) {
      this.state = this.state.merge({pattern:[]});
    }
    this.state = this.state.merge(value);
    this.undoStack = this.undoStack.push(this.state);
    this.redoStack = Immutable.Vector();
    this.emit('change');
  },

  preview: function(value) {
    if (value.rasterSize) {
      this.state = this.state.merge({pattern:[]});
    }
    this.state = this.state.merge(value);
    this.emit('change');
  },

  getState: function() {
    return this.state.toJS();
  },

  undo: function() {
    if (!this.undoStack.length) {
      return
    }
    var p = this.undoStack.last();
    this.redoStack = this.redoStack.push(p);
    this.undoStack = this.undoStack.pop();
    this.state = p;

    this.emit("change");
  },

  redo: function() {
    if (!this.redoStack.length) {
      return
    }
    var p = this.undoStack.last();
    this.undoStack = this.undoStack.push(p);
    this.redoStack = this.redoStack.pop();
    this.state = p;

    this.emit("change");
  }

});

module.exports = Grid;