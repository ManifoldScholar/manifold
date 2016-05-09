import React, { Component, PropTypes } from 'react';

export default class PasswordForgot extends Component {

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
              id="password-forgot-email"
              placeholder="Email"
            />
          </div>
          <input
            className="button-secondary"
            type="submit"
            value="Send Password Reset Email"
          />
        </form>
        <p className="login-links">
          <a href="#account-login">
            {'Remember your password?'}
          </a>
          <a href="#account-create">
            {'Need to sign up?'}
          </a>
        </p>
      </div>
    );
  }
}
