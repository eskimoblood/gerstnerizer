module.exports = {
  changeSettings: function(value, isPreview) {
    this.dispatch(isPreview ? 'SETTING_PREVIEW' : 'SETTING_CHANGED', value);
  },
  undo: function() {
    this.dispatch('SETTING_UNDO');
  },
  redo: function() {
    this.dispatch('SETTING_REDO');
  },

  setPattern: function(pattern) {
    this.dispatch('SETTING_CHANGED', {pattern: pattern});
  }
}