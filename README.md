yarn-outdated-formatter
=======================

[![Build Status](http://img.shields.io/travis/masawada/yarn-outdated-formatter.svg?style=flat-square)](https://travis-ci.org/masawada/yarn-outdated-formatter)
[![Coverage Status](https://img.shields.io/coveralls/masawada/yarn-outdated-formatter.svg?style=flat-square)](https://coveralls.io/github/masawada/yarn-outdated-formatter?branch=master)
[![NPM Version](https://img.shields.io/npm/v/yarn-outdated-formatter.svg?style=flat-square)](https://www.npmjs.com/package/yarn-outdated-formatter)
[![License](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](https://masawada.mit-license.org/)

## Usage

```
$ yarn add -D yarn-outdated-formatter
$ yarn outdated --json | $(yarn bin)/format-yarn-outdated
```

## Options

| name | description | example |
|---|---|---|
| format | output format [markdown&#124;json&#124;mackerel] \(default: markdown) | --format json |
| excludes | exclude packages (YAML) | --excludes ./excludes.yml |
| changelogs | changelog urls (YAML) | --changelogs ./changelogs.yml |

## License

MIT License
