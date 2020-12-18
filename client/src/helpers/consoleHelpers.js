/* eslint-disable no-console */
const emoji = require("node-emoji");
const endsWith = require("lodash/endsWith");

function baseString(emojiKey) {
  let out = "";
  if (emojiKey) {
    out += `${emoji.get(emojiKey)}  `;
  }
  return out;
}

function log(string, color, bold) {
  if (endsWith(process.title, "node")) {
    let colorCode = "";
    if (color === "yellow") colorCode = "\x1b[33m";
    if (color === "blue") colorCode = "\x1b[34m";
    if (color === "green") colorCode = "\x1b[32m";
    if (color === "gray") colorCode = "\x1b[90m";
    if (color === "red") colorCode = "\x1b[31m";
    const resetCode = "\x1b[0m";
    const boldCode = bold ? "\x1b[1m" : "";
    console.log(colorCode + boldCode + string + resetCode);
  } else {
    let colorCode = color;
    if (color === "yellow") colorCode = "#01B6E1";
    if (color === "blue") colorCode = "#01B6E1";
    if (color === "green") colorCode = "#34a178";
    if (color === "gray") colorCode = "#555555";
    if (color === "red") colorCode = "#f75884";
    const style = `color: ${colorCode}`;
    console.log(`%c${string}`, style);
  }
}

function header(string, emojiKey = "fist") {
  const out = baseString(emojiKey) + string;
  log(out, "green", true);
}

function info(string, emojiKey = "bell") {
  const out = baseString(emojiKey) + string;
  log(out, "yellow", false);
}

function error(string, emojiKey = "fire") {
  const out = baseString(emojiKey) + string;
  log(out, "red", true);
}

function notice(string, emojiKey = "ok_hand") {
  const out = baseString(emojiKey) + string;
  log(out, "gray", true);
}

function plain(string) {
  if (__SERVER__) {
    console.log(`[SSR] ${string}`);
  } else {
    console.log(string);
  }
}

function background(string) {
  log(string, "gray", false);
}

module.exports = {
  header,
  info,
  notice,
  error,
  plain,
  background
};
