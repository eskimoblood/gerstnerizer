var Fluxxor = require('fluxxor');
var Grid = require('./Grid');
var Actions = require('./Actions');

var flux = new Fluxxor.Flux({
  Grid: new Grid()
}, Actions);

module.exports = flux;