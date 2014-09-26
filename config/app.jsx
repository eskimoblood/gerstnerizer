/** @jsx React.DOM */

var React = require("react");
var Application = require("../app/" + __resourceQuery.substr(1));
var flux = require('../app/flux/Flux');
React.renderComponent(<Application flux={flux}/>, document.body);
