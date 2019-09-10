const semver = require('semver');

class Formatter {

  constructor (format, excludes, changelogs, workspacesRegex, unique) {
    this.format = format;
    this.excludes = excludes;
    this.changelogs = changelogs;
    this.workspacesRegex = workspacesRegex;
    this.unique = unique;
  }

  run (json) {
    const packages = this.sortPackages(this.extractOutdatedPackages(json));
    const format   = this.format;

    let result;

    if (format === 'markdown') {
      result = this.toMarkdown(packages, json);
    } else if (format === 'json') {
      result = this.toJSON(packages);
    } else if (format === 'mackerel') {
      result = this.toMackerel(packages);
    }

    return result;
  }

  extractOutdatedPackages (json) {
    const packages = (json.data && json.data.body) ? json.data.body : this.extractPackagesFromNpmOutdatedJSON(json);
    const isWorkspaces = json.data && json.data.head && json.data.head.includes('Workspace');
    return packages
      .filter((p) => !p.slice(1, 3).includes('exotic'))
      .filter((p) => !this.excludes.includes(p[0]))
      .filter((p) => !isWorkspaces || !this.workspacesRegex || this.workspacesRegex.test(p[4]))
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

      if (semver.major(current) !== semver.major(latest)) {
        sortedPackages.major.push(p);
      } else if (semver.minor(current) !== semver.minor(latest)) {
        sortedPackages.minor.push(p);
      } else if (semver.patch(current) !== semver.patch(latest)) {
        sortedPackages.patch.push(p);
      }
    });

    return sortedPackages;
  }

  toMarkdown (packages, json) {
    const tableHeader = (json.data && json.data.head) ? json.data.head.concat(['CHANGELOG']) : [
      'Package','Current','Wanted','Latest','Package Type','URL', 'CHANGELOG',
    ];
    return [
      this._markdownSection(packages.major, 'Major', tableHeader),
      this._markdownSection(packages.minor, 'Minor', tableHeader),
      this._markdownSection(packages.patch, 'Patch', tableHeader),
    ].join('\n\n');
  }

  _markdownSection (packages, sectionHeader, tableHeader) {
    const section = [
      `# ${sectionHeader}`,
      `| ${tableHeader.join(' | ')} |`,
      `|${new Array(tableHeader.length).fill('---').join('|')}|`,
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
    const counts = this.unique ? this._countUniquePackages(packages) : this._countPackages(packages);
    return [
      `${label}.major\t${counts.major}\t${epoch}`,
      `${label}.minor\t${counts.minor}\t${epoch}`,
      `${label}.patch\t${counts.patch}\t${epoch}`,
    ].join('\n');
  }

  _countPackages (packages) {
    return {
      major: packages.major.length,
      minor: packages.minor.length,
      patch: packages.patch.length,
    };
  }

  _countUniquePackages (packages) {
    const major = new Set(packages.major.map(p => p[0]));
    const minor = new Set(packages.minor.map(p => p[0]).filter(p => !major.has(p)));
    const patch = new Set(packages.patch.map(p => p[0]).filter(p => !major.has(p) && !minor.has(p)));
    return {
      major: major.size,
      minor: minor.size,
      patch: patch.size,
    };
  }
}

module.exports = Formatter;
