import React, { Component, PropTypes } from 'react';

export default class PasswordForgot extends Component {

  static propTypes = {
    showLogin: PropTypes.func.isRequired,
    showCreate: PropTypes.func.isRequired
  };

  render() {
    return (
      <div>
        <form method="post">
          <div className="row-1-p">
            <div className="form-input form-error">
              <label>Email</label>
              <input
                type="text"
                id="password-forgot-email"
                placeholder="Email"
              />
            </div>
          </div>
          <div className="row-1-p">
            <div className="form-input form-error">
              <input
                className="button-secondary button-with-room"
                type="submit"
                value="Send Password Reset Email"
              />
            </div>
          </div>
        </form>
        <p className="login-links">
          <a href="#" onClick={this.props.showLogin}>
            {'Remember your password?'}
          </a>
          <a href="#" onClick={this.props.showCreate}>
            {'Need to sign up?'}
          </a>
        </p>
      </div>
    );
  }
}
