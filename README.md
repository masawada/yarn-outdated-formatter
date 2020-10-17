yarn-outdated-formatter
=======================

[![Build Status](https://img.shields.io/github/workflow/status/masawada/yarn-outdated-formatter/test/master?style=flat-square)](https://github.com/masawada/yarn-outdated-formatter/actions?query=workflow%3Atest+branch%3Amaster)
[![Coverage Status](https://img.shields.io/coveralls/masawada/yarn-outdated-formatter.svg?style=flat-square)](https://coveralls.io/github/masawada/yarn-outdated-formatter?branch=master)
[![NPM Version](https://img.shields.io/npm/v/yarn-outdated-formatter.svg?style=flat-square)](https://www.npmjs.com/package/yarn-outdated-formatter)
[![License](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](https://masawada.mit-license.org/)

## Usage

`format-yarn-outdated --help` shows the help:

```
NAME
  format-yarn-outdated - yarn outdated --json formatter

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

NPM SUPPORT
  To detecting dependencies or devDependencies, --long option is required.
  $ npm outdated --json --long | $(npm bin)/format-yarn-outdated

  URL will not shown.
  CHANGELOG URL will not shown unless you set --changelogs option.
```

## Examples

- Markdown: [examples/formatted.md](examples/formatted.md)
- JSON: [examples/formatted.json](examples/formatted.json)
- Mackerel: [examples/formatted.mackerel](examples/formatted.mackerel)
- CSV: [examples/formatted.csv](examples/formatted.csv)

## License

MIT License
