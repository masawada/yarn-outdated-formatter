yarn-outdated-formatter
=======================

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
