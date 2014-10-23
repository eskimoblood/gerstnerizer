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
      distortion:0,
      type: 'rect',
      opacity: 1,
      pattern: Immutable.Vector(),
      colors: Immutable.Vector('#666')
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
    this.resetPattern(value);

    if (this.lastState) {
      this.undoStack = this.undoStack.push(this.lastState);
      this.lastState = null;
    } else {
      this.undoStack = this.undoStack.push(this.state);
    }
    this.redoStack = Immutable.Vector();
    this.setState(this.state.merge(Immutable.fromJS(value)))
  },

  preview: function(value) {
    this.resetPattern(value);
    if (!this.lastState) {
      this.lastState = this.state;
    }
    this.setState(this.state.merge(value))
  },

  resetPattern: function(value) {
    if (value.rasterSize || value.type) {
      this.state = this.state.set('pattern', Immutable.Vector());
    }
  },

  setState: function(state) {
    this.state = state;
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
    this.setState(this.undoStack.last());
    this.undoStack = this.undoStack.pop();
  },

  redo: function() {
    if (!this.redoStack.length) {
      return;
    }
    this.undoStack = this.undoStack.push(this.state);
    this.setState(this.redoStack.last());
    this.redoStack = this.redoStack.pop();
  }

});

module.exports = Grid;