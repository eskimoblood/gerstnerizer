var Fluxxor = require('fluxxor');
var Grid = require('./Grid');
var Colors = require('./Colors');
var Actions = require('./Actions');

var flux = new Fluxxor.Flux({
  Grid: new Grid(),
  Colors: new Colors()
}, Actions);

module.exports = flux;