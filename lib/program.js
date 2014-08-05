function Program(input) {
  this.list = input.split('\n').map(function(line) {
    return line.split('');
  });

  this.rows = this.list.length;
  this.cols = Math.max.apply(null, this.list.map(function(line) {
    return line.length;
  }));
}

Program.prototype = {
  get: function get(x, y) {
    if (x < 0 || x >= this.cols || y < 0 || y >= this.rows) return ' ';
    return this.list[y][x];
  },
  put: function(x, y, value) {
    if (x < 0 || x >= this.cols || y < 0 || y >= this.rows) return;
    this.list[y][x] = value;
  }
};

module.exports = Program;
