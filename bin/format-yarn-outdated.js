#!/usr/bin/env node

const yaml = require('js-yaml');
const fs   = require('fs');

const argv      = require('minimist')(process.argv.slice(2));
const Formatter = require('../lib/Formatter');

const selectFormat = (val) => ['markdown', 'json', 'mackerel'].includes(val) ? val : 'markdown';
const loadYAML = (val) => val ? yaml.safeLoad(fs.readFileSync(val, 'utf8')) : null;

// observe stdin
let stdin = '';
process.stdin.resume();
process.stdin.setEncoding('utf8');
process.stdin.on('data', (c) => { stdin += c });
process.stdin.on('end', () => {
  const json       = JSON.parse(stdin);
  const format     = selectFormat(argv.format);
  const excludes   = loadYAML(argv.excludes) || [];
  const changelogs = loadYAML(argv.changelogs) || {};

  const formatter = new Formatter(format, excludes, changelogs);
  console.log(formatter.run(json));
});
