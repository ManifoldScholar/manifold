/**
 * THIS IS THE ENTRY POINT FOR THE CLIENT, JUST LIKE server.js IS THE ENTRY POINT FOR THE SERVER.
 */
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import App from './App';

// The DOM element into which we're rendering the client-side SPA
const rootElement = document.getElementById('content');

ReactDOM.render(<AppContainer><App /></AppContainer>, rootElement);

if (module.hot) {
  module.hot.accept('./App', () => {
    // If you use Webpack 2 in ES modules mode, you can
    // use <App /> here rather than require() a <NextApp />.
    const NextApp = require('./App').default;
    ReactDOM.render(
      <AppContainer>
        <NextApp />
      </AppContainer>,
      rootElement
    );
  });
}

if (__DEVELOPMENT__) {
  // If we're in development mode, we want to check for the server-side render being
  // different from the first client-side render.
  window.React = React; // enable debugger
  if (!rootElement ||
    !rootElement.firstChild ||
    !rootElement.firstChild.attributes ||
    !rootElement.firstChild.attributes['data-react-checksum']) {
    console.error('Server-side React render was discarded. Make sure that your initial ' +
      'render does not contain any client-side code.');
  }
}
