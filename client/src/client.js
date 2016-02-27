/**
 * THIS IS THE ENTRY POINT FOR THE CLIENT, JUST LIKE server.js IS THE ENTRY POINT FOR THE SERVER.
 */
import 'babel-core/polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import createStore from './store/createStore';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { DevTools } from './containers/shared';
import getRoutes from './routes';
import { ResolveDataDependencies } from './components/shared';
import useScroll from 'scroll-behavior/lib/useStandardScroll';

// The DOM element into which we're rendering the client-side SPA
const dest = document.getElementById('content');

// Create the Redux store using our store creator function. Note that we're passing the
// store state, which was dumped by the server-side render.
const store = createStore(window.__INITIAL_STATE__);

// Setup history and wrap it with our scrolling helper
let history;
history = browserHistory;
history = useScroll(() => history)();

// Ensure that the history in our story stays in sync with react-router's history
history = syncHistoryWithStore(history, store);

// We want to wrap all of our containers wiht the higher order ResolveDataDependencies
// component. That component is responsible for detecting route changes and calling the
// fetchData methods in the containers, to ensure that data is loaded when the route
// changes.
const routeRenderMethod = (props) => {
  return <ResolveDataDependencies {...props}/>;
};

// Finally, setup the component that will be rendered
const component = (
  <Router history={history} render={routeRenderMethod} >
    {getRoutes()}
  </Router>
);


// The Provider is the react-redux component that knows about the store and can pass
// state down to our application.
ReactDOM.render(
  <Provider store={store} key="provider">
    {component}
  </Provider>,
  dest
);

// If we're in development mode, we want ot check for the server-side render being
// different from the first client-side render.
if (process.env.NODE_ENV !== 'production') {
  window.React = React; // enable debugger

  if (!dest ||
    !dest.firstChild ||
    !dest.firstChild.attributes ||
    !dest.firstChild.attributes['data-react-checksum']) {
    console.error('Server-side React render was discarded. Make sure that your initial ' +
      'render does not contain any client-side code.');
  }
}

// Finally, if devtools are enabled, we render it a second time, with devtools included.
// This is a bit messy. There was a good reason for this (see react isomorphic starter
// package), but we should try to avoid the second render if we can.
if (__DEVTOOLS__) {
  ReactDOM.render(
    <Provider store={store} key="provider">
      <div>
        {component}
        <DevTools />
      </div>
    </Provider>,
    dest
  );
}
