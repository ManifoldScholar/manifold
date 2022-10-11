import React, { Component } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import connectAndFetch from "utils/connectAndFetch";
import { passwordsAPI, requests } from "api";
import { entityStoreActions, notificationActions } from "actions";
import get from "lodash/get";
import GlobalForm, { Unwrapped } from "global/components/form";
import { UIDConsumer } from "react-uid";

const { request, flush } = entityStoreActions;

export class PasswordForgotContainer extends Component {
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
    response: PropTypes.object,
    t: PropTypes.func
  };

  static defaultProps = {
    hideSignInUpOverlay: () => {}
  };

  constructor(propsIgnored) {
    super();
    this.state = {
      submitted: false,
      email: "",
      errors: []
    };
    this.formRef = React.createRef();
  }

  componentWillUnmount() {
    this.props.dispatch(flush([requests.gPasswordRequest]));
  }

  componentDidMount() {
    if (this.formRef) this.formRef.focus();
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
      heading: this.props.t("forms.signin_overlay.send_reset_success", {
        email: this.state.email
      })
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
    const t = this.props.t;
    return (
      <div>
        <UIDConsumer>
          {id => (
            <form
              method=""
              onSubmit={event => this.handleSubmit(event)}
              aria-labelledby={id}
              tabIndex={-1}
              ref={el => (this.formRef = el)}
              className="focusable-form"
            >
              <GlobalForm.Header
                styleType="primary"
                label={t("forms.signin_overlay.reset_password")}
                id={id}
              />
              <Unwrapped.Input
                value={this.state.email}
                onChange={this.handleInputChange}
                name="email"
                type="text"
                id="password-forgot-email"
                placeholder={t("forms.signin_overlay.email")}
                aria-describedby="password-forgot-email-error"
                label={t("forms.signin_overlay.email")}
                errors={this.state.errors}
              />
              <input
                className="button-secondary button-secondary--with-room"
                type="submit"
                value={t("forms.signin_overlay.send_password_reset")}
              />
            </form>
          )}
        </UIDConsumer>
        <p className="login-links">
          <button
            onClick={event =>
              this.props.handleViewChange("account-login", event)
            }
            data-id="show-login"
          >
            {t("forms.signin_overlay.remember_password")}
          </button>
          <button
            onClick={event =>
              this.props.handleViewChange("account-create", event)
            }
            data-id="show-create"
          >
            {t("forms.signin_overlay.need_account")}
          </button>
        </p>
      </div>
    );
  }
}

export default withTranslation()(connectAndFetch(PasswordForgotContainer));
