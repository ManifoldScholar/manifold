import React, { Component } from "react";
import PropTypes from "prop-types";
import { BrowserRouter, StaticRouter } from "react-router-dom";
import Dialog from "backend/components/dialog";
import { Provider } from "react-redux";
import Manifold from "global/containers/Manifold";
import get from "lodash/get";
import { hot } from "react-hot-loader/root";
import Analytics from "hoc/analytics";

class App extends Component {
  static propTypes = {
    store: PropTypes.object,
    staticContext: PropTypes.object,
    staticRequest: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {
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

  settings() {
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
          <Analytics settings={this.settings()}>
            <Manifold confirm={this.renderConfirm()} />
          </Analytics>
        </Router>
      </Provider>
    );
  }
}

export default hot(App);
