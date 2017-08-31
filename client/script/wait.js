const capitalize = require("lodash/capitalize");
const waitOn = require("wait-on");
const argv = require("minimist")(process.argv.slice(2));
const ch = require("../src/helpers/consoleHelpers");

const resources = argv.on.split(",");
const name = argv.name;
const opts = {
  resources,
  log: false,
  timeout: 300000
};

ch.info(
  capitalize(`${name} server is waiting for: ${resources.join(", ")}.`),
  "hourglass"
);

const msg = setInterval(() => {
  ch.background(
    capitalize(`${name} server is still waiting for: ${resources.join(", ")}.`)
  );
}, 5000);

waitOn(opts, err => {
  clearInterval(msg);
  if (err) {
    ch.error(capitalize(`${name} server ran into an error: ${err}`));
    process.exit();
  }
  ch.info(capitalize(`${name} server is no longer waiting.`), "sparkles");
});
