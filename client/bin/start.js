#!/usr/bin/env node
require('../server.babel'); // babel registration (runtime transpilation for node)
var runAll = require("npm-run-all");

global.__CLIENT__ = false;
global.__SERVER__ = true;
global.__DISABLE_SSR__ = false;  // <----- DISABLES SERVER SIDE RENDERING FOR ERROR DEBUGGING
global.__DEVELOPMENT__ = process.env.NODE_ENV !== 'production';

runList = [];
runList.push('server');

if(__DEVELOPMENT__) {
  runList.push('webpack');
  runAll(runList, { parallel: true, stdout: process.stdout, stderr: process.stderr });
} else {
  if(process.env.MANIFOLD_BUILD_ON_START) {
    runList.unshift('build');
  }
  runAll(runList, { parallel: false, stdout: process.stdout, stderr: process.stderr });
}


