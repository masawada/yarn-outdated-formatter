const semver = require('semver');

class Formatter {

  constructor (format, excludes, changelogs) {
    this.format = format;
    this.excludes = excludes;
    this.changelogs = changelogs;
  }

  run (json) {
    const packages = this.sortPackages(this.extractOutdatedPackages(json));
    const format   = this.format;

    let result;

    if (format === 'markdown') {
      result = this.toMarkdown(packages);
    } else if (format === 'json') {
      result = this.toJSON(packages);
    } else if (format === 'mackerel') {
      result = this.toMackerel(packages);
    } else if (format === 'csv') {
      result = this.toCsv(packages);
    }

    return result;
  }

  extractOutdatedPackages (json) {
    const packages = (json.data && json.data.body) ? json.data.body : this.extractPackagesFromNpmOutdatedJSON(json);
    return packages
      .filter((p) => !p.slice(1, 3).includes('exotic'))
      .filter((p) => !this.excludes.includes(p[0]))
      .map((p) => {
        p.push(this.changelogs[p[0]] || '');
        return p;
      });
  }

  /* convert { packageName: { current, wanted, latest, type }} to [ packageName, current, wanted, latest, type, url(null) ] */
  extractPackagesFromNpmOutdatedJSON (json) {
    return Object.keys(json).map(packageName => {
      const info = json[packageName];
      return [
        packageName,
        this.npmVersionToYarnVersion(info.current),
        this.npmVersionToYarnVersion(info.wanted),
        this.npmVersionToYarnVersion(info.latest),
        info.type,
        null,
      ];
    });
  }

  /* convert "git" to "exotic" */
  npmVersionToYarnVersion (version) {
    if (version === 'git') {
      return 'exotic';
    }
    return version;
  }

  sortPackages (packages) {
    const sortedPackages = {
      major : [],
      minor : [],
      patch : [],
    };

    packages.forEach((p) => {
      const current = p[1];
      const latest  = p[3];

      const currentMajor = semver.major(current);
      const latestMajor = semver.major(latest);
      const currentMinor = semver.minor(current);
      const latestMinor = semver.minor(latest);

      const preMajor = currentMajor === 0 || latestMajor === 0;
      const preMinor = preMajor && (currentMinor === 0 || latestMinor === 0);

      if (currentMajor !== latestMajor) {
        sortedPackages.major.push(p);
      } else if (currentMinor !== latestMinor) {
        if (preMajor) {
          // If the major version number is zero (0.x.x), treat a change of the
          // minor version number as a major change.
          sortedPackages.major.push(p);
        } else {
          sortedPackages.minor.push(p);
        }
      } else if (semver.patch(current) !== semver.patch(latest)) {
        if (preMinor) {
          // If the major & minor version numbers are zero (0.0.x), treat a
          // change of the patch version number as a major change.
          sortedPackages.major.push(p);
        } else if (preMajor) {
          // If the major version number is zero (0.x.x), treat a change of the
          // patch version number as a minor change.
          sortedPackages.minor.push(p);
        } else {
          sortedPackages.patch.push(p);
        }
      }
    });

    return sortedPackages;
  }

  toMarkdown (packages) {
    return [
      this._markdownSection(packages.major, 'Major'),
      this._markdownSection(packages.minor, 'Minor'),
      this._markdownSection(packages.patch, 'Patch'),
    ].join('\n\n');
  }

  _markdownSection (packages, header) {
    const section = [
      `# ${header}`,
      '| Package | Current | Wanted | Latest | Package Type | URL | CHANGELOG |',
      '|---|---|---|---|---|---|---|',
    ];
    packages.forEach((p) => { section.push(`| ${ p.join(' | ') } |`); });

    return section.join('\n');
  }

  toJSON (packages) {
    return JSON.stringify(packages);
  }

  toMackerel (packages) {
    const label = 'outdated_npm_packages';
    const epoch = Math.round((new Date()).getTime() / 1000);
    return [
      `${label}.major\t${packages.major.length}\t${epoch}`,
      `${label}.minor\t${packages.minor.length}\t${epoch}`,
      `${label}.patch\t${packages.patch.length}\t${epoch}`,
    ].join('\n');
  }

  _toCsvPackage (packages, header) {
    return [header, packages].join(',');
  }
  
  toCsv (packages) {
    return [
      'Version Change,Package,Current,Wanted,Latest,Package Type,URL,CHANGELOG',
      packages.major.map((p) => this._toCsvPackage(p, 'Major')).join('\n'),
      packages.minor.map((p) => this._toCsvPackage(p, 'Minor')).join('\n'),
      packages.patch.map((p) => this._toCsvPackage(p, 'Patch')).join('\n'),
    ].join('\n');
  }
}

module.exports = Formatter;
