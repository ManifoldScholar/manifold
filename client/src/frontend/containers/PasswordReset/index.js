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
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const errors = get(this.props.response, "errors") || [];
    const t = this.props.t;
    return (
      <section>
        <div className="container">
          <form method="post" onSubmit={event => this.handleSubmit(event)}>
            <h4 className="form-heading">{t("forms.password_reset.title")}</h4>
            <div className="row-1-p" />
            <div className="row-1-p">
              <Form.Errorable
                name="attributes[password]"
                errors={errors}
                idForError="reset-password-error"
              >
                <Form.Label
                  id="reset-password"
                  label={t("forms.password_reset.new")}
                />
                <Unwrapped.Input
                  value={this.state.password}
                  type="password"
                  name="password"
                  id="reset-password"
                  onChange={this.handleInputChange}
                  placeholder={t("forms.password_reset.new_placeholder")}
                  aria-describedby="reset-password-error"
                />
              </Form.Errorable>
            </div>
            <div className="row-1-p">
              <Form.Errorable
                name="attributes[passwordConfirmation]"
                errors={errors}
                idForError="reset-password-confirmation-error"
              >
                <Form.Label
                  id="reset-password-confirmation"
                  label={t("forms.password_reset.confirm")}
                />
                <Unwrapped.Input
                  value={this.state.passwordConfirmation}
                  type="password"
                  name="passwordConfirmation"
                  id="reset-password-confirmation"
                  onChange={this.handleInputChange}
                  placeholder={t("forms.password_reset.confirm_placeholder")}
                  aria-describedby="reset-password-confirmation-error"
                />
              </Form.Errorable>
            </div>
            <div className="row-1-p">
              <Form.Errorable name="attributes[resetToken]" errors={errors}>
                <input
                  className="button-secondary button-secondary--with-room"
                  type="submit"
                  value={t("forms.password_reset.submit_reset")}
                />
              </Form.Errorable>
            </div>
          </form>
        </div>
      </section>
    );
  }
}

export default withTranslation()(connectAndFetch(PasswordResetContainer));
