import React, { Component } from "react";
import PropTypes from "prop-types";
import { currentUserActions } from "actions";
import { get } from "lodash";
import classNames from "classnames";
import LoginExternal from "./LoginExternal";
import Notifications from "global/containers/Notifications";

export default class Login extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    handleViewChange: PropTypes.func.isRequired,
    settings: PropTypes.object,
    authentication: PropTypes.shape({
      currentUser: PropTypes.object
    }),
    hideSignInUpOverlay: PropTypes.func
  };

  constructor() {
    super();
    this.state = { email: "", password: "" };
  }

  componentDidUpdate(prevProps) {
    if (
      !prevProps.authentication.currentUser &&
      this.props.authentication.currentUser
    ) {
      this.props.hideSignInUpOverlay();
    }
  }

  updateInput = event => {
    const key = event.target.name;
    const value = event.target.value;
    this.setState(Object.assign({}, this.state, { [key]: value }));
  };

  handleLogin = event => {
    event.preventDefault();
    const { dispatch } = this.props;
    const action = currentUserActions.login({
      email: this.state.email,
      password: this.state.password
    });
    dispatch(action);
  };

  authenticationError = () => {
    return get(this.props.authentication, "error.body");
  };

  render() {
    const submitClass = classNames({
      "form-input": true,
      "form-error": this.authenticationError()
    });

    return (
      <div>
        {this.props.willRedirect && (
          <div style={{ marginBottom: 25 }}>
            <Notifications scope="global" style="drawer" animate={false} />
          </div>
        )}
        <form method="post" onSubmit={this.handleLogin}>
          <div className="row-1-p">
            <div className="form-input form-error">
              <label htmlFor="login-email">Email</label>
              <input
                type="email"
                name="email"
                value={this.state.email}
                onChange={this.updateInput}
                id="login-email"
                placeholder="Email"
              />
            </div>
          </div>
          <div className="row-1-p">
            <div className="form-input">
              <label htmlFor="login-password">Password</label>
              <input
                type="password"
                name="password"
                value={this.state.password}
                onChange={this.updateInput}
                id="login-password"
                placeholder="Password"
              />
            </div>
          </div>
          <div className="row-1-p">
            <div className={submitClass}>
              {this.authenticationError() ? (
                <span style={{ marginTop: 0 }} role="alert" className="error">
                  {this.authenticationError()}
                </span>
              ) : null}
              <input
                className="button-secondary button-secondary--with-room"
                type="submit"
                value="Log in"
              />
            </div>
          </div>
        </form>
        <p className="login-links">
          <button
            onClick={event =>
              this.props.handleViewChange("account-password-forgot", event)
            }
            data-id="show-forgot"
          >
            {"Forgot your password?"}
          </button>
          <button
            onClick={event =>
              this.props.handleViewChange("account-create", event)
            }
            data-id="show-create"
          >
            {"Need to sign up?"}
          </button>
        </p>
        <LoginExternal
          settings={this.props.settings}
          dispatch={this.props.dispatch}
        />
      </div>
    );
  }
}
