const test  = require('ava');
const urlize = require('../lib/urlize');

const expect = 'https://github.com/example/example';

test('example/example', t => {
  const input = 'example/example';
  t.is(urlize(input), expect);
});

test('^git+ssh', t => {
  const input = 'git+ssh://git@github.com/example/example.git';
  t.is(urlize(input), expect);
});

test('^git@', t => {
  const input = 'git@github.com:example/example.git';
  t.is(urlize(input), expect);
});

test('^git+https', t => {
  const input = 'git+https://github.com/example/example.git';
  t.is(urlize(input), expect);
});

test('http -> https', t => {
  const input = 'http://github.com/example/example';
  t.is(urlize(input), expect);
});
