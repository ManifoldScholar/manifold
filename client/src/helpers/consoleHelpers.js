/* eslint-disable no-console */
const emoji = require("node-emoji");
const chalk = require("chalk");

function baseString(emojiKey) {
  let out = "";
  if (emojiKey) {
    out += `${emoji.get(emojiKey)}  `;
  }
  return out;
}

function header(string, emojiKey = "fist") {
  let out = baseString(emojiKey) + string;
  out = chalk.bold.green(out);
  console.log(out);
}

function info(string, emojiKey = "bell") {
  let out = baseString(emojiKey) + string;
  out = chalk.bold.cyan(out);
  console.log(out);
}

function error(string, emojiKey = "fire") {
  let out = baseString(emojiKey) + string;
  out = chalk.bold.red(out);
  console.log(out);
}

function background(string) {
  const out = chalk.bold.gray(string);
  console.log(out);
}

module.exports = {
  header,
  info,
  error,
  background
};
