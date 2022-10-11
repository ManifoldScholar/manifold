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
    const name = event.target.name.replace("attributes[", "").replace("]", "");
    const contact = {
      ...this.state.contact,
      [name]: event.target.value
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
            <Form.Header styleType="primary" label={t("forms.contact.title")} />
            <Form.FieldGroup>
              <Unwrapped.Input
                value={this.state.contact.email}
                type="text"
                name="attributes[email]"
                id="create-email"
                idForError="create-email-error"
                errors={errors}
                onChange={this.handleInputChange}
                placeholder={t("forms.contact.email_placeholder")}
                label={t("forms.contact.email")}
                wide
              />
              <Unwrapped.Input
                value={this.state.contact.fullName}
                type="text"
                id="create-name"
                aria-describedby="create-name-error"
                onChange={this.handleInputChange}
                placeholder={t("forms.contact.name_placeholder")}
                name={"attributes[fullName]"}
                errors={errors}
                idForError="create-name-error"
                wide
                label={t("forms.contact.name")}
              />
              <Unwrapped.TextArea
                label={t("forms.contact.message")}
                name="attributes[message]"
                errors={errors}
                idForError="create-message-error"
                value={this.state.contact.message}
                type="message"
                id="create-message"
                onChange={this.handleInputChange}
                placeholder={t("forms.contact.message_placeholder")}
                aria-describedby="create-message-error"
              />
              <input
                className="button-secondary button-secondary--with-room"
                type="submit"
                value={t("forms.contact.button_label")}
              />
            </Form.FieldGroup>
          </form>
        </div>
      </section>
    );
  }
}

export default connect(ContactContainer.mapStateToProps)(
  withTranslation()(ContactContainer)
);
