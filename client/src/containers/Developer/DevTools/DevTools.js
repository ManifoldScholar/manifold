if (__DEVELOPMENT__) {
  module.exports = require('./DevTools.dev.js');
} else {
  module.exports = require('./DevTools.prod.js');
}
