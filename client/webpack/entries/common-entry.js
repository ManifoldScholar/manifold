'use strict'

require('dotenv').config();
var path = require('path')
var minimist = require('minimist')

global.rootFolder = path.resolve(__dirname, '..')

var commandLineArgs = minimist(process.argv.slice(2))

global.__MANIFOLD_API_URL__ = process.env.MANIFOLD_API_URL
global.__CLIENT__ = process.env.ENTRY_IS_CLIENT === 'true';
global.__SERVER__ = process.env.ENTRY_IS_CLIENT !== 'true';
global.__DISABLE_SSR__ = false;
global.__DEVELOPMENT__ = process.env.NODE_ENV !== 'production';
global.__MANIFOLD_API_URL__ = process.env.MANIFOLD_API_URL;

require('babel-register')({})
