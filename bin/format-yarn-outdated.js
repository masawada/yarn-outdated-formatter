#!/usr/bin/env node

const yaml = require('js-yaml');
const fs   = require('fs');
const meow = require('meow');

const Formatter = require('../lib/Formatter');
const parseYarnOutdatedJSON = require('../lib/parseYarnOutdatedJSON');

const cli = meow(`
  NAME
    format-yarn-outdated - yarn outdated --json formater

  SYNOPSIS
    format-yarn-outdated [-h help] [-v version] [-f format]
                         [-e excludes] [-c changelogs]

  OPTIONS
    --help, -h       Prints the help.
    --version, -v    Prints the package version.
    --format, -f     Output format. One of either markdown, json, mackerel or csv can be used. Default: markdown
    --excludes, -e   Path to YAML file which specify package names to exclude
    --changelogs, -c Path to YAML file which specify changelog uris for the packages

  EXAMPLES
    $ yarn outdated --json | $(yarn bin)/format-yarn-outdated
    $ yarn outdated --json | $(yarn bin)/format-yarn-outdated --excludes /path/to/excludes.yml --changelogs /path/to/changelogs.yml
    $ yarn outdated --json | $(yarn bin)/format-yarn-outdated --format json | jq '.minor[],.patch[] | .[0]' | xargs -I{} yarn upgrade {}
    $ yarn outdated --json | $(yarn bin)/format-yarn-outdated --format mackerel | mkr throw --service ServiceMetricName
    $ yarn outdated --json | $(yarn bin)/format-yarn-outdated --format csv > outdated.csv

  NPM SUPPORT
    To detecting dependencies or devDependencies, --long option is required.
    $ npm outdated --json --long | $(yarn bin)/format-yarn-outdated

    URL will not shown.
    CHANGELOG URL will not shown unless you set --changelogs option.
`, {
  alias: {
    h: 'help',
    v: 'version',
    f: 'format',
    e: 'excludes',
    c: 'changelogs',
  },
});

const selectFormat = val => ['markdown', 'json', 'mackerel', 'csv'].includes(val) ? val : 'markdown';
const loadYAML = val => val ? yaml.safeLoad(fs.readFileSync(val, 'utf8')) : null;

// observe stdin
let stdin = '';
process.stdin.resume();
process.stdin.setEncoding('utf8');
process.stdin.on('data', (c) => { stdin += c; });
process.stdin.on('end', () => {
  const json = parseYarnOutdatedJSON(stdin);
  if (!json) {
    process.stderr.write('JSON parse failed...\n');
    process.exit(1);
  }

  const format     = selectFormat(cli.flags.format);
  const excludes   = loadYAML(cli.flags.excludes) || [];
  const changelogs = loadYAML(cli.flags.changelogs) || {};

  const formatter = new Formatter(format, excludes, changelogs);
  process.stdout.write(`${formatter.run(json)}\n`);
});
