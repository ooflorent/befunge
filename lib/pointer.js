var Stack = require('./stack');

var Direction = {
  '<': [-1, 0],
  '>': [1, 0],
  '^': [0, -1],
  'v': [0, 1]
};

function Pointer() {
  this.x = 0;
  this.y = 0;
  this.dx = 1;
  this.dy = 0;
  this.stack = new Stack();
  this.stringmode = false;
}

Pointer.prototype = {
  direction: function(dir) {
    this.dx = Direction[dir][0];
    this.dy = Direction[dir][1];
  },
  move: function() {
    this.x += this.dx;
    this.y += this.dy;
  }
};

module.exports = Pointer;
