var React = require('react');

module.exports = {
  render: function() {
    return React.DOM.div();
  },

  componentDidMount: function() {
    this.portalNode = this.getDOMNode();
    this.createPortal();
    this._renderPortal(this.props);
  },

  componentWillReceiveProps: function(newProps) {
    this._renderPortal(newProps);
  },

  _renderPortal: function(props) {
    React.renderComponent(React.DOM.div({}, props.children), this.portalNode);
    this.portalWillReceiveProps(props);
  }

};