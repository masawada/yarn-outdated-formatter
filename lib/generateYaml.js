const fs   = require('fs');
const path = require('path');

const urlize = (repo) => {
  if (typeof repo !== 'string') return null;
  // ex: facebook/react
  let regexp = new RegExp('^[a-zA-Z0-9-]+\/[a-zA-Z0-9-]+$');
  if (regexp.test(repo)) return 'https://github.com/' + repo;
  repo = repo.replace(/\.git$/, '');
  // ex: git+ssh://git@github.com/mikaelbr/node-notifier.git
  regexp = new RegExp('.+?:\/\/git@');
  if (regexp.test(repo)) return repo.replace(regexp, 'https://');
  // ex: git@github.com:xjamundx/eslint-plugin-promise.git
  regexp = new RegExp('^git@');
  if (regexp.test(repo)) return repo.replace(regexp, 'https://');
  // ex: git+https://github.com/ded/bowser.git
  regexp = new RegExp('^git(?:\\+https?)?');
  if (regexp.test(repo)) return repo.replace(regexp, 'https');
  return repo.replace(/^http:/, 'https:');
};

module.exports = () => {
  const rootPackageJson = JSON.parse(fs.readFileSync(path.resolve('./package.json')));
  const dependencies = Object.assign(rootPackageJson.dependencies, rootPackageJson.devDependencies);
  const nodeModulelDirs = fs.readdirSync(path.resolve('./node_modules'));
  nodeModulelDirs
    .filter((name) => !!dependencies[name])
    .forEach((moduleName) => {
      const dirPath = path.resolve(path.join('./node_modules', moduleName));
      const packageJson = JSON.parse(fs.readFileSync(path.join(dirPath, 'package.json')));
      let repositoryURL = typeof packageJson.repository === 'object' ? packageJson.repository.url : packageJson.repository;
      repositoryURL = urlize(repositoryURL);
      if (!repositoryURL) return;
      const changelogFileName = fs.readdirSync(dirPath).find((name) => name.match(/^CHANGE/i));
      if (!changelogFileName) return;
      console.log(`${moduleName}: ${repositoryURL}/blob/master/${changelogFileName}`) // eslint-disable-line
    });
};
