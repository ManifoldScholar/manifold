require("../webpack/helpers/environment");

import compileEnv from "../webpack/transforms/env";
import paths from "../webpack/helpers/paths";
import fs from "fs";
import { mkdirp } from "mkdirp";

const template = fs.readFileSync("./webpack/templates/www_env.ejs", "utf8");
const output = compileEnv(template);
const writePath = `${paths.build}/www/`;

/* eslint-disable no-console */
mkdirp(writePath).then(_ => {
  fs.writeFileSync(`${paths.build}/www/browser.config.js`, output);
}).catch(_ => {
  console.error("Unable to mkdir at " + writePath + ": " + err);
});
/* eslint-enable no-console */
