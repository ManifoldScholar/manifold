/**
 * THIS IS THE ENTRY POINT FOR THE CLIENT, JUST LIKE server.js IS THE ENTRY POINT FOR THE SERVER.
 */
require('babel-polyfill');
require('es6-promise').polyfill();

import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import App from './App';

// The DOM element into which we're rendering the client-side SPA
const rootElement = document.getElementById('content');

const render = Component => {
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>
  , rootElement);
};

render(App);

if (module.hot) {
  module.hot.accept('./App', () => { render(App); });
}

if (process.env.NODE_ENV === "development") {
  // If we're in development mode, we want to check for the server-side render being
  // different from the first client-side render.
  window.React = React; // enable debugger
  const errorStyle = 'color: red';
  if (rootElement && (rootElement.hasAttribute('data-ssr-render') === true)) {
    console.log("🌈 Server-side rendering service is present");
    if (!rootElement ||
      !rootElement.firstChild ||
      !rootElement.firstChild.attributes ||
      !rootElement.firstChild.attributes['data-react-checksum']) {
      console.log("%c🌧 Server-side rendering service does not match", errorStyle);
    } else {
      console.log("🌈 Server-side rendering service response matches");
    }
  } else {
    console.log("%c🌧 Server-side rendering service is missing", errorStyle);
  }
}
