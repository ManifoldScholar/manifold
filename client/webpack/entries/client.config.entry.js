process.env.ENTRY_IS_CLIENT = true;
require('./common-entry');
var config = require('../webpack.config.client');
module.exports = config;
