process.env.ENTRY_IS_CLIENT = false;
require('../webpack/entries/common-entry');
require('./servers/web-server');

