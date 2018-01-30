const os = require('os');

const parseYarnOutdatedJSON = (jsonString) => {
  // yarn <= 1.0.2
  try {
    const json = JSON.parse(jsonString);
    return json;
  } catch (e) {} // eslint-disable-line no-empty

  // yarn >= 1.2.1
  // try parsing multiple context json string
  let tokens = '';

  for (const token of jsonString.split(os.EOL)) {
    tokens += token;

    try {
      const json = JSON.parse(tokens);
      if (json.type === 'table') {
        return json;
      }
      tokens = '';
    } catch (e) {} // eslint-disable-line no-empty
  }

  return null;
};

module.exports = parseYarnOutdatedJSON;
