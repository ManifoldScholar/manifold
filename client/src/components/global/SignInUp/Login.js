import React, { Component } from "react";
import PropTypes from "prop-types";
import { currentUserActions } from "actions";
import { get } from "lodash";
import classNames from "classnames";
import { SignInUp } from "components/global";

// const { startLogin } = authActions;

export default class Login extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    handleViewChange: PropTypes.func.isRequired,
    authentication: PropTypes.shape({
      currentUser: PropTypes.object
    }),
    hideSignInUpOverlay: PropTypes.func
  };

  constructor() {
    super();
    this.updatePassword = this.updatePassword.bind(this);
    this.updateEmail = this.updateEmail.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.authenticationError = this.authenticationError.bind(this);
    this.state = { email: "", password: "" };
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.authentication.currentUser &&
      !this.props.authentication.currentUser
    ) {
      this.props.hideSignInUpOverlay();
    }
  }

  updatePassword(event) {
    this.setState(
      Object.assign({}, this.state, { password: event.target.value })
    );
  }

  updateEmail(event) {
    this.setState(Object.assign({}, this.state, { email: event.target.value }));
  }

  handleLogin(event) {
    event.preventDefault();
    const { dispatch } = this.props;
    const action = currentUserActions.login({
      email: this.state.email,
      password: this.state.password
    });
    dispatch(action);
  }

  authenticationError() {
    const error = get(this.props.authentication, "error.body");
    return error;
  }

  render() {
    const submitClass = classNames({
      "form-input": true,
      "form-error": this.authenticationError()
    });

    return (
      <div>
        <form method="post" onSubmit={this.handleLogin}>
          <div className="row-1-p">
            <div className="form-input form-error">
              <label>Email</label>
              <input
                type="text"
                value={this.state.email}
                onChange={this.updateEmail}
                id="login-email"
                placeholder="Username"
              />
            </div>
          </div>
          <div className="row-1-p">
            <div className="form-input">
              <label>Password</label>
              <input
                type="password"
                value={this.state.password}
                onChange={this.updatePassword}
                id="login-password"
                placeholder="Password"
              />
            </div>
          </div>
          <div className="row-1-p">
            <div className={submitClass}>
              {this.authenticationError()
                ? <span style={{ marginTop: 0 }} className="error">
                    {this.authenticationError()}
                  </span>
                : null}
              <input
                className="button-secondary button-with-room"
                type="submit"
                value="Log in"
              />
            </div>
          </div>
        </form>
        <p className="login-links">
          <a
            href="#"
            onClick={event =>
              this.props.handleViewChange("account-password-forgot", event)}
            data-id="show-forgot"
          >
            {"Forgot your password?"}
          </a>
          <a
            href="#"
            onClick={event =>
              this.props.handleViewChange("account-create", event)}
            data-id="show-create"
          >
            {"Need to sign up?"}
          </a>
        </p>

        <section className="login-external">
          <SignInUp.Oauth.Monitor dispatch={this.props.dispatch} />
          <SignInUp.Oauth.Button
            dispatch={this.props.dispatch}
            provider="facebook"
          >
            <span>Log in with Facebook</span>
          </SignInUp.Oauth.Button>
          <SignInUp.Oauth.Button
            dispatch={this.props.dispatch}
            provider="google"
            iconName="manicon-envelope"
          >
            <span>Log in with Google</span>
          </SignInUp.Oauth.Button>
          <SignInUp.Oauth.Button
            dispatch={this.props.dispatch}
            provider="twitter"
          >
            <span>Log in with Twitter</span>
          </SignInUp.Oauth.Button>
        </section>
      </div>
    );
  }
}
