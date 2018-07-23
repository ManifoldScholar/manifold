import React, { Component } from "react";
import PropTypes from "prop-types";
import createStore from "store/createStore";
import { BrowserRouter, StaticRouter } from "react-router-dom";
import { Dialog } from "components/backend";
import { HigherOrder } from "components/global";
import { Provider } from "react-redux";
import Manifold from "containers/Manifold";
import cookie from "cookie";
import get from "lodash/get";
import ch from "./helpers/consoleHelpers";
import { hot } from "react-hot-loader";

class App extends Component {
  static propTypes = {
    store: PropTypes.object,
    staticContext: PropTypes.object,
    staticRequest: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {
      bootstrapped: false,
      store: null,
      routerConfirm: false,
      routerConfirmCallback: null,
      routerConfirmMessage: null
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (state.bootstrapped) return null;

    if (__SERVER__) return { bootstrapped: true, store: props.store };
    let initialState = {};
    let bootstrapped = false;

    if (window.__INITIAL_STATE__) {
      initialState = window.__INITIAL_STATE__;
      ch.info("Bootstrapped on the server.", "sparkles");
      bootstrapped = true;
    }
    const store = createStore(initialState);

    if (bootstrapped) return { bootstrapped, store };

    return null;
  }

  componentDidMount() {
    if (this.state.bootstrapped) return this.clientLoaded();
    this.bootstrapClient();
  }

  getConfirmation = (message, callback) => {
    this.setState({
      routerConfirm: true,
      routerConfirmMessage: message,
      routerConfirmCallback: callback
    });
  };

  getRouter() {
    if (this.props.staticRequest) {
      return {
        Router: StaticRouter,
        routerProps: {
          context: this.props.staticContext,
          location: this.props.staticRequest.url
        }
      };
    }
    return {
      Router: BrowserRouter,
      routerProps: {
        getUserConfirmation: this.getConfirmation
      }
    };
  }

  settings() {
    return get(
      this.state.store.getState(),
      "entityStore.entities.settings.0.attributes"
    );
  }

  bootstrapClient() {
    const store = createStore({});

    ch.error("Bootstrapping on the client.", "rain_cloud");
    const manifoldCookie = cookie.parse(document.cookie);
    Manifold.bootstrap(store.getState, store.dispatch, manifoldCookie).then(
      () => {
        ch.info("Bootstrapped on the server.", "sparkles");
        return this.setState({ bootstrapped: true, store }, this.clientLoaded);
      },
      () => {
        ch.error("Bootstrapping failed unexpectedly.", "fire");
        return null;
      }
    );
  }

  clientLoaded() {
    this.state.store.dispatch({ type: "CLIENT_LOADED", payload: {} });
  }

  resolveRouterConfirm = answer => {
    this.state.routerConfirmCallback(answer);
    this.setState({
      routerConfirm: false,
      routerConfirmMessage: null,
      routerConfirmCallback: null
    });
  };

  renderConfirm() {
    if (!this.state.routerConfirm) return null;
    return (
      <Dialog.Confirm
        message={this.state.routerConfirmMessage}
        heading="Are you sure?"
        resolve={() => this.resolveRouterConfirm(true)}
        reject={() => this.resolveRouterConfirm(false)}
      />
    );
  }

  render() {
    if (!this.state.bootstrapped) return null;
    const { routerProps, Router } = this.getRouter();
    return (
      <Provider store={this.state.store} key="provider">
        <Router {...routerProps}>
          <HigherOrder.Analytics settings={this.settings()}>
            <Manifold confirm={this.renderConfirm()} />
          </HigherOrder.Analytics>
        </Router>
      </Provider>
    );
  }
}

export default hot(module)(App);
