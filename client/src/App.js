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
      routerConfirm: false,
      routerConfirmCallback: null,
      routerConfirmMessage: null
    };
  }

  // TODO: Refactor to use new lifecycle methods for React 17
  UNSAFE_componentWillMount() {
    if (__SERVER__) {
      this.store = this.props.store;
      const bootstrapped = true;
      this.setState({ bootstrapped });
    } else {
      // Create the Redux store using our store creator function. Note that we're passing the
      // store state, which was dumped by the server-side render.
      let initialState = {};
      let bootstrapped = false;
      if (window.__INITIAL_STATE__) {
        initialState = window.__INITIAL_STATE__;
        bootstrapped = true;
        ch.info("Bootstrapped on the server.", "sparkles");
        this.setState({ bootstrapped });
      }
      this.store = createStore(initialState);

      // if there is no initial state, then we bootstrap on the client.
      if (!bootstrapped) {
        ch.error("Bootstrapping on the client.", "rain_cloud");
        const manifoldCookie = cookie.parse(document.cookie);
        Manifold.bootstrap(
          this.store.getState,
          this.store.dispatch,
          manifoldCookie
        ).then(
          () => {
            this.setState({ bootstrapped: true });
          },
          () => {
            ch.error("Bootstrapping failed unexpectedly.", "fire");
          }
        );
      }
    }
  }

  componentDidMount() {
    this.store.dispatch({ type: "CLIENT_LOADED", payload: {} });
  }

  settings() {
    return get(
      this.store.getState(),
      "entityStore.entities.settings.0.attributes"
    );
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
      <Provider store={this.store} key="provider">
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
