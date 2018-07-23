import React, { Component } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import { passwordsAPI, requests } from "api";
import { entityStoreActions, notificationActions } from "actions";
import get from "lodash/get";
import { Form as GlobalForm } from "components/global";

const { request, flush } = entityStoreActions;

class PasswordForgotContainer extends Component {
  static mapStateToProps = (state, ownPropsIgnored) => {
    return {
      response: get(state.entityStore.responses, "request-reset-password")
    };
  };

  static displayName = "PasswordForgotContainer";

  static propTypes = {
    handleViewChange: PropTypes.func.isRequired,
    hideSignInUpOverlay: PropTypes.func,
    dispatch: PropTypes.func,
    response: PropTypes.object
  };

  constructor(propsIgnored) {
    super();
    this.state = {
      submitted: false,
      email: "",
      errors: []
    };
  }

  componentWillUnmount() {
    this.props.dispatch(flush([requests.gPasswordRequest]));
  }

  handleSubmit = event => {
    event.preventDefault(event.target);
    const action = passwordsAPI.create(this.state.email);
    const resetRequest = request(action, requests.gPasswordRequest);
    this.setState({ submitted: true }, () => {
      this.props
        .dispatch(resetRequest)
        .promise.then(() => {
          this.postSubmit();
        })
        .catch(res => {
          const errors = res.body.errors;
          this.setState({ errors, submitted: false });
        });
    });
  };

  postSubmit() {
    this.createSuccessNotification();
    this.closeOverlay();
  }

  createSuccessNotification() {
    const notification = {
      level: 0,
      id: "PASSWORD_RESET_SENT",
      heading: `Email sent to ${
        this.state.email
      } with instructions to reset your password.`
    };
    this.props.dispatch(notificationActions.addNotification(notification));
    setTimeout(() => {
      this.props.dispatch(
        notificationActions.removeNotification(notification.id)
      );
    }, 5000);
  }

  closeOverlay() {
    this.props.hideSignInUpOverlay();
  }

  handleInputChange = event => {
    this.setState({ email: event.target.value });
  };

  render() {
    return (
      <div>
        <form method="" onSubmit={event => this.handleSubmit(event)}>
          <div className="row-1-p">
            <div className="form-input form-error">
              <label htmlFor="password-forgot-email">Email</label>
              <GlobalForm.Errorable name="email" errors={this.state.errors}>
                <input
                  value={this.state.email}
                  onChange={this.handleInputChange}
                  name="email"
                  type="text"
                  id="password-forgot-email"
                  placeholder="Email"
                  aria-describedby="password-forgot-email-error"
                />
              </GlobalForm.Errorable>
            </div>
          </div>
          <div className="row-1-p">
            <div className="form-input">
              <input
                className="button-secondary button-with-room"
                type="submit"
                value="Send Password Reset Email"
              />
            </div>
          </div>
        </form>
        <p className="login-links">
          <button
            onClick={event =>
              this.props.handleViewChange("account-login", event)
            }
            data-id="show-login"
          >
            {"Remember your password?"}
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
      </div>
    );
  }
}

export default connectAndFetch(PasswordForgotContainer);
