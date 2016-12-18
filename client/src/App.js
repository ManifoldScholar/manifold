import React, { Component, PropTypes } from 'react';
import createStore from 'store/createStore';
import { Router, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { HigherOrder } from 'components/global';
import { Provider } from 'react-redux';
import getRoutes from 'routes';
import { currentUserActions } from 'actions';


import { Manifold } from 'containers/global';

export default class App extends Component {

  static propTypes = {
    store: PropTypes.object,
  };

  constructor() {
    super();
    this.router = this.router.bind(this);
    this.serverRouter = this.serverRouter.bind(this);
    this.clientRouter = this.clientRouter.bind(this);
    this.componentWillMount = this.componentWillMount.bind(this);
  }

  componentWillMount() {
    if (__SERVER__) {
      this.isServer = true;
      this.store = this.props.store;
      this.history = null;
      this.routeRenderMethod = null;
    } else {
      this.isServer = false;
      // Create the Redux store using our store creator function. Note that we're passing the
      // store state, which was dumped by the server-side render.
      this.store = createStore(window.__INITIAL_STATE__);
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
  }

  serverRouter() {
    return <HigherOrder.ResolveDataDependencies {...this.props} />;
  }

  clientRouter() {
    return (
      <Router history={this.history} render={this.routeRenderMethod} >
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
        <Manifold>
          {this.finalRouter}
        </Manifold>
      </Provider>
    );
  }

}
