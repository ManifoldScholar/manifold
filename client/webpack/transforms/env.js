const template = require("lodash/template");

module.exports = function(content, _path) {
  const compiled = template(content);
  return compiled({ env: process.env });
};
