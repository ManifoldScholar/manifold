'use strict'

require('dotenv').config({path: "../.env"});
var path = require('path');

global.rootFolder = path.resolve(__dirname, '..');
global.__API_URL__ = process.env.API_URL;
global.__CABLE_URL__ = process.env.CABLE_URL;
global.__CLIENT__ = process.env.ENTRY_IS_CLIENT === 'true';
global.__SERVER__ = process.env.ENTRY_IS_CLIENT !== 'true';
global.__DISABLE_SSR__ = false;
global.__DEVELOPMENT__ = process.env.NODE_ENV !== 'production';
global.__PRODUCTION__ = process.env.NODE_ENV == 'production';
global.__ENVIRONMENT__ = process.env.NODE_ENV;

require('babel-register')({});
