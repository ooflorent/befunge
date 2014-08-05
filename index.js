var Board = require('./lib/board');

module.exports = function(input) {
  var board = new Board(input);

  while (!board.dead()) {
    board.step();
  }

  return board.output;
};
