import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import {Link} from 'react-router';

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
            <form className="login-form">
              <div className="field">
                <label>
                  Username
                </label>
                <input type="text" placeholder="Username" />
              </div>
              <div className="field">
                <label>
                  Password
                </label>
                <input type="password" placeholder="Password" />
              </div>
              <input className="button-secondary" type="submit" value="Log in" />
            </form>
            <p className="login-links">
              <Link to="#">
                {'Forgot your password?'}
              </Link>
              <Link to="#">
                {'Need to sign up?'}
              </Link>
            </p>

            <section className="login-external">
              <button className="button-secondary-dull">
                <i className="manicon manicon-facebook"></i>
                <span>Log in with Facebook</span>
              </button>
              <button className="button-secondary-dull">
                <i className="manicon manicon-twitter"></i>
                <span>Log in with Twitter</span>
              </button>
            </section>
          </div>
        </div>
    );
  };
}
