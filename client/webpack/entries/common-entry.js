'use strict'

require('dotenv').config();
var path = require('path')

global.rootFolder = path.resolve(__dirname, '..')
global.__MANIFOLD_API_URL__ = process.env.MANIFOLD_API_URL
global.__CLIENT__ = process.env.ENTRY_IS_CLIENT === 'true';
global.__SERVER__ = process.env.ENTRY_IS_CLIENT !== 'true';
global.__DISABLE_SSR__ = false;
global.__DEVELOPMENT__ = process.env.NODE_ENV !== 'production';
global.__PRODUCTION__ = process.env.NODE_ENV == 'production';
global.__ENVIRONMENT__ = process.env.NODE_ENV;
global.__MANIFOLD_API_URL__ = process.env.MANIFOLD_API_URL;

require('babel-register')({})
