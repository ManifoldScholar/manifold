import React, { Component, PropTypes } from 'react';
import { LoginForm } from '../../containers/frontend';
import classNames from 'classnames';

export default class LoginOverlay extends Component {

  static propTypes = {
    hideOverlay: PropTypes.bool
  };

  static defaultProps = {
    hideOverlay: true
  };

  render = () => {
    const overlayClass = classNames({
      'overlay-login': true,
      'overlay-hidden': this.props.hideOverlay,
      'overlay-visible': !this.props.hideOverlay
    });
    return (
        <div className={overlayClass}>
          <figure className="logo">
            <i className="manicon manicon-manifold-logo"></i>
            Manifold
          </figure>
          <button className="overlay-close">
            Cancel Log in
            <i className="manicon manicon-x"></i>
          </button>
          <div className="overlay-content">
            <LoginForm />
          </div>
        </div>
    );
  };
}
