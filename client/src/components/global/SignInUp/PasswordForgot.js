import React, { Component } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import { passwordsAPI, requests } from "api";
import { entityStoreActions, notificationActions } from "actions";
import get from "lodash/get";
import pull from "lodash/pull";
import { Form } from "components/backend";

const { request, flush } = entityStoreActions;

class PasswordForgotContainer extends Component {
  static displayName = "PasswordForgotContainer";

  static propTypes = {
    handleViewChange: PropTypes.func.isRequired,
    hideSignInUpOverlay: PropTypes.func,
    dispatch: PropTypes.func,
    response: PropTypes.object
  };

  static mapStateToProps = (state, ownPropsIgnored) => {
    return {
      response: get(state.entityStore.responses, "request-reset-password")
    };
  };

  constructor(propsIgnored) {
    super();
    this.state = {
      submitted: false,
      email: "",
      errors: []
    };
    this.clientErrorHandler = this.clientErrorHandler.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillUnmount() {
    this.props.dispatch(flush([requests.gPasswordRequest]));
  }

  handleSubmit(event) {
    event.preventDefault(event.target);
    const action = passwordsAPI.create(this.state.email);
    const resetRequest = request(action, requests.gPasswordRequest);
    this.setState({ submitted: true }, () => {
      if (!this.hasErrors()) {
        this.props.dispatch(resetRequest).promise.then(() => {
          this.postSubmit();
        });
      }
      this.setState({ submitted: false });
    });
  }

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

  handleInputChange(event) {
    this.setState({ email: event.target.value });
  }

  hasErrors() {
    return this.state.errors.length > 0;
  }

  clientErrorHandler(fieldName, hasError) {
    const alreadyIncluded = this.state.errors.includes(fieldName);
    if (alreadyIncluded && hasError === false) {
      const errors = pull(this.state.errors.slice(0), fieldName);
      this.setState({ errors });
    }
    if (!alreadyIncluded && hasError === true) {
      const errors = this.state.errors.slice(0);
      errors.push(fieldName);
      this.setState({ errors });
    }
  }

  render() {
    return (
      <div>
        <form method="" onSubmit={event => this.handleSubmit(event)}>
          <div className="row-1-p">
            <div className="form-input form-error">
              <label>Email</label>
              <Form.HigherOrder.Validation
                submitted={this.state.submitted}
                value={this.state.email}
                errorHandler={this.clientErrorHandler}
                validation={["required"]}
                name="email"
                onChange={event => this.handleInputChange(event)}
              >
                <input
                  value={this.state.email}
                  name="email"
                  type="text"
                  id="password-forgot-email"
                  placeholder="Email"
                />
              </Form.HigherOrder.Validation>
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
