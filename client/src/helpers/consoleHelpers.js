import emoji from 'node-emoji';
import chalk from 'chalk';
import { pad } from '../utils/string';

function baseString(emojiKey) {
  let out = '';
  if (emojiKey) {
    out = out + `${emoji.get(emojiKey)}  `;
  }
  return out
}

function header(string, emojiKey = 'fist') {
  let out = baseString(emojiKey) + string;
  out = chalk.bold.green(pad(out, 80, ' ', false));
  console.log(out);
}

function info(string, emojiKey = 'bell') {
  let out = baseString(emojiKey) + string;
  out = chalk.bold.cyan(out);
  console.log(out);
}

function error(string, emojiKey = 'fire') {
  let out = baseString(emojiKey) + string;
  out = chalk.bold.red(out);
  console.log(out);
}

export default {
  header,
  info,
  error
}
