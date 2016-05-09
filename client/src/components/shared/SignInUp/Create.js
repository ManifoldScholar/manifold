import React, { Component, PropTypes } from 'react';

export default class Create extends Component {

  static propTypes = {};

  render() {
    return (
      <div>
        <form method="post" className="login-form">
          <div className="field">
            <label>
              Email
            </label>
            <input
              type="text"
              id="create-email"
              placeholder="Email"
            />
          </div>
          <div className="field">
            <label>
              Name
            </label>
            <input
              type="text"
              id="create-name"
              placeholder="Name"
            />
          </div>
          <div className="field">
            <label>
              Password
            </label>
            <input
              type="password"
              id="create-password"
              placeholder="password"
            />
          </div>
          <div className="field">
            <label>
              Confirm Password
            </label>
            <input
              type="password"
              id="create-password-confirmation"
              placeholder="Confirm Password"
            />
          </div>
          <input
            className="button-secondary"
            type="submit"
            value="Create Account"
          />
        </form>
        <p className="login-links">
          {'You can also create a Manifold account using your Facebook or Twitter credentials.'}
        </p>
        <section className="login-external">
          <button className="button-secondary-dark">
            <i className="manicon manicon-facebook"></i>
            <span>Log in with Facebook</span>
          </button>
          <button className="button-secondary-dark">
            <i className="manicon manicon-twitter"></i>
            <span>Log in with Twitter</span>
          </button>
        </section>
        <p className="login-links">
          <a href="#account-login">
            {'Already have an account?'}
          </a>
        </p>
        <p className="login-links">
          {'By creating this account, you agree to Manifold\'s terms and conditions.'}
        </p>

      </div>
    );
  }
}
