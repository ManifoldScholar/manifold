#!/usr/bin/env node

const waitOn = require("wait-on");
const argv = require("minimist")(process.argv.slice(2));
const ch = require("../src/helpers/consoleHelpers");

const base = argv.base;
const resources = argv.on.split(",").map(resource => `${base}${resource}`);
const name = argv.name;
const opts = {
  resources,
  log: false,
  timeout: 300000
};

ch.background(`${name} server is waiting for: ${resources.join(", ")}.`, null);

const msg = setInterval(() => {
  ch.background(
    `${name} server is still waiting for: ${resources.join(", ")}.`
  );
}, 5000);

waitOn(opts, err => {
  clearInterval(msg);
  if (err) {
    ch.error(`${name} server ran into an error: ${err}`);
    process.exit();
  }
  ch.background(`${name} server is no longer waiting.`);
});
