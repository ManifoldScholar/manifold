if (__DEVELOPMENT__) {
  module.exports = require('./DevTools.dev');
} else {
  module.exports = require('./DevTools.prod');
}
