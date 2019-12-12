/* eslint-disable no-console */
// Sometimes libraries throw warnings that we don't care about and can't address. We
// can use this configuration to suppress these messages, but please be sure to carefully
// document why the message is being suppressed.
const originalConsoleError = console.error;
const suppress = [
  // https://github.com/reduxjs/react-redux/issues/1373
  // https://gist.github.com/gaearon/e7d97cdf38a2907924ea12e4ebdf3c85
  "Warning: useLayoutEffect does nothing on the server"
];

// Suppress some irritating warnings
beforeEach(() => {
  console.error = jest.fn(message => {
    if (
      suppress.some(suppressedMessage => {
        return message.includes(suppressedMessage);
      })
    )
      return null;
    originalConsoleError(message);
  });
});

afterEach(() => {
  console.error = originalConsoleError;
});
/* eslint-enable no-console */
