module.exports =  (repo) => {
  if (typeof repo !== 'string') return null;
  // ex: facebook/react
  let regexp = new RegExp('^[a-zA-Z0-9-]+\/[a-zA-Z0-9-]+$');
  if (regexp.test(repo)) return 'https://github.com/' + repo;
  repo = repo.replace(/\.git$/, '');
  repo = repo.replace(/\.com:/, '.com/');
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
