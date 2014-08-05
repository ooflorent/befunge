function befunge(input) {
  var env = {
    direction: '>',
    x: -1,
    y: 0,
    stack: [],
    output: '',
    done: false,
    program: parse(input),
    next: function() {
      this.x += directions[this.direction][0];
      this.y += directions[this.direction][1];
      return this.program.get(this.x, this.y);
    }
  };

  return {
    step: function() {
      interpreter(env.next(), env);
      return env;
    },
    run: function() {
      while (!env.done) this.step();
      return env;
    }
  };
}

function parse(input) {
  var buf = input.split('\n').map(function(line) {
    return line.split('');
  });

  var cols = Math.max.apply(null, buf.map(function(line) { return line.length; }));
  var rows = buf.length;

  function constraint(x, y) {
    return {
      x: (x < 0 ? cols - x : x) % cols,
      y: (y < 0 ? rows - y : y) % rows
    };
  }

  return {
    cols: cols,
    rows: rows,
    get: function(x, y) {
      var pos = constraint(x, y);
      return buf[pos.y][pos.x] || ' ';
    },
    set: function(x, y, v) {
      var pos = constraint(x, y);
      buf[pos.y][pos.x] = v;
    }
  };
}

function interpreter(ch, env) {
  if (env.done) return;
  var instr = instructions[ch];
  if (instr) {
    instr(env);
  } else {
    throw new Error('Invalid instruction "' + ch + '" at line ' + env.y + ':' + env.x);
  }
}

var directions = {
  '<': [-1, 0],
  '>': [1, 0],
  '^': [0, -1],
  'v': [0, 1],
};

var instructions = {
  // Arithmetical operators
  '+': function add(env) {
    var a = env.stack.pop();
    var b = env.stack.pop();
    env.stack.push(b + a);
  },
  '-': function sub(env) {
    var a = env.stack.pop();
    var b = env.stack.pop();
    env.stack.push(b - a);
  },
  '*': function mul(env) {
    var a = env.stack.pop();
    var b = env.stack.pop();
    env.stack.push(b * a);
  },
  '/': function div(env) {
    var a = env.stack.pop();
    var b = env.stack.pop();
    env.stack.push(a ? (b / a | 0) : 0);
  },
  '%': function mod(env) {
    var a = env.stack.pop();
    var b = env.stack.pop();
    env.stack.push(a ? (b % a) : 0);
  },
  // Logical operators
  '!': function not(env) { env.stack.push(env.stack.pop() ? 0 : 1); },
  '`': function cmp(env) {
    var a = env.stack.pop();
    var b = env.stack.pop();
    env.stack.push(b > a ? 1 : 0);
  },
  // Direction control operators
  '>': function mrt(env) { env.direction = '>'; },
  '<': function mlt(env) { env.direction = '<'; },
  '^': function mup(env) { env.direction = '^'; },
  'v': function mdw(env) { env.direction = 'v'; },
  '?': function rnd(env) { env.direction = '><^v'[Math.random() * 4 | 0]; },
  '_': function hif(env) { env.direction = env.stack.pop() ? '<' : '>'; },
  '|': function vif(env) { env.direction = env.stack.pop() ? '^' : 'v'; },
  // String operators
  '"': function str(env) {
    env.next();
    var ch, buf = '';
    while ((ch = env.program.get(env.x, env.y)) != '"') {
      buf = ch + buf;
      env.next();
    }
    env.output += buf;
  },
  // Stack operators
  ':': function dup(env) {
    var a = env.stack[env.stack.length - 1];
    env.stack.push(a || 0);
  },
  '\\': function swap(env) {
    var a = env.stack.pop();
    var b = env.stack.pop();
    env.stack.push(a, b || 0);
  },
  '$': function pop(env) { env.stack.pop(); },
  // Output operators
  '.': function putn(env) { env.output += env.stack.pop(); },
  ',': function putc(env) { env.output += String.fromCharCode(env.stack.pop()); },
  // Memory operators
  'p': function put(env) {
    var y = env.stack.pop();
    var x = env.stack.pop();
    env.program.set(x, y, env.stack.pop());
  },
  'g': function get(env) {
    var y = env.stack.pop();
    var x = env.stack.pop();
    env.stack.push(env.program.get(x, y).charCodeAt(0));
  },
  // Control-flow management operators
  ' ': function nop(env) {},
  '#': function skp(env) { env.next(); },
  '@': function end(env) { env.done = true; }
};

function createPushInstruction(n) {
  return function push(env) {
    env.stack.push(n);
  };
}

for (var i = 0; i < 10; i++) {
  instructions[i] = createPushInstruction(i);
}

function interpret(code) {
  var env;
  var program = befunge(code);
  var env = program.run();
  return env.output;
}


console.log(interpret('2>:3g" "-!v\\  g30          <\n |!`"&":+1_:.:03p>03g+:"&"`|\n @               ^  p3\\" ":<\n 2 2345678901234567890123456789012345678'));
