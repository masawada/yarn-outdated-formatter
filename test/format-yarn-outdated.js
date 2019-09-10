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

  const formatDiffRegexes = (args, expectedRegexes) => {
    const result = execa.sync(cd('../bin/format-yarn-outdated.js'), args, { input });
    for (const expectedRegex of expectedRegexes) {
      t.regex(result.stdout, expectedRegex);
    }
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

  formatDiffRegexes(['--format', 'mackerel'], [
    /outdated_npm_packages\.major\t1\t\d+/,
    /outdated_npm_packages\.minor\t1\t\d+/,
    /outdated_npm_packages\.patch\t1\t\d+/,
  ]);
  formatDiffRegexes(['-f', 'mackerel'], [
    /outdated_npm_packages\.major\t1\t\d+/,
    /outdated_npm_packages\.minor\t1\t\d+/,
    /outdated_npm_packages\.patch\t1\t\d+/,
  ]);
});

test('format-yarn-outdated with yarn@1.2.1', t => {
  const input = readFile(cd('./fixture/outdated.1.2.1.json'));
  const formatDiff = (args, expected) => {
    const result = execa.sync(cd('../bin/format-yarn-outdated.js'), args, { input });
    t.is(result.stdout, expected);
  };

  const formatDiffRegexes = (args, expectedRegexes) => {
    const result = execa.sync(cd('../bin/format-yarn-outdated.js'), args, { input });
    for (const expectedRegex of expectedRegexes) {
      t.regex(result.stdout, expectedRegex);
    }
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

  formatDiffRegexes(['--format', 'mackerel'], [
    /outdated_npm_packages\.major\t1\t\d+/,
    /outdated_npm_packages\.minor\t1\t\d+/,
    /outdated_npm_packages\.patch\t1\t\d+/,
  ]);
  formatDiffRegexes(['-f', 'mackerel'], [
    /outdated_npm_packages\.major\t1\t\d+/,
    /outdated_npm_packages\.minor\t1\t\d+/,
    /outdated_npm_packages\.patch\t1\t\d+/,
  ]);
});

test('format-yarn-outdated with yarn workspaces', t => {
  const input = readFile(cd('./fixture/outdated.workspaces.json'));
  const formatDiff = (args, expected) => {
    const result = execa.sync(cd('../bin/format-yarn-outdated.js'), args, { input });
    t.is(result.stdout, expected);
  };

  const formatDiffRegexes = (args, expectedRegexes) => {
    const result = execa.sync(cd('../bin/format-yarn-outdated.js'), args, { input });
    for (const expectedRegex of expectedRegexes) {
      t.regex(result.stdout, expectedRegex);
    }
  };

  formatDiff([], readFile(cd('./data/expected.workspaces.md')));

  formatDiff(['--format', 'markdown'], readFile(cd('./data/expected.workspaces.md')));
  formatDiff(['--format', 'markdown', '--workspaces', '^@example/'], readFile(cd('./data/expected.workspaces.md')));
  formatDiff(['--format', 'markdown', '--workspaces', 'foo'], readFile(cd('./data/expected.workspaces.regex.md')));
  formatDiff(['--format', 'markdown', '--workspaces', '^(?!@example/bar)'], readFile(cd('./data/expected.workspaces.regex.md')));
  formatDiff(['--format', 'json'], readFile(cd('./data/expected.workspaces.json')));
  formatDiff(['--format', 'json', '--workspaces', 'foo'], readFile(cd('./data/expected.workspaces.regex.json')));
  formatDiff(['--changelogs', cd('./fixture/changelogs.yml')], readFile(cd('./data/expected-with-changelogs.workspaces.md')));
  formatDiff(['--excludes', cd('./fixture/excludes.yml')], readFile(cd('./data/expected-with-excludes.workspaces.md')));

  formatDiff(['-f', 'markdown'], readFile(cd('./data/expected.workspaces.md')));
  formatDiff(['-f', 'markdown', '-w', 'foo'], readFile(cd('./data/expected.workspaces.regex.md')));
  formatDiff(['-f', 'json'], readFile(cd('./data/expected.workspaces.json')));
  formatDiff(['-f', 'json', '-w', 'foo'], readFile(cd('./data/expected.workspaces.regex.json')));
  formatDiff(['-c', cd('./fixture/changelogs.yml')], readFile(cd('./data/expected-with-changelogs.workspaces.md')));
  formatDiff(['-e', cd('./fixture/excludes.yml')], readFile(cd('./data/expected-with-excludes.workspaces.md')));

  formatDiffRegexes(['--format', 'mackerel'], [
    /outdated_npm_packages\.major\t1\t\d+/,
    /outdated_npm_packages\.minor\t3\t\d+/,
    /outdated_npm_packages\.patch\t1\t\d+/,
  ]);
  formatDiffRegexes(['--format', 'mackerel', '--workspaces', 'foo'], [
    /outdated_npm_packages\.major\t1\t\d+/,
    /outdated_npm_packages\.minor\t1\t\d+/,
    /outdated_npm_packages\.patch\t1\t\d+/,
  ]);
  formatDiffRegexes(['--format', 'mackerel', '--unique'], [
    /outdated_npm_packages\.major\t1\t\d+/,
    /outdated_npm_packages\.minor\t1\t\d+/,
    /outdated_npm_packages\.patch\t1\t\d+/,
  ]);
  formatDiffRegexes(['-f', 'mackerel'], [
    /outdated_npm_packages\.major\t1\t\d+/,
    /outdated_npm_packages\.minor\t3\t\d+/,
    /outdated_npm_packages\.patch\t1\t\d+/,
  ]);
  formatDiffRegexes(['-f', 'mackerel', '-w', 'foo'], [
    /outdated_npm_packages\.major\t1\t\d+/,
    /outdated_npm_packages\.minor\t1\t\d+/,
    /outdated_npm_packages\.patch\t1\t\d+/,
  ]);
  formatDiffRegexes(['-f', 'mackerel', '-u'], [
    /outdated_npm_packages\.major\t1\t\d+/,
    /outdated_npm_packages\.minor\t1\t\d+/,
    /outdated_npm_packages\.patch\t1\t\d+/,
  ]);
});

test('format-yarn-outdated with npm', t => {
  const input = readFile(cd('./fixture/outdated.npm.json'));
  const formatDiff = (args, expected) => {
    const result = execa.sync(cd('../bin/format-yarn-outdated.js'), args, { input });
    t.is(result.stdout, expected);
  };

  const formatDiffRegexes = (args, expectedRegexes) => {
    const result = execa.sync(cd('../bin/format-yarn-outdated.js'), args, { input });
    for (const expectedRegex of expectedRegexes) {
      t.regex(result.stdout, expectedRegex);
    }
  };

  formatDiff([], readFile(cd('./data/expected-without-url.md')));
  formatDiffRegexes(['--format', 'mackerel'], [
    /outdated_npm_packages\.major\t1\t\d+/,
    /outdated_npm_packages\.minor\t1\t\d+/,
    /outdated_npm_packages\.patch\t1\t\d+/,
  ]);
  formatDiffRegexes(['-f', 'mackerel'], [
    /outdated_npm_packages\.major\t1\t\d+/,
    /outdated_npm_packages\.minor\t1\t\d+/,
    /outdated_npm_packages\.patch\t1\t\d+/,
  ]);
});
