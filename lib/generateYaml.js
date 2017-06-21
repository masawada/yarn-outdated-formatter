const fs   = require('fs');
const path = require('path');
const urlize = require('./urlize');

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
      const changelogFileName = fs.readdirSync(dirPath).find((name) => {
        return name.match(/^(CHANGE|HISTORY)/i);
      });
      if (!changelogFileName) return;
      console.log(`${moduleName}: ${repositoryURL}/blob/master/${changelogFileName}`) // eslint-disable-line
    });
};
