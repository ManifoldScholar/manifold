import React, { Component, PropTypes } from 'react';
import { LoginForm } from '../../containers/frontend';
import classNames from 'classnames';

export default class LoginOverlay extends Component {

  static propTypes = {
    visible: PropTypes.bool,
    hideLoginOverlay: PropTypes.func
  };

  render = () => {
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
          <button onClick={this.props.hideLoginOverlay} className="overlay-close">
            Cancel Log in
            <i className="manicon manicon-x"></i>
          </button>
          <div className="overlay-content">
            {/*
              Note that even though hideLoginOverlay is used in this component it is also passed to the login form
              container
             */}
            <LoginForm overlayVisible={this.props.visible} hideLoginOverlay={this.props.hideLoginOverlay} />
          </div>
        </div>
    );
  };
}
