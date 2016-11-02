require('dotenv').config({path: "../.env"});
require('babel-register')({});
require('./tasks/clean-client-build');
