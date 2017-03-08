import React, { Component, PropTypes } from 'react';
import createStore from 'store/createStore';
import { Router, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { HigherOrder } from 'components/global';
import { Provider } from 'react-redux';
import getRoutes from 'routes';
import { currentUserActions } from 'actions';
import Manifold from 'containers/Manifold';
import ReactGA from 'react-ga';
import get from 'lodash/get';

export default class App extends Component {

  static propTypes = {
    store: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.gaInitialized = false;
    this.gaInitCallback = this.gaInitCallback.bind(this);
    this.router = this.router.bind(this);
    this.serverRouter = this.serverRouter.bind(this);
    this.clientRouter = this.clientRouter.bind(this);
    this.componentWillMount = this.componentWillMount.bind(this);
    this.onRouteUpdate = this.onRouteUpdate.bind(this);
  }

  componentWillMount() {
    if (__SERVER__) {
      this.isServer = true;
      this.store = this.props.store;
      this.history = null;
    } else {
      this.isServer = false;
      // Create the Redux store using our store creator function. Note that we're passing the
      // store state, which was dumped by the server-side render.
      this.store = createStore(window.__INITIAL_STATE__);
      // Load bootstrap data on the client side.
      Manifold.bootstrap(this.store.getState, this.store.dispatch);
      // Setup history and wrap it with our scrolling helper
      // Ensure that the history in our story stays in sync with react-router's history
      // TODO: Restore scrolling helper
      this.history = syncHistoryWithStore(browserHistory, this.store);
      // We want to wrap all of our containers with the higher order ResolveDataDependencies
      // component. That component is responsible for detecting route changes and calling the
      // fetchData methods in the containers, to ensure that data is loaded when the route
      // changes.
      this.routeRenderMethod = (props) => {
        return <HigherOrder.ResolveDataDependencies {...props} />;
      };
    }
    this.finalRouter = this.router();
  }

  componentDidMount() {
    this.store.dispatch({ type: 'CLIENT_LOADED', payload: {} });
    this.store.dispatch(currentUserActions.login);
    this.forceUpdate();
    ReactGA.initialize('UA-90773269-1'); // Google Analytics Tracking ID
  }

  onRouteUpdate() {
    this.trackRouteUpdate();
  }

  gaInitCallback() {
    this.gaInitialized = true;
    this.trackRouteUpdate();
  }

  trackRouteUpdate() {
    if (__SERVER__) return;
    if (!this.gaInitialized) return;
    ReactGA.ga('send', 'pageview', window.location.pathname);
  }

  serverRouter() {
    return <HigherOrder.ResolveDataDependencies {...this.props} />;
  }

  clientRouter() {
    return (
      <Router onUpdate={this.onRouteUpdate} history={this.history} render={this.routeRenderMethod} >
        {getRoutes()}
      </Router>
    );
  }

  router() {
    if (this.isServer) {
      return this.serverRouter();
    }
    return this.clientRouter();
  }

  render() {
    return (
      <Provider store={this.store} key="provider">
        <Manifold gaInitCallback={this.gaInitCallback}>
          {this.finalRouter}
        </Manifold>
      </Provider>
    );
  }

}
