import React, { Component } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import { currentUserActions } from "actions";
import { get } from "lodash";
import classNames from "classnames";
import LoginExternal from "./LoginExternal";
import Notifications from "global/containers/Notifications";
import { UIDConsumer } from "react-uid";

class Login extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    handleViewChange: PropTypes.func.isRequired,
    settings: PropTypes.object,
    authentication: PropTypes.shape({
      currentUser: PropTypes.object
    }),
    hideSignInUpOverlay: PropTypes.func,
    t: PropTypes.func
  };

  static defaultProps = {
    hideSignInUpOverlay: () => {}
  };

  constructor() {
    super();
    this.state = { email: "", password: "" };
    this.formRef = React.createRef();
  }

  componentDidMount() {
    if (this.formRef) this.formRef.focus();
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
    this.setState({ ...this.state, [key]: value });
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

    const t = this.props.t;

    return (
      <div>
        {this.props.willRedirect && (
          <div style={{ marginBottom: 25 }}>
            <Notifications
              scope="authentication"
              style="drawer"
              animate={false}
            />
          </div>
        )}
        <UIDConsumer>
          {id => (
            <form
              method="post"
              onSubmit={this.handleLogin}
              aria-labelledby={id}
              tabIndex={-1}
              ref={el => (this.formRef = el)}
              className="focusable-form"
            >
              <h2 id={id} className="form-heading">
                {t("forms.signin_overlay.log_in")}
              </h2>
              <div className="row-1-p">
                <div className="form-input form-error">
                  <label htmlFor="login-email">
                    {t("forms.signin_overlay.email")}
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={this.state.email}
                    onChange={this.updateInput}
                    id="login-email"
                    placeholder={t("forms.signin_overlay.email")}
                    inputMode="email"
                  />
                </div>
              </div>
              <div className="row-1-p">
                <div className="form-input">
                  <label htmlFor="login-password">
                    {t("forms.signin_overlay.password")}
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={this.state.password}
                    onChange={this.updateInput}
                    id="login-password"
                    placeholder={t("forms.signin_overlay.password")}
                  />
                </div>
              </div>
              <div className="row-1-p">
                <div className={submitClass}>
                  {this.authenticationError() ? (
                    <span
                      style={{ marginTop: 0 }}
                      role="alert"
                      className="error"
                    >
                      {this.authenticationError()}
                    </span>
                  ) : null}
                  <input
                    className="button-secondary button-secondary--with-room"
                    type="submit"
                    value={t("forms.signin_overlay.log_in")}
                  />
                </div>
              </div>
            </form>
          )}
        </UIDConsumer>
        <p className="login-links">
          <button
            onClick={event =>
              this.props.handleViewChange("account-password-forgot", event)
            }
            data-id="show-forgot"
          >
            {t("forms.signin_overlay.forgot_password")}
          </button>
          <button
            onClick={event =>
              this.props.handleViewChange("accept-terms", event)
            }
            data-id="show-create"
          >
            {t("forms.signin_overlay.need_account")}
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

export default withTranslation()(Login);
