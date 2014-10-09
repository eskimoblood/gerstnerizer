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
      pattern: Immutable.Vector()
    });

    this.undoStack = Immutable.Vector();
    this.redoStack = Immutable.Vector();

    this.bindActions(
      'SETTING_CHANGED', this.change,
      'SETTING_PREVIEW', this.preview,
      'ADD_LINE', this.addLine,
      'REMOVE_LINES', this.removeLines,
      'SETTING_UNDO', this.undo,
      'SETTING_REDO', this.redo
    );
  },

  change: function(value) {
    if (value.rasterSize || value.type) {
      this.state = this.state.set('pattern', Immutable.Vector());
    }
    if (this.lastState) {
      this.undoStack = this.undoStack.push(this.lastState);
      this.lastState = null;
    } else {
      this.undoStack = this.undoStack.push(this.state);
    }
    this.state = this.state.merge(Immutable.fromJS(value));
    this.redoStack = Immutable.Vector();
    this.emit('change');
  },

  preview: function(value) {
    if (value.rasterSize) {
      this.state = this.state.set('pattern', Immutable.Vector());
    }
    if (!this.lastState) {
      this.lastState = this.state;
    }
    this.state = this.state.merge(value);
    this.emit('change');
  },

  addLine: function(line) {
    this.undoStack = this.undoStack.push(this.state);
    this.state = this.state.updateIn(['pattern'], function(vect) {
      return vect.push(line);
    });
    this.redoStack = Immutable.Vector();
    this.emit('change');
  },

  removeLines: function(lines) {
    this.undoStack = this.undoStack.push(this.state);
    this.state = this.state.set('pattern', Immutable.fromJS(lines));
    this.redoStack = Immutable.Vector();
    this.emit('change');
  },

  getState: function() {
    console.log(this.state.toJS().columns);
    return this.state.toJS();
  },

  undo: function() {
    console.log('undo');
    if (!this.undoStack.length) {
      return;
    }
    this.redoStack = this.redoStack.push(this.state);
    this.state = this.undoStack.last();
    this.undoStack = this.undoStack.pop();
    this.emit("change");
  },

  redo: function() {
    console.log('redo');
    if (!this.redoStack.length) {
      return;
    }
    this.undoStack = this.undoStack.push(this.state);
    this.state = this.redoStack.last() || this.state;
    this.redoStack = this.redoStack.pop();
    this.emit("change");
  }

});

module.exports = Grid;