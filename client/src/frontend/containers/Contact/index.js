import React, { Component } from "react";
import { connect } from "react-redux";
import get from "lodash/get";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import { contactsAPI, requests } from "api";
import { entityStoreActions } from "actions";
import Form, { Unwrapped } from "global/components/form";

const { request, flush } = entityStoreActions;

export class ContactContainer extends Component {
  static mapStateToProps = state => {
    return {
      response: state.entityStore.responses[requests.gContactForm]
    };
  };

  static propTypes = {
    history: PropTypes.object,
    dispatch: PropTypes.func,
    response: PropTypes.object,
    t: PropTypes.func
  };

  constructor() {
    super();
    this.state = {
      contact: {
        email: "",
        message: "",
        fullName: ""
      }
    };
  }

  componentWillUnmount() {
    this.props.dispatch(flush(requests.gContactForm));
  }

  redirectToHome() {
    this.props.history.push("/");
  }

  sendMessage = event => {
    event.preventDefault(event.target);
    this.props
      .dispatch(
        request(
          contactsAPI.create({ attributes: this.state.contact }),
          requests.gContactForm
        )
      )
      .promise.then(() => {
        this.redirectToHome();
      });
  };

  handleInputChange = event => {
    const contact = {
      ...this.state.contact,
      [event.target.name]: event.target.value
    };
    this.setState({ contact });
  };

  render() {
    const errors = get(this.props.response, "errors") || [];
    const t = this.props.t;

    return (
      <section>
        <div className="container">
          <form method="post" onSubmit={this.sendMessage}>
            <h1 className="form-heading">{t("forms.contact.title")}</h1>
            <div className="row-1-p">
              <Form.Errorable
                name="attributes[email]"
                errors={errors}
                idForError="create-email-error"
              >
                <Form.Label
                  htmlFor="create-email"
                  label={t("forms.contact.email")}
                />
                <Unwrapped.Input
                  value={this.state.contact.email}
                  type="text"
                  name="email"
                  id="create-email"
                  idForError="create-email-error"
                  onChange={this.handleInputChange}
                  placeholder={t("forms.contact.email_placeholder")}
                />
              </Form.Errorable>
            </div>
            <div className="row-1-p">
              <Form.Errorable
                name={"attributes[fullName]"}
                errors={errors}
                idForError="create-name-error"
              >
                <Form.Label
                  htmlFor="create-name"
                  label={t("forms.contact.name")}
                />
                <Unwrapped.Input
                  value={this.state.contact.fullName}
                  type="text"
                  id="create-name"
                  aria-describedby="create-name-error"
                  name="fullName"
                  onChange={this.handleInputChange}
                  placeholder={t("forms.contact.name_placeholder")}
                />
              </Form.Errorable>
            </div>
            <div className="row-1-p">
              <Form.Errorable
                name="attributes[message]"
                errors={errors}
                idForError="create-message-error"
              >
                <Form.Label
                  htmlFor="create-message"
                  label={t("forms.contact.message")}
                />
                <Unwrapped.TextArea
                  value={this.state.contact.message}
                  type="message"
                  name="message"
                  id="create-message"
                  onChange={this.handleInputChange}
                  placeholder={t("forms.contact.message_placeholder")}
                  aria-describedby="create-message-error"
                />
              </Form.Errorable>
            </div>
            <div className="row-1-p">
              <input
                className="button-secondary button-secondary--with-room"
                type="submit"
                value={t("forms.contact.button_label")}
              />
            </div>
          </form>
        </div>
      </section>
    );
  }
}

export default connect(ContactContainer.mapStateToProps)(
  withTranslation()(ContactContainer)
);
