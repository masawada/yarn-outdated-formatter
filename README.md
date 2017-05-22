yarn-outdated-formatter
=======================

[![Build Status](https://travis-ci.org/masawada/yarn-outdated-formatter.svg?branch=master)](https://travis-ci.org/masawada/yarn-outdated-formatter)
[![Coverage Status](https://coveralls.io/repos/github/masawada/yarn-outdated-formatter/badge.svg)](https://coveralls.io/github/masawada/yarn-outdated-formatter)
[![License](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](https://masawada.mit-license.org/)

## Usage

```
$ yarn add -D yarn-outdated-formatter
$ yarn outdated --json | $(yarn bin)/format-yarn-outdated
```

## Options

| name | description | example |
|---|---|---|
| format | output format [markdown|json|mackerel] \(default: markdown) | --format json |
| excludes | exclude packages (YAML) | --excludes ./excludes.yml |
| changelogs | changelog urls (YAML) | --changelogs ./changelogs.yml |

## License

MIT License
