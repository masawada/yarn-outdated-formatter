#!/usr/bin/env node

const yaml = require('js-yaml');
const fs   = require('fs');
const meow = require('meow');

const Formatter = require('../lib/Formatter');

const cli = meow();

const selectFormat = val => ['markdown', 'json', 'mackerel'].includes(val) ? val : 'markdown';
const loadYAML = val => val ? yaml.safeLoad(fs.readFileSync(val, 'utf8')) : null;

// observe stdin
let stdin = '';
process.stdin.resume();
process.stdin.setEncoding('utf8');
process.stdin.on('data', (c) => { stdin += c; });
process.stdin.on('end', () => {
  const json       = JSON.parse(stdin);
  const format     = selectFormat(cli.flags.format);
  const excludes   = loadYAML(cli.flags.excludes) || [];
  const changelogs = loadYAML(cli.flags.changelogs) || {};

  const formatter = new Formatter(format, excludes, changelogs);
  process.stdout.write(`${formatter.run(json)}\n`);
});
