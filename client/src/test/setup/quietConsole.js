/* eslint-disable no-console */
// Sometimes libraries throw warnings that we don't care about and can't address. We
// can use this configuration to suppress these messages, but please be sure to carefully
// document why the message is being suppressed.
const originalConsoleError = console.error;
const suppress = [
  // https://github.com/reduxjs/react-redux/issues/1373
  // https://gist.github.com/gaearon/e7d97cdf38a2907924ea12e4ebdf3c85
  "Warning: useLayoutEffect does nothing on the server",
  // https://github.com/ManifoldScholar/manifold/commit/070c96262d921ac6c136c06f5f120eca9ff75a6c
  `The pseudo class ":first-child" is potentially unsafe when doing server-side rendering. Try changing it to ":first-of-type".`
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
