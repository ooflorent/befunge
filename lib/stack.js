function Stack() {
  this.values = [];
}

Stack.prototype = {
  push: function(value) {
    this.values.push(value);
  },
  pop: function() {
    return this.values.pop() || 0;
  },
  peek: function() {
    return this.values[this.values.length - 1] || 0;
  }
};

module.exports = Stack;
