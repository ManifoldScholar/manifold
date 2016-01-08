/**
 * THIS IS THE ENTRY POINT FOR THE CLIENT, JUST LIKE server.js IS THE ENTRY POINT FOR THE SERVER.
 */
import 'babel-core/polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import createHistory from 'history/lib/createBrowserHistory';
import createStore from './store/createStore';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import { syncReduxAndRouter } from 'redux-simple-router';
import { DevTools } from './containers/shared';
import getRoutes from './routes';
import ResolveDataDependencies from './helpers/ResolveDataDependencies';

const dest = document.getElementById('content');
const store = createStore(window.__INITIAL_STATE__);
const history = createHistory();

syncReduxAndRouter(history, store);

const component = (
  <Router history={history} RoutingContext={ResolveDataDependencies} >
    {getRoutes()}
  </Router>
);

ReactDOM.render(
  <Provider store={store} key="provider">
    {component}
  </Provider>,
  dest
);

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
