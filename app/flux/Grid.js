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
      strokeWidth: 1,
      type: 'rect',
      opacity: 1,
      pattern: []
    });

    this.undoStack = Immutable.Vector();
    this.redoStack = Immutable.Vector();

    this.bindActions(
      'SETTING_CHANGED', this.change,
      'SETTING_PREVIEW', this.preview,
      'SETTING_UNDO', this.undo,
      'SETTING_REDO', this.redo
    );
  },

  change: function(value) {
    if (value.rasterSize || value.type) {
      this.state = this.state.mergeDeep({pattern: []});
    }
    this.undoStack = this.undoStack.push(this.state);
    console.log(value);
    console.log(this.state.toJS());
    this.state = this.state.mergeDeep(value);
    console.log(this.state.toJS());

    console.log(this.state.toJS());
    this.redoStack = Immutable.Vector();
    this.emit('change');
  },

  preview: function(value) {
    console.log('preview');
    if (value.rasterSize) {
      this.state = this.state.mergeDeep({pattern: []});
    }
    this.state = this.state.mergeDeep(value);
    this.emit('change');
  },

  getState: function() {
    return this.state.toJS();
  },

  undo: function() {
    if (!this.undoStack.length) {
      return;
    }
    this.redoStack = this.redoStack.push(this.state);
    this.state = this.undoStack.last() || this.state;
    this.undoStack = this.undoStack.pop();
    console.log(this.state.toJS());
    this.emit("change");
  },

  redo: function() {
    if (!this.redoStack.length) {
      return;
    }
    this.undoStack = this.undoStack.push(this.state);
    this.state = this.redoStack.last() || this.state;
    this.redoStack = this.redoStack.pop();
    console.log(this.state.toJS());
    this.emit("change");
  }

});

module.exports = Grid;