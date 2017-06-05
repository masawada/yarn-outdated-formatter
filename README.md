yarn-outdated-formatter
=======================

[![Build Status](http://img.shields.io/travis/masawada/yarn-outdated-formatter.svg?style=flat-square)](https://travis-ci.org/masawada/yarn-outdated-formatter)
[![Coverage Status](https://img.shields.io/coveralls/masawada/yarn-outdated-formatter.svg?style=flat-square)](https://coveralls.io/github/masawada/yarn-outdated-formatter?branch=master)
[![NPM Version](https://img.shields.io/npm/v/yarn-outdated-formatter.svg?style=flat-square)](https://www.npmjs.com/package/yarn-outdated-formatter)
[![License](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](https://masawada.mit-license.org/)

## Usage

`format-yarn-outdated --help` shows the help:

```
NAME
  format-yarn-outdated - yarn outdated --json formater

SYNOPSIS
  format-yarn-outdated [-h help] [-v version] [-f format]
                       [-e excludes] [-c changelogs]

OPTIONS
  --help, -h       Prints the help.
  --version, -v    Prints the package version.
  --format, -f     Output format. One of either markdown, json or mackerel can be used. Default: markdown
  --excludes, -e   Path to YAML file which specify package names to exclude
  --changelogs, -c Path to YAML file which specify changelog uris for the packages

EXAMPLES
  $ yarn outdated --json | $(yarn bin)/format-yarn-outdated
  $ yarn outdated --json | $(yarn bin)/format-yarn-outdated --excludes /path/to/excludes.yml --changelogs /path/to/changelogs.yml
  $ yarn outdated --json | $(yarn bin)/format-yarn-outdated --format json | jq '.minor[],.patch[] | .[0]' | xargs -I{} yarn upgrade {}
  $ yarn outdated --json | $(yarn bin)/format-yarn-outdated --format mackerel | mkr throw --service ServiceMetricName
```

## License

MIT License
