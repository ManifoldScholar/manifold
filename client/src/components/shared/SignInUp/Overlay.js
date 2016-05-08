import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import PasswordForgot from './PasswordForgot';
import PasswordReset from './PasswordReset';
import Login from './Login';
import Update from './Update';
import Create from './Create';
import { browserHistory } from 'react-router';

export default class Overlay extends Component {

  static propTypes = {
    visible: PropTypes.bool,
    hideSignInUpOverlay: PropTypes.func,
    authentication: PropTypes.object,
    dispatch: PropTypes.func,
    hash: PropTypes.string
  };

  constructor() {
    super();
    this.updateHash = this.updateHash.bind(this);
    this.childProps = this.childProps.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (this.props.authentication.authenticated === true &&
      prevProps.authentication.authenticated === false) {
      this.props.hideSignInUpOverlay();
    }
  }

  updateHash(hash) {
    return () => {
      browserHistory.push({ ...location, hash: `#${hash}` });
    };
  }

  childProps() {
    return {
      updateHash: this.updateHash,
      dispatch: this.props.dispatch,
      authentication: this.props.authentication
    };
  }

  renderChild() {
    let child = null;
    const childProps = this.childProps();
    switch (this.props.hash) {
      case '#account-create':
        child = <Create {...childProps} />;
        break;
      case '#account-update':
        child = <Update {...childProps} />;
        break;
      case '#account-password-forgot':
        child = <PasswordForgot {...childProps} />;
        break;
      case '#account-password-reset':
        child = <PasswordReset {...childProps} />;
        break;
      case '#account-login':
      default:
        child = <Login {...childProps} />;
        break;
    }
    return child;
  }

  render() {
    const overlayClass = classNames({
      'overlay-login': true,
      'overlay-hidden': !this.props.visible,
      'overlay-visible': this.props.visible
    });
    return (
      <div className={overlayClass}>
        <figure className="logo">
          <i className="manicon manicon-manifold-logo"></i>
          Manifold
        </figure>
        <button onClick={this.props.hideSignInUpOverlay} className="overlay-close">
          Cancel Log in
          <i className="manicon manicon-x"></i>
        </button>
        <div className="overlay-content">
          {this.renderChild()}
        </div>
      </div>
    );
  }
}
