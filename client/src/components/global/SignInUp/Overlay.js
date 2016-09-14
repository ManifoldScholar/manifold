import React, { Component, PropTypes } from 'react';
import { HigherOrder } from 'components/global';
import PasswordForgot from './PasswordForgot';
import PasswordReset from './PasswordReset';
import Login from './Login';
import CreateUpdate from './CreateUpdate';
import Update from './Update';
import Create from './Create';

export default class Overlay extends Component {

  static propTypes = {
    visible: PropTypes.bool,
    hideSignInUpOverlay: PropTypes.func,
    authentication: PropTypes.object,
    dispatch: PropTypes.func,
  };

  constructor() {
    super();
    this.state = {
      view: 'account-login'
    };
    this.updateView = this.updateView.bind(this);
    this.childProps = this.childProps.bind(this);
  }

  updateView(view, event = null) {
    if (event) event.preventDefault();
    this.setState({ view });
  }

  childProps() {
    return {
      updateView: this.updateView,
      showLogin: (e) => { this.updateView('account-login', e); },
      showCreate: (e) => { this.updateView('account-create', e); },
      showForgot: (e) => { this.updateView('account-password-forgot', e); },
      showReset: (e) => { this.updateView('account-password-reset', e); },
      showCreateUpdate: (e) => { this.updateView('account-create-update', e); },
      dispatch: this.props.dispatch,
      hideSignInUpOverlay: this.props.hideSignInUpOverlay,
      authentication: this.props.authentication
    };
  }

  renderChild() {
    let child = null;
    const childProps = this.childProps();

    switch (this.state.view) {
      case 'account-create':
        child = <Create {...childProps} />;
        break;
      case 'account-update':
        child = <Update {...childProps} />;
        break;
      case 'account-create-update':
        child = <CreateUpdate {...childProps} />;
        break;
      case 'account-password-forgot':
        child = <PasswordForgot {...childProps} />;
        break;
      case 'account-password-reset':
        child = <PasswordReset {...childProps} />;
        break;
      case 'account-login':
      default:
        if (this.props.authentication.authenticated) {
          child = <Update {...childProps} />;
        } else {
          child = <Login {...childProps} />;
        }
        break;
    }
    return child;
  }

  render() {
    return (
      <HigherOrder.BodyClass className={'no-scroll'}>
        <div className="overlay-login">
          <figure className="logo">
            <i className="manicon manicon-manifold-logo"></i>
            Manifold
          </figure>
          <button onClick={this.props.hideSignInUpOverlay} className="overlay-close">
            Cancel
            <i className="manicon manicon-x"></i>
          </button>
          <div className="container">
            <div className="overlay-content">
              {this.renderChild()}
            </div>
          </div>
        </div>
      </HigherOrder.BodyClass>
    );
  }
}
