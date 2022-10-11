import React, { Component } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import connectAndFetch from "utils/connectAndFetch";
import { passwordsAPI, requests } from "api";
import Form, { Unwrapped } from "global/components/form";
import { entityStoreActions, currentUserActions } from "actions";
import { get } from "lodash";

const { request, flush } = entityStoreActions;

export class PasswordResetContainer extends Component {
  static mapStateToProps = state => {
    return {
      response: get(state.entityStore.responses, requests.gPasswordReset)
    };
  };

  static propTypes = {
    dispatch: PropTypes.func,
    match: PropTypes.shape({
      params: PropTypes.shape({
        resetToken: PropTypes.string
      })
    }).isRequired,
    history: PropTypes.object.isRequired,
    response: PropTypes.object,
    t: PropTypes.func
  };

  constructor() {
    super();
    this.state = {
      password: "",
      passwordConfirmation: ""
    };
  }

  componentWillUnmount() {
    this.props.dispatch(flush([requests.gPasswordReset]));
  }

  handleSubmit = event => {
    event.preventDefault(event.target);
    const action = passwordsAPI.update(
      this.state.password,
      this.state.passwordConfirmation,
      this.props.match.params.resetToken
    );
    const changeRequest = request(action, requests.gPasswordReset);
    this.props.dispatch(changeRequest).promise.then(response => {
      this.postUpdate(response.data);
    });
  };

  postUpdate(data) {
    this.loginUser(data);
    this.redirectToHome();
  }

  loginUser(user) {
    this.props.dispatch(
      currentUserActions.login({
        email: user.attributes.email,
        password: this.state.password
      })
    );
  }

  redirectToHome() {
    this.props.history.push("/");
  }

  handleInputChange = event => {
    const name = event.target.name.replace("attributes[", "").replace("]", "");
    this.setState({ [name]: event.target.value });
  };

  render() {
    const errors = get(this.props.response, "errors") || [];
    const t = this.props.t;
    return (
      <section>
        <div className="container">
          <form method="post" onSubmit={event => this.handleSubmit(event)}>
            <Form.Header
              styleType="primary"
              label={t("forms.password_reset.title")}
            />
            <Form.FieldGroup>
              <Unwrapped.Input
                value={this.state.password}
                type="password"
                name="attributes[password]"
                id="reset-password"
                onChange={this.handleInputChange}
                placeholder={t("forms.password_reset.new_placeholder")}
                aria-describedby="reset-password-error"
                errors={errors}
                idForError="reset-password-error"
                label={t("forms.password_reset.new")}
                wide
              />
              <Unwrapped.Input
                value={this.state.passwordConfirmation}
                type="password"
                id="reset-password-confirmation"
                onChange={this.handleInputChange}
                placeholder={t("forms.password_reset.confirm_placeholder")}
                aria-describedby="reset-password-confirmation-error"
                name="attributes[passwordConfirmation]"
                errors={errors}
                idForError="reset-password-confirmation-error"
                label={t("forms.password_reset.confirm")}
                wide
              />
              <Form.Errorable name="attributes[resetToken]" errors={errors}>
                <input
                  className="button-secondary"
                  type="submit"
                  value={t("forms.password_reset.submit_reset")}
                />
              </Form.Errorable>
            </Form.FieldGroup>
          </form>
        </div>
      </section>
    );
  }
}

export default withTranslation()(connectAndFetch(PasswordResetContainer));
