const util = require('util'),
  fs = require('fs'),
  removeAsync = util.promisify(fs.unlink);
module.exports = async function silentRemove(file) {
  try {
    await removeAsync(file);
  } catch (e) {
    // ignore error
  }
};
