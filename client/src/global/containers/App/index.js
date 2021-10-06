import React, { Component } from "react";
import PropTypes from "prop-types";
import { BrowserRouter, StaticRouter } from "react-router-dom";
import Dialog from "global/components/dialog";
import { Provider } from "react-redux";
import Manifold from "global/containers/Manifold";
import get from "lodash/get";
import Analytics from "hoc/analytics";
import { HelmetProvider } from "react-helmet-async";
import GlobalStyles from "theme/styles/GlobalStyles";

class App extends Component {
  static propTypes = {
    store: PropTypes.object,
    staticContext: PropTypes.object,
    staticRequest: PropTypes.object,
    helmetContext: PropTypes.object
  };

  static defaultProps = {
    helmetContext: {}
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

  get authToken() {
    return get(this.props.store.getState(), "authentication.authToken");
  }

  get settings() {
    return get(
      this.props.store.getState(),
      "entityStore.entities.settings.0.attributes"
    );
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
    const { routerProps, Router } = this.getRouter();
    return (
      <Provider store={this.props.store} key="provider">
        <Router {...routerProps}>
          <Analytics
            dispatch={this.props.store.dispatch}
            settings={this.settings}
          >
            <HelmetProvider context={this.props.helmetContext}>
              <GlobalStyles />
              <Manifold confirm={this.renderConfirm()} />
            </HelmetProvider>
          </Analytics>
        </Router>
      </Provider>
    );
  }
}

export default App;
