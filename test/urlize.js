const test  = require('ava');
const urlize = require('../lib/urlize');

test('user/repo', t => {
  const input = 'facebook/react';
  const output = 'https://github.com/facebook/react';
  t.is(urlize(input), output);
});

test('^git+ssh', t => {
  const input = 'git+ssh://git@github.com/mikaelbr/node-notifier.git';
  const output = 'https://github.com/mikaelbr/node-notifier';
  t.is(urlize(input), output);
});

test('^git@', t => {
  const input = 'git@github.com:xjamundx/eslint-plugin-promise.git';
  const output = 'https://github.com/xjamundx/eslint-plugin-promise';
  t.is(urlize(input), output);
});

test('^git+https', t => {
  const input = 'git+https://github.com/ded/bowser.git';
  const output = 'https://github.com/ded/bowser';
  t.is(urlize(input), output);
});

test('http -> https', t => {
  const input = 'http://github.com/ded/bowser';
  const output = 'https://github.com/ded/bowser';
  t.is(urlize(input), output);
});

// git@github.com:istanbuljs/nyc.git
