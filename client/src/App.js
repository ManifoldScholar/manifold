import React, { Component, PropTypes } from 'react';
import createStore from 'store/createStore';
import {
  BrowserRouter,
  StaticRouter,
  Route,
  Link
} from 'react-router-dom';
import { Dialog } from 'components/backend';
import { HigherOrder } from 'components/global';
import { Provider } from 'react-redux';
import { currentUserActions } from 'actions';
import Manifold from 'containers/Manifold';
import get from 'lodash/get';


export default class App extends Component {

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
    this.resolveRouterConfirm = this.resolveRouterConfirm.bind(this);
    this.getConfirmation = this.getConfirmation.bind(this);

  }

  componentWillMount() {
    if (__SERVER__) {
      this.store = this.props.store;
    } else {
      // Create the Redux store using our store creator function. Note that we're passing the
      // store state, which was dumped by the server-side render.
      this.store = createStore(window.__INITIAL_STATE__);
      // Load bootstrap data on the client side.
      Manifold.bootstrap(this.store.getState, this.store.dispatch);
    }
  }

  componentDidMount() {
    this.store.dispatch({ type: 'CLIENT_LOADED', payload: {} });
    this.store.dispatch(currentUserActions.login);
    this.forceUpdate();
  }

  settings() {
    return get(this.store.getState(), 'entityStore.entities.settings.0.attributes');
  }

  getConfirmation(message, callback) {
    this.setState({
      routerConfirm: true,
      routerConfirmMessage: message,
      routerConfirmCallback: callback
    });
  }

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

  resolveRouterConfirm(answer) {
    this.state.routerConfirmCallback(answer);
    this.setState({
      routerConfirm: false,
      routerConfirmMessage: null,
      routerConfirmCallback: null
    });
  }

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
      <Provider store={this.store} key="provider">
        <Router {...routerProps} >
          <HigherOrder.Analytics settings={this.settings()}>
            <Manifold
              confirm={this.renderConfirm()}
            />
          </HigherOrder.Analytics>
        </Router>
      </Provider>
    );
  }

}
