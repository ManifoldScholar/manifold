// https://stackoverflow.com/questions/9719570/generate-random-password-string-with-requirements-in-javascript#answer-26528271
const pattern = /[a-zA-Z0-9]/;
const length = 16;

function getRandomByte() {
  if (window.crypto && window.crypto.getRandomValues) {
    const result = new Uint8Array(1);
    window.crypto.getRandomValues(result);
    return result[0];
  } else if (window.msCrypto && window.msCrypto.getRandomValues) {
    const result = new Uint8Array(1);
    window.msCrypto.getRandomValues(result);
    return result[0];
  }
  return Math.floor(Math.random() * 256);
}

export default function generatePassword() {
  const password = [];
  while (password.length < length) {
    let char = null;

    do {
      char = String.fromCharCode(getRandomByte());
    } while (!pattern.test(char));

    password.push(char);
  }

  return password.join("");
}
