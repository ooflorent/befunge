var befunge = require('./index');
var assert = require('assert');
var multiline = require('multiline').stripIndent;

var program1 = multiline(function() {/*
  >987v>.v
  v456<  :
  >321 ^ _@
*/});

var program2 = multiline(function() {/*
  >25*"!dlrow ,olleH":v
                   v:,_@
                   >  ^
*/});

var program3 = multiline(function() {/*
  08>:1-:v v *_$.@
    ^    _$>\:^
*/});

assert.equal(befunge(program1), '123456789');
assert.equal(befunge(program2), 'Hello, world!\n');
assert.equal(befunge(program3), '40320');
