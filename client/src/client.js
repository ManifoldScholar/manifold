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
  const style = 'background: #222; width: 100%; padding: 5px; color: #60F86F';
  if (rootElement && (rootElement.hasAttribute('data-ssr-render') === true)) {
    console.log("%c✊  Manifold's server-side, universal rendering is present ", style);
    if (!rootElement ||
      !rootElement.firstChild ||
      !rootElement.firstChild.attributes ||
      !rootElement.firstChild.attributes['data-react-checksum']) {
      console.log("%c⚠️  However, the server-side render was discarded because  ", style);
      console.log("%c⚠️  it differed from the client-side render. This can      ", style);
      console.log("%c⚠️  happen when components render random content, or when  ", style);
      console.log("%c⚠️  client-side code is executed on the server.            ", style);
    } else {
      console.log("%c✊  and matches the client-side render.                    ", style);
    }
  } else {
    console.log("%c⚠️  The server-side render is not present. Perhaps the ", style);
    console.log("%c⚠️  universal server is reloading.                     ", style);
  }
}
