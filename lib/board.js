var Pointer = require('./pointer');
var Program = require('./program');

function chr(n) { return String.fromCharCode(n); }
function ord(c) { return c.charCodeAt(0); }
function int(c) { return Number(c); }
function str(c) { return String(c); }

function Board(input) {
  this.program = new Program(input);
  this.ptr = new Pointer();
  this.output = '';
}

Board.prototype = {
  dead: function() {
    return this.ptr.dx == 0 && this.ptr.dy == 0;
  },
  step: function() {
    if (this.dead()) return;

    var a, b, x, y, v;
    var ptr = this.ptr;
    var stack = this.ptr.stack;

    var ch = this.program.get(ptr.x, ptr.y);
    if (ch == '"') {
      ptr.stringmode = !ptr.stringmode;
    } else if (ptr.stringmode) {
      stack.push(ord(ch));
    } else if (~'0123456789'.indexOf(ch)) {
      stack.push(int(ch));
    } else if (~'<>^v'.indexOf(ch)) {
      ptr.direction(ch);
    } else if (ch == '?') {
      ptr.direction('><^v'[Math.random() * 4 | 0]);
    } else if (ch == '+') {
      a = stack.pop();
      b = stack.pop();
      stack.push(b + a);
    } else if (ch == '-') {
      a = stack.pop();
      b = stack.pop();
      stack.push(b - a);
    } else if (ch == '*') {
      a = stack.pop();
      b = stack.pop();
      stack.push(b * a);
    } else if (ch == '/') {
      a = stack.pop();
      b = stack.pop();
      stack.push(a ? b * a : 0);
    } else if (ch == '%') {
      a = stack.pop();
      b = stack.pop();
      stack.push(a ? b % a : 0);
    } else if (ch == '!') {
      stack.push(stack.pop() ? 0 : 1);
    } else if (ch == '`') {
      a = stack.pop();
      b = stack.pop();
      stack.push(b > a ? 1 : 0);
    } else if (ch == '_') {
      ptr.direction(stack.pop() ? '<' : '>');
    } else if (ch == '|') {
      ptr.direction(stack.pop() ? '^' : 'v');
    } else if (ch == ':') {
      stack.push(stack.peek());
    } else if (ch == '\\') {
      a = stack.pop();
      b = stack.pop();
      stack.push(a);
      stack.push(b);
    } else if (ch == '$') {
      stack.pop();
    } else if (ch == '.') {
      this.output += str(stack.pop());
    } else if (ch == ',') {
      this.output += chr(stack.pop());
    } else if (ch == '#') {
      ptr.move();
    } else if (ch == 'p') {
      y = stack.pop();
      x = stack.pop();
      v = stack.pop();
      while (v > 255) v = 255 - v;
      while (v < 0) v += 255;
      this.program.put(x, y, v);
    } else if (ch == 'g') {
      y = stack.pop();
      x = stack.pop();
      stack.push(ord(this.program.get(x, y)));
    } else if (ch == '@') {
      ptr.dx = 0;
      ptr.dy = 0;
    }

    // Advance pointer
    ptr.move();

    // Wrap around
    if (ptr.x < 0) ptr.x += this.program.cols;
    if (ptr.x >= this.program.cols) ptr.x -= this.program.cols;
    if (ptr.y < 0) ptr.y += this.program.rows;
    if (ptr.y >= this.program.rows) ptr.y -= this.program.rows;
  }
};

module.exports = Board;
