const test  = require('ava');
const path  = require('path');
const fs    = require('fs');
const execa = require('execa');

const cd = name => path.resolve(__dirname, name);
const readFile = filePath => fs.readFileSync(filePath, 'utf8').replace(/\n*$/, '');

test('format-yarn-outdated with yarn@1.0.x', t => {
  const input = readFile(cd('./fixture/outdated.1.0.x.json'));
  const formatDiff = (args, expected) => {
    const result = execa.sync(cd('../bin/format-yarn-outdated.js'), args, { input });
    t.is(result.stdout, expected);
  };

  const formatDiffRegex = (args, expectedRegex) => {
    const result = execa.sync(cd('../bin/format-yarn-outdated.js'), args, { input });
    t.regex(result.stdout, expectedRegex);
  };

  formatDiff([], readFile(cd('./data/expected.md')));

  formatDiff(['--format', 'markdown'], readFile(cd('./data/expected.md')));
  formatDiff(['--format', 'json'], readFile(cd('./data/expected.json')));
  formatDiff(['--changelogs', cd('./fixture/changelogs.yml')], readFile(cd('./data/expected-with-changelogs.md')));
  formatDiff(['--excludes', cd('./fixture/excludes.yml')], readFile(cd('./data/expected-with-excludes.md')));

  formatDiff(['-f', 'markdown'], readFile(cd('./data/expected.md')));
  formatDiff(['-f', 'json'], readFile(cd('./data/expected.json')));
  formatDiff(['-c', cd('./fixture/changelogs.yml')], readFile(cd('./data/expected-with-changelogs.md')));
  formatDiff(['-e', cd('./fixture/excludes.yml')], readFile(cd('./data/expected-with-excludes.md')));

  formatDiffRegex(['--format', 'mackerel'], /outdated_npm_packages\.(major|minor|patch)\t1\t\d+/);
  formatDiffRegex(['-f', 'mackerel'], /outdated_npm_packages\.(major|minor|patch)\t1\t\d+/);
});

test('format-yarn-outdated with yarn@1.2.1', t => {
  const input = readFile(cd('./fixture/outdated.1.2.1.json'));
  const formatDiff = (args, expected) => {
    const result = execa.sync(cd('../bin/format-yarn-outdated.js'), args, { input });
    t.is(result.stdout, expected);
  };

  const formatDiffRegex = (args, expectedRegex) => {
    const result = execa.sync(cd('../bin/format-yarn-outdated.js'), args, { input });
    t.regex(result.stdout, expectedRegex);
  };

  formatDiff([], readFile(cd('./data/expected.md')));

  formatDiff(['--format', 'markdown'], readFile(cd('./data/expected.md')));
  formatDiff(['--format', 'json'], readFile(cd('./data/expected.json')));
  formatDiff(['--changelogs', cd('./fixture/changelogs.yml')], readFile(cd('./data/expected-with-changelogs.md')));
  formatDiff(['--excludes', cd('./fixture/excludes.yml')], readFile(cd('./data/expected-with-excludes.md')));

  formatDiff(['-f', 'markdown'], readFile(cd('./data/expected.md')));
  formatDiff(['-f', 'json'], readFile(cd('./data/expected.json')));
  formatDiff(['-c', cd('./fixture/changelogs.yml')], readFile(cd('./data/expected-with-changelogs.md')));
  formatDiff(['-e', cd('./fixture/excludes.yml')], readFile(cd('./data/expected-with-excludes.md')));

  formatDiffRegex(['--format', 'mackerel'], /outdated_npm_packages\.(major|minor|patch)\t1\t\d+/);
  formatDiffRegex(['-f', 'mackerel'], /outdated_npm_packages\.(major|minor|patch)\t1\t\d+/);
});
